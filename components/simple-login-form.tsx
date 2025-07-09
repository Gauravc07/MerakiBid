"use client"

import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/app/actions"

export default function SimpleLoginForm() {
  const [state, formAction] = useFormState(login, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <Card className="w-full max-w-md bg-black/80 border-yellow-500/30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-yellow-400">Login to Bidding</CardTitle>
          <p className="text-gray-400">Enter your credentials to access the live bidding</p>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
            {state?.error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded p-2">
                {state.error}
              </div>
            )}
            <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold">
              Login
            </Button>
          </form>

          {/* Demo credentials helper */}
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-600">
            <p className="text-xs text-gray-400 text-center mb-2">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-300">Username: user1</div>
              <div className="text-gray-300">Password: password1</div>
              <div className="text-gray-300">Username: user2</div>
              <div className="text-gray-300">Password: password2</div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">(Available: user1-user40 / password1-password40)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
