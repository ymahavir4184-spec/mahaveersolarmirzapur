import { NextResponse } from "next/server";
import { getStaffSession, isSameOriginRequest } from "@/lib/staffAuth";
import { getSupabaseServerClient, getSupabaseConfigurationMessage, isSupabaseConfigured } from "@/lib/supabaseServer";
import { getBusinessInfo } from "@/lib/billing/businessInfo";
import { sumMoneyDecimal } from "@/lib/billing/billMath";
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
  if (search) query = query.or(`estimate_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_mobile.ilike.%${search}%`);
  if (from) query = query.gte("estimate_date", from);
  if (to) query = query.lte("estimate_date", to);
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
  const estimates = [];
  const estimateFields = "id,request_id,estimate_number,estimate_date,customer_name,customer_mobile,customer_address,document_details,tax_mode,subtotal,tax_total,grand_total,items,seller_snapshot,created_by,created_at";
  let expectedCount = null;

  for (let offset = 0; ; offset += PAGE_SIZE) {
    let query = supabase.from("estimates").select(estimateFields, { count: offset === 0 ? "exact" : undefined });
    query = applyFilters(query, filters)
      .order("estimate_date", { ascending: true })
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);
    const page = await query;
    if (page.error) {
      console.error("Estimate CSV rows failed:", page.error.code || "unknown");
      return errorResponse(503, "Estimate records could not be exported. Check Supabase setup and retry.");
    }
    if (offset === 0) {
      expectedCount = Number(page.count || 0);
      if (!Number.isSafeInteger(expectedCount) || expectedCount < 0) return errorResponse(503, "The estimate report returned an invalid record count.");
      if (expectedCount > MAX_EXPORT_RECORDS) return errorResponse(413, `This export contains more than ${MAX_EXPORT_RECORDS.toLocaleString()} estimates. Narrow the date range or search to download it safely.`);
    }
    estimates.push(...(page.data || []));
    if (!page.data?.length || page.data.length < PAGE_SIZE || estimates.length >= expectedCount) break;
  }

  let countQuery = supabase.from("estimates").select("id", { count: "exact", head: true });
  countQuery = applyFilters(countQuery, filters);
  const currentCount = await countQuery;
  if (currentCount.error || Number(currentCount.count || 0) !== expectedCount || estimates.length !== expectedCount) {
    console.error("Estimate CSV consistency check failed:", currentCount.error?.code || "count_changed");
    return errorResponse(409, "Estimates changed while the report was exporting. Refresh the report and retry so the CSV is complete.");
  }

  const business = getBusinessInfo();
  const summary = {
    subtotal: sumMoneyDecimal(estimates.map((estimate) => estimate.subtotal)),
    tax: sumMoneyDecimal(estimates.map((estimate) => estimate.tax_total)),
    grand: sumMoneyDecimal(estimates.map((estimate) => estimate.grand_total)),
  };
  const rows = [
    csvRow([business.name + " — Complete Estimate Report"]),
    csvRow(["From", from || "All dates", "To", to || "All dates", "Search", search || "All estimates"]),
    csvRow(["Estimate count", expectedCount, "Subtotal (INR)", summary.subtotal, "GST (INR)", summary.tax, "Grand total (INR)", summary.grand]),
    csvRow(["Business profile"]),
    ...sellerCsvRows(business),
    "",
    csvRow(["Estimates"]),
    csvRow([
      "S.No.", "Database ID", "Request ID", "Estimate number", "Date", "Created at", "Created by",
      "Customer", "Mobile", "Address", "Tax mode", "Items", "Subtotal (INR)", "GST (INR)", "Total (INR)",
      "Seller name", "Seller address", "Seller phone", "Seller mobile", "Seller email", "Seller GSTIN/UIN",
      "Seller PAN", "Seller state", "Seller state code", "Bank name", "Bank account", "Bank branch / IFSC",
      ...documentDetailHeaders(),
    ]),
    ...estimates.map((estimate, index) => {
      const seller = estimate.seller_snapshot || {};
      return csvRow([
        index + 1, estimate.id, estimate.request_id, estimate.estimate_number, estimate.estimate_date,
        estimate.created_at, estimate.created_by, estimate.customer_name, estimate.customer_mobile,
        estimate.customer_address, taxModeLabel(estimate.tax_mode), estimate.items?.length || 0,
        estimate.subtotal, estimate.tax_total, estimate.grand_total,
        seller.name, seller.address, seller.phone, seller.mobile, seller.email, seller.gstin,
        seller.pan, seller.stateName, seller.stateCode, seller.bankName, seller.bankAccount,
        seller.bankBranchIfsc, ...documentDetailValues(estimate.document_details),
      ]);
    }),
    "",
    csvRow(["Estimate line items"]),
    csvRow(["Estimate S.No.", "Estimate number", "Estimate date", "Customer", "Item S.No.", "Product", "HSN/SAC", "Quantity", "Unit", "Unit price (INR)", "GST %", "Taxable (INR)", "CGST (INR)", "SGST (INR)", "IGST (INR)", "Line total (INR)"]),
  ];
  for (const [index, estimate] of estimates.entries()) {
    for (const [itemIndex, item] of (estimate.items || []).entries()) {
      rows.push(csvRow([
        index + 1, estimate.estimate_number, estimate.estimate_date, estimate.customer_name,
        item.line_number || itemIndex + 1, item.product_name, item.hsn_sac, item.quantity, item.unit,
        item.unit_price, item.gst_rate, item.taxable_amount, item.cgst_amount, item.sgst_amount,
        item.igst_amount, item.line_total,
      ]));
    }
  }

  const filePrefix = business.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "business";
  const filename = `${filePrefix}-estimate-report-${from || "all"}-${to || "all"}.csv`;
  return makeCsvResponse(rows, filename);
}
