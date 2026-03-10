import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential
} from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "./config"

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()
// Add scopes if needed
googleProvider.addScope('email')
googleProvider.addScope('profile')

/**
 * Create or update user document in Firestore after authentication
 */
async function createOrUpdateUserDocument(user: User): Promise<void> {
  if (!db) {
    console.warn("[AUTH] Firestore not initialized, skipping user document creation")
    return
  }

  try {
    const userRef = doc(db, "users", user.uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      console.log("[AUTH] Created new user document for:", user.uid)
    } else {
      // Update existing user document with latest info
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || userDoc.data()?.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || userDoc.data()?.photoURL,
        updatedAt: serverTimestamp(),
      }, { merge: true })
      console.log("[AUTH] Updated user document for:", user.uid)
    }
  } catch (error) {
    console.error("[AUTH] Error creating/updating user document:", error)
    // Don't throw - user can still use the app even if document creation fails
  }
}

/**
 * Sign in with Google SSO
 * Tries popup first, falls back to redirect if popup is blocked
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  if (!auth) {
    throw new Error("Firebase is not configured. Please set environment variables.")
  }

  console.log("[AUTH] Starting Google sign-in...")

  try {
    // Try popup first (better UX)
    console.log("[AUTH] Attempting popup sign-in...")
    const result = await signInWithPopup(auth, googleProvider)
    console.log("[AUTH] Popup sign-in successful")

    // Create or update user document in Firestore
    await createOrUpdateUserDocument(result.user)

    console.log("[AUTH] Sign-in complete")
    return result
  } catch (error) {
    console.error("[AUTH] Google sign-in error:", error)

    // If popup is blocked, try redirect
    if ((error as { code?: string }).code === 'auth/popup-blocked' || (error as { code?: string }).code === 'auth/popup-closed-by-user') {
      console.log("[AUTH] Popup blocked/closed, trying redirect...")
      try {
        await signInWithRedirect(auth, googleProvider)
        // Redirect will happen, so we won't return here
        throw new Error("Redirecting to Google sign-in...")
      } catch (redirectError) {
        if (redirectError instanceof Error && redirectError.message.includes("Redirecting")) {
          throw redirectError // This is expected
        }
        throw new Error("Sign-in failed. Please check your browser's popup blocker settings.")
      }
    }

    // If user cancelled, re-throw
    if ((error as { code?: string }).code === 'auth/cancelled-popup-request') {
      throw new Error("Sign-in cancelled.")
    }

    // Other errors
    throw new Error(error instanceof Error ? error.message : "Google sign-in failed. Please try again.")
  }
}

/**
 * Handle redirect result after Google sign-in
 * Call this on page load to check if user just signed in via redirect
 */
export const handleGoogleRedirect = async (): Promise<UserCredential | null> => {
  if (!auth) {
    return null
  }

  try {
    const result = await getRedirectResult(auth)
    if (result) {
      // Create or update user document in Firestore
      await createOrUpdateUserDocument(result.user)
      return result
    }
    return null
  } catch (error) {
    console.error("[AUTH] Redirect result error:", error)
    throw error
  }
}

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  if (!auth) {
    throw new Error("Firebase is not configured. Please set environment variables.")
  }
  
  return signInWithEmailAndPassword(auth, email, password)
}

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string): Promise<UserCredential> => {
  if (!auth) {
    throw new Error("Firebase is not configured. Please set environment variables.")
  }
  
  return createUserWithEmailAndPassword(auth, email, password)
}

/**
 * Check if current user is authorized (any authenticated user is authorized)
 */
export const isAuthorizedUser = (user: User | null): boolean => {
  return user !== null && user.email !== null && user.email !== undefined
}

/**
 * Sign out current user
 */
export const logOut = async (): Promise<void> => {
  if (!auth) {
    throw new Error("Firebase is not configured. Please set environment variables.")
  }
  return signOut(auth)
}

// Alias for signOut
export { logOut as signOut }

/**
 * Get current user
 * Note: This only works on the client side.
 * For API routes, use getCurrentUserFromRequest from auth-server.ts
 */
export const getCurrentUser = (): User | null => {
  if (!auth) return null
  return auth.currentUser
}

/**
 * Get current user async (for API routes that need to verify token)
 * This version can work in both client and server contexts
 */
export async function getCurrentUserAsync(): Promise<{ uid: string; email: string | null } | null> {
  // Client-side: use auth.currentUser
  if (typeof window !== 'undefined' && auth && auth.currentUser) {
    return {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
    }
  }
  
  // Server-side: return null (should use getCurrentUserFromRequest with token)
  return null
}

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

