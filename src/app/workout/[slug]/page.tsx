'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { getProgramDays } from '@/lib/program-data'
import { searchExercisesByName, type ExerciseDBItem } from '@/lib/exercisedb'

interface SetData {
  reps: string
  weight: string
  done: boolean
}

interface ExerciseLog {
  exerciseId: string
  sets: SetData[]
  notes: string
}

const DEFAULT_SETS = 4

export default function WorkoutPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const dayKey = params.slug as string
  const phase = Number(searchParams.get('phase') || 1)

  const [profile, setProfile] = useState<{ program: 'male'|'female'; display_name: string } | null>(null)
  const [logs, setLogs] = useState<Record<string, ExerciseLog>>({})
  const [gifData, setGifData] = useState<Record<string, ExerciseDBItem | null>>({})
  const [expandedEx, setExpandedEx] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loadingGif, setLoadingGif] = useState<Record<string, boolean>>({})
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

  const loadGif = useCallback(async (ex: { id: string; exerciseDbQuery: string }) => {
    if (gifData[ex.id] !== undefined || loadingGif[ex.id]) return
    setLoadingGif(prev => ({ ...prev, [ex.id]: true }))
    const results = await searchExercisesByName(ex.exerciseDbQuery)
    setGifData(prev => ({ ...prev, [ex.id]: results[0] || null }))
    setLoadingGif(prev => ({ ...prev, [ex.id]: false }))
  }, [gifData, loadingGif])

  function updateSet(exId: string, setIdx: number, field: keyof SetData, value: string | boolean) {
    setLogs(prev => {
      const updated = { ...prev }
      updated[exId] = { ...updated[exId], sets: updated[exId].sets.map((s, i) => i === setIdx ? { ...s, [field]: value } : s) }
      return updated
    })
  }

  function addSet(exId: string) {
    setLogs(prev => ({
      ...prev,
      [exId]: { ...prev[exId], sets: [...prev[exId].sets, { reps: '', weight: '', done: false }] }
    }))
  }

  function updateNotes(exId: string, notes: string) {
    setLogs(prev => ({ ...prev, [exId]: { ...prev[exId], notes } }))
  }

  async function saveWorkout() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !day) return

    const inserts = day.exercises.map(ex => ({
      user_id: user.id,
      exercise_id: ex.id,
      exercise_name: ex.name,
      phase,
      week: 1,
      day: dayKey,
      sets: logs[ex.id]?.sets.filter(s => s.done || s.reps || s.weight) || [],
      notes: logs[ex.id]?.notes || ''
    }))

    await supabase.from('workout_logs').insert(inserts)
    setSaving(false)
    setSaved(true)
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--muted)', padding: 4, display: 'flex' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>Fase {phase}</p>
          <h1 style={{ fontSize: 22 }}>{day.focus.split('—')[1]?.trim().toUpperCase() || day.focus.toUpperCase()}</h1>
        </div>
        <span className="pill pill-accent">{completedCount}/{day.exercises.length}</span>
      </div>

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 36px', gap: 6, padding: '0 0 6px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
        {['#', 'Reps', 'Peso (kg)', 'Notas', '✓'].map(h => (
          <p key={h} style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</p>
        ))}
      </div>

      {/* Exercises */}
      {day.exercises.map((ex, exIdx) => {
        const log = logs[ex.id]
        const gif = gifData[ex.id]
        const isExpanded = expandedEx === ex.id
        const allDone = log?.sets.every(s => s.done) && log.sets.length > 0

        return (
          <div key={ex.id} className={`exercise-card${allDone ? ' completed' : ''}`} style={{ animationDelay: `${exIdx * 0.06}s` }}>
            {/* Exercise header */}
            <button
              onClick={() => {
                setExpandedEx(isExpanded ? null : ex.id)
                if (!isExpanded) loadGif(ex)
              }}
              style={{ width: '100%', background: 'none', border: 'none', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}
            >
              {/* GIF or placeholder */}
              <div className="gif-container">
                {gif?.gifUrl
                  ? <img src={gif.gifUrl} alt={ex.name} loading="lazy" />
                  : loadingGif[ex.id]
                    ? <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg3)' }}>
                        <div style={{ width: 20, height: 20, border: '2px solid var(--border2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      </div>
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg3)' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--border2)" strokeWidth={1.5}>
                          <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" />
                        </svg>
                      </div>
                }
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{ex.name}</p>
                {ex.notes && <p style={{ fontSize: 12, color: 'var(--muted)' }}>{ex.notes}</p>}
                {gif?.target && <span className="pill pill-muted" style={{ fontSize: 11, padding: '1px 7px', marginTop: 4 }}>{gif.target}</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                {allDone && <span style={{ color: 'var(--accent)', fontSize: 18 }}>✓</span>}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth={2} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {/* Expanded: sets + instructions */}
            {isExpanded && (
              <div style={{ padding: '0 14px 14px' }}>
                {/* Instructions */}
                {gif?.instructions?.length ? (
                  <div style={{ marginBottom: 14, padding: '10px 12px', background: 'var(--bg3)', borderRadius: 8 }}>
                    <p style={{ fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Ejecución</p>
                    {gif.instructions.slice(0, 3).map((inst, i) => (
                      <p key={i} style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4, lineHeight: 1.5 }}>
                        <span style={{ color: 'var(--accent)', marginRight: 6 }}>{i + 1}.</span>{inst}
                      </p>
                    ))}
                  </div>
                ) : null}

                {/* Set column headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 36px', gap: 6, marginBottom: 6 }}>
                  {['#', 'Reps', 'Kg', '✓'].map(h => (
                    <p key={h} style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>{h}</p>
                  ))}
                </div>

                {/* Sets */}
                {log?.sets.map((set, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 36px', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                    <p className="set-num">{i + 1}</p>
                    <input
                      className="set-input"
                      type="number"
                      inputMode="numeric"
                      placeholder="—"
                      value={set.reps}
                      onChange={e => updateSet(ex.id, i, 'reps', e.target.value)}
                    />
                    <input
                      className="set-input"
                      type="number"
                      inputMode="decimal"
                      placeholder="—"
                      value={set.weight}
                      onChange={e => updateSet(ex.id, i, 'weight', e.target.value)}
                    />
                    <button
                      onClick={() => updateSet(ex.id, i, 'done', !set.done)}
                      style={{
                        width: 36, height: 36, borderRadius: 8, border: 'none',
                        background: set.done ? 'var(--accent)' : 'var(--bg3)',
                        color: set.done ? '#0a0a0a' : 'var(--muted)',
                        fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s'
                      }}
                    >✓</button>
                  </div>
                ))}

                {/* Add set */}
                <button
                  onClick={() => addSet(ex.id)}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg3)', border: '1px dashed var(--border2)', borderRadius: 8, color: 'var(--muted)', fontSize: 13, marginBottom: 10 }}
                >
                  + Serie
                </button>

                {/* Notes */}
                <textarea
                  placeholder="Notas: peso usado, sensaciones, RPE..."
                  value={log?.notes || ''}
                  onChange={e => updateNotes(ex.id, e.target.value)}
                  rows={2}
                  style={{ fontSize: 13, padding: '8px 12px', resize: 'none' }}
                />
              </div>
            )}
          </div>
        )
      })}

      {/* Save button */}
      <div style={{ marginTop: 8 }}>
        <button
          className="btn-primary"
          onClick={saveWorkout}
          disabled={saving || saved}
          style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.05em', padding: 16 }}
        >
          {saved ? '✓ GUARDADO' : saving ? 'GUARDANDO...' : 'GUARDAR ENTRENAMIENTO'}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
