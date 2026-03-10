"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-guard"
import { getUserProfile } from "../services/profile-service"
import type { UserRole } from "../types/profile"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  redirectTo?: string
}

export function RoleGuard({ children, allowedRoles, redirectTo = "/dashboard" }: RoleGuardProps) {
  const { user, loading: authLoading } = useAuth()
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      // Redirect to login with return URL
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        router.push(`/?redirect=${encodeURIComponent(currentPath)}`)
      } else {
        router.push("/")
      }
      return
    }

    const fetchUserRole = async () => {
      try {
        console.log("[ROLE GUARD] Fetching role for user:", user.uid)
        const profile = await getUserProfile(user.uid)
        console.log("[ROLE GUARD] User profile:", profile)
        console.log("[ROLE GUARD] User ID:", user.uid)
        
        // Normalize role to lowercase for comparison
        const rawRole = profile?.role || "viewer"
        const role = typeof rawRole === 'string' ? rawRole.toLowerCase().trim() : "viewer"
        console.log("[ROLE GUARD] Resolved role:", role, "type:", typeof role)
        console.log("[ROLE GUARD] Allowed roles:", allowedRoles)
        console.log("[ROLE GUARD] Role check:", allowedRoles.map(r => r.toLowerCase()).includes(role))
        
        setUserRole(role as UserRole)
        
        // Check if role is allowed (case-insensitive)
        const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase())
        if (!normalizedAllowedRoles.includes(role)) {
          console.log("[ROLE GUARD] ❌ Role not allowed! Role:", role, "Allowed:", normalizedAllowedRoles)
          console.log("[ROLE GUARD] Redirecting to:", redirectTo)
          router.push(redirectTo)
        } else {
          console.log("[ROLE GUARD] ✅ Role allowed! Showing creator dashboard")
        }
      } catch (error) {
        console.error("[ROLE GUARD] Error fetching user role:", error)
        router.push(redirectTo)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [user, authLoading, allowedRoles, redirectTo, router])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F5F3]">
        <div className="text-[#37322F] text-lg font-sans">Loading...</div>
      </div>
    )
  }

  // Normalize role comparison
  const normalizedUserRole = userRole ? userRole.toLowerCase().trim() : null
  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase().trim())
  
  if (!user || !normalizedUserRole || !normalizedAllowedRoles.includes(normalizedUserRole)) {
    return null
  }

  return <>{children}</>
}

/**
 * Hook to get current user's role
 */
export function useUserRole(): { role: UserRole | null; loading: boolean } {
  const { user, loading: authLoading } = useAuth()
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setLoading(false)
      return
    }

    const fetchUserRole = async () => {
      try {
        const profile = await getUserProfile(user.uid)
        const role = profile?.role || "viewer" // Default to viewer if no profile or no role
        setUserRole(role)
      } catch (error) {
        console.error("Error fetching user role:", error)
        setUserRole("viewer")
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [user, authLoading])

  return { role: userRole, loading: authLoading || loading }
}

