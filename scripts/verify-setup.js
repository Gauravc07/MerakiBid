// Script to verify your complete setup
// Run with: node scripts/verify-setup.js

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

async function verifySetup() {
  console.log("🔍 Verifying Meraki Entertainment Live Bidding Setup...")
  console.log("=" * 50)

  // Check environment variables
  console.log("\n1. 🔑 Environment Variables:")
  const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]

  let envOk = true
  requiredVars.forEach((varName) => {
    const value = process.env[varName]
    if (value && !value.includes("your-") && !value.includes("placeholder")) {
      console.log(`   ✅ ${varName}: Found`)
    } else {
      console.log(`   ❌ ${varName}: Missing or placeholder`)
      envOk = false
    }
  })

  if (!envOk) {
    console.log("\n❌ Environment setup incomplete!")
    console.log("Please run: ./setup-env.sh")
    return
  }

  // Test database connection
  console.log("\n2. 🗄️  Database Connection:")
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    const { data, error } = await supabase.from("tables").select("count").limit(1)

    if (error) throw error
    console.log("   ✅ Database connection successful")
  } catch (error) {
    console.log(`   ❌ Database connection failed: ${error.message}`)
    return
  }

  // Check tables exist
  console.log("\n3. 📊 Database Tables:")
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    const { data: tables } = await supabase.from("tables").select("*").limit(1)
    const { data: users } = await supabase.from("users").select("*").limit(1)
    const { data: bids } = await supabase.from("bids").select("*").limit(1)

    console.log(`   ✅ Tables: ${tables ? "Found" : "Missing"}`)
    console.log(`   ✅ Users: ${users ? "Found" : "Missing"}`)
    console.log(`   ✅ Bids: ${bids ? "Found" : "Missing"}`)
  } catch (error) {
    console.log(`   ❌ Tables check failed: ${error.message}`)
    console.log("   💡 Please run the SQL script in Supabase dashboard")
    return
  }

  // Check event times
  console.log("\n4. ⏰ Event Configuration:")
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    const { data: eventTables } = await supabase
      .from("tables")
      .select("bidding_starts_at, bidding_ends_at")
      .limit(1)
      .single()

    if (eventTables) {
      const startTime = new Date(eventTables.bidding_starts_at)
      const endTime = new Date(eventTables.bidding_ends_at)

      console.log(`   📅 Event Start: ${startTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`)
      console.log(`   📅 Event End: ${endTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`)

      if (startTime.getFullYear() === 2024 && startTime.getMonth() === 0) {
        console.log("   ⚠️  Event times appear to be placeholder values")
        console.log("   💡 Update with: node scripts/update-event-times.js")
      } else {
        console.log("   ✅ Event times configured")
      }
    }
  } catch (error) {
    console.log(`   ❌ Event times check failed: ${error.message}`)
  }

  // Check file structure
  console.log("\n5. 📁 File Structure:")
  const requiredFiles = ["package.json", ".env.local", "scripts/update-event-times.js", "app/bidding/page.tsx"]

  requiredFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}`)
    } else {
      console.log(`   ❌ ${file}`)
    }
  })

  console.log("\n" + "=" * 50)
  console.log("🎉 Setup verification complete!")
  console.log("\n📋 Next steps:")
  console.log("1. Update event times: node scripts/update-event-times.js")
  console.log("2. Test locally: npm run dev")
  console.log("3. Deploy: vercel --prod")
  console.log("4. Test with multiple users")
}

verifySetup().catch(console.error)
