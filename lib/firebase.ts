import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

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
export const db = getFirestore(app)
