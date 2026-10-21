import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabaseServer";
import { STAFF_IDLE_TIMEOUT_SECONDS } from "@/lib/quotation/sessionPolicy";

export const STAFF_SESSION_COOKIE = "mahaveer_staff_session";
const LEGACY_STAFF_SESSION_COOKIE = "mahavir_staff_session";
const SESSION_HASH_PATTERN = /^[A-Za-z0-9_-]{43}$/;

function constantTimeEqual(left, right) {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyStaffCredentials(loginId, password) {
  const expectedId = process.env.QUOTATION_LOGIN_ID;
  const expectedPassword = process.env.QUOTATION_LOGIN_PASSWORD;
  if (!expectedId || !expectedPassword || expectedId.length > 10 || expectedPassword.length > 10) {
    return { configured: false, valid: false };
  }

  return {
    configured: true,
    valid:
      constantTimeEqual(String(loginId || "").trim().toLowerCase(), expectedId.trim().toLowerCase()) &&
      constantTimeEqual(password, expectedPassword),
  };
}

function sessionHash(token) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createStaffSession(loginId) {
  if (!isSupabaseConfigured()) throw new Error("Staff session storage is not configured.");
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await getSupabaseServerClient().from("staff_sessions").insert({
    session_hash: sessionHash(token),
    staff_login_id: String(loginId).trim().slice(0, 120),
    expires_at: expiresAt,
  });
  if (error) throw new Error("Staff session storage is not ready.");
  return token;
}

export async function getStaffSession(request) {
  const cookieValue = request.cookies?.get?.(STAFF_SESSION_COOKIE)?.value || request.cookies?.get?.(LEGACY_STAFF_SESSION_COOKIE)?.value;
  const cookieHeader = request.headers.get("cookie") || "";
  const rawToken = cookieValue || cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${STAFF_SESSION_COOKIE}=`) || part.startsWith(`${LEGACY_STAFF_SESSION_COOKIE}=`))
    ?.split("=")[1];
  if (!rawToken || !SESSION_HASH_PATTERN.test(rawToken) || !isSupabaseConfigured()) return null;

  try {
    const { data, error } = await getSupabaseServerClient().rpc("touch_staff_session_v1", {
      p_session_hash: sessionHash(rawToken),
      p_idle_timeout_seconds: STAFF_IDLE_TIMEOUT_SECONDS,
    });
    if (error || typeof data !== "string" || !data) return null;
    return { sub: data };
  } catch {
    return null;
  }
}

export async function revokeStaffSession(request) {
  const token = getStaffSessionToken(request);
  if (!token || !isSupabaseConfigured()) return;
  try {
    await getSupabaseServerClient().from("staff_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("session_hash", sessionHash(token))
      .is("revoked_at", null);
  } catch {
    // The cookie is still cleared by the caller; server authorization fails closed if storage is unavailable.
  }
}

export function getStaffSessionToken(request) {
  const cookieValue = request.cookies?.get?.(STAFF_SESSION_COOKIE)?.value || request.cookies?.get?.(LEGACY_STAFF_SESSION_COOKIE)?.value;
  const cookieHeader = request.headers.get("cookie") || "";
  const rawToken = cookieValue || cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${STAFF_SESSION_COOKIE}=`) || part.startsWith(`${LEGACY_STAFF_SESSION_COOKIE}=`))
    ?.split("=")[1];
  return rawToken && SESSION_HASH_PATTERN.test(rawToken) ? rawToken : null;
}

export function isSameOriginRequest(request) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  try {
    if (origin) return new URL(origin).origin === requestOrigin;
    const referer = request.headers.get("referer");
    if (referer) return new URL(referer).origin === requestOrigin;
    return request.headers.get("sec-fetch-site") === "same-origin";
  } catch {
    return false;
  }
}

export function staffSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  };
}
