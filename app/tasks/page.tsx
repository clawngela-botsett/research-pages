'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { db, waitForAuth } from '@/lib/firebase'
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, query, orderBy } from 'firebase/firestore'

interface Task {
  id: string
  text: string
  category: string
  status: string
  notes: string
  priority?: boolean
  dueDate?: string
  createdAt: string
  updatedAt: string
}

const CATEGORIES = ['BTD', 'Commercial', 'DOAC', 'FounderStory', 'FS', 'JAO', 'Marketing', 'Other', 'Press/PR', 'Private', 'SB Requests', 'Speaking', 'Travel']
const LAST_CATEGORY_KEY = 'juan-tasks-last-category'

const STATUSES = [
  { key: 'todo', label: 'To Do', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
  { key: 'in-progress', label: 'In Progress', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { key: 'waiting-reply', label: 'Waiting', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { key: 'waiting-me', label: 'On Me', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { key: 'done', label: 'Done', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { key: 'disregard', label: 'Disregard', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
]

function getStatusInfo(key: string) {
  return STATUSES.find(s => s.key === key) || STATUSES[0]
}

function cycleStatus(current: string): string {
  const idx = STATUSES.findIndex(s => s.key === current)
  return STATUSES[(idx + 1) % STATUSES.length].key
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date(new Date().toDateString())
}

function isDueSoon(dueDate: string): boolean {
  const due = new Date(dueDate)
  const now = new Date()
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 2 && diffDays >= 0
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function exportCSV(tasks: Task[]) {
  const header = 'id,text,category,status,notes,dueDate,createdAt,updatedAt'
  const rows = tasks.map(t =>
    [t.id, `"${t.text.replace(/"/g, '""')}"`, t.category, t.status, `"${(t.notes || '').replace(/"/g, '""')}"`, t.dueDate || '', t.createdAt, t.updatedAt].join(',')
  )
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tasks-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const TASK_PIN = 'sb8116'

const PIN_LOCKOUT_KEY = 'task_pin_attempts'
const PIN_MAX_ATTEMPTS = 5
const PIN_LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes

function getPinLockoutState(): { count: number; lockedUntil: number } {
  try {
    return JSON.parse(localStorage.getItem(PIN_LOCKOUT_KEY) || '{"count":0,"lockedUntil":0}')
  } catch { return { count: 0, lockedUntil: 0 } }
}

function setPinLockoutState(count: number, lockedUntil: number) {
  try { localStorage.setItem(PIN_LOCKOUT_KEY, JSON.stringify({ count, lockedUntil })) } catch {}
}

export default function TasksPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [pinLockoutUntil, setPinLockoutUntil] = useState(0)
  const [pinAttemptsLeft, setPinAttemptsLeft] = useState(PIN_MAX_ATTEMPTS)
  const [pinTimeLeft, setPinTimeLeft] = useState('')

  // Check if already unlocked in this session
  useEffect(() => {
    if (sessionStorage.getItem('tasks-unlocked') === 'true') {
      setUnlocked(true)
      return
    }
    const state = getPinLockoutState()
    if (state.lockedUntil > Date.now()) {
      setPinLockoutUntil(state.lockedUntil)
    } else if (state.lockedUntil > 0 && state.lockedUntil <= Date.now()) {
      setPinLockoutState(0, 0)
    }
    setPinAttemptsLeft(PIN_MAX_ATTEMPTS - Math.min(state.count, PIN_MAX_ATTEMPTS))
  }, [])

  useEffect(() => {
    if (!pinLockoutUntil) return
    const interval = setInterval(() => {
      const remaining = pinLockoutUntil - Date.now()
      if (remaining <= 0) {
        setPinLockoutUntil(0)
        setPinLockoutState(0, 0)
        setPinAttemptsLeft(PIN_MAX_ATTEMPTS)
        clearInterval(interval)
      } else {
        const mins = Math.ceil(remaining / 60000)
        setPinTimeLeft(`${mins} minute${mins !== 1 ? 's' : ''}`)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [pinLockoutUntil])

  const handleUnlock = () => {
    if (pinLockoutUntil > Date.now()) return
    if (pin === TASK_PIN) {
      sessionStorage.setItem('tasks-unlocked', 'true')
      setPinLockoutState(0, 0)
      setUnlocked(true)
    } else {
      const state = getPinLockoutState()
      const newCount = state.count + 1
      if (newCount >= PIN_MAX_ATTEMPTS) {
        const lockedUntil = Date.now() + PIN_LOCKOUT_MS
        setPinLockoutState(newCount, lockedUntil)
        setPinLockoutUntil(lockedUntil)
        setPinAttemptsLeft(0)
      } else {
        setPinLockoutState(newCount, 0)
        setPinAttemptsLeft(PIN_MAX_ATTEMPTS - newCount)
      }
      setPinError(true)
      setPin('')
      setTimeout(() => setPinError(false), 2000)
    }
  }

  const [tasks, setTasks] = useState<Task[]>([])
  const [loaded, setLoaded] = useState(false)
  const [newText, setNewText] = useState('')
  const [newCategory, setNewCategory] = useState(CATEGORIES[0])
  const [newDueDate, setNewDueDate] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [completedCollapsed, setCompletedCollapsed] = useState(false)
  const [disregardedCollapsed, setDisregardedCollapsed] = useState(false)
  const [leavingIds, setLeavingIds] = useState<Set<string>>(new Set())
  const [pendingStatus, setPendingStatus] = useState<Record<string, string>>({})
  const leaveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const inputRef = useRef<HTMLInputElement>(null)
  const editRef = useRef<HTMLInputElement>(null)
  const activeTabRef = useRef<HTMLButtonElement>(null)

  // Load last-used category from localStorage (UI preference, not data)
  useEffect(() => {
    try {
      const lastCat = localStorage.getItem(LAST_CATEGORY_KEY)
      if (lastCat && CATEGORIES.includes(lastCat)) setNewCategory(lastCat)
    } catch {}
  }, [])

  // Load tasks: wait for auth first, then start real-time listener
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null
    let cancelled = false

    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'))

    waitForAuth().then(() => {
      if (cancelled) return

      unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(d => d.data() as Task)
        setTasks(docs)
        setLoaded(true)
      }, (error) => {
        console.error('Firestore snapshot error:', error)
        setLoaded(true)
      })
    }).catch(() => {
      if (!cancelled) setLoaded(true)
    })

    return () => {
      cancelled = true
      if (unsubscribeSnapshot) unsubscribeSnapshot()
    }
  }, [])

  // Scroll active tab into view
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ inline: 'nearest', block: 'nearest' })
  }, [activeTab])

  // "/" shortcut to focus input (desktop only)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingId) {
      setTimeout(() => editRef.current?.focus(), 0)
    }
  }, [editingId])

  // Firestore helpers
  const upsertTask = useCallback(async (task: Task) => {
    await setDoc(doc(db, 'tasks', task.id), task)
  }, [])

  const removeTask = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id))
  }, [])

  const addTask = () => {
    const text = newText.trim()
    if (!text) return
    const now = new Date().toISOString()
    const task: Task = {
      id: generateId(),
      text,
      category: newCategory,
      status: 'todo',
      notes: '',
      dueDate: newDueDate || '',
      createdAt: now,
      updatedAt: now,
    }
    upsertTask(task)
    setNewText('')
    setNewDueDate('')
    try { localStorage.setItem(LAST_CATEGORY_KEY, newCategory) } catch {}
    inputRef.current?.focus()
  }

  const deleteTask = (id: string) => {
    removeTask(id)
  }

  const cycleTaskStatus = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    // Use pendingStatus as current if mid-animation (Firestore not written yet)
    const currentStatus = pendingStatus[id] || task.status
    const nextStatus = cycleStatus(currentStatus)
    const movesToBottom = nextStatus === 'done' || nextStatus === 'disregard'
    if (movesToBottom) {
      // Cancel any existing leave timer for this task
      if (leaveTimers.current[id]) clearTimeout(leaveTimers.current[id])
      // Show new status badge optimistically + fade, then write after delay
      setPendingStatus(prev => ({ ...prev, [id]: nextStatus }))
      setLeavingIds(prev => new Set(prev).add(id))
      leaveTimers.current[id] = setTimeout(() => {
        delete leaveTimers.current[id]
        upsertTask({ ...task, status: nextStatus, updatedAt: new Date().toISOString() })
        setPendingStatus(prev => { const n = { ...prev }; delete n[id]; return n })
        setLeavingIds(prev => { const s = new Set(prev); s.delete(id); return s })
      }, 1200)
    } else {
      // Leaving animation cancelled — back to an active status
      if (leaveTimers.current[id]) {
        clearTimeout(leaveTimers.current[id])
        delete leaveTimers.current[id]
      }
      setPendingStatus(prev => { const n = { ...prev }; delete n[id]; return n })
      setLeavingIds(prev => { const s = new Set(prev); s.delete(id); return s })
      upsertTask({ ...task, status: nextStatus, updatedAt: new Date().toISOString() })
    }
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditText(task.text)
  }

  const commitEdit = (id: string) => {
    const text = editText.trim()
    if (!text) return
    const task = tasks.find(t => t.id === id)
    if (!task) return
    upsertTask({ ...task, text, updatedAt: new Date().toISOString() })
    setEditingId(null)
  }

  const clearCompleted = () => {
    tasks.filter(t => t.status === 'done').forEach(t => removeTask(t.id))
  }

  const clearDisregarded = () => {
    tasks.filter(t => t.status === 'disregard').forEach(t => removeTask(t.id))
  }

  const updateNote = (id: string, notes: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    upsertTask({ ...task, notes, updatedAt: new Date().toISOString() })
  }

  const updateDueDate = (id: string, dueDate: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    upsertTask({ ...task, dueDate, updatedAt: new Date().toISOString() })
  }

  const togglePriority = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    upsertTask({ ...task, priority: !task.priority, updatedAt: new Date().toISOString() })
  }

  const cycleCategory = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const idx = CATEGORIES.indexOf(task.category)
    const next = CATEGORIES[(idx + 1) % CATEGORIES.length]
    upsertTask({ ...task, category: next, updatedAt: new Date().toISOString() })
  }

  const toggleNotes = (id: string) => {
    setExpandedNotes(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Filter
  const filtered = tasks.filter(t => {
    const matchesCategory = activeTab === 'All' ? true : t.category === activeTab
    const matchesSearch = searchQuery === '' ? true : t.text.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Sort + group
  const sortFn = (a: Task, b: Task) => {
    if (a.priority && !b.priority) return -1
    if (!a.priority && b.priority) return 1
    const cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return sortOrder === 'newest' ? -cmp : cmp
  }

  const activeTasks = filtered.filter(t => t.status !== 'done' && t.status !== 'disregard' || leavingIds.has(t.id)).sort(sortFn)
  const doneTasks = filtered.filter(t => t.status === 'done' && !leavingIds.has(t.id)).sort(sortFn)
  const disregardTasks = filtered.filter(t => t.status === 'disregard' && !leavingIds.has(t.id)).sort(sortFn)

  // Badge counts (active only)
  const badgeCount = (cat: string) =>
    tasks.filter(t => t.status !== 'done' && t.status !== 'disregard' && (cat === 'All' ? true : t.category === cat)).length

  const activeCount = tasks.filter(t => t.status !== 'done' && t.status !== 'disregard').length

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#020e14' }}>
        <div className="w-full max-w-xs text-center">
          <div className="text-3xl mb-6">🔒</div>
          <h1 className="text-white text-xl font-semibold mb-2">To Do List</h1>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>Enter your PIN to continue</p>
          {pinLockoutUntil > Date.now() ? (
            <div className="text-center mt-4">
              <p className="text-red-400 text-sm mb-1">Too many failed attempts</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Try again in {pinTimeLeft}</p>
            </div>
          ) : (
            <>
              <input
                type="password"
                className={`w-full rounded-xl px-4 py-3 text-white text-center text-xl tracking-widest focus:outline-none mb-3 transition-colors ${pinError ? 'animate-pulse' : ''}`}
                style={{
                  background: '#061c26',
                  border: `1px solid ${pinError ? 'rgb(239,68,68)' : 'rgba(240,117,88,0.35)'}`,
                  fontSize: '20px',
                }}
                placeholder="••••••"
                value={pin}
                onChange={e => setPin(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleUnlock() }}
                autoFocus
              />
              <button
                onClick={handleUnlock}
                className="w-full font-semibold py-3 rounded-xl active:scale-95 transition-transform text-white"
                style={{ background: '#f07558' }}
              >
                Unlock
              </button>
              {pinError && <p className="text-red-400 text-sm mt-3">Incorrect PIN. {pinAttemptsLeft} attempt{pinAttemptsLeft !== 1 ? 's' : ''} remaining.</p>}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: '#020e14' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-20 backdrop-blur border-b"
        style={{ background: 'rgba(2,14,20,0.95)', borderColor: 'rgba(240,117,88,0.15)' }}
      >
        {/* Title row */}
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-white whitespace-nowrap">To Do List</h1>
            <span className="text-sm whitespace-nowrap" style={{ color: 'rgba(240,117,88,0.7)' }}>
              {activeCount} active
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Sort toggle */}
            <button
              onClick={() => setSortOrder(s => s === 'newest' ? 'oldest' : 'newest')}
              className="text-xs transition-colors px-3 py-2 min-h-[36px] rounded-xl flex items-center"
              style={{
                background: '#061c26',
                border: '1px solid rgba(240,117,88,0.15)',
                color: 'rgba(255,255,255,0.6)',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            >
              {sortOrder === 'newest' ? '↓ New' : '↑ Old'}
            </button>

          </div>
        </div>

        {/* Quick-add bar */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Task input — full width on mobile */}
            <input
              ref={inputRef}
              type="text"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder="Add a task…"
              className="w-full sm:flex-1 rounded-xl px-3 py-3 text-base text-white focus:outline-none transition-colors min-h-[44px]"
              style={{
                background: '#061c26',
                border: '1px solid rgba(240,117,88,0.2)',
                fontSize: '16px',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(240,117,88,0.5)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(240,117,88,0.2)')}
            />
            {/* Category + Due Date + Add button row */}
            <div className="flex gap-2">
              <select
                value={newCategory}
                onChange={e => {
                  setNewCategory(e.target.value)
                  try { localStorage.setItem(LAST_CATEGORY_KEY, e.target.value) } catch {}
                }}
                className="flex-1 sm:flex-none rounded-xl px-2 py-3 text-sm focus:outline-none transition-colors cursor-pointer min-h-[44px]"
                style={{
                  background: '#061c26',
                  border: '1px solid rgba(240,117,88,0.2)',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '16px',
                }}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c} style={{ background: '#061c26' }}>{c}</option>
                ))}
              </select>
              <input
                type="date"
                value={newDueDate}
                onChange={e => setNewDueDate(e.target.value)}
                className="rounded-xl px-2 py-3 text-sm focus:outline-none transition-colors cursor-pointer min-h-[44px]"
                style={{
                  background: '#061c26',
                  border: '1px solid rgba(240,117,88,0.2)',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '16px',
                }}
              />
              <button
                onClick={addTask}
                className="text-sm font-semibold px-5 py-3 rounded-xl active:opacity-80 transition-colors min-h-[44px] whitespace-nowrap text-white"
                style={{ background: '#f07558' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-colors pr-8"
              style={{
                background: '#061c26',
                border: '1px solid rgba(240,117,88,0.2)',
                fontSize: '16px',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(240,117,88,0.5)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(240,117,88,0.2)')}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-lg leading-none transition-colors"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs — horizontal scroll, no wrap */}
        <div
          className="max-w-2xl mx-auto px-4 pb-3 flex gap-1 overflow-x-auto"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`.filter-tabs::-webkit-scrollbar { display: none; }`}</style>
          {['All', ...CATEGORIES].map(tab => {
            const count = badgeCount(tab)
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                ref={isActive ? activeTabRef : undefined}
                onClick={() => setActiveTab(tab)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors min-h-[36px]"
                style={isActive ? {
                  background: '#f07558',
                  color: 'white',
                } : {
                  color: 'rgba(255,255,255,0.4)',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = '#061c26' } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent' } }}
              >
                {tab}
                {count > 0 && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                    style={isActive ? {
                      background: 'rgba(0,0,0,0.2)',
                      color: 'white',
                    } : {
                      background: 'rgba(240,117,88,0.15)',
                      color: 'rgba(240,117,88,0.8)',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </header>

      {/* Task list */}
      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-4 space-y-1">
        {/* Loading state */}
        {!loaded && (
          <div className="text-center py-16 text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Loading…
          </div>
        )}

        {/* Active tasks */}
        {loaded && activeTasks.length === 0 && doneTasks.length === 0 && disregardTasks.length === 0 && (
          <div className="text-center py-16 text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {searchQuery ? 'No tasks match your search.' : 'No tasks yet. Type above and hit Enter.'}
          </div>
        )}

        {loaded && activeTasks.map(task => (
          <TaskRow
            key={task.id}
            task={pendingStatus[task.id] ? { ...task, status: pendingStatus[task.id] } : task}
            isEditing={editingId === task.id}
            editText={editText}
            editRef={editRef}
            isNotesExpanded={expandedNotes.has(task.id)}
            isLeaving={leavingIds.has(task.id)}
            onCycleStatus={() => cycleTaskStatus(task.id)}
            onStartEdit={() => startEdit(task)}
            onEditChange={setEditText}
            onEditCommit={() => commitEdit(task.id)}
            onEditKeyDown={e => {
              if (e.key === 'Enter') commitEdit(task.id)
              if (e.key === 'Escape') setEditingId(null)
            }}
            onDelete={() => deleteTask(task.id)}
            onToggleNotes={() => toggleNotes(task.id)}
            onUpdateNote={(notes) => updateNote(task.id, notes)}
            onUpdateDueDate={(dueDate) => updateDueDate(task.id, dueDate)}
            onTogglePriority={() => togglePriority(task.id)}
            onCycleCategory={() => cycleCategory(task.id)}
          />
        ))}

        {/* Completed section */}
        {loaded && doneTasks.length > 0 && (
          <>
            <div className="flex items-center justify-between pt-4 pb-1">
              <button
                onClick={() => setCompletedCollapsed(c => !c)}
                className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium transition-colors"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >
                <span>{completedCollapsed ? '▸' : '▾'}</span>
                Completed · {doneTasks.length}
              </button>
              <button
                onClick={clearCompleted}
                className="text-xs transition-colors py-2 px-1 min-h-[36px] flex items-center"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(240,117,88,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >
                Clear completed
              </button>
            </div>
            <div className="border-t" style={{ borderColor: 'rgba(240,117,88,0.1)' }} />
            {!completedCollapsed && doneTasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                isEditing={editingId === task.id}
                editText={editText}
                editRef={editRef}
                isNotesExpanded={expandedNotes.has(task.id)}
                onCycleStatus={() => cycleTaskStatus(task.id)}
                onStartEdit={() => startEdit(task)}
                onEditChange={setEditText}
                onEditCommit={() => commitEdit(task.id)}
                onEditKeyDown={e => {
                  if (e.key === 'Enter') commitEdit(task.id)
                  if (e.key === 'Escape') setEditingId(null)
                }}
                onDelete={() => deleteTask(task.id)}
                onToggleNotes={() => toggleNotes(task.id)}
                onUpdateNote={(notes) => updateNote(task.id, notes)}
                onUpdateDueDate={(dueDate) => updateDueDate(task.id, dueDate)}
                onTogglePriority={() => togglePriority(task.id)}
            onCycleCategory={() => cycleCategory(task.id)}
                isDone
              />
            ))}
          </>
        )}

        {/* Disregarded section */}
        {loaded && disregardTasks.length > 0 && (
          <>
            <div className="flex items-center justify-between pt-4 pb-1">
              <button
                onClick={() => setDisregardedCollapsed(c => !c)}
                className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium transition-colors"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >
                <span>{disregardedCollapsed ? '▸' : '▾'}</span>
                Disregarded · {disregardTasks.length}
              </button>
              <button
                onClick={clearDisregarded}
                className="text-xs transition-colors py-2 px-1 min-h-[36px] flex items-center"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(240,117,88,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >
                Clear disregarded
              </button>
            </div>
            <div className="border-t" style={{ borderColor: 'rgba(240,117,88,0.1)' }} />
            {!disregardedCollapsed && disregardTasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                isEditing={editingId === task.id}
                editText={editText}
                editRef={editRef}
                isNotesExpanded={expandedNotes.has(task.id)}
                onCycleStatus={() => cycleTaskStatus(task.id)}
                onStartEdit={() => startEdit(task)}
                onEditChange={setEditText}
                onEditCommit={() => commitEdit(task.id)}
                onEditKeyDown={e => {
                  if (e.key === 'Enter') commitEdit(task.id)
                  if (e.key === 'Escape') setEditingId(null)
                }}
                onDelete={() => deleteTask(task.id)}
                onToggleNotes={() => toggleNotes(task.id)}
                onUpdateNote={(notes) => updateNote(task.id, notes)}
                onUpdateDueDate={(dueDate) => updateDueDate(task.id, dueDate)}
                onTogglePriority={() => togglePriority(task.id)}
            onCycleCategory={() => cycleCategory(task.id)}
                isDone
              />
            ))}
          </>
        )}
      </main>
    </div>
  )
}

function getCategoryGlow(category: string): { rgb: string; color: string } {
  const map: Record<string, { rgb: string; color: string }> = {
    'DOAC':         { rgb: '20,184,166',   color: '#5eead4' }, // teal
    'Commercial':   { rgb: '59,130,246',   color: '#93c5fd' }, // blue
    'Speaking':     { rgb: '139,92,246',   color: '#c4b5fd' }, // violet
    'Private':      { rgb: '249,115,22',   color: '#fdba74' }, // orange
    'Travel':       { rgb: '16,185,129',   color: '#6ee7b7' }, // emerald
    'SB Requests':  { rgb: '245,158,11',   color: '#fbbf24' }, // amber
    'Press/PR':     { rgb: '236,72,153',   color: '#f9a8d4' }, // pink
    'BTD':          { rgb: '239,68,68',    color: '#fca5a5' }, // red
    'FounderStory': { rgb: '99,102,241',   color: '#a5b4fc' }, // indigo
    'Marketing':    { rgb: '6,182,212',    color: '#67e8f9' }, // cyan
    'FS':           { rgb: '236,72,153',   color: '#f9a8d4' }, // pink
    'JAO':          { rgb: '251,146,60',   color: '#fed7aa' }, // orange
    'Other':        { rgb: '113,113,122',  color: '#d4d4d8' }, // zinc
  }
  return map[category] || { rgb: '113,113,122', color: '#d4d4d8' }
}

interface TaskRowProps {
  task: Task
  isEditing: boolean
  editText: string
  editRef: React.RefObject<HTMLInputElement | null>
  isNotesExpanded: boolean
  onCycleStatus: () => void
  onStartEdit: () => void
  onEditChange: (v: string) => void
  onEditCommit: () => void
  onEditKeyDown: (e: React.KeyboardEvent) => void
  onDelete: () => void
  onToggleNotes: () => void
  onUpdateNote: (notes: string) => void
  onUpdateDueDate: (dueDate: string) => void
  isDone?: boolean
  isLeaving?: boolean
  onTogglePriority?: () => void
  onCycleCategory?: () => void
}

function TaskRow({
  task, isEditing, editText, editRef,
  isNotesExpanded,
  onCycleStatus, onStartEdit, onEditChange,
  onEditCommit, onEditKeyDown, onDelete,
  onToggleNotes, onUpdateNote, onUpdateDueDate,
  isDone, isLeaving, onTogglePriority, onCycleCategory
}: TaskRowProps) {
  const status = getStatusInfo(task.status)

  const cardStyle = isLeaving
    ? { background: '#061c26', border: '1px solid rgba(240,117,88,0.05)', opacity: 0.3, transform: 'scale(0.98)' }
    : isDone
    ? { background: '#061c26', border: '1px solid rgba(240,117,88,0.08)', opacity: 0.5 }
    : { background: '#061c26', border: '1px solid rgba(240,117,88,0.15)' }

  return (
    <div
      className="group flex items-start gap-2 px-3 py-3 rounded-xl transition-all duration-700"
      style={cardStyle}
      onMouseEnter={e => {
        if (!isLeaving) {
          e.currentTarget.style.borderColor = 'rgba(240,117,88,0.3)'
          e.currentTarget.style.background = '#071e2b'
          if (isDone) e.currentTarget.style.opacity = '0.7'
        }
      }}
      onMouseLeave={e => {
        if (!isLeaving) {
          e.currentTarget.style.borderColor = isDone ? 'rgba(240,117,88,0.08)' : 'rgba(240,117,88,0.15)'
          e.currentTarget.style.background = '#061c26'
          if (isDone) e.currentTarget.style.opacity = '0.5'
        }
      }}
    >
      {/* Status badge — tappable, min 36px height */}
      <button
        onClick={onCycleStatus}
        title="Tap to cycle status"
        className={`flex-shrink-0 text-[11px] font-semibold px-2.5 rounded-full border transition-all active:scale-95 flex items-center min-h-[36px] ${status.color}`}
      >
        {status.label}
      </button>

      {/* Task content — stacked on mobile */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Task text / edit input */}
        {isEditing ? (
          <input
            ref={editRef}
            value={editText}
            onChange={e => onEditChange(e.target.value)}
            onBlur={onEditCommit}
            onKeyDown={onEditKeyDown}
            className="w-full rounded-xl px-2 py-1.5 text-white focus:outline-none min-h-[36px]"
            style={{
              background: '#0a2535',
              border: '1px solid rgba(240,117,88,0.2)',
              fontSize: '16px',
            }}
          />
        ) : (
          <span
            onClick={onStartEdit}
            className="cursor-text leading-snug"
            style={{
              fontSize: '15px',
              color: isDone ? 'rgba(255,255,255,0.3)' : 'white',
              textDecoration: isDone ? 'line-through' : 'none',
            }}
          >
            {task.text}
          </span>
        )}

        {/* Meta row: category + date + due date */}
        <div className="flex items-center gap-2 flex-wrap">
          {task.category && task.category !== 'All' && (
            <button
              onClick={onCycleCategory}
              title="Tap to change category"
              style={{
                background: `rgba(${getCategoryGlow(task.category).rgb},0.15)`,
                border: `1px solid rgba(${getCategoryGlow(task.category).rgb},0.5)`,
                boxShadow: `0 0 8px rgba(${getCategoryGlow(task.category).rgb},0.3)`,
                color: getCategoryGlow(task.category).color,
                borderRadius: '9999px',
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 500,
                display: 'inline-block',
                whiteSpace: 'nowrap' as const,
                cursor: 'pointer',
              }}>
              {task.category}
            </button>
          )}
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {formatDate(task.createdAt)}
          </span>
          {task.dueDate && (
            <span className={`text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isOverdue(task.dueDate) && task.status !== 'done' && task.status !== 'disregard'
                ? 'bg-red-500/20 text-red-400'
                : isDueSoon(task.dueDate) && task.status !== 'done' && task.status !== 'disregard'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-white/5 text-gray-500'
            }`}>
              📅 {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {/* Notes toggle button */}
        <button
          onClick={onToggleNotes}
          className={`text-xs mt-1 flex items-center gap-1 transition-colors ${
            task.notes ? 'text-blue-400' : ''
          }`}
          style={task.notes ? {} : { color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={e => { if (!task.notes) e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
          onMouseLeave={e => { if (!task.notes) e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
        >
          {isNotesExpanded ? '▾' : '▸'}
          {task.notes ? 'Note' : 'Add note'}
          {task.notes && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />}
        </button>

        {/* Expandable notes area */}
        {isNotesExpanded && (
          <>
            <textarea
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm resize-none focus:outline-none"
              style={{
                background: '#0a2535',
                border: '1px solid rgba(240,117,88,0.15)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '16px',
                minHeight: '80px',
              }}
              placeholder="Add a note or update..."
              value={task.notes || ''}
              onChange={e => onUpdateNote(e.target.value)}
              onKeyDown={e => e.stopPropagation()}
            />
            <div className="mt-2 flex items-center gap-2">
              <label className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Due:</label>
              <input
                type="date"
                value={task.dueDate || ''}
                onChange={e => onUpdateDueDate(e.target.value)}
                className="rounded px-2 py-1 text-xs focus:outline-none"
                style={{
                  background: '#0a2535',
                  border: '1px solid rgba(240,117,88,0.15)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '16px',
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Priority flag */}
      {onTogglePriority && (
        <button
          onClick={onTogglePriority}
          className={`flex-shrink-0 transition-all p-1 min-h-[36px] min-w-[36px] flex items-center justify-center text-base ${
            task.priority
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-40 hover:!opacity-100'
          }`}
          title={task.priority ? 'Remove priority' : 'Mark as priority'}
        >
          {task.priority ? '🚩' : '⚑'}
        </button>
      )}

      {/* Delete button — always visible on mobile (subtle), hover-only on desktop */}
      <button
        onClick={onDelete}
        className="flex-shrink-0 transition-colors p-1 min-h-[36px] min-w-[36px] flex items-center justify-center opacity-40 sm:opacity-0 sm:group-hover:opacity-100"
        style={{ color: 'rgba(255,255,255,0.2)' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#f07558')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
        title="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
    </div>
  )
}
