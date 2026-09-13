'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (response.ok) router.replace('/admin/orders')
    else setError('Incorrect admin password.')
    setLoading(false)
  }

  return (
    <main className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <p className="eyebrow">PRINTKART / PRIVATE AREA</p>
        <h1>Admin sign in</h1>
        <p>Enter the admin password to view your orders dashboard.</p>
        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoFocus
        />
        <button className="button-primary" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Open dashboard'}
        </button>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </main>
  )
}
