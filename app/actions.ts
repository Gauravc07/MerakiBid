"use server"

import { USERS } from "@/lib/users"
import { setSessionCookie, deleteSessionCookie } from "@/lib/auth"
import { redirect } from "next/navigation"

/**
 * Login Server Action
 */
export async function login(_prevState: { error?: string } | null, formData: FormData) {
  const username = (formData.get("username") ?? "").toString().trim()
  const password = (formData.get("password") ?? "").toString().trim()

  if (!username || !password) {
    return { error: "Username and password are required" }
  }

  const user = USERS.find((u) => u.username === username && u.password === password)

  if (!user) {
    return { error: "Invalid username or password" }
  }

  // Success ‒ create a session cookie and redirect to /bidding
  setSessionCookie(user.username)
  redirect("/bidding") // do NOT wrap in try/catch
}

/**
 * Logout Server Action
 */
export async function logout() {
  deleteSessionCookie()
  redirect("/") // do NOT wrap in try/catch
}
