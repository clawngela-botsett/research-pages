'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Task {
  id: string
  text: string
  category: string
  status: string
  createdAt: string
  updatedAt: string
}

const CATEGORIES = ['DOAC', 'Commercial', 'Speaking', 'Private', 'Travel', 'SB Requests', 'Press/PR']
const STORAGE_KEY = 'juan-tasks'
const LAST_CATEGORY_KEY = 'juan-tasks-last-category'

const STATUSES = [
  { key: 'todo', label: 'To Do', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
  { key: 'in-progress', label: 'In Progress', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { key: 'waiting-reply', label: 'Waiting on Reply', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { key: 'waiting-me', label: 'Waiting on Me', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
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
  const header = 'id,text,category,status,createdAt,updatedAt'
  const rows = tasks.map(t =>
    [t.id, `"${t.text.replace(/"/g, '""')}"`, t.category, t.status, t.createdAt, t.updatedAt].join(',')
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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newText, setNewText] = useState('')
  const [newCategory, setNewCategory] = useState(CATEGORIES[0])
  const [activeTab, setActiveTab] = useState('All')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const editRef = useRef<HTMLInputElement>(null)

  // Load from localStorage
  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setTasks(JSON.parse(raw))
      const lastCat = localStorage.getItem(LAST_CATEGORY_KEY)
      if (lastCat && CATEGORIES.includes(lastCat)) setNewCategory(lastCat)
    } catch {}
  }, [])

  // Save to localStorage
  const saveTasks = useCallback((updated: Task[]) => {
    setTasks(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {}
  }, [])

  // "/" shortcut to focus input
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

  const addTask = () => {
    const text = newText.trim()
    if (!text) return
    const now = new Date().toISOString()
    const task: Task = {
      id: generateId(),
      text,
      category: newCategory,
      status: 'todo',
      createdAt: now,
      updatedAt: now,
    }
    saveTasks([task, ...tasks])
    setNewText('')
    try { localStorage.setItem(LAST_CATEGORY_KEY, newCategory) } catch {}
    inputRef.current?.focus()
  }

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id))
  }

  const cycleTaskStatus = (id: string) => {
    saveTasks(tasks.map(t =>
      t.id === id
        ? { ...t, status: cycleStatus(t.status), updatedAt: new Date().toISOString() }
        : t
    ))
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditText(task.text)
  }

  const commitEdit = (id: string) => {
    const text = editText.trim()
    if (!text) return
    saveTasks(tasks.map(t =>
      t.id === id ? { ...t, text, updatedAt: new Date().toISOString() } : t
    ))
    setEditingId(null)
  }

  const clearCompleted = () => {
    saveTasks(tasks.filter(t => t.status !== 'done'))
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

  const activeTasks = filtered.filter(t => t.status !== 'done').sort(sortFn)
  const doneTasks = filtered.filter(t => t.status === 'done').sort(sortFn)

  // Badge counts (active only)
  const badgeCount = (cat: string) =>
    tasks.filter(t => t.status !== 'done' && (cat === 'All' ? true : t.category === cat)).length

  const activeCount = tasks.filter(t => t.status !== 'done').length

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0f0f0f]/95 backdrop-blur border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-white">Tasks</h1>
            <span className="text-sm text-gray-500">
              {activeCount} active
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Sort toggle */}
            <button
              onClick={() => setSortOrder(s => s === 'newest' ? 'oldest' : 'newest')}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded border border-white/5 hover:border-white/10"
            >
              {sortOrder === 'newest' ? '↓ Newest' : '↑ Oldest'}
            </button>
            {/* Export CSV */}
            <button
              onClick={() => exportCSV(tasks)}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded border border-white/5 hover:border-white/10"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Quick-add bar */}
        <div className="max-w-3xl mx-auto px-4 pb-3">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder="Add a task... (press / to focus)"
              autoFocus
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/8 transition-colors"
            />
            <select
              value={newCategory}
              onChange={e => {
                setNewCategory(e.target.value)
                try { localStorage.setItem(LAST_CATEGORY_KEY, e.target.value) } catch {}
              }}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm text-gray-300 focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>
              ))}
            </select>
            <button
              onClick={addTask}
              className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="max-w-3xl mx-auto px-4 pb-3 flex gap-1 overflow-x-auto scrollbar-hide">
          {['All', ...CATEGORIES].map(tab => {
            const count = badgeCount(tab)
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-black'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
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
      <main className="max-w-3xl mx-auto px-4 py-4 space-y-1">
        {/* Active tasks */}
        {activeTasks.length === 0 && doneTasks.length === 0 && (
          <div className="text-center py-16 text-gray-600 text-sm">
            No tasks yet. Type above and hit Enter.
          </div>
        )}

        {activeTasks.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            isEditing={editingId === task.id}
            editText={editText}
            editRef={editRef}
            onCycleStatus={() => cycleTaskStatus(task.id)}
            onStartEdit={() => startEdit(task)}
            onEditChange={setEditText}
            onEditCommit={() => commitEdit(task.id)}
            onEditKeyDown={e => {
              if (e.key === 'Enter') commitEdit(task.id)
              if (e.key === 'Escape') setEditingId(null)
            }}
            onDelete={() => deleteTask(task.id)}
          />
        ))}

        {/* Done section */}
        {doneTasks.length > 0 && (
          <>
            <div className="flex items-center justify-between pt-4 pb-1">
              <p className="text-xs text-gray-600 uppercase tracking-wider font-medium">
                Completed · {doneTasks.length}
              </p>
              <button
                onClick={clearCompleted}
                className="text-xs text-gray-600 hover:text-red-400 transition-colors"
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
                onCycleStatus={() => cycleTaskStatus(task.id)}
                onStartEdit={() => startEdit(task)}
                onEditChange={setEditText}
                onEditCommit={() => commitEdit(task.id)}
                onEditKeyDown={e => {
                  if (e.key === 'Enter') commitEdit(task.id)
                  if (e.key === 'Escape') setEditingId(null)
                }}
                onDelete={() => deleteTask(task.id)}
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
  onCycleStatus: () => void
  onStartEdit: () => void
  onEditChange: (v: string) => void
  onEditCommit: () => void
  onEditKeyDown: (e: React.KeyboardEvent) => void
  onDelete: () => void
  isDone?: boolean
}

function TaskRow({
  task, isEditing, editText, editRef,
  onCycleStatus, onStartEdit, onEditChange,
  onEditCommit, onEditKeyDown, onDelete, isDone
}: TaskRowProps) {
  const status = getStatusInfo(task.status)

  return (
    <div className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
      isDone
        ? 'border-white/3 opacity-50 hover:opacity-70'
        : 'border-white/5 hover:border-white/10 hover:bg-white/2'
    }`}>
      {/* Status badge */}
      <button
        onClick={onCycleStatus}
        title="Click to cycle status"
        className={`flex-shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full border transition-all hover:scale-105 ${status.color}`}
      >
        {status.label}
      </button>

      {/* Task text */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={editRef}
            value={editText}
            onChange={e => onEditChange(e.target.value)}
            onBlur={onEditCommit}
            onKeyDown={onEditKeyDown}
            className="w-full bg-white/10 border border-white/20 rounded px-2 py-0.5 text-sm text-white focus:outline-none"
          />
        ) : (
          <span
            onClick={onStartEdit}
            className={`text-sm cursor-text ${isDone ? 'line-through text-gray-500' : 'text-gray-100'}`}
            title="Click to edit"
          >
            {task.text}
          </span>
        )}
      </div>

      {/* Category pill */}
      <span className="flex-shrink-0 text-[10px] text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
        {task.category}
      </span>

      {/* Date */}
      <span className="flex-shrink-0 text-[10px] text-gray-700 hidden sm:block">
        {formatDate(task.createdAt)}
      </span>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
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
