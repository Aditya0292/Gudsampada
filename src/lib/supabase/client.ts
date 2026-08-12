import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://psrkbwpxkeljyalvitla.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_tSI-FQlMWlM_HTP0CJdEmg_VXqzzLus'

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

export const supabase = createClient()
