// ============================================================
// lib/supabase.ts
// Supabase client — two versions:
//   supabase        = client-side (uses anon key, respects RLS)
//   supabaseAdmin   = server-side only (uses service role, bypasses RLS)
// ============================================================

import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// ── CLIENT (browser + server components) ──
// Respects Row Level Security — members only see their own data
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// ── ADMIN (API routes + server actions only — NEVER import in client components) ──
// Bypasses RLS — use only for admin operations and background jobs
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ── TYPE HELPERS ──
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileDetails = Database['public']['Tables']['profile_details']['Row']
export type Match = Database['public']['Tables']['matches']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Reflection = Database['public']['Tables']['reflections']['Row']
export type SurveyResponse = Database['public']['Tables']['survey_responses']['Row']
