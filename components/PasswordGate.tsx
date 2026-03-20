'use client'

import { useEffect, useState } from 'react'

const AUTH_KEY = 'auth_token'
const AUTH_VALUE = 'sb8116_authenticated'
const CORRECT_PASSWORD = 'sb8116'

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'locked' | 'unlocked'>('checking')
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY)
    setStatus(stored === AUTH_VALUE ? 'unlocked' : 'locked')
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === CORRECT_PASSWORD) {
      localStorage.setItem(AUTH_KEY, AUTH_VALUE)
      setStatus('unlocked')
      setError('')
    } else {
      setError('Incorrect password. Please try again.')
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Password"
            autoFocus
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2 transition"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}
