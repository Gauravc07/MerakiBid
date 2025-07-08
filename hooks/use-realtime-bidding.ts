"use client"

import { useState, useEffect } from "react"
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

  // Auto-refresh every 1.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTables()
      fetchRecentBids()
    }, 1500) // 1.5 seconds

    return () => clearInterval(interval)
  }, [])

  // Set up real-time subscriptions
  useEffect(() => {
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
          setRecentBids((prev) => [payload.new as Bid, ...prev.slice(0, 19)])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(tablesSubscription)
      supabase.removeChannel(bidsSubscription)
    }
  }, [])

  const fetchTables = async () => {
    try {
      const response = await fetch("/api/tables", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      const data = await response.json()

      if (data.tables) {
        setTables(data.tables)
      }
    } catch (err) {
      setError("Failed to fetch tables")
      console.error("Error fetching tables:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentBids = async () => {
    try {
      const response = await fetch("/api/bids", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      const data = await response.json()

      if (data.bids) {
        setRecentBids(data.bids)
      }
    } catch (err) {
      console.error("Error fetching bids:", err)
    }
  }

  const placeBid = async (tableId: string, bidAmount: number) => {
    try {
      const response = await fetch("/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table_id: tableId,
          bid_amount: bidAmount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to place bid")
      }

      // Immediately refresh data after successful bid
      await Promise.all([fetchTables(), fetchRecentBids()])

      return { success: true, data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to place bid"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  return {
    tables,
    recentBids,
    loading,
    error,
    placeBid,
    refetch: () => {
      fetchTables()
      fetchRecentBids()
    },
  }
}
