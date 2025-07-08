import { type NextRequest, NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth-enhanced"

export async function GET() {
  try {
    const { data: bids, error } = await supabase
      .from("bids")
      .select("*")
      .order("bid_time", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error fetching bids:", error)
      return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 })
    }

    return NextResponse.json({ bids })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { table_id, bid_amount, expected_version } = await request.json()

    if (!table_id || !bid_amount || bid_amount <= 0) {
      return NextResponse.json({ error: "Invalid bid data" }, { status: 400 })
    }

    // Get client IP and user agent for logging
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Use the database function for atomic bid placement
    const { data: result, error } = await supabaseAdmin.rpc("place_bid", {
      p_table_id: table_id,
      p_user_id: user.id,
      p_username: user.username,
      p_bid_amount: bid_amount,
      p_expected_version: expected_version,
      p_ip_address: ip,
      p_user_agent: userAgent,
      p_session_id: request.headers.get("x-session-id") || null,
    })

    if (error) {
      console.error("Error placing bid:", error)
      return NextResponse.json({ error: "Failed to place bid" }, { status: 500 })
    }

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          error_code: result.error_code,
          current_bid: result.current_bid,
          minimum_bid: result.minimum_bid,
          current_version: result.current_version,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      bid_id: result.bid_id,
      new_bid: result.new_bid,
      previous_bid: result.previous_bid,
      new_version: result.new_version,
      message: result.message,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
