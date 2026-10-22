import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseServerClient, getSupabaseConfigurationMessage, isSupabaseConfigured } from "@/lib/supabaseServer";
import { getStaffSession, getStaffSessionHash, isSameOriginRequest } from "@/lib/staffAuth";
import { getBusinessInfo } from "@/lib/billing/businessInfo";
import { decimalToScaledInteger, GST_RATES, roundHalfUp, sumMoney } from "@/lib/billing/billMath";
import { cleanDocumentDetails } from "@/lib/billing/documentDetails";
import { STAFF_IDLE_TIMEOUT_SECONDS } from "@/lib/quotation/sessionPolicy";

export const preferredRegion = "bom1";

const noStore = { "Cache-Control": "no-store" };
const databaseNotConfigured = () => NextResponse.json({ success: false, message: getSupabaseConfigurationMessage() }, { status: 503, headers: noStore });
const databaseUnavailable = () => NextResponse.json({ success: false, message: "Estimate storage is not ready. Run the current supabase/setup.sql in the connected Supabase project, then retry." }, { status: 503, headers: noStore });
const unauthorized = () => NextResponse.json({ success: false, message: "Staff sign-in required." }, { status: 401, headers: noStore });

function parseDate(value) {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value ? value : null;
}

function safeSearch(value) {
  return String(value || "").replace(/[^\p{L}\p{N}+\- ]/gu, "").trim().slice(0, 80);
}

