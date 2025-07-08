"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRealtimeBidding } from "@/hooks/use-realtime-bidding"
import { Loader2, RefreshCw } from "lucide-react"
import BiddingTimeStatus from "./bidding-time-status"
import BidLoadingOverlay from "./bid-loading-overlay"

interface ProductionBiddingTableProps {
  currentUser?: string
}

export default function ProductionBiddingTable({ currentUser = "user1" }: ProductionBiddingTableProps) {
  const { tables, recentBids, loading, error, placeBid } = useRealtimeBidding()
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [hoveredTable, setHoveredTable] = useState<string | null>(null)
  const [customBid, setCustomBid] = useState<string>("")
  const [bidError, setBidError] = useState<string>("")
  const [isPlacingBid, setIsPlacingBid] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Update last refresh time every 1.5 seconds to show activity
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date())
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  const handlePlaceBid = async (tableId: string) => {
    const table = tables.find((t) => t.id === tableId)
    if (!table) return

    const bidAmount = Number.parseInt(customBid)
    const minimumBid = table.current_bid + 1000

    // Validation
    if (!customBid || isNaN(bidAmount)) {
      setBidError("Please enter a valid bid amount")
      return
    }

    if (bidAmount < minimumBid) {
      setBidError(`Bid must be at least ₹${minimumBid.toLocaleString()} (₹1000 more than current bid)`)
      return
    }

    setIsPlacingBid(true)
    setBidError("")

    // Add a minimum delay to show the animation
    const [result] = await Promise.all([
      placeBid(tableId, bidAmount),
      new Promise((resolve) => setTimeout(resolve, 2000)), // Minimum 2 seconds to show animation
    ])

    if (result.success) {
      setSelectedTable(null)
      setCustomBid("")
    } else {
      setBidError(result.error || "Failed to place bid")
    }

    setIsPlacingBid(false)
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
          <Button onClick={() => window.location.reload()}>Retry</Button>
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

            {/* Auto-refresh indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-yellow-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Auto-refreshing every 1.5s • Last update: {lastRefresh.toLocaleTimeString()}</span>
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

            {/* Main content: Image on left, Tables list on right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image on the left */}
              <div className="relative">
                <div className="relative w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-2xl shadow-yellow-500/20">
                  <Image
                    src="/images/seating-chart-black.png"
                    alt="King of Good Times Seating Chart"
                    fill
                    className="object-contain"
                    quality={100}
                  />

                  {/* Hover areas positioned accurately over each table */}
                  {tables.map((table) => {
                    let position = { top: "50%", left: "50%", width: "8%", height: "6%" }

                    // Accurate positioning based on the seating chart layout
                    switch (table.id) {
                      case "50":
                        position = { top: "8%", left: "8%", width: "12%", height: "8%" }
                        break
                      case "51":
                        position = { top: "8%", left: "25%", width: "12%", height: "8%" }
                        break
                      case "52":
                        position = { top: "8%", left: "63%", width: "12%", height: "8%" }
                        break
                      case "53":
                        position = { top: "8%", left: "80%", width: "12%", height: "8%" }
                        break
                      case "43/44":
                        position = { top: "25%", left: "2%", width: "15%", height: "10%" }
                        break
                      case "82":
                        position = { top: "32%", left: "22%", width: "10%", height: "8%" }
                        break
                      case "72":
                        position = { top: "32%", left: "68%", width: "10%", height: "8%" }
                        break
                      case "41":
                        position = { top: "45%", left: "5%", width: "8%", height: "6%" }
                        break
                      case "81":
                        position = { top: "52%", left: "18%", width: "12%", height: "8%" }
                        break
                      case "71":
                        position = { top: "52%", left: "70%", width: "12%", height: "8%" }
                        break
                      case "62":
                        position = { top: "45%", left: "87%", width: "8%", height: "6%" }
                        break
                      case "40":
                        position = { top: "65%", left: "5%", width: "8%", height: "6%" }
                        break
                      case "80":
                        position = { top: "72%", left: "18%", width: "12%", height: "8%" }
                        break
                      case "70":
                        position = { top: "72%", left: "70%", width: "12%", height: "8%" }
                        break
                      case "63":
                        position = { top: "58%", left: "87%", width: "8%", height: "6%" }
                        break
                      case "64":
                        position = { top: "71%", left: "87%", width: "8%", height: "6%" }
                        break
                    }

                    return (
                      <div
                        key={table.id}
                        className="absolute cursor-pointer z-10"
                        style={position}
                        onMouseEnter={() => setHoveredTable(table.id)}
                        onMouseLeave={() => setHoveredTable(null)}
                      >
                        {hoveredTable === table.id && (
                          <div className="absolute z-20 bg-black/95 text-yellow-400 px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-yellow-500/50 shadow-xl -top-14 left-1/2 transform -translate-x-1/2">
                            <div className="font-bold text-center text-yellow-300">Table {table.id}</div>
                            <div className="font-bold text-center">₹{table.current_bid.toLocaleString()}</div>
                            <div className="text-yellow-300 text-xs text-center">
                              {table.highest_bidder_username || "No bidder"}
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-yellow-500/50"></div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Available Tables section on the right */}
              <div className="space-y-4">
                <Card className="bg-card-overlay border-black-charcoal">
                  <CardHeader>
                    <CardTitle className="text-platinum-gradient flex items-center gap-2">
                      Available Tables
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[500px] overflow-y-auto space-y-3">
                    {tables.map((table) => (
                      <div
                        key={table.id}
                        className={`p-3 rounded-lg border transition-all cursor-pointer ${
                          selectedTable === table.id
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-black-charcoal bg-background hover:border-yellow-500/50"
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
                            <p className="text-sm text-muted-foreground">Current Bid:</p>
                            <p className="font-bold text-yellow-400">₹{table.current_bid.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">
                              by {table.highest_bidder_username || "No bidder"}
                            </p>
                          </div>
                        </div>

                        {selectedTable === table.id && (
                          <div className="mt-3 space-y-2 border-t border-yellow-500/20 pt-3">
                            <Label htmlFor={`bid-${table.id}`} className="text-sm text-foreground">
                              Enter Your Bid (Min: ₹{(table.current_bid + 1000).toLocaleString()})
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id={`bid-${table.id}`}
                                type="number"
                                placeholder={`${table.current_bid + 1000}`}
                                value={customBid}
                                onChange={(e) => setCustomBid(e.target.value)}
                                className="bg-background border-yellow-500/50 text-foreground"
                                min={table.current_bid + 1000}
                                step="1000"
                                disabled={isPlacingBid}
                              />
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePlaceBid(table.id)
                                }}
                                className="bg-yellow-500 hover:bg-yellow-600 text-black whitespace-nowrap"
                                disabled={!customBid || isPlacingBid}
                              >
                                {isPlacingBid ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Placing...
                                  </>
                                ) : (
                                  "Place Bid"
                                )}
                              </Button>
                            </div>
                            {bidError && <p className="text-red-400 text-xs">{bidError}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Live Bidding Activity */}
            <Card className="bg-card-overlay border-black-charcoal">
              <CardHeader>
                <CardTitle className="text-platinum-gradient flex items-center gap-2">
                  Live Bidding Activity
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recentBids.map((bid, index) => (
                    <div key={bid.id || index} className="flex justify-between items-center text-sm">
                      <span className="text-foreground">
                        <strong>{bid.username}</strong> bid on <strong>Table {bid.table_id}</strong>
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
