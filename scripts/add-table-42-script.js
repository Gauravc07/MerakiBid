// Script to add table 42 to the database
// Run with: node scripts/add-table-42-script.js

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

async function addTable42() {
  console.log("🔧 Adding table 42 to the database...")

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials!")
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Check if table 42 already exists
    const { data: existingTable } = await supabase.from("tables").select("*").eq("id", "42").single()

    if (existingTable) {
      console.log("⚠️  Table 42 already exists:")
      console.log(`   Name: ${existingTable.name}`)
      console.log(`   Category: ${existingTable.category}`)
      console.log(`   PAX: ${existingTable.pax}`)
      console.log(`   Current Bid: ₹${existingTable.current_bid}`)
      return
    }

    // Add table 42
    const newTable = {
      id: "42",
      name: "Table 42",
      category: "Silver",
      pax: "4-6",
      base_price: 3500,
      current_bid: 3500,
      highest_bidder_username: "User20",
      bid_count: 0,
      version: 1,
      is_active: true,
      bidding_starts_at: "2024-01-20 18:00:00+05:30",
      bidding_ends_at: "2024-01-20 23:00:00+05:30",
    }

    const { data, error } = await supabase.from("tables").insert(newTable).select().single()

    if (error) {
      console.error("❌ Error adding table 42:", error.message)
      return
    }

    console.log("✅ Table 42 added successfully!")
    console.log(`   ID: ${data.id}`)
    console.log(`   Name: ${data.name}`)
    console.log(`   Category: ${data.category}`)
    console.log(`   PAX: ${data.pax}`)
    console.log(`   Base Price: ₹${data.base_price}`)
    console.log(`   Current Bid: ₹${data.current_bid}`)

    // Verify total tables count
    const { data: allTables } = await supabase.from("tables").select("id, name").eq("is_active", true).order("id")

    console.log(`\n📊 Total active tables: ${allTables?.length || 0}`)
    if (allTables) {
      console.log("Active table IDs:", allTables.map((t) => t.id).join(", "))
    }
  } catch (error) {
    console.error("💥 Unexpected error:", error.message)
  }
}

addTable42()
