import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseServerClient, getSupabaseConfigurationMessage, isSupabaseConfigured } from "@/lib/supabaseServer";
import { getStaffSession, isSameOriginRequest } from "@/lib/staffAuth";

const noStore = { "Cache-Control": "no-store" };

function unauthorized() {
  return NextResponse.json({ success: false, message: "Staff sign-in required." }, { status: 401, headers: noStore });
}

function databaseNotConfigured() {
  return NextResponse.json({
    success: false,
    message: getSupabaseConfigurationMessage(),
  }, { status: 503, headers: noStore });
}

function databaseUnavailable() {
  return NextResponse.json({
    success: false,
    message: "Quotation tables are not reachable. Check the Supabase keys and confirm setup.sql ran in this project.",
  }, { status: 503, headers: noStore });
}

function toClientRecord(row) {
  return {
    id: row.id,
    quotationRef: row.ref_no,
    customerName: row.name,
    customerMobile: row.phone,
    customerAddress: row.address,
    capacityKw: Number(row.capacity_kw),
    systemType: row.system_type,
    propertyType: row.property_type,
    roofType: row.roof_type,
    panelWatt: Number(row.panel_watt),
    panelCount: Number(row.panel_count),
    notes: row.notes,
    status: row.status,
    isPurchased: row.is_purchased,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

function parseQuotationInput(body) {
  const name = String(body?.customerName || "").trim();
  const phone = String(body?.customerMobile || "").replace(/\D/g, "");
  const address = String(body?.customerAddress || "").trim();
  const capacity = Number(body?.capacityKw);
  const systemType = String(body?.systemType || "on-grid");
  const propertyType = String(body?.propertyType || "residential");
  const roofType = String(body?.roofType || "rcc");
  const panelWatt = Math.trunc(Number(body?.panelWatt) || 550);
  const panelCount = Math.trunc(Number(body?.panelCount) || 0);
  const notes = String(body?.notes || "").trim();

  if (name.length < 2 || name.length > 160 || phone.length < 10 || phone.length > 13 || address.length < 3 || address.length > 500) {
    return { error: "Enter a valid customer name, mobile number, and installation address." };
  }
  if (!Number.isFinite(capacity) || capacity <= 0 || capacity > 999999.99) {
    return { error: "Enter a valid solar capacity." };
  }
  if (!["on-grid", "hybrid", "off-grid"].includes(systemType)
    || !["residential", "commercial", "industrial"].includes(propertyType)
    || !["rcc", "metalSheet", "tiled"].includes(roofType)
    || panelWatt < 1 || panelWatt > 1000 || panelCount < 0 || panelCount > 10000 || notes.length > 2000) {
    return { error: "Check the solar system and panel details." };
  }

  return {
    value: {
      name,
      phone,
      address,
      capacity_kw: capacity,
      system_type: systemType,
      property_type: propertyType,
      roof_type: roofType,
      panel_watt: panelWatt,
      panel_count: panelCount,
      notes,
    },
  };
}

export async function GET(request) {
  if (!await getStaffSession(request)) return unauthorized();
  if (!isSupabaseConfigured()) return databaseNotConfigured();

  const { data, error } = await getSupabaseServerClient()
    .from("quotations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) {
    console.error("Quotation list failed:", error.code || error.message);
    return databaseUnavailable();
  }
  return NextResponse.json({ success: true, data: (data || []).map(toClientRecord) }, { headers: noStore });
}

export async function POST(request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ success: false }, { status: 403 });
  if (!await getStaffSession(request)) return unauthorized();
  if (!isSupabaseConfigured()) return databaseNotConfigured();

  try {
    const parsed = parseQuotationInput(await request.json());
    if (parsed.error) return NextResponse.json({ success: false, message: parsed.error }, { status: 400, headers: noStore });

    const id = randomUUID();
    const record = {
      id,
      ref_no: `MS-Q-${new Date().getFullYear()}-${id.slice(0, 8).toUpperCase()}`,
      ...parsed.value,
    };
    const { data, error } = await getSupabaseServerClient().from("quotations").insert(record).select("*").single();
    if (error) {
      console.error("Quotation insert failed:", error.code || error.message);
      return databaseUnavailable();
    }
    return NextResponse.json({ success: true, data: toClientRecord(data) }, { status: 201, headers: noStore });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to save quotation. Check the entered details and try again." }, { status: 400, headers: noStore });
  }
}

export async function PATCH(request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ success: false }, { status: 403 });
  if (!await getStaffSession(request)) return unauthorized();
  if (!isSupabaseConfigured()) return databaseNotConfigured();

  try {
    const body = await request.json();
    if (typeof body?.id !== "string" || !body.id || body.id.length > 80) {
      return NextResponse.json({ success: false, message: "A valid quotation ID is required." }, { status: 400, headers: noStore });
    }

    let update;
    if (typeof body.isPurchased === "boolean") {
      update = {
        is_purchased: body.isPurchased,
        status: body.isPurchased ? "completed" : "pending",
        completed_at: body.isPurchased ? new Date().toISOString() : null,
      };
      if (typeof body.notes === "string") update.notes = body.notes.slice(0, 2000);
    } else {
      const parsed = parseQuotationInput(body);
      if (parsed.error) return NextResponse.json({ success: false, message: parsed.error }, { status: 400, headers: noStore });
      update = parsed.value;
    }

    const { data, error } = await getSupabaseServerClient()
      .from("quotations")
      .update(update)
      .eq("id", body.id)
      .select("*")
      .maybeSingle();
    if (error) {
      console.error("Quotation update failed:", error.code || error.message);
      return databaseUnavailable();
    }
    if (!data) return NextResponse.json({ success: false, message: "Quotation not found." }, { status: 404, headers: noStore });
    return NextResponse.json({ success: true, data: toClientRecord(data) }, { headers: noStore });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to update quotation." }, { status: 400, headers: noStore });
  }
}

export async function DELETE(request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ success: false }, { status: 403 });
  if (!await getStaffSession(request)) return unauthorized();
  if (!isSupabaseConfigured()) return databaseNotConfigured();

  const id = new URL(request.url).searchParams.get("id");
  if (!id || id.length > 80) return NextResponse.json({ success: false, message: "A valid quotation ID is required." }, { status: 400, headers: noStore });
  const { data, error } = await getSupabaseServerClient().from("quotations").delete().eq("id", id).select("id");
  if (error) {
    console.error("Quotation delete failed:", error.code || error.message);
    return databaseUnavailable();
  }
  if (!data?.length) return NextResponse.json({ success: false, message: "Quotation not found." }, { status: 404, headers: noStore });
  return NextResponse.json({ success: true }, { headers: noStore });
}
