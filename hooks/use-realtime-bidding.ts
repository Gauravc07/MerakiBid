"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase, type Table, type Bid } from "@/lib/supabase"

export function useRealtimeBidding() {
  const [tables, setTables] = useState<Table[]>([])
  const [recentBids, setRecentBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial data
  useEffect(() => {
    fetchTables()
    fetchRecentBids()
  }, [])

  // Auto-refresh every 2 seconds for more responsive updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTables()
      fetchRecentBids()
    }, 2000) // Increased to 2 seconds to reduce server load

    return () => clearInterval(interval)
  }, [])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!supabase) return

    // Subscribe to table updates
    const tablesSubscription = supabase
      .channel("tables-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tables",
        },
        (payload) => {
          console.log("Real-time table update:", payload.new)
          setTables((prev) => prev.map((table) => (table.id === payload.new.id ? { ...table, ...payload.new } : table)))
        },
      )
      .subscribe()

    // Subscribe to new bids
    const bidsSubscription = supabase
      .channel("bids-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bids",
        },
        (payload) => {
          console.log("Real-time new bid:", payload.new)
          setRecentBids((prev) => [payload.new as Bid, ...prev.slice(0, 19)])
          // Force refresh tables when new bid comes in
          setTimeout(() => fetchTables(), 500)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(tablesSubscription)
      supabase.removeChannel(bidsSubscription)
    }
  }, [])

  const fetchTables = useCallback(async () => {
    try {
      const response = await fetch("/api/tables", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "X-Timestamp": Date.now().toString(),
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched tables data:", data)

      if (data.tables && Array.isArray(data.tables)) {
        setTables(data.tables)
        setError(null)
      } else {
        console.warn("Invalid tables data:", data)
      }
    } catch (err) {
      console.error("Error fetching tables:", err)
      setError("Failed to fetch tables")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRecentBids = useCallback(async () => {
    try {
      const response = await fetch("/api/bids", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "X-Timestamp": Date.now().toString(),
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched bids data:", data)

      if (data.bids && Array.isArray(data.bids)) {
        setRecentBids(data.bids)
      }
    } catch (err) {
      console.error("Error fetching bids:", err)
    }
  }, [])

  const placeBid = async (tableId: string, bidAmount: number) => {
    try {
      console.log("Placing bid:", { tableId, bidAmount })

      const response = await fetch("/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Timestamp": Date.now().toString(),
        },
        body: JSON.stringify({
          table_id: tableId,
          bid_amount: bidAmount,
        }),
      })

      const data = await response.json()
      console.log("Bid response:", data)

      if (!response.ok) {
        // Return detailed error information
        return {
          success: false,
          error: data.error || "Failed to place bid",
          error_code: data.error_code,
          current_bid: data.current_bid,
          minimum_bid: data.minimum_bid,
        }
      }

      // Immediately update the local table state with the new bid
      setTables((prevTables) =>
        prevTables.map((table) =>
          table.id === tableId
            ? {
                ...table,
                current_bid: bidAmount,
                highest_bidder_username: data.username || "You",
                bid_count: (table.bid_count || 0) + 1,
                version: (table.version || 1) + 1,
                updated_at: new Date().toISOString(),
              }
            : table,
        ),
      )

      // Force refresh data after successful bid
      setTimeout(() => {
        fetchTables()
        fetchRecentBids()
      }, 1000)

      // Additional refresh after 3 seconds to ensure consistency
      setTimeout(() => {
        fetchTables()
      }, 3000)

      return { success: true, data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to place bid"
      console.error("Bid error:", errorMessage)
      return {
        success: false,
        error: errorMessage,
        error_code: "NETWORK_ERROR",
      }
    }
  }

  const forceRefresh = useCallback(() => {
    console.log("Force refreshing all data...")
    fetchTables()
    fetchRecentBids()
  }, [fetchTables, fetchRecentBids])

  return {
    tables,
    recentBids,
    loading,
    error,
    placeBid,
    refetch: forceRefresh,
  }
}
