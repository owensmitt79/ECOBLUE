import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

function getCredentials(): { url?: string; key?: string } {
  // Support private server variables (preferred) and legacy fallback
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, key };
}

/**
 * Checks whether Supabase credentials are configured in the environment.
 */
export function isSupabaseConfigured(): boolean {
  const { url, key } = getCredentials();
  if (!url || !key) return false;
  if (url.includes('your-project-id') || key.includes('your-anon-public-key') || key.includes('your-supabase-anon')) return false;
  return true;
}

/**
 * Returns a lazily-initialized Supabase client.
 * Server-only: ensures database connections are only executed server-side.
 */
export function getSupabase(): SupabaseClient | null {
  if (typeof window !== 'undefined') {
    // Client-side execution should not access Supabase directly; use server API routes.
    return null;
  }

  if (_supabase) return _supabase;

  if (!isSupabaseConfigured()) {
    return null;
  }

  const { url, key } = getCredentials();
  if (!url || !key) return null;

  _supabase = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });

  return _supabase;
}

// Convenience re-export for server-side endpoints
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) {
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

