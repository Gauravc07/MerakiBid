"use client"
import type { Table } from "@/lib/supabase"

interface DynamicSeatingChartProps {
  tables: Table[]
  hoveredTable: string | null
  selectedTable: string | null
  onTableHover: (tableId: string | null) => void
  onTableSelect: (tableId: string) => void
  currentUser: string
}

interface TablePosition {
  id: string
  x: number // percentage from left
  y: number // percentage from top
  width: number // percentage width
  height: number // percentage height
  shape: "rectangle" | "circle"
  category: string
  pax: string
}

const tablePositions: TablePosition[] = [
  // Top row - Diamond tables
  { id: "50", x: 8, y: 8, width: 12, height: 12, shape: "rectangle", category: "Diamond", pax: "10-13" },
  { id: "51", x: 25, y: 8, width: 12, height: 12, shape: "rectangle", category: "Diamond", pax: "10-13" },
  { id: "52", x: 63, y: 8, width: 12, height: 12, shape: "rectangle", category: "Diamond", pax: "10-13" },
  { id: "53", x: 80, y: 8, width: 12, height: 12, shape: "rectangle", category: "Diamond", pax: "10-13" },

  // Second row
  { id: "43/44", x: 2, y: 25, width: 15, height: 12, shape: "rectangle", category: "Platinum", pax: "10-13" },
  { id: "82", x: 22, y: 32, width: 10, height: 10, shape: "circle", category: "Gold", pax: "6-8" },
  { id: "72", x: 68, y: 32, width: 10, height: 10, shape: "circle", category: "Silver", pax: "2-6" },
  { id: "43/44", x: 83, y: 25, width: 15, height: 12, shape: "rectangle", category: "Platinum", pax: "10-13" },

  // Third row - Changed first 41 to 42
  { id: "42", x: 5, y: 45, width: 8, height: 8, shape: "circle", category: "Silver", pax: "4-5" },
  { id: "81", x: 18, y: 52, width: 12, height: 8, shape: "rectangle", category: "Gold", pax: "8-8" },
  { id: "71", x: 70, y: 52, width: 12, height: 8, shape: "rectangle", category: "Gold", pax: "6-8" },
  { id: "62", x: 87, y: 45, width: 8, height: 8, shape: "circle", category: "Silver", pax: "2-3" },

  // Fourth row
  { id: "41", x: 5, y: 58, width: 8, height: 8, shape: "circle", category: "Silver", pax: "8-5" },
  { id: "63", x: 87, y: 58, width: 8, height: 8, shape: "circle", category: "Silver", pax: "3-6" },

  // Fifth row
  { id: "40", x: 5, y: 71, width: 8, height: 8, shape: "circle", category: "Silver", pax: "6-5" },
  { id: "80", x: 18, y: 72, width: 12, height: 8, shape: "rectangle", category: "Silver", pax: "4-6" },
  { id: "70", x: 70, y: 72, width: 12, height: 8, shape: "rectangle", category: "Silver", pax: "9-8" },
  { id: "64", x: 87, y: 71, width: 8, height: 8, shape: "circle", category: "Silver", pax: "2-6" },
]

