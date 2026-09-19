import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

/**
 * Returns a lazily-initialized Supabase client.
 * The client is only created on first call — not at module load time —
 * so Vercel's build phase never crashes due to missing env vars.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes('your-project-id') || key.includes('your-anon-public-key')) return false;
  return true;
}

/**
 * Returns a lazily-initialized Supabase client.
 * The client is only created on first call — not at module load time —
 * so Vercel's build phase never crashes due to missing env vars.
 */
export function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;

  if (!isSupabaseConfigured()) {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  _supabase = createClient(url, key);
  return _supabase;
}

// Convenience re-export for places that use `supabase` directly
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) {
      // Return a no-op chainable mock if unconfigured to avoid instant unhandled crashes
      return () => ({
        select: () => ({ order: () => Promise.resolve({ data: [], error: null }), eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
        delete: () => ({ eq: () => Promise.resolve({ error: null }) })
      });
    }
    return (client as any)[prop];
  }
});
