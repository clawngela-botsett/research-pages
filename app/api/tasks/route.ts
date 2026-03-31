import { NextRequest, NextResponse } from 'next/server'
import { getDocumentsServer } from '@/lib/firebase/firestore-server'

const API_SECRET = process.env.ADD_TASK_SECRET

export async function GET(req: NextRequest) {
  try {
    const secret = req.headers.get('x-api-secret')
    if (!API_SECRET || secret !== API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tasks = await getDocumentsServer('tasks', [
      { field: 'createdAt', direction: 'desc' }
    ])

    return NextResponse.json({ ok: true, tasks })
  } catch (err: any) {
    console.error('[tasks] Error:', err)
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
