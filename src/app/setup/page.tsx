'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const [name, setName] = useState('')
  const [program, setProgram] = useState<'male' | 'female'>('male')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      const { data } = await supabase.from('profiles').select('display_name, program').eq('id', user.id).single()
      if (data?.display_name && data.display_name !== user.email) {
        router.push('/home')
      } else {
        setChecking(false)
      }
    }
    check()
  }, [])

  async function handleSave() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').upsert({ id: user.id, display_name: name.trim() || 'Atleta', program, current_phase: 1, current_week: 1 })
    router.push('/home')
  }

  if (checking) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--border2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <h1 style={{ fontSize: 40, color: 'var(--accent)', marginBottom: 8 }}>SETUP</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>Configurá tu perfil para empezar</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tu nombre</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Rusty, Fátima..." />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Programa</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {(['male', 'female'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setProgram(p)}
                  style={{
                    padding: '20px 16px',
                    borderRadius: 12,
                    border: `2px solid ${program === p ? 'var(--accent)' : 'var(--border2)'}`,
                    background: program === p ? 'rgba(200,241,53,0.06)' : 'var(--bg2)',
                    color: program === p ? 'var(--accent)' : 'var(--muted)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    transition: 'all 0.15s'
                  }}
                >
                  <span style={{ fontSize: 32 }}>{p === 'male' ? '♂' : '♀'}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: '0.05em' }}>
                    {p === 'male' ? 'MASCULINO' : 'FEMENINO'}
                  </span>
                  <span style={{ fontSize: 12, opacity: 0.7 }}>
                    {p === 'male' ? 'Upper/Lower 4d' : 'Lower/Upper 4d'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={handleSave} disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Guardando...' : 'Empezar programa'}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
