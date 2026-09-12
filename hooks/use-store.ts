'use client'

import { useEffect, useRef, useState } from 'react'

export type CartItem = { slug: string; name: string; price: number; image: string; quantity: number; option: string; customization?: string; uploadedImage?: string }

function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)
  const [hydrated, setHydrated] = useState(false)
  const syncingRef = useRef(false)
  useEffect(() => {
    const syncValue = () => {
      try {
        const stored = window.localStorage.getItem(key)
        if (stored) { syncingRef.current = true; setValue(JSON.parse(stored)) }
      } catch {}
    }
    syncValue()
    const handleStorage = (event: StorageEvent) => { if (event.key === key) syncValue() }
    const handleCartUpdate = (event: Event) => { if ((event as CustomEvent<{ key?: string }>).detail?.key === key) syncValue() }
    window.addEventListener('storage', handleStorage)
    window.addEventListener('printkart-store-update', handleCartUpdate)
    setHydrated(true)
    return () => { window.removeEventListener('storage', handleStorage); window.removeEventListener('printkart-store-update', handleCartUpdate) }
  }, [key])
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      if (syncingRef.current) syncingRef.current = false
      else window.dispatchEvent(new CustomEvent('printkart-store-update', { detail: { key } }))
    } catch {}
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
