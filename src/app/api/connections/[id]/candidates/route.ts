import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Verify connection belongs to user
  const { data: connection } = await supabase
    .from('connections')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!connection) {
    return NextResponse.json({ error: 'Connection not found' }, { status: 404 })
  }

  const url = new URL(request.url)
  const status = url.searchParams.get('status') || 'all'

  let query = supabase
    .from('task_candidates')
    .select('*')
    .eq('connection_id', id)
    .order('created_at', { ascending: false })

  if (status !== 'all') {
    query = query.eq('status', status)
  }

  const { data: candidates, error } = await query.limit(50)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 })
  }

  return NextResponse.json({ candidates })
}
