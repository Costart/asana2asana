import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: connection } = await supabase
    .from('connections')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!connection) {
    return NextResponse.json({ connection: null, skill: null, stats: null })
  }

  // Get latest skill
  const { data: skill } = await supabase
    .from('skills')
    .select('*')
    .eq('connection_id', connection.id)
    .order('version', { ascending: false })
    .limit(1)
    .single()

  // Get candidate stats
  const { count: pendingCount } = await supabase
    .from('task_candidates')
    .select('*', { count: 'exact', head: true })
    .eq('connection_id', connection.id)
    .eq('status', 'pending')

  const { count: movedCount } = await supabase
    .from('task_candidates')
    .select('*', { count: 'exact', head: true })
    .eq('connection_id', connection.id)
    .eq('status', 'moved')

  const { count: rejectedCount } = await supabase
    .from('task_candidates')
    .select('*', { count: 'exact', head: true })
    .eq('connection_id', connection.id)
    .eq('status', 'rejected')

  return NextResponse.json({
    connection,
    skill,
    stats: {
      pending: pendingCount ?? 0,
      moved: movedCount ?? 0,
      rejected: rejectedCount ?? 0,
      skillVersion: skill?.version ?? 0,
    },
  })
}
