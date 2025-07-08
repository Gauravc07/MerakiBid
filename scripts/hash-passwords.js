// Script to generate proper bcrypt hashes for the 40 users
const bcrypt = require("bcrypt")

async function generateHashes() {
  const saltRounds = 10

  for (let i = 1; i <= 40; i++) {
    const password = `password${i}`
    const hash = await bcrypt.hash(password, saltRounds)
    console.log(`('user${i}', '${hash}', 'user${i}@test.com'),`)
  }
}

generateHashes()
