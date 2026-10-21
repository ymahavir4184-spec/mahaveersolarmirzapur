import { NextResponse } from "next/server";
import { getSupabaseServerClient, getSupabaseConfigurationMessage, isSupabaseConfigured } from "@/lib/supabaseServer";
import { getStaffSession } from "@/lib/staffAuth";
import { listEstimateDeletionLog } from "@/lib/billing/estimateDeletionLog";

const noStore = { "Cache-Control": "no-store" };

export async function GET(request) {
  if (!await getStaffSession(request)) {
    return NextResponse.json({ success: false, message: "Staff sign-in required." }, { status: 401, headers: noStore });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, message: getSupabaseConfigurationMessage() }, { status: 503, headers: noStore });
  }

  const params = new URL(request.url).searchParams;
  const limit = Math.max(1, Math.min(100, Number(params.get("limit")) || 50));
  const offset = Math.max(0, Math.min(500_000, Number(params.get("offset")) || 0));

  try {
    const { data, error, count } = await listEstimateDeletionLog(getSupabaseServerClient(), { limit, offset });
    if (error) {
      console.error("Estimate deletion log query failed:", error.code || "unknown");
      return NextResponse.json({ success: false, message: "Deletion log is not ready. Run the latest estimate deletion migration in Supabase." }, { status: 503, headers: noStore });
    }
    return NextResponse.json({ success: true, logs: data || [], count: count || 0 }, { headers: noStore });
  } catch {
    return NextResponse.json({ success: false, message: "Deletion log could not be loaded." }, { status: 503, headers: noStore });
  }
}
