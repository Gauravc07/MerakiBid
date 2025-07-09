"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRealtimeBidding } from "@/hooks/use-realtime-bidding"
import { Loader2, RefreshCw } from "lucide-react"
import BiddingTimeStatus from "./bidding-time-status"
import BidLoadingOverlay from "./bid-loading-overlay"
import DynamicSeatingChart from "./dynamic-seating-chart"

interface ProductionBiddingTableProps {
  currentUser?: string
}

export default function ProductionBiddingTable({ currentUser = "user1" }: ProductionBiddingTableProps) {
  const { tables, recentBids, loading, error, placeBid, refetch } = useRealtimeBidding()
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [hoveredTable, setHoveredTable] = useState<string | null>(null)
  const [customBid, setCustomBid] = useState<string>("")
  const [bidError, setBidError] = useState<string>("")
  const [isPlacingBid, setIsPlacingBid] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [lastBidPlaced, setLastBidPlaced] = useState<string | null>(null)

  // Update last refresh time every 1 second to show activity
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handlePlaceBid = async (tableId: string) => {
    const table = tables.find((t) => t.id === tableId)
    if (!table) {
      setBidError("Table not found")
      return
    }

    const bidAmount = Number.parseInt(customBid)
    const minimumBid = table.current_bid + 1000

    // Enhanced validation
    if (!customBid || customBid.trim() === "") {
      setBidError("Please enter a bid amount")
      return
    }

    if (isNaN(bidAmount) || bidAmount <= 0) {
      setBidError("Please enter a valid positive number")
      return
    }

    if (bidAmount <= table.current_bid) {
      setBidError(`Bid must be higher than current highest bid of ₹${table.current_bid.toLocaleString()}`)
      return
    }

    if (bidAmount < minimumBid) {
      setBidError(`Minimum bid is ₹${minimumBid.toLocaleString()} (₹1000 more than current highest bid)`)
      return
    }

    // Check if user is trying to outbid themselves
    if (table.highest_bidder_username === currentUser) {
      setBidError("You already have the highest bid on this table")
      return
    }

    setIsPlacingBid(true)
    setBidError("")
    setLastBidPlaced(tableId)

    console.log("Placing bid:", {
      tableId,
      bidAmount,
      currentBid: table.current_bid,
      minimumBid,
      currentUser,
      currentHighestBidder: table.highest_bidder_username,
    })

    try {
      // Add a minimum delay to show the animation
      const [result] = await Promise.all([
        placeBid(tableId, bidAmount),
        new Promise((resolve) => setTimeout(resolve, 2000)), // Minimum 2 seconds to show animation
      ])

      console.log("Bid result:", result)

      if (result.success) {
        setSelectedTable(null)
        setCustomBid("")

        // Force multiple refreshes to ensure UI updates
        setTimeout(() => {
          console.log("First refresh after bid...")
          refetch()
        }, 500)

        setTimeout(() => {
          console.log("Second refresh after bid...")
          refetch()
        }, 2000)

        setTimeout(() => {
          console.log("Third refresh after bid...")
          refetch()
        }, 4000)
      } else {
        setBidError(result.error || "Failed to place bid")
      }
    } catch (error) {
      console.error("Error placing bid:", error)
      setBidError("An unexpected error occurred")
    } finally {
      setIsPlacingBid(false)
      setLastBidPlaced(null)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Diamond":
        return "bg-purple-600"
      case "Platinum":
        return "bg-gray-400"
      case "Gold":
        return "bg-yellow-500"
      case "Silver":
        return "bg-gray-300"
      default:
        return "bg-gray-500"
    }
  }

  // Clear bid error when selection changes
  useEffect(() => {
    setBidError("")
    setCustomBid("")
  }, [selectedTable])

  // Don't auto-populate minimum bid - let user enter custom amount
  // Just clear the field when table selection changes
  useEffect(() => {
    if (selectedTable) {
      setCustomBid("") // Clear field instead of auto-populating
    }
  }, [selectedTable])

  // Manual refresh function
  const handleManualRefresh = () => {
    console.log("Manual refresh triggered")
    refetch()
    setLastRefresh(new Date())
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        <span className="ml-2 text-foreground">Loading bidding data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={handleManualRefresh}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Bid Loading Overlay */}
      <BidLoadingOverlay isVisible={isPlacingBid} />

      <section className="w-full py-6 md:py-8 lg:py-12 bg-black">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-8">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gold-gradient">Live Bidding Section</h2>

            {/* Auto-refresh indicator with manual refresh button */}
            <div className="flex items-center justify-center gap-4 text-sm text-yellow-400">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Auto-refreshing every 2s • Last update: {lastRefresh.toLocaleTimeString()}</span>
              </div>
              <Button
                onClick={handleManualRefresh}
                variant="outline"
                size="sm"
                className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black bg-transparent"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh Now
              </Button>
            </div>
          </div>

          {/* Add this new time status component */}
          <BiddingTimeStatus tables={tables} />

          <div className="space-y-6">
            <div className="text-center">
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-platinum-gradient italic">
                Welcome the King of Good Times
              </h3>
            </div>

            {/* Main content: Dynamic Seating Chart on left, Tables list on right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Dynamic Seating Chart on the left */}
              <div className="relative">
                <DynamicSeatingChart
                  tables={tables}
                  hoveredTable={hoveredTable}
                  selectedTable={selectedTable}
                  onTableHover={setHoveredTable}
                  onTableSelect={setSelectedTable}
                  currentUser={currentUser}
                />
              </div>

              {/* Available Tables section on the right */}
              <div className="space-y-4">
                <Card className="bg-card-overlay border-black-charcoal">
                  <CardHeader>
                    <CardTitle className="text-platinum-gradient flex items-center gap-2">
                      Available Tables ({tables.length})
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[500px] overflow-y-auto space-y-3">
                    {tables.map((table) => {
                      const minimumBid = table.current_bid + 1000
                      const isUserWinning = table.highest_bidder_username === currentUser
                      const wasJustBid = lastBidPlaced === table.id

                      return (
                        <div
                          key={table.id}
                          className={`p-3 rounded-lg border transition-all cursor-pointer ${
                            selectedTable === table.id
                              ? "border-yellow-500 bg-yellow-500/10"
                              : "border-black-charcoal bg-background hover:border-yellow-500/50"
                          } ${isUserWinning ? "ring-2 ring-green-400" : ""} ${
                            wasJustBid ? "ring-2 ring-blue-400 animate-pulse" : ""
                          }`}
                          onClick={() => setSelectedTable(table.id)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-foreground">{table.name}</h4>
                              <p className="text-sm text-muted-foreground">{table.pax} PAX</p>
                            </div>
                            <Badge className={`${getCategoryColor(table.category)} text-white`}>{table.category}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-muted-foreground">Current Highest Bid:</p>
                              <p className="font-bold text-yellow-400 text-lg">₹{table.current_bid.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">
                                by {table.highest_bidder_username || "No bidder"}
                              </p>
                              <p className="text-xs text-green-400">Min. next bid: ₹{minimumBid.toLocaleString()}</p>
                              <p className="text-xs text-gray-400">
                                Updated: {new Date(table.updated_at || Date.now()).toLocaleTimeString()}
                              </p>
                              <p className="text-xs text-blue-400">
                                Version: {table.version || 1} • Bids: {table.bid_count || 0}
                              </p>
                            </div>
                            {isUserWinning && (
                              <div className="text-green-400 text-xs font-bold bg-green-400/20 px-2 py-1 rounded">
                                🏆 YOU'RE WINNING!
                              </div>
                            )}
                          </div>

                          {selectedTable === table.id && (
                            <div className="mt-3 space-y-2 border-t border-yellow-500/20 pt-3">
                              <Label htmlFor={`bid-${table.id}`} className="text-sm text-foreground">
                                Enter Your Custom Bid (Min: ₹{minimumBid.toLocaleString()})
                              </Label>
                              <div className="flex gap-2">
                                <Input
                                  id={`bid-${table.id}`}
                                  type="number"
                                  placeholder={`Enter amount (min ${minimumBid})`}
                                  value={customBid}
                                  onChange={(e) => {
                                    setCustomBid(e.target.value)
                                    setBidError("") // Clear error when user types
                                  }}
                                  className="bg-background border-yellow-500/50 text-foreground"
                                  min={minimumBid}
                                  step="100" // Allow smaller increments for custom bids
                                  disabled={isPlacingBid || isUserWinning}
                                />
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handlePlaceBid(table.id)
                                  }}
                                  className="bg-yellow-500 hover:bg-yellow-600 text-black whitespace-nowrap"
                                  disabled={!customBid || isPlacingBid || isUserWinning}
                                >
                                  {isPlacingBid ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                      Placing...
                                    </>
                                  ) : isUserWinning ? (
                                    "You're Winning!"
                                  ) : (
                                    "Place Bid"
                                  )}
                                </Button>
                              </div>
                              {bidError && <p className="text-red-400 text-xs">{bidError}</p>}
                              {isUserWinning && (
                                <p className="text-green-400 text-xs">
                                  You have the highest bid on this table. Wait for others to bid higher.
                                </p>
                              )}
                              <div className="text-xs text-gray-400 mt-1">
                                💡 You can bid any amount above ₹{minimumBid.toLocaleString()}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Live Bidding Activity */}
            <Card className="bg-card-overlay border-black-charcoal">
              <CardHeader>
                <CardTitle className="text-platinum-gradient flex items-center gap-2">
                  Live Bidding Activity ({recentBids.length})
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recentBids.map((bid, index) => (
                    <div key={bid.id || index} className="flex justify-between items-center text-sm">
                      <span className="text-foreground">
                        <strong className={bid.username === currentUser ? "text-green-400" : ""}>
                          {bid.username === currentUser ? "You" : bid.username}
                        </strong>{" "}
                        bid on <strong>Table {bid.table_id}</strong>
                      </span>
                      <div className="text-right">
                        <span className="text-yellow-400 font-bold">₹{bid.bid_amount.toLocaleString()}</span>
                        <div className="text-xs text-muted-foreground">
                          {new Date(bid.bid_time).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentBids.length === 0 && (
                    <p className="text-muted-foreground text-center">No recent bidding activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
