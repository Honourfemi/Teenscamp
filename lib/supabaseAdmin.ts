import { createClient } from '@supabase/supabase-js';

// This client uses the SECRET service role key, which bypasses all
// security rules. It must ONLY ever be used in server-side code
// (API routes, server components) — never in a file that runs in the browser.
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
