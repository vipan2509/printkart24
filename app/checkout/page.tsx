'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { Check, Lock } from 'lucide-react'
import { Footer, Header } from '@/components/storefront'
import { formatPrice } from '@/lib/catalog'
import { useCart } from '@/hooks/use-store'

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const payload = {
      email: form.get('email'), phone: form.get('phone'), name: form.get('name'),
      address: `${form.get('address')}, ${form.get('city')}, ${form.get('state')} - ${form.get('pin')}`,
      items: items.map(({ slug, name, quantity, option, price, customization, uploadedImage }) => ({ slug, name, quantity, option, price, customization, uploadedImage })),
      subtotal: total, shipping: 0, total,
    }
    if (!items.length) { setError('Your cart is empty. Add a product before checking out.'); setSubmitting(false); return }
    try {
      const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) { setError(result.error || 'We couldn\'t place your order. Please try again.'); setSubmitting(false); return }
      clear()
      setDone(true)
    } catch {
      setError('We could not connect to checkout. Please try again.')
      setSubmitting(false)
    }
  }

  if (done) return <><Header /><main className="page-shell section-pad"><div className="success-state"><div className="success-icon"><Check /></div><h1>Thank you for your order.</h1><p>Your order has been received successfully. We&apos;ll send confirmation details to your email shortly.</p><Link href="/" className="button-primary">Back to home</Link></div></main><Footer /></>

  return <><Header /><main className="page-shell section-pad"><div className="breadcrumbs"><Link href="/cart">Cart</Link> / Checkout</div><div className="checkout-layout"><form className="checkout-form" onSubmit={placeOrder}><h1 className="section-title">Almost <span>there.</span></h1><p className="checkout-subtitle">Where should we send your PRINTKART order?</p><div className="form-section"><h2>Contact information</h2><div className="form-grid"><label>Email address<input required name="email" type="email" placeholder="you@example.com" /></label><label>Phone number<input required name="phone" type="tel" placeholder="+91 98765 43210" /></label></div></div><div className="form-section"><h2>Delivery address</h2><div className="form-grid"><label>Full name<input required name="name" placeholder="Your full name" /></label><label>PIN code<input required name="pin" inputMode="numeric" placeholder="400001" /></label><label className="span-two">Address<input required name="address" placeholder="House number, street, area" /></label><label>City<input required name="city" placeholder="Mumbai" /></label><label>State<select name="state" defaultValue="Maharashtra"><option>Maharashtra</option><option>Delhi</option><option>Karnataka</option><option>Tamil Nadu</option></select></label></div></div><div className="form-section"><h2>Payment</h2><div className="payment-note"><Lock size={17} /> Secure checkout. No payment is required at this step.</div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button-primary wide" type="submit" disabled={submitting}>{submitting ? 'Saving order…' : <>Place order <span>{formatPrice(total)}</span></>}</button></div></form><aside className="checkout-summary"><p className="eyebrow">ORDER SUMMARY</p><h2>{items.length} items</h2>{items.map((item) => <div className="summary-row" key={`${item.slug}-${item.option}`}><span>{item.name} × {item.quantity}</span><strong>{formatPrice(item.price * item.quantity)}</strong></div>)}<div className="summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></div></aside></div></main><Footer /></>
}
