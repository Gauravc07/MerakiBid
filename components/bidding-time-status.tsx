"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar, AlertCircle } from "lucide-react"
import {
  formatTimeRemaining,
  isEventLive,
  getTimeUntilStart,
  getTimeUntilEnd,
  formatISTTime,
} from "@/utils/time-helpers"

interface BiddingTimeStatusProps {
  tables: Array<{
    bidding_starts_at: string
    bidding_ends_at: string
  }>
}

export default function BiddingTimeStatus({ tables }: BiddingTimeStatusProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [eventStatus, setEventStatus] = useState<"not-started" | "live" | "ended">("not-started")

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Calculate event status and time remaining
  useEffect(() => {
    if (tables.length === 0) return

    const firstTable = tables[0]
    const startsAt = firstTable.bidding_starts_at
    const endsAt = firstTable.bidding_ends_at

    if (isEventLive(startsAt, endsAt)) {
      setEventStatus("live")
      setTimeRemaining(getTimeUntilEnd(endsAt))
    } else if (getTimeUntilStart(startsAt) > 0) {
      setEventStatus("not-started")
      setTimeRemaining(getTimeUntilStart(startsAt))
    } else {
      setEventStatus("ended")
      setTimeRemaining(0)
    }
  }, [currentTime, tables])

  if (tables.length === 0) {
    return (
      <div className="bg-black border-2 border-yellow-500 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-yellow-400">
          <Clock className="h-5 w-5" />
          <span>Loading event schedule...</span>
        </div>
      </div>
    )
  }

  const firstTable = tables[0]
  const startTime = formatISTTime(firstTable.bidding_starts_at)
  const endTime = formatISTTime(firstTable.bidding_ends_at)

  const getStatusConfig = () => {
    switch (eventStatus) {
      case "live":
        return {
          icon: <Clock className="h-5 w-5 text-yellow-400" />,
          title: "🔴 LIVE BIDDING",
          subtitle: `Event ends in: ${formatTimeRemaining(timeRemaining)}`,
          description: "Bidding is currently active! Place your bids now.",
          pulseClass: "animate-pulse",
        }
      case "not-started":
        return {
          icon: <Calendar className="h-5 w-5 text-yellow-400" />,
          title: "⏰ BIDDING STARTS SOON",
          subtitle: `Starts in: ${formatTimeRemaining(timeRemaining)}`,
          description: "Get ready! Bidding will begin shortly.",
          pulseClass: "",
        }
      case "ended":
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
          title: "🏁 BIDDING ENDED",
          subtitle: "Event has concluded",
          description: "Thank you for participating! Results will be announced soon.",
          pulseClass: "",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div
      className={`bg-black border-2 border-yellow-500 rounded-lg p-4 mb-6 shadow-lg shadow-yellow-500/20 ${config.pulseClass}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {config.icon}
          <div>
            <h3 className="font-bold text-lg text-yellow-400">{config.title}</h3>
            <p className="text-sm text-yellow-300">{config.subtitle}</p>
          </div>
        </div>
        <div className="text-right text-sm text-yellow-300">
          <div>Event: {startTime}</div>
          <div>Until: {endTime}</div>
        </div>
      </div>
      <div className="mt-2 text-sm text-yellow-200">{config.description}</div>
    </div>
  )
}
