import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { setAsanaToken } from '@/lib/asana-token'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const cookieStore = await cookies()
  const savedState = cookieStore.get('asana_oauth_state')?.value

  // Validate CSRF state
  if (!state || !savedState || state !== savedState) {
    return NextResponse.redirect(`${origin}/dashboard?error=invalid_state`)
  }

  // Clean up state cookie
  cookieStore.delete('asana_oauth_state')

  if (!code) {
    return NextResponse.redirect(`${origin}/dashboard?error=no_code`)
  }

  // Exchange code for access token
  const tokenRes = await fetch('https://app.asana.com/-/oauth_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.ASANA_CLIENT_ID!,
      client_secret: process.env.ASANA_CLIENT_SECRET!,
      redirect_uri: `${origin}/api/asana/callback`,
      code,
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${origin}/dashboard?error=token_exchange_failed`)
  }

  const tokenData = await tokenRes.json()
  await setAsanaToken(tokenData.access_token)

  return NextResponse.redirect(`${origin}/dashboard`)
}
