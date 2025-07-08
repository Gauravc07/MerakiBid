"use client"

import { useFormState } from "react-dom"
import { login } from "@/app/actions"

export default function SimpleLoginForm() {
  const [state, formAction] = useFormState(login, null)

  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-120px)] py-12">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg border border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-400">Login to Bidding</h1>
          <p className="text-gray-400 mt-2">Enter your credentials to access the live bidding section.</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              id="username"
              name="username"
              placeholder="user1"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="password1"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {state?.error && <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded">{state.error}</div>}

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-400 text-center">
          <p>Demo credentials: user1 / password1</p>
        </div>
      </div>
    </div>
  )
}
