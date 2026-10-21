import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseServerClient, getSupabaseConfigurationMessage, isSupabaseConfigured } from "@/lib/supabaseServer";
import { getStaffSession, isSameOriginRequest } from "@/lib/staffAuth";
import { deleteEstimateWithAudit } from "@/lib/billing/estimateDeletionLog";

const noStore = { "Cache-Control": "no-store" };
const json = (body, status = 200, headers = {}) => NextResponse.json(body, { status, headers: { ...noStore, ...headers } });
const unauthorized = () => json({ success: false, message: "Staff sign-in required." }, 401);
const validUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || "");

function constantTimePasswordMatch(candidate, expected) {
  const candidateHash = createHash("sha256").update(candidate, "utf8").digest();
  const expectedHash = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(candidateHash, expectedHash);
}

export async function POST(request) {
  if (!isSameOriginRequest(request)) return json({ success: false }, 403);
  const session = await getStaffSession(request);
  if (!session) return unauthorized();
  if (!isSupabaseConfigured()) return json({ success: false, message: getSupabaseConfigurationMessage() }, 503);

  const expectedPassword = process.env.ESTIMATE_DELETE_MASTER_PASSWORD;
  if (!expectedPassword || expectedPassword.length > 10) {
    return json({ success: false, message: "Set ESTIMATE_DELETE_MASTER_PASSWORD to a value of 1 to 10 characters in .env.local, then restart the server. For production, set it in the hosting environment and redeploy." }, 503);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 4096) return json({ success: false, message: "Invalid delete request." }, 413);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, message: "Invalid delete request." }, 400);
  }

  const estimateId = typeof body?.estimateId === "string" ? body.estimateId : "";
  const masterPassword = typeof body?.masterPassword === "string" ? body.masterPassword : "";
  const confirmation = typeof body?.confirmation === "string" ? body.confirmation : "";
  if (!validUuid(estimateId) || masterPassword.length > 10 || confirmation.length > 160) {
    return json({ success: false, message: "Invalid delete request." }, 400);
  }

  const passwordMatches = constantTimePasswordMatch(masterPassword, expectedPassword);
  if (!passwordMatches) {
    return json({ success: false, message: "Master password is incorrect." }, 401);
  }

  if (!confirmation.trim()) return json({ success: false, message: "Enter the estimate number to confirm deletion." }, 400);

  try {
    const { data, error } = await deleteEstimateWithAudit(getSupabaseServerClient(), {
      estimateId,
      confirmation: confirmation.trim(),
      staffId: String(session.sub || "staff").slice(0, 120),
    });
    if (error) {
      if (error.code === "P0002") return json({ success: false, message: "This estimate no longer exists or was already removed. Refresh the records." }, 404);
      if (error.code === "22023") return json({ success: false, message: "Estimate number did not match. Nothing was deleted." }, 409);
      console.error("Estimate delete audit failed:", error.code || "unknown");
      return json({ success: false, message: "Deletion log is not ready. Run the latest estimate deletion migration in Supabase, then retry." }, 503);
    }
    return json({ success: true, logged: true, estimateNumber: data?.estimate_number || "" });
  } catch {
    return json({ success: false, message: "Estimate was not deleted. Refresh the records and retry." }, 503);
  }
}
