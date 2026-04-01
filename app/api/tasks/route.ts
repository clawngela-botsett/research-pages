import { NextRequest, NextResponse } from 'next/server'

const API_SECRET = process.env.ADD_TASK_SECRET
const FIREBASE_API_KEY = 'AIzaSyCyqUjPKCr7eKzsMoyCTfEtMiLuQ6wZqJI'
const FIREBASE_PROJECT_ID = 'juan-tasks-8411c'
const TASKS_EMAIL = 'tasks@sbtasks.app'
const TASKS_PASS = 'sb8116tasks'

async function getFirebaseIdToken(): Promise<string> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TASKS_EMAIL, password: TASKS_PASS, returnSecureToken: true }),
    }
  )
  if (!res.ok) throw new Error(`Firebase Auth failed: ${await res.text()}`)
  const data = await res.json()
  return data.idToken
}

function fromFirestoreValue(val: any): any {
  if (!val) return null
  if ('stringValue' in val) return val.stringValue
  if ('integerValue' in val) return Number(val.integerValue)
  if ('doubleValue' in val) return val.doubleValue
  if ('booleanValue' in val) return val.booleanValue
  if ('nullValue' in val) return null
  if ('timestampValue' in val) return val.timestampValue
  if ('mapValue' in val) {
    const obj: Record<string, any> = {}
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      obj[k] = fromFirestoreValue(v)
    }
    return obj
  }
  if ('arrayValue' in val) {
    return (val.arrayValue.values || []).map(fromFirestoreValue)
  }
  return null
}

export async function GET(req: NextRequest) {
  try {
    const secret = req.headers.get('x-api-secret')
    if (!API_SECRET || secret !== API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = await getFirebaseIdToken()

    // Use runQuery (structured query) instead of listDocuments — works with Firestore security rules
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/default/documents:runQuery`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'tasks' }],
          orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'DESCENDING' }],
          limit: 500,
        },
      }),
    })

    if (!res.ok) throw new Error(`Firestore query failed: ${await res.text()}`)

    const results = await res.json()
    const tasks = (results as any[])
      .filter((r: any) => r.document)
      .map((r: any) => {
        const fields: Record<string, any> = {}
        for (const [k, v] of Object.entries(r.document.fields || {})) {
          fields[k] = fromFirestoreValue(v)
        }
        return fields
      })

    return NextResponse.json({ ok: true, tasks })
  } catch (err: any) {
    console.error('[tasks] Error:', err)
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
