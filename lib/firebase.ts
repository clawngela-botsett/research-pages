import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDYI4n7hqe--hqg3NQDlYGIBg6KDnAloo0",
  authDomain: "sb-travel-d2af7.firebaseapp.com",
  projectId: "sb-travel-d2af7",
  storageBucket: "sb-travel-d2af7.firebasestorage.app",
  messagingSenderId: "547651495355",
  appId: "1:547651495355:web:1e002552e5464d45ebd09e",
  measurementId: "G-K28KEYR62L"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app)
export const auth = getAuth(app)

// Shared tasks account — email/password is more reliable than anonymous on iOS Safari
const TASKS_EMAIL = 'tasks@sbtasks.app'
const TASKS_PASS = 'sb8116tasks'

export const waitForAuth = (): Promise<void> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribe()
        resolve()
      } else {
        signInWithEmailAndPassword(auth, TASKS_EMAIL, TASKS_PASS).catch(() => {})
      }
    })
  })
}

export const ensureAuth = () =>
  signInWithEmailAndPassword(auth, TASKS_EMAIL, TASKS_PASS).catch(() => {})
