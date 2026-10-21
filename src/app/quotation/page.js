"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/lib/LanguageContext";
import { STAFF_IDLE_TIMEOUT_MS } from "@/lib/quotation/sessionPolicy";
import LoginGate from "@/components/quotation/LoginGate";

const StaffDashboard = dynamic(() => import("../../components/quotation/StaffDashboard.jsx"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent" />
    </div>
  ),
});

/**
 * =============================================================================
 * QUOTATION & CUSTOMER TRACKER SYSTEM PAGE (/quotation)
 * =============================================================================
 * Professional ERP / Software light theme:
 * - Pure white background (no dark mode interference)
 * - Protected staff authentication
 * - Quotation wizard & live customer tracker
 * =============================================================================
 */
export default function QuotationPage() {
  const { language, setLanguage } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const sessionResetPromiseRef = useRef(Promise.resolve());

  // A page load is a security boundary: refreshes and newly opened tabs must sign in again.
  useEffect(() => {
    const channel = typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel("mahaveer-staff-session")
      : null;
    channel?.postMessage({ type: "logout" });
    sessionResetPromiseRef.current = fetch("/api/auth/session", { method: "DELETE", cache: "no-store" })
      .catch(() => {})
      .finally(() => channel?.close());
    return () => {
      channel?.close();
    };
  }, []);

  // Shared idle timeout. User input renews the server-side Supabase session;
  // no activity for the policy window signs the staff user out.
  useEffect(() => {
    if (!isAuthenticated) return undefined;

    let lastActivityAt = Date.now();
    let lastHeartbeatAt = 0;
    let lastActivityBroadcastAt = 0;
    let lastTimerResetAt = 0;
    let timeoutId;
    let heartbeatInFlight = false;
    let didLogout = false;
    const channel = typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel("mahaveer-staff-session")
      : null;

    const logout = (notifyOtherTabs = true) => {
      if (didLogout) return;
      didLogout = true;
      window.clearTimeout(timeoutId);
      setIsAuthenticated(false);
      fetch("/api/auth/session", { method: "DELETE", cache: "no-store" }).catch(() => {});
      if (notifyOtherTabs) channel?.postMessage({ type: "logout" });
    };

    const sendHeartbeat = async () => {
      if (heartbeatInFlight || didLogout) return;
      heartbeatInFlight = true;
      try {
        const response = await fetch("/api/auth/session", { method: "POST", cache: "no-store" });
        if (response.status === 401) logout();
        else if (response.ok) lastHeartbeatAt = Date.now();
      } catch {
        // Protected APIs still enforce the server-side idle timeout if the network is unavailable.
      } finally {
        heartbeatInFlight = false;
      }
    };

    const scheduleIdleLogout = () => {
      window.clearTimeout(timeoutId);
      const remaining = Math.max(0, STAFF_IDLE_TIMEOUT_MS - (Date.now() - lastActivityAt));
      timeoutId = window.setTimeout(() => {
        if (Date.now() - lastActivityAt >= STAFF_IDLE_TIMEOUT_MS) logout();
        else scheduleIdleLogout();
      }, remaining);
    };

    const markActivity = () => {
      if (didLogout) return;
      const now = Date.now();
      lastActivityAt = now;
      if (now - lastTimerResetAt >= 1_000) {
        lastTimerResetAt = now;
        scheduleIdleLogout();
      }
      if (now - lastActivityBroadcastAt >= 5_000) {
        lastActivityBroadcastAt = now;
        channel?.postMessage({ type: "activity", at: lastActivityAt });
      }
      if (now - lastHeartbeatAt >= 60_000) void sendHeartbeat();
    };

    const onChannelMessage = (event) => {
      if (event.data?.type === "logout") logout(false);
      if (event.data?.type === "activity" && Number.isFinite(event.data.at)) {
        lastActivityAt = Math.max(lastActivityAt, Math.min(Date.now(), event.data.at));
        scheduleIdleLogout();
        if (Date.now() - lastHeartbeatAt >= 60_000) void sendHeartbeat();
      }
    };

    const onVisibilityChange = () => {
      if (!document.hidden && Date.now() - lastActivityAt >= STAFF_IDLE_TIMEOUT_MS) logout();
    };
    const onPageHide = () => {
      channel?.postMessage({ type: "logout" });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/auth/session?end=1",
          new Blob([""], { type: "text/plain" })
        );
      }
    };
    const onPageShow = (event) => {
      if (event.persisted) logout();
    };

    const activityEvents = ["pointerdown", "pointermove", "keydown", "touchstart", "input", "change", "scroll"];
    activityEvents.forEach((name) => window.addEventListener(name, markActivity, { passive: true, capture: true }));
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    channel?.addEventListener("message", onChannelMessage);
    scheduleIdleLogout();
    void sendHeartbeat();

    return () => {
      window.clearTimeout(timeoutId);
      activityEvents.forEach((name) => window.removeEventListener(name, markActivity, true));
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      channel?.removeEventListener("message", onChannelMessage);
      channel?.close();
    };
  }, [isAuthenticated]);

  // Login/logout swaps the page content without changing the URL; reset its scroll too.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isAuthenticated]);

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(async () => {
    const channel = typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel("mahaveer-staff-session")
      : null;
    channel?.postMessage({ type: "logout" });
    channel?.close();
    setIsAuthenticated(false);
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
  }, []);

  const toggleLanguage = () => setLanguage(language === "hi" ? "en" : "hi");

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pt-28 pb-6 sm:pt-36 sm:pb-8 font-sans antialiased">
      {!isAuthenticated ? (
        <LoginGate
          onLoginSuccess={handleLoginSuccess}
          beforeLogin={() => sessionResetPromiseRef.current}
          lang={language}
          onLangToggle={toggleLanguage}
        />
      ) : (
        <StaffDashboard
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
