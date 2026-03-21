import { initializeApp, getApps } from 'firebase/app'
import { initializeFirestore, getFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCyqUjPKCr7eKzsMoyCTfEtMiLuQ6wZqJI",
  authDomain: "juan-tasks-8411c.firebaseapp.com",
  projectId: "juan-tasks-8411c",
  storageBucket: "juan-tasks-8411c.firebasestorage.app",
  messagingSenderId: "99879539688",
  appId: "1:99879539688:web:b6ccf116b7962551ee0a5d",
  measurementId: "G-8PM0M1LS2F"
}

let db: ReturnType<typeof initializeFirestore>

if (getApps().length === 0) {
  const app = initializeApp(firebaseConfig)
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  })
} else {
  db = getFirestore(getApps()[0]) as ReturnType<typeof initializeFirestore>
}

export { db }

export const auth = getAuth(getApps()[0])

// Returns a promise that resolves once the user is signed in
export const waitForAuth = (): Promise<void> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribe()
        resolve()
      } else {
        signInAnonymously(auth).catch(() => {})
      }
    })
  })
}

// Keep ensureAuth for backward compat
export const ensureAuth = () => signInAnonymously(auth).catch(() => {})
