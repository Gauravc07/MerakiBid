import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  /* 1. Instant fallback when client isn't initialised */
  if (!supabase) {
    console.warn("⚠️  Supabase keys missing; serving mock tables.")

    // Return mock data for development
    const mockTables = [
      {
        id: "T1",
        name: "Table 1",
        category: "Diamond" as const,
        pax: "8",
        base_price: 50000,
        current_bid: 75000,
        highest_bidder_id: 1,
        highest_bidder_username: "user1",
        bid_count: 3,
        version: 1,
        is_active: true,
        bidding_starts_at: new Date(Date.now() - 3600000).toISOString(),
        bidding_ends_at: new Date(Date.now() + 3600000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "T2",
        name: "Table 2",
        category: "Platinum" as const,
        pax: "6",
        base_price: 40000,
        current_bid: 55000,
        highest_bidder_id: 2,
        highest_bidder_username: "user2",
        bid_count: 2,
        version: 1,
        is_active: true,
        bidding_starts_at: new Date(Date.now() - 3600000).toISOString(),
        bidding_ends_at: new Date(Date.now() + 3600000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    return NextResponse.json({
      tables: mockTables,
      fallback: true,
      timestamp: new Date().toISOString(),
    })
  }

  try {
    console.log("Fetching tables from database...")

    const {
      data: tables,
      error,
      status,
    } = await supabase
      .from("tables")
      .select("*")
      .eq("is_active", true)
      .order("category", { ascending: true })
      .order("name", { ascending: true })

    console.log("Database response:", { tables: tables?.length, error, status })

    /* 2. Auth / key errors ⇒ fallback */
    if (error || status === 400 || status === 401 || status === 403) {
      console.error("Supabase error (tables):", error?.message || status)

      // Return mock data as fallback
      const mockTables = [
        {
          id: "T1",
          name: "Table 1",
          category: "Diamond" as const,
          pax: "8",
          base_price: 50000,
          current_bid: 75000,
          highest_bidder_id: 1,
          highest_bidder_username: "user1",
          bid_count: 3,
          version: 1,
          is_active: true,
          bidding_starts_at: new Date(Date.now() - 3600000).toISOString(),
          bidding_ends_at: new Date(Date.now() + 3600000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]

      return NextResponse.json({
        tables: mockTables,
        fallback: true,
        timestamp: new Date().toISOString(),
      })
    }

    console.log(
      "Successfully fetched tables:",
      tables?.map((t) => ({ id: t.id, current_bid: t.current_bid, highest_bidder: t.highest_bidder_username })),
    )

    return NextResponse.json({
      tables: tables || [],
      timestamp: new Date().toISOString(),
      count: tables?.length || 0,
      success: true,
    })
  } catch (error) {
    console.error("Unexpected error fetching tables:", error)
    return NextResponse.json({
      tables: [],
      fallback: true,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
