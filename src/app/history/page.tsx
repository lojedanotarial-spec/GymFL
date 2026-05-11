'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

interface Log {
  id: string
  exercise_name: string
  day: string
  phase: number
  week: number
  sets: { reps: string; weight: string; done: boolean }[]
  notes: string
  logged_at: string
}

export default function HistoryPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      const { data } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(100)
      setLogs(data || [])
      setLoading(false)
    }
    load()
  }, [])

  // Group by date
  const grouped = logs.reduce<Record<string, Log[]>>((acc, log) => {
    const date = new Date(log.logged_at).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
    if (!acc[date]) acc[date] = []
    acc[date].push(log)
    return acc
  }, {})

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--border2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div className="page fade-in">
      <h1 style={{ fontSize: 40, marginBottom: 4 }}>HISTORIAL</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>{logs.length} ejercicios registrados</p>

      {Object.keys(grouped).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>📋</p>
          <h2 style={{ fontSize: 24, color: 'var(--muted)', marginBottom: 8 }}>Sin registros todavía</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Completá tu primer entrenamiento y aparecerá acá.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, dayLogs]) => (
          <div key={date} style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 12, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{date}</p>
            {dayLogs.map(log => {
              const doneSets = log.sets.filter(s => s.done || s.reps)
              const maxWeight = Math.max(...log.sets.map(s => parseFloat(s.weight) || 0), 0)
              const isOpen = expanded === log.id
              return (
                <div key={log.id} className="exercise-card" style={{ marginBottom: 8 }}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : log.id)}
                    style={{ width: '100%', background: 'none', border: 'none', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>{log.exercise_name}</p>
                      <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {doneSets.length} series
                        {maxWeight > 0 && <span style={{ color: 'var(--accent)', marginLeft: 6 }}>· {maxWeight} kg</span>}
                      </p>
                    </div>
                    <span className="pill pill-muted" style={{ fontSize: 11 }}>Fase {log.phase}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth={2} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 14px 14px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr', gap: 6, marginBottom: 6 }}>
                        {['#', 'Reps', 'Kg'].map(h => <p key={h} style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>{h}</p>)}
                      </div>
                      {log.sets.filter(s => s.reps || s.weight || s.done).map((s, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr', gap: 6, marginBottom: 4 }}>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--muted)', textAlign: 'center' }}>{i + 1}</p>
                          <p style={{ background: 'var(--bg3)', borderRadius: 8, padding: '7px', textAlign: 'center', fontSize: 14 }}>{s.reps || '—'}</p>
                          <p style={{ background: 'var(--bg3)', borderRadius: 8, padding: '7px', textAlign: 'center', fontSize: 14, color: s.weight ? 'var(--accent)' : 'var(--muted)' }}>{s.weight || '—'}</p>
                        </div>
                      ))}
                      {log.notes && (
                        <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8 }}>
                          <p style={{ fontSize: 12, color: 'var(--muted)' }}>{log.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))
      )}

      <BottomNav />
    </div>
  )
}
