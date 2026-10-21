import { NextResponse } from "next/server";
import { getStaffSession, isSameOriginRequest } from "@/lib/staffAuth";
import { getSupabaseServerClient, getSupabaseConfigurationMessage, isSupabaseConfigured } from "@/lib/supabaseServer";
import { getBusinessInfo } from "@/lib/billing/businessInfo";
import { csvRow, documentDetailHeaders, documentDetailValues, makeCsvResponse, sellerCsvRows, taxModeLabel } from "@/lib/billing/csv";

const MAX_EXPORT_RECORDS = 100_000;
const PAGE_SIZE = 250;

function validDate(value) {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value ? value : false;
}

function safeSearch(value) {
  return String(value || "").replace(/[^\p{L}\p{N}+\- ]/gu, "").trim().slice(0, 80);
}

function errorResponse(status, message) {
  return NextResponse.json({ success: false, message }, { status, headers: { "Cache-Control": "no-store" } });
}

function applyFilters(query, { search, from, to }) {
  if (search) query = query.or(`bill_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_mobile.ilike.%${search}%`);
  if (from) query = query.gte("invoice_date", from);
  if (to) query = query.lte("invoice_date", to);
  return query;
}

export async function GET(request) {
  if (!await getStaffSession(request)) return errorResponse(401, "Staff sign-in required.");
  if (!isSameOriginRequest(request)) return errorResponse(403, "Same-origin request required.");
  if (!isSupabaseConfigured()) return errorResponse(503, getSupabaseConfigurationMessage());

  const params = new URL(request.url).searchParams;
  const from = validDate(params.get("from"));
  const to = validDate(params.get("to"));
  if (from === false || to === false || (from && to && from > to)) return errorResponse(400, "Enter a valid date range.");
  const search = safeSearch(params.get("search"));
  const filters = { search, from, to };
  const supabase = getSupabaseServerClient();
  const reportResult = await supabase.rpc("bill_report_v1", { p_search: search || null, p_from: from, p_to: to });
  if (reportResult.error) {
    console.error("Bill CSV summary failed:", reportResult.error.code || "unknown");
    return errorResponse(503, "Billing report functions are not reachable. Apply the current supabase/setup.sql.");
  }

  const summary = reportResult.data || {};
  const expectedCount = Number(summary.bill_count || 0);
  if (!Number.isSafeInteger(expectedCount) || expectedCount < 0) return errorResponse(503, "The billing report returned an invalid record count.");
  if (expectedCount > MAX_EXPORT_RECORDS) return errorResponse(413, `This export contains more than ${MAX_EXPORT_RECORDS.toLocaleString()} bills. Narrow the date range or search to download it safely.`);

  const bills = [];
  const billFields = "id,request_id,bill_number,invoice_date,customer_name,customer_mobile,customer_address,document_details,tax_mode,subtotal,tax_total,grand_total,seller_snapshot,created_by,created_at,bill_items(id,line_number,product_name,hsn_sac,quantity,unit,unit_price,gst_rate,taxable_amount,cgst_amount,sgst_amount,igst_amount,line_total)";
  for (let offset = 0; offset < expectedCount; offset += PAGE_SIZE) {
    let query = supabase.from("bills").select(billFields, { count: offset === 0 ? "exact" : undefined });
    query = applyFilters(query, filters)
      .order("invoice_date", { ascending: true })
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(offset, Math.min(offset + PAGE_SIZE - 1, expectedCount - 1));
    const page = await query;
    if (page.error) {
      console.error("Bill CSV rows failed:", page.error.code || "unknown");
      return errorResponse(503, "Bill records could not be exported. Check Supabase setup and retry.");
    }
    if (offset === 0 && Number(page.count || 0) !== expectedCount) return errorResponse(409, "Bills changed while the report was starting. Refresh the report and retry.");
    bills.push(...(page.data || []));
    if (!page.data?.length) break;
  }

  let countQuery = supabase.from("bills").select("id", { count: "exact", head: true });
  countQuery = applyFilters(countQuery, filters);
  const currentCount = await countQuery;
  if (currentCount.error || Number(currentCount.count || 0) !== expectedCount || bills.length !== expectedCount) {
    console.error("Bill CSV consistency check failed:", currentCount.error?.code || "count_changed");
    return errorResponse(409, "Bills changed while the report was exporting. Refresh the report and retry so the CSV is complete.");
  }

  const business = getBusinessInfo();
  const rows = [
    csvRow([business.name + " — Complete Bill Report"]),
    csvRow(["From", from || "All dates", "To", to || "All dates", "Search", search || "All bills"]),
    csvRow(["Bill count", expectedCount, "Subtotal (INR)", summary.subtotal || 0, "GST (INR)", summary.tax_total || 0, "Grand total (INR)", summary.grand_total || 0]),
    csvRow(["Business profile"]),
    ...sellerCsvRows(business),
    "",
    csvRow(["Bills"]),
    csvRow([
      "S.No.", "Database ID", "Request ID", "Bill number", "Date", "Created at", "Created by",
      "Customer", "Mobile", "Address", "Tax mode", "Items", "Subtotal (INR)", "GST (INR)", "Total (INR)",
      "Seller name", "Seller address", "Seller phone", "Seller mobile", "Seller email", "Seller GSTIN/UIN",
      "Seller PAN", "Seller state", "Seller state code", "Bank name", "Bank account", "Bank branch / IFSC",
      ...documentDetailHeaders(),
    ]),
    ...bills.map((bill, index) => {
      const seller = bill.seller_snapshot || {};
      return csvRow([
        index + 1, bill.id, bill.request_id, bill.bill_number, bill.invoice_date, bill.created_at, bill.created_by,
        bill.customer_name, bill.customer_mobile, bill.customer_address, taxModeLabel(bill.tax_mode),
        bill.bill_items?.length || 0, bill.subtotal, bill.tax_total, bill.grand_total,
        seller.name, seller.address, seller.phone, seller.mobile, seller.email, seller.gstin,
        seller.pan, seller.stateName, seller.stateCode, seller.bankName, seller.bankAccount,
        seller.bankBranchIfsc, ...documentDetailValues(bill.document_details),
      ]);
    }),
    "",
    csvRow(["Bill line items"]),
    csvRow(["Bill S.No.", "Bill number", "Bill date", "Customer", "Item S.No.", "Product", "HSN/SAC", "Quantity", "Unit", "Unit price (INR)", "GST %", "Taxable (INR)", "CGST (INR)", "SGST (INR)", "IGST (INR)", "Line total (INR)"]),
  ];
  for (const [index, bill] of bills.entries()) {
    for (const [itemIndex, item] of (bill.bill_items || []).entries()) {
      rows.push(csvRow([
        index + 1, bill.bill_number, bill.invoice_date, bill.customer_name,
        item.line_number || itemIndex + 1, item.product_name, item.hsn_sac, item.quantity, item.unit,
        item.unit_price, item.gst_rate, item.taxable_amount, item.cgst_amount, item.sgst_amount,
        item.igst_amount, item.line_total,
      ]));
    }
  }

  const filePrefix = business.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "business";
  const filename = `${filePrefix}-bill-report-${from || "all"}-${to || "all"}.csv`;
  return makeCsvResponse(rows, filename);
}
