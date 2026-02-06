import { cookies } from 'next/headers'
import { createHmac, createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const COOKIE_NAME = 'asana_token'
const SECRET = process.env.ASANA_CLIENT_SECRET!

function deriveKey(secret: string): Buffer {
  return createHmac('sha256', secret).update('asana-token-key').digest().subarray(0, 32)
}

export function encryptToken(token: string): string {
  const key = deriveKey(SECRET)
  const iv = randomBytes(16)
  const cipher = createCipheriv('aes-256-cbc', key, iv)
  const encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decryptToken(encrypted: string): string {
  const key = deriveKey(SECRET)
  const [ivHex, dataHex] = encrypted.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const data = Buffer.from(dataHex, 'hex')
  const decipher = createDecipheriv('aes-256-cbc', key, iv)
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
}

export async function getAsanaToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE_NAME)
  if (!cookie) return null
  try {
    return decryptToken(cookie.value)
  } catch {
    return null
  }
}

export async function setAsanaToken(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, encryptToken(token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

export async function clearAsanaToken(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function hasAsanaToken(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.has(COOKIE_NAME)
}
