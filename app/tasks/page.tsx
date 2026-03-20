'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { db, ensureAuth } from '@/lib/firebase'
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore'

interface Task {
  id: string
  text: string
  category: string
  status: string
  notes: string
  createdAt: string
  updatedAt: string
}

const CATEGORIES = ['DOAC', 'Commercial', 'Speaking', 'Private', 'Travel', 'SB Requests', 'Press/PR', 'BTD', 'FounderStory', 'Marketing', 'Other']
const LAST_CATEGORY_KEY = 'juan-tasks-last-category'

const STATUSES = [
  { key: 'todo', label: 'To Do', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
  { key: 'in-progress', label: 'In Progress', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { key: 'waiting-reply', label: 'Waiting', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { key: 'waiting-me', label: 'On Me', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { key: 'disregard', label: 'Disregard', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { key: 'done', label: 'Done', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
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

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function exportCSV(tasks: Task[]) {
  const header = 'id,text,category,status,notes,createdAt,updatedAt'
  const rows = tasks.map(t =>
    [t.id, `"${t.text.replace(/"/g, '""')}"`, t.category, t.status, `"${(t.notes || '').replace(/"/g, '""')}"`, t.createdAt, t.updatedAt].join(',')
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

export default function TasksPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)

  // Check if already unlocked in this session
  useEffect(() => {
    if (sessionStorage.getItem('tasks-unlocked') === 'true') {
      setUnlocked(true)
    }
  }, [])

  // Ensure Firebase anonymous auth
  useEffect(() => {
    ensureAuth()
  }, [])

  const handleUnlock = () => {
    if (pin === TASK_PIN) {
      sessionStorage.setItem('tasks-unlocked', 'true')
      setUnlocked(true)
    } else {
      setPinError(true)
      setPin('')
      setTimeout(() => setPinError(false), 2000)
    }
  }

  const [tasks, setTasks] = useState<Task[]>([])
  const [loaded, setLoaded] = useState(false)
  const [newText, setNewText] = useState('')
  const [newCategory, setNewCategory] = useState(CATEGORIES[0])
  const [activeTab, setActiveTab] = useState('All')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
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

  // Firestore real-time listener
  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => d.data() as Task)
      setTasks(docs)
      setLoaded(true)
    })
    return () => unsubscribe()
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
      createdAt: now,
      updatedAt: now,
    }
    upsertTask(task)
    setNewText('')
    try { localStorage.setItem(LAST_CATEGORY_KEY, newCategory) } catch {}
    inputRef.current?.focus()
  }

  const deleteTask = (id: string) => {
    removeTask(id)
  }

  const cycleTaskStatus = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    upsertTask({ ...task, status: cycleStatus(task.status), updatedAt: new Date().toISOString() })
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
    tasks
      .filter(t => t.status === 'done' || t.status === 'disregard')
      .forEach(t => removeTask(t.id))
  }

  const updateNote = (id: string, notes: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    upsertTask({ ...task, notes, updatedAt: new Date().toISOString() })
  }

  const toggleNotes = (id: string) => {
    setExpandedNotes(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Filter
  const filtered = tasks.filter(t =>
    activeTab === 'All' ? true : t.category === activeTab
  )

  // Sort + group
  const sortFn = (a: Task, b: Task) => {
    const cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return sortOrder === 'newest' ? -cmp : cmp
  }

  const activeTasks = filtered.filter(t => t.status !== 'done' && t.status !== 'disregard').sort(sortFn)
  const doneTasks = filtered.filter(t => t.status === 'done' || t.status === 'disregard').sort(sortFn)

  // Badge counts (active only)
  const badgeCount = (cat: string) =>
    tasks.filter(t => t.status !== 'done' && t.status !== 'disregard' && (cat === 'All' ? true : t.category === cat)).length

  const activeCount = tasks.filter(t => t.status !== 'done' && t.status !== 'disregard').length

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center px-4">
        <div className="w-full max-w-xs text-center">
          <div className="text-3xl mb-6">🔒</div>
          <h1 className="text-white text-xl font-semibold mb-2">Tasks</h1>
          <p className="text-gray-500 text-sm mb-6">Enter your PIN to continue</p>
          <input
            type="password"
            inputMode="numeric"
            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-center text-xl tracking-widest focus:outline-none mb-3 ${pinError ? 'border-red-500 animate-pulse' : 'border-white/10 focus:border-white/30'}`}
            style={{ fontSize: '20px' }}
            placeholder="••••••"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleUnlock() }}
            autoFocus
          />
          <button
            onClick={handleUnlock}
            className="w-full bg-white text-black font-semibold py-3 rounded-xl active:scale-95 transition-transform"
          >
            Unlock
          </button>
          {pinError && <p className="text-red-400 text-sm mt-3">Incorrect PIN</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0f0f0f]/95 backdrop-blur border-b border-white/5">
        {/* Title row */}
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-white whitespace-nowrap">Tasks</h1>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {activeCount} active
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Sort toggle */}
            <button
              onClick={() => setSortOrder(s => s === 'newest' ? 'oldest' : 'newest')}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-2 min-h-[36px] rounded border border-white/5 hover:border-white/10 flex items-center"
            >
              {sortOrder === 'newest' ? '↓ New' : '↑ Old'}
            </button>
            {/* Export CSV */}
            <button
              onClick={() => exportCSV(tasks)}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-2 min-h-[36px] rounded border border-white/5 hover:border-white/10 flex items-center whitespace-nowrap"
            >
              Export CSV
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
              className="w-full sm:flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-base text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.08] transition-colors min-h-[44px]"
              style={{ fontSize: '16px' }}
            />
            {/* Category + Add button row */}
            <div className="flex gap-2">
              <select
                value={newCategory}
                onChange={e => {
                  setNewCategory(e.target.value)
                  try { localStorage.setItem(LAST_CATEGORY_KEY, e.target.value) } catch {}
                }}
                className="flex-1 sm:flex-none bg-white/5 border border-white/10 rounded-lg px-2 py-3 text-sm text-gray-300 focus:outline-none focus:border-white/20 transition-colors cursor-pointer min-h-[44px]"
                style={{ fontSize: '16px' }}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>
                ))}
              </select>
              <button
                onClick={addTask}
                className="bg-white text-black text-sm font-semibold px-5 py-3 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors min-h-[44px] whitespace-nowrap"
              >
                Add
              </button>
            </div>
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
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors min-h-[36px] ${
                  isActive
                    ? 'bg-white text-black'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 active:bg-white/10'
                }`}
              >
                {tab}
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-black/15 text-black' : 'bg-white/10 text-gray-400'
                  }`}>
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
          <div className="text-center py-16 text-gray-600 text-sm">
            Loading…
          </div>
        )}

        {/* Active tasks */}
        {loaded && activeTasks.length === 0 && doneTasks.length === 0 && (
          <div className="text-center py-16 text-gray-600 text-sm">
            No tasks yet. Type above and hit Enter.
          </div>
        )}

        {loaded && activeTasks.map(task => (
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
          />
        ))}

        {/* Done section */}
        {loaded && doneTasks.length > 0 && (
          <>
            <div className="flex items-center justify-between pt-4 pb-1">
              <p className="text-xs text-gray-600 uppercase tracking-wider font-medium">
                Completed · {doneTasks.length}
              </p>
              <button
                onClick={clearCompleted}
                className="text-xs text-gray-600 hover:text-red-400 active:text-red-400 transition-colors py-2 px-1 min-h-[36px] flex items-center"
              >
                Clear completed
              </button>
            </div>
            {doneTasks.map(task => (
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
                isDone
              />
            ))}
          </>
        )}
      </main>
    </div>
  )
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
  isDone?: boolean
}

function TaskRow({
  task, isEditing, editText, editRef,
  isNotesExpanded,
  onCycleStatus, onStartEdit, onEditChange,
  onEditCommit, onEditKeyDown, onDelete,
  onToggleNotes, onUpdateNote,
  isDone
}: TaskRowProps) {
  const status = getStatusInfo(task.status)

  return (
    <div className={`group flex items-start gap-2 px-3 py-3 rounded-lg border transition-colors ${
      isDone
        ? 'border-white/[0.03] opacity-50 hover:opacity-70'
        : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02] active:bg-white/[0.03]'
    }`}>
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
            className="w-full bg-white/10 border border-white/20 rounded px-2 py-1.5 text-white focus:outline-none min-h-[36px]"
            style={{ fontSize: '16px' }}
          />
        ) : (
          <span
            onClick={onStartEdit}
            className={`cursor-text leading-snug ${isDone ? 'line-through text-gray-500' : 'text-gray-100'}`}
            style={{ fontSize: '15px' }}
          >
            {task.text}
          </span>
        )}

        {/* Meta row: category + date */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
            {task.category}
          </span>
          <span className="text-[11px] text-gray-700">
            {formatDate(task.createdAt)}
          </span>
        </div>

        {/* Notes toggle button */}
        <button
          onClick={onToggleNotes}
          className={`text-xs mt-1 flex items-center gap-1 transition-colors ${
            task.notes ? 'text-blue-400' : 'text-gray-600 hover:text-gray-400'
          }`}
        >
          {isNotesExpanded ? '▾' : '▸'}
          {task.notes ? 'Note' : 'Add note'}
          {task.notes && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />}
        </button>

        {/* Expandable notes area */}
        {isNotesExpanded && (
          <textarea
            className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-white/20"
            style={{ fontSize: '16px', minHeight: '80px' }}
            placeholder="Add a note or update..."
            value={task.notes || ''}
            onChange={e => onUpdateNote(e.target.value)}
            onKeyDown={e => e.stopPropagation()}
          />
        )}
      </div>

      {/* Delete button — always visible on mobile (subtle), hover-only on desktop */}
      <button
        onClick={onDelete}
        className="flex-shrink-0 text-gray-600 hover:text-red-400 active:text-red-400 transition-colors p-1 min-h-[36px] min-w-[36px] flex items-center justify-center opacity-40 sm:opacity-0 sm:group-hover:opacity-100"
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
