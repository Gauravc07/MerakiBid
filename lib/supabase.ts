import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

/* ------------------------------------------------------------------
   Validate env variables early so we don't call createClient with ""
------------------------------------------------------------------- */
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    [
      "❌ Missing Supabase environment variables.",
      "Make sure BOTH of these are set:",
      "  • NEXT_PUBLIC_SUPABASE_URL",
      "  • NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "",
      "Add them to .env.local (for local dev) and to Vercel → Project → Settings → Environment Variables.",
    ].join("\n"),
  )
}

/*  Public client – used in the browser  */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/*  Admin client – server-only operations (service role key REQUIRED) */
export const supabaseAdmin = supabaseServiceRole
  ? createClient(supabaseUrl, supabaseServiceRole, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null

// Database types
export interface Table {
  id: string
  name: string
  category: "Diamond" | "Platinum" | "Gold" | "Silver"
  pax: string
  base_price: number
  current_bid: number
  highest_bidder_id?: number
  highest_bidder_username?: string
  bid_count: number
  version: number
  is_active: boolean
  bidding_starts_at: string
  bidding_ends_at: string
  created_at: string
  updated_at: string
}

export interface Bid {
  id: number
  table_id: string
  user_id: number
  username: string
  bid_amount: number
  previous_bid: number
  bid_time: string
  is_winning: boolean
}

export interface User {
  id: number
  username: string
  email?: string
  created_at: string
  updated_at: string
}
