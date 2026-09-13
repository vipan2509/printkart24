'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Footer, Header } from '@/components/storefront'
import { formatPrice } from '@/lib/catalog'
import { useCart } from '@/hooks/use-store'

export default function CartPage() {
  const { items, total, update, remove } = useCart()
  return (
    <>
      <Header />
      <main className="page-shell section-pad">
        <div className="breadcrumbs">
          <Link href="/">Home</Link> / Cart
        </div>
        <h1 className="section-title">
          Your <span>cart.</span>
        </h1>
        {items.length === 0 ? (
          <div className="empty-state">
            <h2>Your cart is waiting for a good idea.</h2>
            <p>Browse our collection and make something personal.</p>
            <Link href="/search" className="button-primary">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={`${item.slug}-${item.option}`}>
                  <img src={item.image} alt="" />
                  <div className="cart-item-info">
                    <Link href={`/product/${item.slug}`}>
                      <h3>{item.name}</h3>
                    </Link>
                    <p>
                      {item.option}
                      {item.customization && ` · “${item.customization}”`}
                    </p>
                    <div className="quantity-control">
                      <button
                        onClick={() => update(item.slug, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => update(item.slug, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                  <button
                    className="delete-button"
                    onClick={() => remove(item.slug)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
            <aside className="summary-card">
              <h2>Order summary</h2>
              <div>
                <span>Subtotal</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <div>
                <span>Delivery</span>
                <strong>{total >= 999 ? 'FREE' : formatPrice(79)}</strong>
              </div>
              <hr />
              <div className="summary-total">
                <span>Total</span>
                <strong>{formatPrice(total >= 999 ? total : total + 79)}</strong>
              </div>
              <Link href="/checkout" className="button-primary wide">
                Continue to checkout
              </Link>
              <small>Secure payments · Easy returns</small>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
