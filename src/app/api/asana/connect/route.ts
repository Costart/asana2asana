import { NextResponse } from 'next/server'
import { setAsanaToken } from '@/lib/asana-token'

export async function POST(request: Request) {
  const { token } = await request.json()

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  // Validate the token by calling Asana's /users/me endpoint
  const res = await fetch('https://app.asana.com/api/1.0/users/me', {
    headers: { Authorization: `Bearer ${token.trim()}` },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Invalid API key. Please check your token and try again.' }, { status: 401 })
  }

  await setAsanaToken(token.trim())

  return NextResponse.json({ success: true })
}
