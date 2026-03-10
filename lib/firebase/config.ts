import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"
import { getStorage, FirebaseStorage } from "firebase/storage"
import { getFunctions, Functions } from "firebase/functions"

// Firebase configuration
// Replace these values with your Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional, for Analytics
}

// Initialize Firebase only if config is valid
console.log("[FIREBASE CONFIG] Initializing Firebase...")
console.log("[FIREBASE CONFIG] API Key present:", !!firebaseConfig.apiKey)
console.log("[FIREBASE CONFIG] Project ID present:", !!firebaseConfig.projectId)

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null
let functions: Functions | null = null

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    console.log("[FIREBASE CONFIG] Attempting to initialize Firebase...")
    if (!getApps().length) {
      console.log("[FIREBASE CONFIG] No existing apps, creating new app")
      app = initializeApp(firebaseConfig)
    } else {
      console.log("[FIREBASE CONFIG] Using existing app")
      app = getApps()[0]
    }
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    functions = getFunctions(app)
    console.log("[FIREBASE CONFIG] Firebase initialized successfully")
  } catch (error) {
    console.error("[FIREBASE CONFIG] Firebase initialization error:", error)
  }
} else {
  console.warn("[FIREBASE CONFIG] Firebase configuration is missing. Please set environment variables.")
}

console.log("[FIREBASE CONFIG] Final state - auth:", auth ? "initialized" : "null")

// Export with fallbacks
export { auth, db, storage, functions }
export default app

