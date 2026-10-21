import { NextResponse } from "next/server";
import {
  createStaffSession,
  isSameOriginRequest,
  STAFF_SESSION_COOKIE,
  staffSessionCookieOptions,
  verifyStaffCredentials,
} from "@/lib/staffAuth";

export async function POST(request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false }, { status: 403 });
  }

  try {
    const body = await request.json();
    const loginId = typeof body.loginId === "string" ? body.loginId.slice(0, 10) : "";
    const password = typeof body.password === "string" ? body.password.slice(0, 10) : "";
    const credentials = verifyStaffCredentials(loginId, password);

    if (!credentials.configured) {
      return NextResponse.json(
        { success: false, message: "Staff login is not securely configured." },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }
    if (!credentials.valid) {
      return NextResponse.json(
        { success: false, message: "Invalid login ID or password." },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const sessionToken = await createStaffSession(loginId);
    const response = NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(STAFF_SESSION_COOKIE, sessionToken, staffSessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Secure staff sessions are not ready. Apply the staff-session SQL in Supabase, then retry." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
