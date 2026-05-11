'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { getProgramDays } from '@/lib/program-data'

interface SetData { reps: string; weight: string; done: boolean }
interface ExerciseLog { exerciseId: string; sets: SetData[]; notes: string }

const DEFAULT_SETS = 4

function getMuscleWikiUrl(name: string, slug?: string) {
  if (slug) return `https://musclewiki.com/exercise/${slug}`
  return `https://musclewiki.com/exercise/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}

export default function WorkoutPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const dayKey = params.slug as string
  const phase = Number(searchParams.get('phase') || 1)
  const [profile, setProfile] = useState<{ program: 'male'|'female'; display_name: string } | null>(null)
  const [logs, setLogs] = useState<Record<string, ExerciseLog>>({})
  const [expandedEx, setExpandedEx] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      const { data } = await supabase.from('profiles').select('program, display_name').eq('id', user.id).single()
      if (data) setProfile(data)
    }
    load()
  }, [])

  const day = profile ? getProgramDays(profile.program).find(d => d.key === dayKey) : null

  useEffect(() => {
    if (!day) return
    const initialLogs: Record<string, ExerciseLog> = {}
    day.exercises.forEach(ex => {
      initialLogs[ex.id] = {
        exerciseId: ex.id,
        sets: Array.from({ length: DEFAULT_SETS }, () => ({ reps: '', weight: '', done: false })),
        notes: ''
      }
    })
    setLogs(initialLogs)
  }, [day?.key])

  function updateSet(exId: string, setIdx: number, field: keyof SetData, value: string | boolean) {
    setLogs(prev => {
      const updated = { ...prev }
      updated[exId] = { ...updated[exId], sets: updated[exId].sets.map((s, i) => i === setIdx ? { ...s, [field]: value } : s) }
      return updated
    })
  }

  function addSet(exId: string) {
    setLogs(prev => ({ ...prev, [exId]: { ...prev[exId], sets: [...prev[exId].sets, { reps: '', weight: '', done: false }] } }))
  }

  function updateNotes(exId: string, notes: string) {
    setLogs(prev => ({ ...prev, [exId]: { ...prev[exId], notes } }))
  }

  async function saveWorkout() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !day) return
    const inserts = day.exercises.map(ex => ({
      user_id: user.id, exercise_id: ex.id, exercise_name: ex.name,
      phase, week: 1, day: dayKey,
      sets: logs[ex.id]?.sets.filter(s => s.done || s.reps || s.weight) || [],
      notes: logs[ex.id]?.notes || ''
    }))
    await supabase.from('workout_logs').insert(inserts)
    setSaving(false); setSaved(true)
    setTimeout(() => router.push('/home'), 1200)
  }

  const completedCount = day ? day.exercises.filter(ex => logs[ex.id]?.sets.some(s => s.done)).length : 0

  if (!profile || !day) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--border2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--muted)', padding: 4, display: 'flex' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>Fase {phase}</p>
          <h1 style={{ fontSize: 22 }}>{day.focus.split('—')[1]?.trim().toUpperCase() || day.focus.toUpperCase()}</h1>
        </div>
        <span className="pill pill-accent">{completedCount}/{day.exercises.length}</span>
      </div>

      {day.exercises.map((ex, exIdx) => {
        const log = logs[ex.id]
        const isExpanded = expandedEx === ex.id
        const allDone = log?.sets.every(s => s.done) && log.sets.length > 0
        const wikiUrl = getMuscleWikiUrl(ex.name, ex.muscleWikiSlug)

        return (
          <div key={ex.id} className={`exercise-card${allDone ? ' completed' : ''}`} style={{ animationDelay: `${exIdx * 0.06}s` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>

              <div
                onClick={() => window.open(wikiUrl, '_blank')}
                style={{ width: 80, height: 80, background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer', flexShrink: 0 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--accent)" stroke="none">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.03em' }}>VER VIDEO</span>
              </div>

              <button
                onClick={() => setExpandedEx(isExpanded ? null : ex.id)}
                style={{ flex: 1, background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', padding: 0, cursor: 'pointer' }}
              >
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2, color: 'var(--text)' }}>{ex.name}</p>
                  {ex.notes && <p style={{ fontSize: 12, color: 'var(--muted)' }}>{ex.notes}</p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, marginLeft: 8 }}>
                  {allDone && <span style={{ color: 'var(--accent)', fontSize: 18 }}>✓</span>}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth={2} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>
            </div>

            {isExpanded && (
              <div style={{ padding: '0 14px 14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 36px', gap: 6, marginBottom: 6 }}>
                  {['#', 'Reps', 'Kg', '✓'].map(h => (
                    <p key={h} style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>{h}</p>
                  ))}
                </div>
                {log?.sets.map((set, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 36px', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                    <p className="set-num">{i + 1}</p>
                    <input className="set-input" type="number" inputMode="numeric" placeholder="—" value={set.reps} onChange={e => updateSet(ex.id, i, 'reps', e.target.value)} />
                    <input className="set-input" type="number" inputMode="decimal" placeholder="—" value={set.weight} onChange={e => updateSet(ex.id, i, 'weight', e.target.value)} />
                    <button onClick={() => updateSet(ex.id, i, 'done', !set.done)} style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: set.done ? 'var(--accent)' : 'var(--bg3)', color: set.done ? '#0a0a0a' : 'var(--muted)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>✓</button>
                  </div>
                ))}
                <button onClick={() => addSet(ex.id)} style={{ width: '100%', padding: '8px', background: 'var(--bg3)', border: '1px dashed var(--border2)', borderRadius: 8, color: 'var(--muted)', fontSize: 13, marginBottom: 10 }}>+ Serie</button>
                <textarea placeholder="Notas: peso usado, sensaciones, RPE..." value={log?.notes || ''} onChange={e => updateNotes(ex.id, e.target.value)} rows={2} style={{ fontSize: 13, padding: '8px 12px', resize: 'none' }} />
              </div>
            )}
          </div>
        )
      })}

      <div style={{ marginTop: 8 }}>
        <button className="btn-primary" onClick={saveWorkout} disabled={saving || saved} style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.05em', padding: 16 }}>
          {saved ? '✓ GUARDADO' : saving ? 'GUARDANDO...' : 'GUARDAR ENTRENAMIENTO'}
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}