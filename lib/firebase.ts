import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCyqUjPKCr7eKzsMoyCTfEtMiLuQ6wZqJI",
  authDomain: "juan-tasks-8411c.firebaseapp.com",
  projectId: "juan-tasks-8411c",
  storageBucket: "juan-tasks-8411c.firebasestorage.app",
  messagingSenderId: "99879539688",
  appId: "1:99879539688:web:b6ccf116b7962551ee0a5d",
  measurementId: "G-8PM0M1LS2F"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app, 'default') // named database 'default' (not the legacy '(default)')
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
