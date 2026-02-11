import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: Request,
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

  const { data: skill, error } = await supabase
    .from('skills')
    .select('*')
    .eq('connection_id', id)
    .order('version', { ascending: false })
    .limit(1)
    .single()

  if (error || !skill) {
    return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
  }

  // Get total versions count
  const { count } = await supabase
    .from('skills')
    .select('*', { count: 'exact', head: true })
    .eq('connection_id', id)

  return NextResponse.json({ skill, totalVersions: count ?? 0 })
}
