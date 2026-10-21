"use client";

import React, { useState } from "react";
import Image from "next/image";
import { siteConfig } from "../../config/site.js";
import { quotationText } from "../../lib/quotation/quotationTranslations.js";

/**
 * =============================================================================
 * LOGIN GATE COMPONENT (Software Light Theme)
 * =============================================================================
 * Enterprise software login:
 * - Clean white card, crisp borders
 * - Universal wording, high clarity
 * - Hindi default + English toggle
 * =============================================================================
 */
export default function LoginGate({ onLoginSuccess, beforeLogin, lang = "hi", onLangToggle }) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tx = (key) => quotationText[key]?.[lang] || quotationText[key]?.en || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      await beforeLogin?.();
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        onLoginSuccess();
      } else if (res.status === 503) {
        setError(data.message || (lang === "hi" ? "Staff login abhi available nahi hai. Server setup check karein." : "Staff login is temporarily unavailable. Check the server setup."));
      } else {
        setError(res.status === 401 ? tx("loginError") : data.message || tx("loginError"));
        if (res.status === 401) setPassword("");
      }
    } catch {
      setError(lang === "hi" ? "कनेक्शन त्रुटि। कृपया पुनः प्रयास करें।" : "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600 rounded-t-2xl" />

        {/* Language Switcher */}
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={onLangToggle}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <span>🌐</span>
            <span>{lang === "hi" ? "English" : "हिंदी"}</span>
          </button>
        </div>

        {/* Company Logo & Software Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm mb-3">
            <Image
              src="/client-assets/logo.png"
              alt="Mahaveer Enterprises"
              width={140}
              height={140}
              className="h-20 w-auto object-contain mx-auto"
              priority
            />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {tx("loginTitle")}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {tx("loginSubtitle")}
          </p>
          <div className="mt-2 flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full bg-slate-100 px-3 py-1 text-center text-[11px] font-medium text-slate-600">
            <span>📍 {siteConfig.company.address}</span>
            <span className="hidden sm:inline">•</span>
            <span>📞 {siteConfig.company.displayPhone}</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <span className="text-base flex-shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {tx("loginIdLabel")}
            </label>
            <input
              type="text"
              required
              maxLength={10}
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder={tx("loginIdPlaceholder")}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {tx("passwordLabel")}
            </label>
            <input
              type="password"
              required
              maxLength={10}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tx("passwordPlaceholder")}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 text-sm flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{tx("loggingIn")}</span>
              </>
            ) : (
              <>
                <span>🔒</span>
                <span>{tx("loginButton")}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-100 pt-3">
          <p className="text-[11px] text-slate-400">
            {lang === "hi"
              ? "Authorized staff only. Refresh या tab बंद करने पर और 30 मिनट inactivity के बाद दोबारा login करना होगा।"
              : "Authorized staff only. Sign in again after refresh, closing the tab, or 30 minutes of inactivity."}
          </p>
        </div>
      </div>
    </div>
  );
}
