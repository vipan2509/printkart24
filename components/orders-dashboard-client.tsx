'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, LogOut, Package, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/catalog'

type Order = { id: string; customer_name: string; customer_email: string; phone: string; shipping_address: string; items: { name: string; quantity: number; price: number; uploadedImage?: string }[]; subtotal: number; shipping: number; total: number; status: string; created_at: string }

export default function OrdersDashboardClient() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/orders', { cache: 'no-store', credentials: 'include' })
      if (response.status === 401) return router.replace('/admin/login')
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to load orders.')
      setOrders(data.orders || [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load orders.')
    } finally {
      setLoading(false)
    }
  }
  const logout = async () => { await fetch('/api/admin/logout', { method: 'POST' }); router.replace('/admin/login') }
  useEffect(() => { load() }, [])
  return <main className="admin-shell"><header className="admin-header"><div><p className="eyebrow">PRINTKART / ADMIN</p><h1>Orders dashboard</h1><p>Every order placed through your storefront, in one place.</p></div><div className="admin-actions"><button className="button-secondary" onClick={load}><RefreshCw size={16} /> Refresh</button><button className="button-secondary" onClick={logout}><LogOut size={16} /> Sign out</button><Link href="/" className="button-secondary"><ArrowLeft size={16} /> Storefront</Link></div></header><section className="admin-stats"><div><span>Total orders</span><strong>{orders.length}</strong></div><div><span>Pending</span><strong>{orders.filter((order) => order.status === 'Pending').length}</strong></div><div><span>Revenue</span><strong>{formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}</strong></div></section><section className="orders-panel"><div className="panel-heading"><h2>Recent orders</h2><span>{loading ? 'Loading…' : `${orders.length} orders`}</span></div>{loading ? <div className="empty-state">Loading orders…</div> : error ? <div className="empty-state"><Package size={30} /><h3>Could not load orders</h3><p>{error}</p><button className="button-primary" onClick={load}>Try again</button></div> : orders.length === 0 ? <div className="empty-state"><Package size={30} /><h3>No orders yet</h3><p>Placed orders will appear here automatically.</p></div> : <div className="orders-table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>#{order.id.slice(0, 8).toUpperCase()}</strong><small>{order.shipping_address}</small></td><td><strong>{order.customer_name}</strong><small>{order.customer_email}<br />{order.phone}</small></td><td>{order.items.map((item) => <div key={item.name} className="order-item"><span>{item.name} × {item.quantity}</span>{item.uploadedImage && <a href={item.uploadedImage} target="_blank" rel="noreferrer">View uploaded photo</a>}</div>)}</td><td><strong>{formatPrice(order.total)}</strong></td><td><span className="status-pill">{order.status}</span></td><td>{new Date(order.created_at).toLocaleDateString('en-IN')}</td></tr>)}</tbody></table></div>}</section></main>
}
