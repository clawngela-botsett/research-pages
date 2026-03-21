'use client'

import { useEffect, useState } from 'react'

const AUTH_KEY = 'auth_token'
const AUTH_VALUE = 'sb8116_authenticated'
const CORRECT_PASSWORD = 'sb8116'

const LOCKOUT_KEY = 'pw_attempts'
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes

function getLockoutState(): { count: number; lockedUntil: number } {
  try {
    return JSON.parse(localStorage.getItem(LOCKOUT_KEY) || '{"count":0,"lockedUntil":0}')
  } catch { return { count: 0, lockedUntil: 0 } }
}

function setLockoutState(count: number, lockedUntil: number) {
  try { localStorage.setItem(LOCKOUT_KEY, JSON.stringify({ count, lockedUntil })) } catch {}
}

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'locked' | 'unlocked'>('checking')
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [lockoutUntil, setLockoutUntil] = useState(0)
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS)
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY)
    if (stored === AUTH_VALUE) {
      setStatus('unlocked')
      return
    }
    const state = getLockoutState()
    if (state.lockedUntil > Date.now()) {
      setLockoutUntil(state.lockedUntil)
    } else if (state.lockedUntil > 0 && state.lockedUntil <= Date.now()) {
      // Lockout expired, reset
      setLockoutState(0, 0)
    }
    setAttemptsLeft(MAX_ATTEMPTS - Math.min(state.count, MAX_ATTEMPTS))
    setStatus('locked')
  }, [])

  useEffect(() => {
    if (!lockoutUntil) return
    const interval = setInterval(() => {
      const remaining = lockoutUntil - Date.now()
      if (remaining <= 0) {
        setLockoutUntil(0)
        setLockoutState(0, 0)
        setAttemptsLeft(MAX_ATTEMPTS)
        clearInterval(interval)
      } else {
        const mins = Math.ceil(remaining / 60000)
        setTimeLeft(`${mins} minute${mins !== 1 ? 's' : ''}`)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [lockoutUntil])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (lockoutUntil > Date.now()) return
    if (input === CORRECT_PASSWORD) {
      localStorage.setItem(AUTH_KEY, AUTH_VALUE)
      setLockoutState(0, 0)
      setStatus('unlocked')
      setError('')
    } else {
      const state = getLockoutState()
      const newCount = state.count + 1
      if (newCount >= MAX_ATTEMPTS) {
        const lockedUntil = Date.now() + LOCKOUT_MS
        setLockoutState(newCount, lockedUntil)
        setLockoutUntil(lockedUntil)
        setAttemptsLeft(0)
      } else {
        setLockoutState(newCount, 0)
        setAttemptsLeft(MAX_ATTEMPTS - newCount)
      }
      setError('Incorrect password.')
      setInput('')
    }
  }

  if (status === 'checking') return null

  if (status === 'unlocked') return <>{children}</>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Protected Page</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Enter the password to continue.</p>
        {lockoutUntil > Date.now() ? (
          <div className="text-center">
            <p className="text-red-400 text-sm mb-1">Too many failed attempts</p>
            <p className="text-gray-500 text-xs">Try again in {timeLeft}</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Password"
                autoFocus
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2 transition"
              >
                Unlock
              </button>
            </form>
            {error && <p className="text-red-400 text-xs text-center mt-3">Incorrect password. {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining.</p>}
          </>
        )}
      </div>
    </div>
  )
}
