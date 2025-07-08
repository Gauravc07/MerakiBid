// Script to easily update event times
// Run with: node scripts/update-event-times.js

const { createClient } = require("@supabase/supabase-js")
const path = require("path")
const fs = require("fs")

// *** CONFIGURE YOUR EVENT TIMES HERE ***
const EVENT_CONFIG = {
  // Change these to your actual event times (IST)
  startTime: "2024-02-15 19:00:00+05:30", // Event start time
  endTime: "2025-09-15 23:00:00+05:30", // Event end time
}

// Function to load environment variables from .env.local
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

    console.log("✅ Loaded environment variables from .env.local")
  } else {
    console.log("⚠️  .env.local file not found, using system environment variables")
  }
}

// Load environment variables
loadEnvFile()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log("🔍 Checking environment variables...")
console.log(`Supabase URL: ${supabaseUrl ? "✅ Found" : "❌ Missing"}`)
console.log(`Service Key: ${supabaseServiceKey ? "✅ Found" : "❌ Missing"}`)

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("\n❌ Missing Supabase credentials!")
  console.error("\n📋 Please ensure you have either:")
  console.error("1. A .env.local file in your project root with:")
  console.error("   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co")
  console.error("   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key")
  console.error("\n2. Or set these as system environment variables")
  console.error("\n💡 You can find these values in your Supabase dashboard:")
  console.error("   Settings → API → Project URL and Service Role Key")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateEventTimes() {
  try {
    console.log("\n🕐 Updating event times...")
    console.log(`📅 Start Time: ${EVENT_CONFIG.startTime}`)
    console.log(`📅 End Time: ${EVENT_CONFIG.endTime}`)

    const { data, error } = await supabase
      .from("tables")
      .update({
        bidding_starts_at: EVENT_CONFIG.startTime,
        bidding_ends_at: EVENT_CONFIG.endTime,
      })
      .eq("is_active", true)
      .select()

    if (error) {
      throw error
    }

    console.log("\n✅ Event times updated successfully!")
    console.log(`📊 Updated ${data.length} tables`)

    // Display updated times for verification
    console.log("\n📋 Updated tables:")
    data.forEach((table) => {
      console.log(
        `   ${table.name}: ${new Date(table.bidding_starts_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} → ${new Date(table.bidding_ends_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
      )
    })
  } catch (error) {
    console.error("\n❌ Error updating event times:", error.message)

    if (error.message.includes("JWT")) {
      console.error("🔑 This looks like an authentication error. Please check your SUPABASE_SERVICE_ROLE_KEY")
    }

    process.exit(1)
  }
}

// Run the update
updateEventTimes()
