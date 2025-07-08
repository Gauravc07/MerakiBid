// Emergency script to start the event immediately
// Run with: node scripts/start-event-now.js

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function startEventNow() {
  try {
    console.log("🚀 Starting event immediately...")

    const now = new Date()
    const endTime = new Date(now.getTime() + 5 * 60 * 60 * 1000) // 5 hours from now

    const { data, error } = await supabase
      .from("tables")
      .update({
        bidding_starts_at: now.toISOString(),
        bidding_ends_at: endTime.toISOString(),
      })
      .eq("is_active", true)
      .select()

    if (error) throw error

    console.log("✅ Event started successfully!")
    console.log(`📊 Updated ${data.length} tables`)
    console.log(`⏰ Event will end at: ${endTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`)
  } catch (error) {
    console.error("❌ Error starting event:", error.message)
  }
}

startEventNow()
