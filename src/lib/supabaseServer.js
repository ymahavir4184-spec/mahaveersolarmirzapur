import { createClient } from "@supabase/supabase-js";

let supabaseServerClient = null;

export function isSupabaseConfigured() {
  return getSupabaseConfigurationIssue() === null;
}

export function getSupabaseConfigurationIssue() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key) return "missing_credentials";
  if (key.startsWith("sb_publishable_") || key.startsWith("sb_anon_")) return "public_key";

  // Older Supabase anon/service_role API keys are JWTs; reject anon keys for server writes.
  if (key.startsWith("eyJ")) {
    try {
      const claims = JSON.parse(Buffer.from(key.split(".")[1] || "", "base64url").toString("utf8"));
      if (claims.role === "anon") return "public_key";
    } catch {
      // Let Supabase report malformed non-empty keys through the normal connection error path.
    }
  }
  return null;
}

export function getSupabaseConfigurationMessage() {
  if (getSupabaseConfigurationIssue() === "public_key") {
    return "A publishable/anon key is set as the server key. Use the Supabase Secret key (sb_secret_...) or a legacy service_role key instead, then restart the website.";
  }
  return "Supabase is not connected. Set SUPABASE_URL and either SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY in .env.local, then restart the website.";
}

export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseServerClient) {
    const supabaseUrl = process.env.SUPABASE_URL.trim();
    const supabaseServiceKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY).trim();

    supabaseServerClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseServerClient;
}
