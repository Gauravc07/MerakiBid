// Script to debug table update issues
// Run with: node scripts/debug-table-updates.js

const { createClient } = require("@supabase/supabase-js")
const path = require("path")
const fs = require("fs")

// Load environment variables
function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env.local")
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf8")
    const envLines = envFile.split("\n")
    envLines.forEach((line) => {
      const [key, ...valueParts] = line.split("=")
      if (key && valueParts.length > 0) {
        const value = valueParts.join("=").trim()
        process.env[key.trim()] = value
      }
    })
  }
}

loadEnvFile()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function debugTableUpdates() {
  console.log("🔍 Debugging table update issues...")

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials!")
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // 1. Check current table states
    console.log("\n1. 📊 Current table states:")
    const { data: tables } = await supabase
      .from("tables")
      .select("id, name, current_bid, highest_bidder_username, bid_count, version, updated_at")
      .eq("is_active", true)
      .order("id")

    if (tables) {
      tables.forEach((table) => {
        console.log(
          `   ${table.id}: ₹${table.current_bid} by ${table.highest_bidder_username} (v${table.version}, ${table.bid_count} bids)`,
        )
      })
    }

    // 2. Check recent bids
    console.log("\n2. 🎯 Recent bids:")
    const { data: recentBids } = await supabase
      .from("bids")
      .select("table_id, username, bid_amount, bid_time, is_winning")
      .order("bid_time", { ascending: false })
      .limit(10)

    if (recentBids) {
      recentBids.forEach((bid) => {
        const time = new Date(bid.bid_time).toLocaleTimeString()
        const winning = bid.is_winning ? "🏆" : "  "
        console.log(`   ${winning} ${bid.username} → Table ${bid.table_id}: ₹${bid.bid_amount} at ${time}`)
      })
    }

    // 3. Test place_bid function
    console.log("\n3. 🧪 Testing place_bid function...")
    const testTableId = tables?.[0]?.id || "50"
    const testBidAmount = 1 // This will fail but tests if function exists

    const { data: testResult, error: testError } = await supabase.rpc("place_bid", {
      p_table_id: testTableId,
      p_user_id: 999,
      p_username: "test_debug",
      p_bid_amount: testBidAmount,
    })

    if (testError) {
      if (testError.message.includes("does not exist")) {
        console.log("❌ place_bid function missing!")
      } else {
        console.log("✅ place_bid function exists (expected error for low bid)")
      }
    } else {
      console.log("✅ place_bid function working")
    }

    // 4. Check for orphaned bids
    console.log("\n4. 🧹 Checking for orphaned bids...")
    const { data: orphanedBids } = await supabase
      .from("bids")
      .select("id, table_id, username, bid_amount")
      .not("table_id", "in", `(${tables?.map((t) => `'${t.id}'`).join(",") || "'none'"})`)

    if (orphanedBids && orphanedBids.length > 0) {
      console.log(`⚠️  Found ${orphanedBids.length} orphaned bids:`)
      orphanedBids.forEach((bid) => {
        console.log(`   Bid ${bid.id}: ${bid.username} → Table ${bid.table_id} (table doesn't exist)`)
      })
    } else {
      console.log("✅ No orphaned bids found")
    }

    // 5. Check real-time subscriptions
    console.log("\n5. 📡 Testing real-time subscriptions...")
    const channel = supabase
      .channel("test-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tables",
        },
        (payload) => {
          console.log("Real-time update received:", payload.new)
        },
      )
      .subscribe((status) => {
        console.log(`Real-time subscription status: ${status}`)
        if (status === "SUBSCRIBED") {
          console.log("✅ Real-time subscriptions working")
          supabase.removeChannel(channel)
        }
      })

    // Wait a bit for subscription test
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("\n" + "=" * 50)
    console.log("🎯 DIAGNOSIS COMPLETE")
    console.log("\n📋 Potential issues to check:")
    console.log("1. Are bids being recorded in the bids table?")
    console.log("2. Is the place_bid function updating the tables correctly?")
    console.log("3. Are real-time subscriptions working?")
    console.log("4. Is the frontend fetching the latest data?")
    console.log("5. Are there any caching issues?")
  } catch (error) {
    console.error("💥 Error during debugging:", error.message)
  }
}

debugTableUpdates()
