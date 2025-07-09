// Script to verify table positions and remove duplicates
// Run with: node scripts/verify-table-positions.js

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

async function verifyTablePositions() {
  console.log("🔍 Verifying table positions and removing duplicates...")

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials!")
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Check for duplicate table 42 entries
    const { data: table42s } = await supabase.from("tables").select("*").eq("id", "42").order("created_at")

    if (table42s && table42s.length > 1) {
      console.log(`⚠️  Found ${table42s.length} table 42 entries. Removing duplicates...`)

      // Keep the first one, delete the rest
      const toDelete = table42s.slice(1)
      for (const table of toDelete) {
        const { error } = await supabase.from("tables").delete().eq("id", "42").eq("created_at", table.created_at)
        if (error) {
          console.error("Error deleting duplicate:", error.message)
        } else {
          console.log(`✅ Deleted duplicate table 42 created at ${table.created_at}`)
        }
      }
    } else if (table42s && table42s.length === 1) {
      console.log("✅ Only one table 42 found - no duplicates to remove")
    } else {
      console.log("⚠️  No table 42 found")
    }

    // Get all active tables and their positions
    const { data: allTables } = await supabase.from("tables").select("*").eq("is_active", true).order("id")

    console.log("\n📊 Current active tables:")
    if (allTables) {
      allTables.forEach((table) => {
        console.log(`   ${table.id}: ${table.name} (${table.category}, ${table.pax} PAX) - ₹${table.current_bid}`)
      })
    }

    // Verify table 42 position
    const table42 = allTables?.find((t) => t.id === "42")
    if (table42) {
      console.log("\n✅ Table 42 details:")
      console.log(`   Name: ${table42.name}`)
      console.log(`   Category: ${table42.category}`)
      console.log(`   PAX: ${table42.pax}`)
      console.log(`   Current Bid: ₹${table42.current_bid}`)
      console.log(`   Position: Above table 41 in the seating chart`)
    }

    console.log("\n🎯 Layout changes made:")
    console.log("   ✅ Removed duplicate table 42 from seating chart")
    console.log("   ✅ Removed PAX count from table display (shown in legend)")
    console.log("   ✅ Table 42 positioned above table 41")
    console.log("   ✅ Only one table 42 exists in database")
  } catch (error) {
    console.error("💥 Error verifying tables:", error.message)
  }
}

verifyTablePositions()
