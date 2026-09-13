'use client'

import { useEffect, useState } from 'react'

export type CartItem = {
  slug: string
  name: string
  price: number
  image: string
  quantity: number
  option: string
  customization?: string
  uploadedImage?: string
}

function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    const syncValue = () => {
      try {
        const stored = window.localStorage.getItem(key)
        if (stored) setValue(JSON.parse(stored))
      } catch {}
    }
    syncValue()
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) syncValue()
    }
    const handleCartUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ key?: string; value?: T }>).detail
      if (detail?.key === key && detail.value !== undefined) setValue(detail.value)
    }
    window.addEventListener('storage', handleStorage)
    window.addEventListener('printkart-store-update', handleCartUpdate)
    setHydrated(true)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('printkart-store-update', handleCartUpdate)
    }
  }, [key])
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value, hydrated])
  return [value, setValue] as const
}

export function useCart() {
  const [items, setItems] = useStored<CartItem[]>('printkart-cart', [])
  const publish = (value: CartItem[]) =>
    window.setTimeout(
      () =>
        window.dispatchEvent(
          new CustomEvent('printkart-store-update', { detail: { key: 'printkart-cart', value } }),
        ),
      0,
    )
  const add = (item: CartItem) =>
    setItems((current) => {
      const next = current.find(
        (entry) =>
          entry.slug === item.slug &&
          entry.option === item.option &&
          entry.customization === item.customization,
      )
        ? current.map((entry) =>
            entry.slug === item.slug &&
            entry.option === item.option &&
            entry.customization === item.customization
              ? { ...entry, quantity: entry.quantity + item.quantity }
              : entry,
          )
        : [...current, item]
      publish(next)
      return next
    })
  const update = (slug: string, quantity: number) =>
    setItems((current) => {
      const next =
        quantity < 1
          ? current.filter((item) => item.slug !== slug)
          : current.map((item) => (item.slug === slug ? { ...item, quantity } : item))
      publish(next)
      return next
    })
  const remove = (slug: string) =>
    setItems((current) => {
      const next = current.filter((item) => item.slug !== slug)
      publish(next)
      return next
    })
  const clear = () => {
    setItems([])
    publish([])
  }
  return {
    items,
    add,
    update,
    remove,
    clear,
    count: items.reduce((total, item) => total + item.quantity, 0),
    total: items.reduce((total, item) => total + item.price * item.quantity, 0),
  }
}

export function useWishlist() {
  return useStored<string[]>('printkart-wishlist', [])
}
export function useRecent() {
  return useStored<string[]>('printkart-recent', [])
}
