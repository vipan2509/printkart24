'use client'

import { useEffect, useState } from 'react'

export type CartItem = { slug: string; name: string; price: number; image: string; quantity: number; option: string; customization?: string }

function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored) setValue(JSON.parse(stored))
    } catch {}
    setHydrated(true)
  }, [key])
  useEffect(() => {
    if (!hydrated) return
    try { window.localStorage.setItem(key, JSON.stringify(value)) } catch {}
  }, [key, value, hydrated])
  return [value, setValue] as const
}

export function useCart() {
  const [items, setItems] = useStored<CartItem[]>('printkart-cart', [])
  const add = (item: CartItem) => setItems((current) => { const existing = current.find((entry) => entry.slug === item.slug && entry.option === item.option && entry.customization === item.customization); return existing ? current.map((entry) => entry === existing ? { ...entry, quantity: entry.quantity + item.quantity } : entry) : [...current, item] })
  const update = (slug: string, quantity: number) => setItems((current) => quantity < 1 ? current.filter((item) => item.slug !== slug) : current.map((item) => item.slug === slug ? { ...item, quantity } : item))
  const remove = (slug: string) => setItems((current) => current.filter((item) => item.slug !== slug))
  const clear = () => setItems([])
  return { items, add, update, remove, clear, count: items.reduce((total, item) => total + item.quantity, 0), total: items.reduce((total, item) => total + item.price * item.quantity, 0) }
}

export function useWishlist() { return useStored<string[]>('printkart-wishlist', []) }
export function useRecent() { return useStored<string[]>('printkart-recent', []) }
