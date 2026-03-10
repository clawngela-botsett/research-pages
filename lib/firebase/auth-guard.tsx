"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "./config"
import { isAuthorizedUser as checkIsAuthorizedUser } from "./auth"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      router.push("/")
      return
    }

    // Set a timeout to stop loading if Firebase takes too long
    const timeout = setTimeout(() => {
      setLoading(false)
      router.push("/")
    }, 3000)

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          clearTimeout(timeout)
          if (user && checkIsAuthorizedUser(user)) {
            setUser(user)
          } else {
            // Sign out unauthorized users
            if (user) {
              auth?.signOut()
            }
            router.push("/")
          }
          setLoading(false)
        },
        (error) => {
          // Handle Firebase errors gracefully
          console.error("Firebase auth error:", error)
          clearTimeout(timeout)
          setLoading(false)
          router.push("/")
        }
      )

      return () => {
        clearTimeout(timeout)
        unsubscribe()
      }
    } catch (error) {
      console.error("Firebase auth setup error:", error)
      clearTimeout(timeout)
      setLoading(false)
      router.push("/")
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F5F3]">
        <div className="text-[#37322F] text-lg font-sans">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    // Set a timeout to stop loading if Firebase takes too long
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 3000)

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          clearTimeout(timeout)
          // Only set user if authorized
          if (user && checkIsAuthorizedUser(user)) {
            setUser(user)
          } else {
            // Sign out unauthorized users
            if (user) {
              auth?.signOut()
            }
            setUser(null)
          }
          setLoading(false)
        },
        (error) => {
          // Handle Firebase errors gracefully
          console.error("[USE AUTH] Firebase auth error:", error)
          clearTimeout(timeout)
          setUser(null)
          setLoading(false)
        }
      )

      return () => {
        clearTimeout(timeout)
        unsubscribe()
      }
    } catch (error) {
      console.error("[USE AUTH] Firebase auth setup error:", error)
      clearTimeout(timeout)
      setLoading(false)
    }
  }, [])

  return { user, loading }
}

