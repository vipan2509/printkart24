import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { Resend } from 'resend'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim()
    const phone = String(body.phone || '').trim()
    const address = String(body.address || '').trim()
    const items = Array.isArray(body.items) ? body.items : []
    const sanitizedItems = items.map((item) => ({
      slug: String(item?.slug || '').slice(0, 160),
      name: String(item?.name || '').slice(0, 240),
      quantity: Math.max(1, Math.min(100, Number(item?.quantity) || 1)),
      option: String(item?.option || '').slice(0, 160),
      price: Number(item?.price) || 0,
      customization: String(item?.customization || '').slice(0, 500),
      uploadedImage:
        typeof item?.uploadedImage === 'string' &&
        item.uploadedImage.startsWith('data:image/') &&
        item.uploadedImage.length < 900000
          ? item.uploadedImage
          : '',
    }))
    const subtotal = Number(body.subtotal)
    const shipping = Number(body.shipping || 0)
    const total = Number(body.total)

    if (
      !name ||
      !email ||
      !address ||
      !items.length ||
      !Number.isFinite(subtotal) ||
      !Number.isFinite(total)
    ) {
      return NextResponse.json(
        { error: 'Please complete the required order details.' },
        { status: 400 },
      )
    }

    const result = await db.execute(sql`
      INSERT INTO orders (customer_name, customer_email, phone, shipping_address, items, subtotal, shipping, total)
      VALUES (${name}, ${email}, ${phone}, ${address}, CAST(${JSON.stringify(sanitizedItems)} AS jsonb), ${subtotal}, ${shipping}, ${total})
      RETURNING id, customer_name, customer_email, total, status, created_at
    `)
    const order = result.rows[0]
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      const resend = new Resend(resendApiKey)
      const from = `PRINTKART <orders@${process.env.RESEND_EMAIL_DOMAIN || 'resend.dev'}>`
      const itemSummary = sanitizedItems.map((item) => `${item.name} × ${item.quantity}`).join(', ')
      const { error: emailError } = await resend.emails.send(
        {
          from,
          to: [email],
          subject: `Thank you for your PRINTKART order${order?.id ? ` #${order.id}` : ''}`,
          html: `<p>Hi ${name},</p><p>Thank you for your order with PRINTKART.</p><p><strong>Items:</strong> ${itemSummary}</p><p><strong>Total:</strong> ₹${total.toFixed(2)}</p><p>We&apos;ll share another update when your order is ready.</p>`,
        },
        { idempotencyKey: `order-thank-you/${order?.id || email}` },
      )
      if (emailError) console.error('[v0] customer order email failed', emailError.message)
      const { error: adminEmailError } = await resend.emails.send(
        {
          from,
          to: ['vipanp09@gmail.com'],
          subject: `New PRINTKART order${order?.id ? ` #${order.id}` : ''}`,
          html: `<p>A new PRINTKART order has been placed.</p><p><strong>Customer:</strong> ${name} (${email})</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Address:</strong> ${address}</p><p><strong>Items:</strong> ${itemSummary}</p><p><strong>Total:</strong> ₹${total.toFixed(2)}</p>`,
        },
        { idempotencyKey: `order-admin-alert/${order?.id || email}` },
      )
      if (adminEmailError) console.error('[v0] admin order email failed', adminEmailError.message)
    }

    return NextResponse.json({ order, whatsappNumber: '918288811860' }, { status: 201 })
  } catch (error) {
    console.error('[v0] order creation failed', error)
    return NextResponse.json(
      { error: 'We couldn’t place your order. Please check your details and try again.' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await request.json()
    if (!id || typeof id !== 'string')
      return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 })
    await db.execute(sql`UPDATE orders SET status = 'Completed' WHERE id = ${id}`)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[v0] order completion failed', error)
    return NextResponse.json({ error: 'Unable to complete this order.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await request.json()
    if (!id || typeof id !== 'string')
      return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 })
    const result = await db.execute(sql`DELETE FROM orders WHERE id = ${id} RETURNING id`)
    if (result.rows.length === 0)
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[v0] order deletion failed', error)
    return NextResponse.json({ error: 'Unable to delete this order.' }, { status: 500 })
  }
}

export async function GET() {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
