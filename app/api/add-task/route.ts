import { NextRequest, NextResponse } from 'next/server'

const VALID_CATEGORIES = [
  'BTD', 'Commercial', 'DOAC', 'FounderStory', 'FS', 'JAO',
  'Marketing', 'Other', 'Press/PR', 'Private', 'SB Requests',
  'Speaking', 'Travel'
]

const API_SECRET = process.env.ADD_TASK_SECRET
const FIREBASE_API_KEY = 'AIzaSyCyqUjPKCr7eKzsMoyCTfEtMiLuQ6wZqJI'
const FIREBASE_PROJECT_ID = 'juan-tasks-8411c'
const TASKS_EMAIL = 'tasks@sbtasks.app'
const TASKS_PASS = 'sb8116tasks'

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// Convert a JS object to Firestore REST API field format
function toFirestoreFields(obj: Record<string, unknown>): Record<string, unknown> {
  const fields: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') fields[key] = { stringValue: val }
    else if (typeof val === 'number') fields[key] = { integerValue: String(val) }
    else if (typeof val === 'boolean') fields[key] = { booleanValue: val }
    else if (val === null || val === undefined) fields[key] = { nullValue: null }
    else fields[key] = { stringValue: String(val) }
  }
  return fields
}

async function getFirebaseIdToken(): Promise<string> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TASKS_EMAIL, password: TASKS_PASS, returnSecureToken: true }),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Firebase Auth failed: ${err}`)
  }
  const data = await res.json()
  return data.idToken
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

    // Get auth token
    const idToken = await getFirebaseIdToken()

    // Write to Firestore via REST API
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/tasks/${id}`
    const fsRes = await fetch(firestoreUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ fields: toFirestoreFields(task) }),
    })

    if (!fsRes.ok) {
      const err = await fsRes.text()
      throw new Error(`Firestore write failed: ${err}`)
    }

    return NextResponse.json({ ok: true, id, task })
  } catch (err: any) {
    console.error('[add-task] Error:', err)
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
