import { NextRequest, NextResponse } from 'next/server'
import { setDocumentServer } from '@/lib/firebase/firestore-server'

const VALID_CATEGORIES = [
  'BTD', 'Commercial', 'DOAC', 'FounderStory', 'FS', 'JAO',
  'Marketing', 'Other', 'Press/PR', 'Private', 'SB Requests',
  'Speaking', 'Travel'
]

const API_SECRET = process.env.ADD_TASK_SECRET

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const secret = req.headers.get('x-api-secret')
    if (!API_SECRET || secret !== API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { text, category, notes, dueDate, priority } = body

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    // Validate/default category
    const resolvedCategory = VALID_CATEGORIES.includes(category) ? category : 'Other'

    const now = new Date().toISOString()
    const id = generateId()

    const task = {
      id,
      text: text.trim(),
      category: resolvedCategory,
      status: 'todo',
      notes: notes || '',
      priority: !!priority,
      dueDate: dueDate || '',
      createdAt: now,
      updatedAt: now,
    }

    await setDocumentServer('tasks', id, task)

    return NextResponse.json({ ok: true, id, task })
  } catch (err: any) {
    console.error('[add-task] Error:', err)
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
