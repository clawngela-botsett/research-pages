"use client"

import { AuthGuard } from "@/lib/firebase/auth-guard"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AuthGuard>
  )
}
