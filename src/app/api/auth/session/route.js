import { NextResponse } from "next/server";
import {
  getStaffSession,
  isSameOriginRequest,
  revokeStaffSession,
  STAFF_SESSION_COOKIE,
  staffSessionCookieOptions,
} from "@/lib/staffAuth";
import { STAFF_IDLE_TIMEOUT_SECONDS } from "@/lib/quotation/sessionPolicy";

export async function GET(request) {
  const session = await getStaffSession(request);
  return NextResponse.json(
    { authenticated: Boolean(session) },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  if (new URL(request.url).searchParams.get("end") === "1") {
    await revokeStaffSession(request);
    return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  }
  const session = await getStaffSession(request);
  if (!session) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json(
    { success: true, authenticated: true, idleTimeoutSeconds: STAFF_IDLE_TIMEOUT_SECONDS },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function DELETE(request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false }, { status: 403 });
  }
  await revokeStaffSession(request);
  const response = NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(STAFF_SESSION_COOKIE, "", { ...staffSessionCookieOptions(), maxAge: 0 });
  response.cookies.set("mahavir_staff_session", "", { ...staffSessionCookieOptions(), maxAge: 0 });
  return response;
}