export async function GET(request) {
  if (!await getStaffSession(request)) return unauthorized();
  if (!isSupabaseConfigured()) return databaseNotConfigured();

  const params = new URL(request.url).searchParams;
  const isListingRequest = ["limit", "offset", "search", "from", "to"].some((key) => params.has(key));
  if (!isListingRequest) {
    const { error } = await getSupabaseServerClient().from("estimates").select("id", { head: true }).limit(1);
    if (error) return databaseUnavailable();
    return NextResponse.json({ success: true, settings: { business: getBusinessInfo() } }, { headers: noStore });
  }

  const from = parseDate(params.get("from"));
  const to = parseDate(params.get("to"));
  if ((params.get("from") && !from) || (params.get("to") && !to) || (from && to && from > to)) {
    return NextResponse.json({ success: false, message: "Enter a valid date range." }, { status: 400, headers: noStore });
  }

  const search = safeSearch(params.get("search"));
  const limit = Math.max(1, Math.min(100, Number(params.get("limit")) || 50));
  const offset = Math.max(0, Math.min(500_000, Number(params.get("offset")) || 0));
  const supabase = getSupabaseServerClient();
  let query = supabase.from("estimates")
    .select("id,estimate_number,estimate_date,customer_name,customer_mobile,customer_address,document_details,tax_mode,subtotal,tax_total,grand_total,items,seller_snapshot,created_at", { count: "exact" })
    .order("estimate_date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (search) query = query.or(`estimate_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_mobile.ilike.%${search}%`);
  if (from) query = query.gte("estimate_date", from);
  if (to) query = query.lte("estimate_date", to);
  const { data, error, count } = await query;
  if (error) {
    console.error("Estimate records query failed:", error.code || "unknown");
    return databaseUnavailable();
  }
  const estimates = data || [];
  return NextResponse.json({
    success: true,
    estimates,
    summary: {
      estimate_count: count || 0,
      visible_tax_total: sumMoney(estimates.map((estimate) => estimate.tax_total)),
      visible_grand_total: sumMoney(estimates.map((estimate) => estimate.grand_total)),
    },
    settings: { business: getBusinessInfo() },
  }, { headers: noStore });
}

export async function POST(request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ success: false }, { status: 403, headers: noStore });
  const sessionHash = getStaffSessionHash(request);
  if (!sessionHash) return unauthorized();
  if (!isSupabaseConfigured()) return databaseNotConfigured();

  try {
    const body = await request.json();
    const customerName = String(body.customerName || "").trim();
    const digits = String(body.customerMobile || "").replace(/\D/g, "");
    const mobile = digits.length === 10 ? `+91${digits}` : digits.length === 12 && digits.startsWith("91") ? `+${digits}` : "";
    const address = String(body.customerAddress || "").trim().slice(0, 500);
    const documentDetails = cleanDocumentDetails(body.documentDetails);
    const taxMode = body.taxMode;
    const items = Array.isArray(body.items) ? body.items : [];
    const business = getBusinessInfo();

    if (customerName.length < 2 || customerName.length > 160 || !mobile) {
      return NextResponse.json({ success: false, message: "Customer name and a valid mobile number are required." }, { status: 400, headers: noStore });
    }
    if (!["none", "intra", "inter"].includes(taxMode)) {
      return NextResponse.json({ success: false, message: "Choose a valid GST treatment before saving the estimate." }, { status: 400, headers: noStore });
    }
    if (!items.length || items.length > 100) {
      return NextResponse.json({ success: false, message: "Add between 1 and 100 products to the estimate." }, { status: 400, headers: noStore });
    }

    const cleanItems = [];
    let grandTotalPaise = 0n;
    for (const item of items) {
      const productName = String(item.productName || "").trim();
      const quantity = Number(item.quantity ?? 1);
      const unitPrice = Number(item.unitPrice);
      const quantityMilli = decimalToScaledInteger(item.quantity ?? 1, 3);
      const unitPricePaise = decimalToScaledInteger(item.unitPrice, 2);
      const gstRate = Number(item.gstRate ?? 0);
      const unit = String(item.unit || "pcs").trim().slice(0, 24) || "pcs";
      if (!productName || productName.length > 240 || !Number.isFinite(quantity) || quantity <= 0 || quantity > 100000 || quantityMilli === null || !Number.isFinite(unitPrice) || unitPrice < 0 || unitPrice > 100000000 || unitPricePaise === null || !GST_RATES.includes(gstRate)) {
        return NextResponse.json({ success: false, message: "Check every product name, quantity (up to 3 decimal places), price (up to 2 decimal places), and GST rate." }, { status: 400, headers: noStore });
      }
      if (taxMode !== "none" && gstRate === 0) {
        return NextResponse.json({ success: false, message: "A GST mode is selected. Choose a GST rate for every product." }, { status: 400, headers: noStore });
      }
      if (gstRate > 0 && (!business.gstEnabled || taxMode === "none")) {
        return NextResponse.json({ success: false, message: "A valid company GSTIN and a tax mode are required to apply GST." }, { status: 400, headers: noStore });
      }
      const taxablePaise = roundHalfUp(quantityMilli * unitPricePaise, 1000n);
      const taxPaise = roundHalfUp(taxablePaise * BigInt(gstRate), 100n);
      grandTotalPaise += taxablePaise + taxPaise;
      if (grandTotalPaise > 99_999_999_999_999n) {
        return NextResponse.json({ success: false, message: "The estimate total exceeds the supported amount." }, { status: 400, headers: noStore });
      }
      cleanItems.push({ productName, hsnSac: String(item.hsnSac || "").trim().slice(0, 24), unit, quantity: Number(quantityMilli) / 1000, unitPrice: Number(unitPricePaise) / 100, gstRate });
    }

    const requestId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.requestId || "") ? body.requestId : randomUUID();
    const prefix = String(process.env.ESTIMATE_NUMBER_PREFIX || "ME").toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 12) || "ME";
    const supabase = getSupabaseServerClient();
    const result = await supabase.rpc("create_estimate_with_staff_session_v1", {
      p_session_hash: sessionHash,
      p_idle_timeout_seconds: STAFF_IDLE_TIMEOUT_SECONDS,
      p_request_id: requestId,
      p_estimate_prefix: prefix,
      p_customer_name: customerName,
      p_customer_mobile: mobile,
      p_customer_address: address,
      p_tax_mode: taxMode,
      p_items: cleanItems,
      p_seller_snapshot: business,
      p_document_details: documentDetails,
    });
    if (result.error) {
      if (result.error.code === "28000") return unauthorized();
      console.error("Estimate creation failed:", result.error.code || result.error.message);
      return databaseUnavailable();
    }
    const data = result.data || {};
    const { items: recordItems, ...estimate } = data.estimate || {};
    return NextResponse.json({
      success: true,
      data: {
        estimate,
        items: Array.isArray(data.items) ? data.items : recordItems || [],
      },
    }, { status: 201, headers: noStore });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to create the estimate. Check the entered details and try again." }, { status: 400, headers: noStore });
  }
}
