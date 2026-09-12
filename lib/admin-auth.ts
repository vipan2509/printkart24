import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'printkart_admin'

function token() {
  return createHmac('sha256', process.env.ADMIN_PASSWORD || 'missing-admin-password').update('printkart-admin-session').digest('hex')
}

export function isValidAdminToken(value: string | undefined) {
  if (!value) return false
  const expected = Buffer.from(token())
  const received = Buffer.from(value)
  return expected.length === received.length && timingSafeEqual(expected, received)
}

export async function isAdminAuthenticated() {
  return isValidAdminToken((await cookies()).get(COOKIE_NAME)?.value)
}

export { COOKIE_NAME, token as createAdminToken }
