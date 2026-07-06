import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

let browserClient: SupabaseClient | null = null

/**
 * Returns the shared Supabase client, or null when the project runs in
 * demo mode (no VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY configured).
 */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null
  if (!browserClient) {
    browserClient = createClient(url, anonKey)
  }
  return browserClient
}
