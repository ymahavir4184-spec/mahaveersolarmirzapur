import { createClient } from "@supabase/supabase-js";

let supabaseServerClient = null;

export function isSupabaseConfigured() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && key && url.trim().length > 0 && key.trim().length > 0);
}

export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseServerClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    supabaseServerClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseServerClient;
}
