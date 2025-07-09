"use client"

import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, User, Lock } from "lucide-react"
import { useState } from "react"
import { login } from "@/app/actions"

export default function LoginForm() {
  const [state, formAction] = useFormState(login, null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <Card className="w-full max-w-md bg-black/90 border-yellow-500/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-yellow-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-yellow-400">Welcome Back</CardTitle>
          <p className="text-gray-400">Sign in to access the live bidding platform</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-yellow-500/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-yellow-500/20 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {state?.error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                {state.error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-bold py-3 transition-all duration-200 transform hover:scale-105"
            >
              Sign In
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

          <div className="text-center text-sm text-gray-500">
            <p>Need help? Contact support</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
