import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL || ''
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Sanitize against accidental quotes or whitespace in deployment dashboards
const supabaseUrl = rawUrl.replace(/^["']|["']$/g, '').trim()
const supabaseAnonKey = rawAnonKey.replace(/^["']|["']$/g, '').trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url' &&
  !supabaseUrl.includes('your_supabase_project_url')
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

