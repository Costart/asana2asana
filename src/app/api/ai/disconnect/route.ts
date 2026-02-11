import { NextResponse } from 'next/server'
import { clearAIConfig } from '@/lib/ai-token'

export async function POST() {
  await clearAIConfig()
  return NextResponse.json({ success: true })
}
