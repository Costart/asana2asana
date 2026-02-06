import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { randomBytes } from 'crypto'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url)
  const state = randomBytes(16).toString('hex')

  const cookieStore = await cookies()
  cookieStore.set('asana_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10, // 10 minutes
  })

  const params = new URLSearchParams({
    client_id: process.env.ASANA_CLIENT_ID!,
    redirect_uri: `${origin}/api/asana/callback`,
    response_type: 'code',
    state,
  })

  return NextResponse.redirect(
    `https://app.asana.com/-/oauth_authorize?${params.toString()}`
  )
}
