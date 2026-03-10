import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

// App configuration from environment variables
const appName = process.env.NEXT_PUBLIC_APP_NAME || "My App"
const appDescription = process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern web application built with Next.js and Firebase"
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://example.com"

export const metadata: Metadata = {
  title: appName,
  description: appDescription,
  openGraph: {
    title: appName,
    description: appDescription,
    url: appUrl,
    siteName: appName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    description: appDescription,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
