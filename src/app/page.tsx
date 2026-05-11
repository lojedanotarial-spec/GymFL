'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Revisá tu email para confirmar la cuenta.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/setup')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <h1 style={{ fontSize: 56, color: 'var(--accent)', marginBottom: 4 }}>VI GYM</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Visual Impact — versión actualizada</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
          </div>
          {error && <p style={{ color: 'var(--red)', fontSize: 13, background: 'rgba(255,68,68,0.08)', padding: '10px 12px', borderRadius: 8 }}>{error}</p>}
          {message && <p style={{ color: 'var(--accent)', fontSize: 13, background: 'rgba(200,241,53,0.08)', padding: '10px 12px', borderRadius: 8 }}>{message}</p>}
          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>{loading ? 'Cargando...' : isSignUp ? 'Crear cuenta' : 'Entrar'}</button>
        </form>
        <button onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage('') }} style={{ marginTop: 20, width: '100%', background: 'none', border: 'none', color: 'var(--muted)', fontSize: 14, cursor: 'pointer' }}>
          {isSignUp ? '¿Ya tenés cuenta? Iniciá sesión' : '¿No tenés cuenta? Registrate'}
        </button>
      </div>
    </div>
  )
}
