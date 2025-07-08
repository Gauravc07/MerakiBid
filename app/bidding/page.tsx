import SimpleLoginForm from "@/components/simple-login-form"
import ProductionBiddingTable from "@/components/production-bidding-table"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { getCurrentUser } from "@/lib/auth-enhanced"
import { logout } from "@/app/actions"

export default async function BiddingPage() {
  const user = await getCurrentUser()
  const isLoggedIn = Boolean(user)

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <SiteHeader />
      <main className="flex-1 pt-24">
        {isLoggedIn ? (
          <div className="space-y-2">
            <div className="container px-4 md:px-6 flex justify-between items-center pt-4 pb-2">
              <div className="text-sm text-gray-400">
                Logged in as <span className="text-yellow-400 font-semibold">{user.username}</span>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400 px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
            <ProductionBiddingTable currentUser={user.username} />
          </div>
        ) : (
          <SimpleLoginForm />
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
