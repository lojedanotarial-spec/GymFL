'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { phaseConfigs } from '@/lib/program-data'

export default function ProfilePage() {
  const [profile, setProfile] = useState<{ display_name: string; program: string; current_phase: number; current_week: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  async function updatePhaseWeek(phase: number, week: number) {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({ current_phase: phase, current_week: week }).eq('id', user.id)
    setProfile(prev => prev ? { ...prev, current_phase: phase, current_week: week } : null)
    setSaving(false)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading || !profile) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--border2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const currentPhase = phaseConfigs.find(p => p.phase === profile.current_phase)!

  return (
    <div className="page fade-in">
      <h1 style={{ fontSize: 40, marginBottom: 4 }}>PERFIL</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>{profile.display_name}</p>

      {/* Current status */}
      <div className="card" style={{ marginBottom: 16, borderColor: 'rgba(200,241,53,0.2)' }}>
        <p style={{ fontSize: 12, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Estado actual</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--accent)' }}>{profile.current_phase}</p>
            <p style={{ fontSize: 12, color: 'var(--muted)' }}>Fase</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text)' }}>{profile.current_week}</p>
            <p style={{ fontSize: 12, color: 'var(--muted)' }}>Semana</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text)' }}>{profile.program === 'male' ? '♂' : '♀'}</p>
            <p style={{ fontSize: 12, color: 'var(--muted)' }}>{profile.program === 'male' ? 'Masc.' : 'Fem.'}</p>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: '8px 10px', background: 'var(--bg3)', borderRadius: 8 }}>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{currentPhase.name}</p>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>{currentPhase.goal}</p>
        </div>
      </div>

      {/* Change phase */}
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Avanzar fase / semana</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {phaseConfigs.map(pc => (
            <div key={pc.phase}>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                Fase {pc.phase} — {pc.name}
                {pc.phase === profile.current_phase && <span style={{ color: 'var(--accent)', marginLeft: 6 }}>← actual</span>}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {[1, 2, 3, 4].map(w => {
                  const isActive = profile.current_phase === pc.phase && profile.current_week === w
                  return (
                    <button
                      key={w}
                      onClick={() => updatePhaseWeek(pc.phase, w)}
                      disabled={saving}
                      style={{
                        padding: '10px 6px',
                        borderRadius: 8,
                        border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border2)'}`,
                        background: isActive ? 'rgba(200,241,53,0.1)' : 'var(--bg3)',
                        color: isActive ? 'var(--accent)' : 'var(--muted)',
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 400,
                        transition: 'all 0.15s'
                      }}
                    >
                      S{w}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cardio guide for current phase */}
      <div className="card" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Cardio esta fase</p>
        <p style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 500 }}>{currentPhase.cardio}</p>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Tempo: {currentPhase.tempo} · Descanso: {currentPhase.rest}</p>
      </div>

      {/* Logout */}
      <button className="btn-ghost" onClick={logout} style={{ width: '100%', textAlign: 'center' }}>
        Cerrar sesión
      </button>

      <BottomNav />
    </div>
  )
}
