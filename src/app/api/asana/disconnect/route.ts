import { NextResponse } from 'next/server'
import { clearAsanaToken } from '@/lib/asana-token'

export async function POST() {
  await clearAsanaToken()
  return NextResponse.json({ success: true })
}
