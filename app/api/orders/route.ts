import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim()
    const phone = String(body.phone || '').trim()
    const address = String(body.address || '').trim()
    const items = Array.isArray(body.items) ? body.items : []
    const sanitizedItems = items.map((item) => ({
      slug: String(item?.slug || '').slice(0, 160), name: String(item?.name || '').slice(0, 240), quantity: Math.max(1, Math.min(100, Number(item?.quantity) || 1)), option: String(item?.option || '').slice(0, 160), price: Number(item?.price) || 0, customization: String(item?.customization || '').slice(0, 500), uploadedImage: typeof item?.uploadedImage === 'string' && item.uploadedImage.startsWith('data:image/') && item.uploadedImage.length < 900000 ? item.uploadedImage : '',
    }))
    const subtotal = Number(body.subtotal)
    const shipping = Number(body.shipping || 0)
    const total = Number(body.total)

    if (!name || !email || !address || !items.length || !Number.isFinite(subtotal) || !Number.isFinite(total)) {
      return NextResponse.json({ error: 'Please complete the required order details.' }, { status: 400 })
    }

    const [order] = await db.execute(sql`
      INSERT INTO orders (customer_name, customer_email, phone, shipping_address, items, subtotal, shipping, total)
      VALUES (${name}, ${email}, ${phone}, ${address}, ${JSON.stringify(sanitizedItems)}::jsonb, ${subtotal}, ${shipping}, ${total})
      RETURNING id, customer_name, customer_email, total, status, created_at
    `)

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('[v0] order creation failed', error)
    return NextResponse.json({ error: 'We couldn’t place your order. Please check your details and try again.' }, { status: 500 })
  }
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const result = await db.execute(sql`
      SELECT id, customer_name, customer_email, phone, shipping_address, items, subtotal, shipping, total, status, created_at
      FROM orders ORDER BY created_at DESC
    `)
    return NextResponse.json({ orders: result.rows })
  } catch (error) {
    console.error('[v0] orders lookup failed', error)
    return NextResponse.json({ error: 'Unable to load orders.' }, { status: 500 })
  }
}
