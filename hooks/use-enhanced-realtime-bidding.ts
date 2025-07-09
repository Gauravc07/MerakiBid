"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { supabase, type Table, type Bid } from "@/lib/supabase"

interface BidResult {
  success: boolean
  error?: string
  error_code?: string
  current_bid?: number
  minimum_bid?: number
  current_version?: number
}

export function useEnhancedRealtimeBidding() {
  const [tables, setTables] = useState<Table[]>([])
  const [recentBids, setRecentBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")

  const retryTimeoutRef = useRef<NodeJS.Timeout>()
  const maxRetries = 3
  const retryDelays = [1000, 3000, 5000] // Progressive delays

  // Fetch initial data with retry logic
  const fetchWithRetry = useCallback(async (url: string, retries = 0): Promise<any> => {
    try {
      const response = await fetch(url, {
        headers: {
          "Cache-Control": "no-cache",
          "X-Timestamp": Date.now().toString(),
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      if (retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelays[retries]))
        return fetchWithRetry(url, retries + 1)
      }
      throw err
    }
  }, [])

  const fetchTables = useCallback(async () => {
    try {
      const data = await fetchWithRetry("/api/tables")
      if (data.tables) {
        console.log("📊 Fetched tables:", data.tables.length)
        setTables(data.tables)
      }
    } catch (err) {
      setError("Failed to fetch tables")
      console.error("Error fetching tables:", err)
    }
  }, [fetchWithRetry])

  const fetchRecentBids = useCallback(async () => {
    try {
      const data = await fetchWithRetry("/api/bids")
      if (data.bids) {
        console.log("🎯 Fetched bids:", data.bids.length)
        setRecentBids(data.bids)
      }
    } catch (err) {
      console.error("Error fetching bids:", err)
    }
  }, [fetchWithRetry])

  // Initial data fetch
  useEffect(() => {
    Promise.all([fetchTables(), fetchRecentBids()]).finally(() => setLoading(false))
  }, [fetchTables, fetchRecentBids])

  // Enhanced real-time subscriptions with immediate local updates
  useEffect(() => {
    let tablesChannel: any
    let bidsChannel: any
    let reconnectAttempts = 0
    const maxReconnectAttempts = 5

    const setupSubscriptions = () => {
      if (!supabase) {
        console.warn("⚠️ Supabase not available for real-time")
        return
      }

      setConnectionStatus("connecting")

      // Subscribe to table updates with immediate UI updates
      tablesChannel = supabase
        .channel("tables-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "tables",
          },
          (payload) => {
            console.log("🔄 Real-time table update:", payload.new)

            // Immediately update the table in state
            setTables((prev) =>
              prev.map((table) =>
                table.id === payload.new.id
                  ? { ...table, ...payload.new, updated_at: new Date().toISOString() }
                  : table,
              ),
            )

            // Force a fresh fetch after a short delay to ensure consistency
            setTimeout(() => {
              console.log("🔄 Refreshing after real-time update...")
              fetchTables()
            }, 1000)
          },
        )
        .on("system", {}, (payload) => {
          if (payload.type === "system" && payload.event === "phx_error") {
            console.error("Tables channel error:", payload)
            setConnectionStatus("disconnected")
          }
        })
        .subscribe((status) => {
          console.log("📡 Tables subscription status:", status)
          if (status === "SUBSCRIBED") {
            setConnectionStatus("connected")
            reconnectAttempts = 0
          }
        })

      // Subscribe to new bids with immediate table updates
      bidsChannel = supabase
        .channel("bids-changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "bids",
          },
          (payload) => {
            console.log("🎯 Real-time new bid:", payload.new)
            const newBid = payload.new as Bid

            // Immediately add to recent bids
            setRecentBids((prev) => [newBid, ...prev.slice(0, 49)])

            // Immediately update the corresponding table if it's a winning bid
            if (newBid.is_winning) {
              setTables((prev) =>
                prev.map((table) =>
                  table.id === newBid.table_id
                    ? {
                        ...table,
                        current_bid: newBid.bid_amount,
                        highest_bidder_username: newBid.username,
                        bid_count: (table.bid_count || 0) + 1,
                        version: (table.version || 1) + 1,
                        updated_at: new Date().toISOString(),
                      }
                    : table,
                ),
              )
            }

            // Force refresh tables after a short delay
            setTimeout(() => {
              console.log("🔄 Refreshing tables after new bid...")
              fetchTables()
            }, 500)
          },
        )
        .on("system", {}, (payload) => {
          if (payload.type === "system" && payload.event === "phx_error") {
            console.error("Bids channel error:", payload)
            setConnectionStatus("disconnected")
          }
        })
        .subscribe((status) => {
          console.log("📡 Bids subscription status:", status)
        })
    }

    const handleReconnect = () => {
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++
        console.log(`🔄 Attempting to reconnect... (${reconnectAttempts}/${maxReconnectAttempts})`)

        retryTimeoutRef.current = setTimeout(() => {
          cleanup()
          setupSubscriptions()
        }, Math.pow(2, reconnectAttempts) * 1000) // Exponential backoff
      }
    }

    const cleanup = () => {
      if (tablesChannel) {
        supabase?.removeChannel(tablesChannel)
      }
      if (bidsChannel) {
        supabase?.removeChannel(bidsChannel)
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }

    setupSubscriptions()

    // Handle connection issues
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && connectionStatus === "disconnected") {
        handleReconnect()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      cleanup()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [connectionStatus, fetchTables])

  // Aggressive polling for production environment
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("⏰ Aggressive polling refresh...")
      fetchTables()
      fetchRecentBids()
    }, 3000) // Every 3 seconds for production

    return () => clearInterval(interval)
  }, [fetchTables, fetchRecentBids])

  const placeBid = useCallback(
    async (tableId: string, bidAmount: number): Promise<BidResult> => {
      try {
        const table = tables.find((t) => t.id === tableId)
        const expectedVersion = table?.version

        console.log("🎯 Placing bid:", { tableId, bidAmount, expectedVersion })

        // Optimistically update the UI immediately
        setTables((prev) =>
          prev.map((t) =>
            t.id === tableId
              ? {
                  ...t,
                  current_bid: bidAmount,
                  highest_bidder_username: "You",
                  bid_count: (t.bid_count || 0) + 1,
                  version: (t.version || 1) + 1,
                  updated_at: new Date().toISOString(),
                }
              : t,
          ),
        )

        const response = await fetch("/api/bids", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Session-ID": `${Date.now()}-${Math.random()}`,
            "X-Timestamp": Date.now().toString(),
          },
          body: JSON.stringify({
            table_id: tableId,
            bid_amount: bidAmount,
            expected_version: expectedVersion,
          }),
        })

        const data = await response.json()
        console.log("📤 Bid response:", data)

        if (!response.ok) {
          // Revert optimistic update on failure
          console.log("❌ Bid failed, reverting optimistic update")
          fetchTables() // Refresh to get correct state

          return {
            success: false,
            error: data.error || "Failed to place bid",
            error_code: data.error_code,
            current_bid: data.current_bid,
            minimum_bid: data.minimum_bid,
            current_version: data.current_version,
          }
        }

        // Force multiple refreshes to ensure all users see the update
        setTimeout(() => fetchTables(), 200)
        setTimeout(() => fetchTables(), 1000)
        setTimeout(() => fetchTables(), 3000)
        setTimeout(() => fetchRecentBids(), 500)

        return { success: true, ...data }
      } catch (err) {
        console.error("💥 Bid error:", err)
        // Revert optimistic update on error
        fetchTables()

        const errorMessage = err instanceof Error ? err.message : "Network error"
        return {
          success: false,
          error: errorMessage,
          error_code: "NETWORK_ERROR",
        }
      }
    },
    [tables, fetchTables, fetchRecentBids],
  )

  const refetch = useCallback(() => {
    setError(null)
    setLoading(true)
    Promise.all([fetchTables(), fetchRecentBids()]).finally(() => setLoading(false))
  }, [fetchTables, fetchRecentBids])

  return {
    tables,
    recentBids,
    loading,
    error,
    connectionStatus,
    placeBid,
    refetch,
  }
}
