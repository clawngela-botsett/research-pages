"use client"

import Link from "next/link"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signInWithGoogle } from "@/lib/firebase/auth"

function HomePageContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "My App"
  const appDescription = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A modern web application"

  // Get redirect URL from query params
  const redirectUrl = searchParams.get("redirect") || "/dashboard"

  const handleGoogleSignIn = async () => {
    setError("")
    setLoading(true)

    try {
      await signInWithGoogle()
      router.push(redirectUrl)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Google sign-in failed"
      if (errorMessage.includes("Sign-in cancelled")) {
        setError("Sign-in was cancelled.")
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
            {appName}
          </h1>
          <p className="text-gray-600">
            {appDescription}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">New in this repo</p>
          <h2 className="mt-2 text-lg font-semibold text-black">Steven Bartlett stylist research page</h2>
          <p className="mt-2 text-sm text-gray-600">
            A polished in-app memo with the original shortlist, added stylist base locations, and US-based options sorted first.
          </p>
          <Link
            href="/research/steven-bartlett-stylists"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-black px-4 py-2 text-sm font-medium text-black hover:bg-black hover:text-white"
          >
            Open research page
          </Link>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full group flex items-center justify-center gap-3 px-6 py-4 border border-black bg-white text-black font-medium text-base transition-all duration-200 hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 18 18">
                <path fill="currentColor" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.48h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="currentColor" d="M9 18c2.43 0 4.467-.806 5.96-2.18l-2.908-2.258c-.806.54-1.837.86-3.052.86-2.35 0-4.34-1.588-5.052-3.723H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="currentColor" d="M3.948 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.348 6.173 0 7.55 0 9s.348 2.827.957 4.042l2.991-2.332z"/>
                <path fill="currentColor" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.948 7.29C4.66 5.153 6.65 3.58 9 3.58z"/>
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Footer */}
        <p className="text-xs text-gray-400 pt-8">
          Powered by Next.js & Firebase
        </p>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}