export default function DynamicSeatingChart({
  tables,
  hoveredTable,
  selectedTable,
  onTableHover,
  onTableSelect,
  currentUser,
}: DynamicSeatingChartProps) {
  const getTableData = (tableId: string) => {
    return tables.find((t) => t.id === tableId)
  }

  const getHoveredTable = () => {
    if (!hoveredTable) return null
    return tables.find((table) => table.id === hoveredTable)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Diamond":
        return "border-purple-400 bg-purple-900/20"
      case "Platinum":
        return "border-gray-300 bg-gray-800/20"
      case "Gold":
        return "border-yellow-400 bg-yellow-900/20"
      case "Silver":
        return "border-gray-400 bg-gray-700/20"
      default:
        return "border-yellow-500 bg-yellow-900/20"
    }
  }

  const hoveredTableData = getHoveredTable()

  return (
    <div className="relative">
      {/* Main seating chart container */}
      <div className="relative w-full h-[600px] bg-black rounded-lg border-2 border-yellow-500 overflow-hidden">
        {/* VIP Back Stage */}
        <div className="absolute top-[15%] left-[42%] w-[16%] h-[8%] border-2 border-yellow-500 bg-yellow-900/10 flex items-center justify-center">
          <span className="text-yellow-400 font-bold text-xs">VIP BACK STAGE</span>
        </div>

        {/* DJ Console */}
        <div className="absolute top-[45%] left-[42%] w-[16%] h-[12%] border-2 border-yellow-500 bg-yellow-900/10 rounded-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-yellow-400 font-bold text-sm">DJ</div>
            <div className="text-yellow-400 font-bold text-xs">CONSOLE</div>
          </div>
        </div>

        {/* Bar */}
        <div className="absolute bottom-[15%] left-[15%] w-[70%] h-[8%] border-2 border-yellow-500 bg-yellow-900/10 flex items-center justify-center">
          <span className="text-yellow-400 font-bold text-xl">BAR</span>
        </div>

        {/* Category Legend */}
        <div className="absolute bottom-[2%] left-[5%] right-[5%] grid grid-cols-2 gap-2 text-xs">
          <div className="border border-gray-400 bg-gray-700/20 p-2 text-center text-yellow-400">SILVER : 4-6 PAX</div>
          <div className="border border-gray-300 bg-gray-800/20 p-2 text-center text-yellow-400">
            PLATINUM : 8-10 PAX
          </div>
          <div className="border border-yellow-400 bg-yellow-900/20 p-2 text-center text-yellow-400">
            GOLD : 6-8 PAX
          </div>
          <div className="border border-purple-400 bg-purple-900/20 p-2 text-center text-yellow-400">
            DIAMOND : 10-12 PAX
          </div>
        </div>

        {/* Dynamic Tables */}
        {tablePositions.map((position) => {
          const tableData = getTableData(position.id)
          if (!tableData) return null

          const isCurrentUserWinning = tableData.highest_bidder_username === currentUser
          const isHovered = hoveredTable === position.id
          const isSelected = selectedTable === position.id

          return (
            <div
              key={position.id}
              className={`absolute cursor-pointer transition-all duration-200 ${
                position.shape === "circle" ? "rounded-full" : "rounded-md"
              } ${getCategoryColor(position.category)} border-2 ${
                isHovered || isSelected ? "border-yellow-400 bg-yellow-400/30 scale-110" : ""
              } ${isCurrentUserWinning ? "ring-2 ring-green-400" : ""}`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                width: `${position.width}%`,
                height: `${position.height}%`,
              }}
              onMouseEnter={() => onTableHover(position.id)}
              onMouseLeave={() => onTableHover(null)}
              onClick={() => onTableSelect(position.id)}
            >
              {/* Table content */}
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-1">
                <div className="text-yellow-400 font-bold text-lg">{position.id}</div>
                <div className="text-yellow-300 text-xs font-semibold">{position.category.toUpperCase()}</div>
                <div className="text-yellow-200 text-xs">{position.pax} PAX</div>
              </div>

              {/* Winning indicator */}
              {isCurrentUserWinning && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-black flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}

              {/* Hover/Selection indicator */}
              {(isHovered || isSelected) && (
                <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg bg-yellow-400/20 animate-pulse" />
              )}
            </div>
          )
        })}

        {/* Hover Information Tooltip */}
        {hoveredTableData && (
          <div className="absolute z-20 bg-black/95 text-yellow-400 px-4 py-3 rounded-lg text-sm border border-yellow-500/50 shadow-xl pointer-events-none max-w-xs top-4 right-4">
            <div className="space-y-2">
              <div className="font-bold text-center text-yellow-300 text-lg">{hoveredTableData.name}</div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-400">Category:</div>
                <div className="text-white font-semibold">{hoveredTableData.category}</div>

                <div className="text-gray-400">Capacity:</div>
                <div className="text-white font-semibold">{hoveredTableData.pax} PAX</div>

                <div className="text-gray-400">Base Price:</div>
                <div className="text-white font-semibold">₹{hoveredTableData.base_price.toLocaleString()}</div>
              </div>

              <div className="border-t border-yellow-500/30 pt-2">
                <div className="text-center">
                  <div className="text-gray-400 text-xs">Current Highest Bid</div>
                  <div className="font-bold text-xl text-yellow-300">
                    ₹{hoveredTableData.current_bid.toLocaleString()}
                  </div>
                  <div className="text-gray-300 text-xs">
                    by {hoveredTableData.highest_bidder_username || "No bidder"}
                  </div>
                </div>
              </div>

              <div className="border-t border-yellow-500/30 pt-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-gray-400">Total Bids:</div>
                  <div className="text-white font-semibold">{hoveredTableData.bid_count}</div>

                  <div className="text-gray-400">Min. Next Bid:</div>
                  <div className="text-green-400 font-bold">
                    ₹{(hoveredTableData.current_bid + 1000).toLocaleString()}
                  </div>
                </div>
              </div>

              {hoveredTableData.highest_bidder_username === currentUser && (
                <div className="bg-green-500/20 border border-green-500 rounded p-2 text-center">
                  <span className="text-green-400 font-bold text-xs">🏆 YOU'RE CURRENTLY WINNING!</span>
                </div>
              )}

              <div className="text-xs text-gray-500 text-center border-t border-yellow-500/30 pt-1">
                Updated: {new Date(hoveredTableData.updated_at || Date.now()).toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Status Indicators */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-semibold">LIVE BIDDING</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 font-semibold">Your Winning Tables</span>
          </div>
        </div>
        <div className="text-gray-400">Click on tables to place bids</div>
      </div>
    </div>
  )
}
