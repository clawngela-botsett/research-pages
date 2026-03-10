import { NextRequest } from "next/server"

/**
 * Get current user from API request
 * Verifies Firebase ID token from Authorization header
 * Falls back to client-side auth if Admin SDK not available
 */
export async function getCurrentUserFromRequest(request: NextRequest): Promise<{ uid: string; email: string | null } | null> {
  try {
    // Try to get token from Authorization header
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader) {
      console.warn("[AUTH SERVER] No Authorization header found")
      return null
    }
    
    if (!authHeader.startsWith("Bearer ")) {
      console.warn("[AUTH SERVER] Authorization header doesn't start with 'Bearer '")
      return null
    }
    
    const token = authHeader.substring(7)
    
    if (!token) {
      console.warn("[AUTH SERVER] No token found in Authorization header")
      return null
    }
    
    // For development, decode token without verification (less secure but works without Admin SDK)
    if (process.env.NODE_ENV === 'development') {
      try {
        // Simple JWT decode (not verified - only for development!)
        const parts = token.split('.')
        if (parts.length === 3) {
          // Decode base64url (JWT uses base64url, not base64)
          let payloadStr = parts[1]
          // Replace URL-safe base64 characters
          payloadStr = payloadStr.replace(/-/g, '+').replace(/_/g, '/')
          // Add padding if needed
          while (payloadStr.length % 4) {
            payloadStr += '='
          }
          
          const payload = JSON.parse(Buffer.from(payloadStr, 'base64').toString())
          
          // Check if token is expired (basic check)
          const now = Math.floor(Date.now() / 1000)
          if (payload.exp && payload.exp < now) {
            console.warn("[AUTH SERVER] Token expired")
            return null
          }
          
          if (payload.user_id || payload.sub || payload.uid) {
            const uid = payload.user_id || payload.sub || payload.uid
            console.log(`[AUTH SERVER] Development mode: Using unverified token for user ${uid}`)
            return {
              uid: uid,
              email: payload.email || null,
            }
          }
        }
      } catch (decodeError: any) {
        console.warn("[AUTH SERVER] Token decode failed in development mode:", decodeError?.message)
      }
    }
    
    // Try to verify token using Firebase Admin SDK (for production)
    try {
      const admin = await import("firebase-admin")
      
      // Initialize admin if not already done
      if (admin.apps.length === 0) {
        // Try to initialize with default credentials
        try {
          admin.initializeApp()
        } catch (initError: any) {
          // Already initialized or no credentials - that's okay
          console.log("[AUTH SERVER] Admin SDK already initialized or no credentials:", initError?.message)
        }
      }
      
      if (admin.apps.length > 0) {
        const { getAuth } = await import("firebase-admin/auth")
        const adminAuth = getAuth(admin.apps[0])
        const decodedToken = await adminAuth.verifyIdToken(token)
        console.log(`[AUTH SERVER] Admin SDK verified token for user ${decodedToken.uid}`)
        return {
          uid: decodedToken.uid,
          email: decodedToken.email || null,
        }
      }
    } catch (adminError: any) {
      // Admin SDK not available or token invalid
      console.warn("[AUTH SERVER] Admin SDK verification failed:", adminError?.message || adminError)
    }

    // No token or verification failed
    console.warn("[AUTH SERVER] Could not verify token")
    return null
  } catch (error) {
    console.error("[AUTH SERVER] Error getting user from request:", error)
    return null
  }
}

