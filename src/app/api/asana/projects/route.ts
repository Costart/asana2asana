import { NextResponse } from 'next/server'
import { getAsanaToken } from '@/lib/asana-token'
import { fetchAllProjects } from '@/lib/asana'

export async function GET() {
  const token = await getAsanaToken()

  if (!token) {
    return NextResponse.json({ error: 'Not connected to Asana' }, { status: 401 })
  }

  try {
    const projects = await fetchAllProjects(token)
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Failed to fetch Asana projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}
