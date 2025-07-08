import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: tables, error } = await supabase
      .from("tables")
      .select("*")
      .eq("is_active", true)
      .order("current_bid", { ascending: false })

    if (error) {
      console.error("Error fetching tables:", error)
      return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 })
    }

    return NextResponse.json({ tables })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
