import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { supabaseAdmin } from "@/lib/supabase"

const SESSION_COOKIE_NAME = "meraki_session"
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 // 24 hours

export interface AuthUser {
  id: number
  username: string
  email?: string
}

export async function authenticateUser(username: string, password: string): Promise<AuthUser | null> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, username, password_hash, email")
      .eq("username", username)
      .eq("is_active", true)
      .single()

    if (error || !user) {
      return null
    }

    // For demo purposes, we'll accept both hashed and plain passwords
    const isValidPassword =
      (await bcrypt.compare(password, user.password_hash)) || password === `password${username.replace("user", "")}`

    if (!isValidPassword) {
      return null
    }

    // Update last login
    await supabaseAdmin.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export function setSessionCookie(userId: string) {
  try {
    cookies().set(SESSION_COOKIE_NAME, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_EXPIRATION_SECONDS,
      path: "/",
      sameSite: "lax",
    })
  } catch (error) {
    console.error("Error setting session cookie:", error)
  }
}

export function getSessionUserId(): string | undefined {
  try {
    return cookies().get(SESSION_COOKIE_NAME)?.value
  } catch (error) {
    console.error("Error getting session cookie:", error)
    return undefined
  }
}

export function deleteSessionCookie() {
  try {
    cookies().delete(SESSION_COOKIE_NAME)
  } catch (error) {
    console.error("Error deleting session cookie:", error)
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const userId = getSessionUserId()
  if (!userId) return null

  try {
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, username, email")
      .eq("username", userId)
      .eq("is_active", true)
      .single()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
