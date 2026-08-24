import { createClient } from "@supabase/supabase-js";

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * True when real (non-mock) Supabase credentials are present.
 * When false the app falls back to offline/demo mode gracefully.
 */
export const isSupabaseConfigured =
  Boolean(envUrl) &&
  !envUrl.includes("mock") &&
  !envUrl.includes("your-project") &&
  Boolean(envKey) &&
  !envKey.includes("mock") &&
  !envKey.includes("your-anon");

// Dev-time warning — only shown server-side or during build
if (
  typeof window === "undefined" &&
  process.env.NODE_ENV === "development" &&
  !isSupabaseConfigured
) {
  console.warn(
    "[FunLearn] ⚠️  Supabase is NOT configured. " +
      "Copy .env.example → .env.local and add your real Supabase URL + Anon Key. " +
      "Running in offline/demo mode."
  );
}

// Always create the client — falls back to mock URL in offline mode
const supabaseUrl = envUrl || "https://funlearn-mock.supabase.co";
const supabaseAnonKey = envKey || "mock-anon-key-funlearn-rural-ed";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "funlearn-auth-token",
  },
});
