import { NextResponse } from 'next/server'
import { COOKIE_NAME, createAdminToken } from '@/lib/admin-auth'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!process.env.ADMIN_PASSWORD || body?.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, createAdminToken(), { httpOnly: true, sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 })
  return response
}
