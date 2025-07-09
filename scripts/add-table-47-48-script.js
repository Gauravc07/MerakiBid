// Script to add table 47/48 to the database
// Run with: node scripts/add-table-47-48-script.js

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

async function addTable4748() {
  console.log("🔧 Adding table 47/48 to the database...")

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials!")
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Check if table 47/48 already exists
    const { data: existingTable } = await supabase.from("tables").select("*").eq("id", "47/48").single()

    if (existingTable) {
      console.log("⚠️  Table 47/48 already exists:")
      console.log(`   Name: ${existingTable.name}`)
      console.log(`   Category: ${existingTable.category}`)
      console.log(`   PAX: ${existingTable.pax}`)
      console.log(`   Current Bid: ₹${existingTable.current_bid}`)
      return
    }

    // Add table 47/48
    const newTable = {
      id: "47/48",
      name: "Platinum 47/48",
      category: "Platinum",
      pax: "10-13",
      base_price: 10000,
      current_bid: 10000,
      highest_bidder_username: "User10",
      bid_count: 0,
      version: 1,
      is_active: true,
      bidding_starts_at: "2024-01-20 18:00:00+05:30",
      bidding_ends_at: "2024-01-20 23:00:00+05:30",
    }

    const { data, error } = await supabase.from("tables").insert(newTable).select().single()

    if (error) {
      console.error("❌ Error adding table 47/48:", error.message)
      return
    }

    console.log("✅ Table 47/48 added successfully!")
    console.log(`   ID: ${data.id}`)
    console.log(`   Name: ${data.name}`)
    console.log(`   Category: ${data.category}`)
    console.log(`   PAX: ${data.pax}`)
    console.log(`   Base Price: ₹${data.base_price}`)
    console.log(`   Current Bid: ₹${data.current_bid}`)

    // Show all platinum tables
    const { data: platinumTables } = await supabase
      .from("tables")
      .select("id, name, category, pax, current_bid")
      .eq("category", "Platinum")
      .eq("is_active", true)
      .order("id")

    console.log(`\n💎 Platinum tables (${platinumTables?.length || 0}):`)
    if (platinumTables) {
      platinumTables.forEach((table) => {
        console.log(`   ${table.id}: ${table.name} (${table.pax} PAX) - ₹${table.current_bid}`)
      })
    }

    // Verify total tables count
    const { data: allTables } = await supabase.from("tables").select("id, name").eq("is_active", true).order("id")

    console.log(`\n📊 Total active tables: ${allTables?.length || 0}`)
  } catch (error) {
    console.error("💥 Unexpected error:", error.message)
  }
}

addTable4748()
