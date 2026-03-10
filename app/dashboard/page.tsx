"use client"

import { useAuth } from "@/lib/firebase/auth-guard"
import { signOut } from "@/lib/firebase/auth"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          You are signed in as {user?.email}
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-2">Getting Started</h2>
            <p className="text-sm text-gray-600">
              This is a minimal dashboard template. Build your application from here.
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
