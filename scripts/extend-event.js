// Script to extend the event by specified hours
// Run with: node scripts/extend-event.js 2 (extends by 2 hours)

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function extendEvent() {
  const hoursToExtend = Number.parseInt(process.argv[2]) || 1

  try {
    console.log(`⏰ Extending event by ${hoursToExtend} hour(s)...`)

    const { data, error } = await supabase.rpc("extend_event", {
      hours_to_extend: hoursToExtend,
    })

    if (error) {
      // Fallback to direct update if function doesn't exist
      const { data: tables, error: updateError } = await supabase
        .from("tables")
        .select("bidding_ends_at")
        .eq("is_active", true)
        .limit(1)
        .single()

      if (updateError) throw updateError

      const currentEndTime = new Date(tables.bidding_ends_at)
      const newEndTime = new Date(currentEndTime.getTime() + hoursToExtend * 60 * 60 * 1000)

      const { error: finalError } = await supabase
        .from("tables")
        .update({ bidding_ends_at: newEndTime.toISOString() })
        .eq("is_active", true)

      if (finalError) throw finalError
    }

    console.log("✅ Event extended successfully!")
    console.log(`📊 Extended by ${hoursToExtend} hour(s)`)
  } catch (error) {
    console.error("❌ Error extending event:", error.message)
  }
}

extendEvent()
