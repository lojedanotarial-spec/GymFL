'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { getProgramDays } from '@/lib/program-data'

function getMuscleWikiUrl(name: string, slug?: string) {
  const s = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `https://musclewiki.com/exercise/${s}?model=m`
}

interface SetData { reps: string; weight: string; done: boolean }
interface ExerciseLog { exerciseId: string; sets: SetData[]; notes: string }
interface ExerciseOverride {
  exercise_id: string
  custom_name: string
  custom_video_url: string | null
  custom_instructions: string[]
  custom_target: string
}
interface SearchResult {
  id: string
  name: string
  videoUrl: string | null
  instructions: string[]
  target: string
  category: string
}

const DEFAULT_SETS = 4

export default function WorkoutPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const dayKey = params.slug as string
  const phase = Number(searchParams.get('phase') || 1)
  const [profile, setProfile] = useState<{ program: 'male'|'female'; display_name: string } | null>(null)
  const [logs, setLogs] = useState<Record<string, ExerciseLog>>({})
  const [overrides, setOverrides] = useState<Record<string, ExerciseOverride>>({})
  const [expandedEx, setExpandedEx] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  // Search modal
  const [searchTarget, setSearchTarget] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [previewVideo, setPreviewVideo] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      const { data: profile } = await supabase.from('profiles').select('program, display_name').eq('id', user.id).single()
      if (profile) setProfile(profile)
      const { data: ov } = await supabase.from('exercise_overrides').select('*').eq('user_id', user.id)
      if (ov) {
        const map: Record<string, ExerciseOverride> = {}
        ov.forEach((o: ExerciseOverride) => { map[o.exercise_id] = o })
        setOverrides(map)
      }
    }
    load()
  }, [])


  
  const day = profile ? getProgramDays(profile.program).find(d => d.key === dayKey) : null

  useEffect(() => {
    if (!day) return
    day.exercises.forEach(async ex => {
      if (overrides[ex.id]) return
      const res = await fetch(`/api/exercises?q=${encodeURIComponent(ex.exerciseDbQuery)}`)
      const data = await res.json()
      if (data[0]?.videoUrl) {
        setOverrides(prev => ({
          ...prev,
          [ex.id]: {
            exercise_id: ex.id,
            custom_name: prev[ex.id]?.custom_name || ex.name,
            custom_video_url: data[0].videoUrl,
            custom_instructions: prev[ex.id]?.custom_instructions || data[0].instructions || [],
            custom_target: prev[ex.id]?.custom_target || data[0].target || ''
          }
        }))
      }
    })
  }, [day?.key])

  useEffect(() => {
    if (!day) return
    const initialLogs: Record<string, ExerciseLog> = {}
    day.exercises.forEach(ex => {
      initialLogs[ex.id] = { exerciseId: ex.id, sets: Array.from({ length: DEFAULT_SETS }, () => ({ reps: '', weight: '', done: false })), notes: '' }
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
      user_id: user.id, exercise_id: ex.id,
      exercise_name: overrides[ex.id]?.custom_name || ex.name,
      phase, week: 1, day: dayKey,
      sets: logs[ex.id]?.sets.filter(s => s.done || s.reps || s.weight) || [],
      notes: logs[ex.id]?.notes || ''
    }))
    await supabase.from('workout_logs').insert(inserts)
    setSaving(false); setSaved(true)
    setTimeout(() => router.push('/home'), 1200)
  }

  async function doSearch(q: string) {
    if (!q.trim()) { setSearchResults([]); return }
    setSearching(true)
    const res = await fetch(`/api/exercises?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setSearchResults(data)
    setSearching(false)
  }

  async function selectExercise(exId: string, result: SearchResult) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const override: ExerciseOverride = {
      exercise_id: exId,
      custom_name: result.name,
      custom_video_url: result.videoUrl,
      custom_instructions: result.instructions,
      custom_target: result.target
    }
    await supabase.from('exercise_overrides').upsert({ user_id: user.id, ...override })
    setOverrides(prev => ({ ...prev, [exId]: override }))
    setSearchTarget(null)
    setSearchQuery('')
    setSearchResults([])
    setPreviewVideo(null)
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
        const override = overrides[ex.id]
        const isExpanded = expandedEx === ex.id
        const allDone = log?.sets.every(s => s.done) && log.sets.length > 0
        const displayName = override?.custom_name || ex.name
        const videoUrl = override?.custom_video_url
        const instructions = override?.custom_instructions || []
        const wikiUrl = getMuscleWikiUrl(ex.name, ex.muscleWikiSlug)

        return (
          <div key={ex.id} className={`exercise-card${allDone ? ' completed' : ''}`} style={{ animationDelay: `${exIdx * 0.06}s` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>

              {/* Video preview or placeholder */}
              <div
                onClick={() => videoUrl && setPreviewVideo(videoUrl)}
                style={{ width: 80, height: 80, background: 'var(--bg3)', border: `1px solid ${videoUrl ? 'var(--accent)' : 'var(--border2)'}`, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: videoUrl ? 'pointer' : 'default', flexShrink: 0, position: 'relative', overflow: 'hidden' }}
              >
                {videoUrl ? (
                  <>
                    <video src={videoUrl} muted loop playsInline autoPlay style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="none" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))' }}>
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </>
                ) : (
                  <>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--border2)" stroke="none">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span style={{ fontSize: 8, color: 'var(--border2)', textAlign: 'center' }}>sin video</span>
                  </>
                )}
              </div>

              <button
                onClick={() => setExpandedEx(isExpanded ? null : ex.id)}
                style={{ flex: 1, background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', padding: 0, cursor: 'pointer' }}
              >
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2, color: 'var(--text)' }}>{displayName}</p>
                  {ex.notes && <p style={{ fontSize: 12, color: 'var(--muted)' }}>{ex.notes}</p>}
                  {override && <span style={{ fontSize: 10, color: 'var(--accent)', background: 'rgba(200,241,53,0.1)', padding: '1px 6px', borderRadius: 4 }}>personalizado</span>}
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

                {/* Action buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <button
                    onClick={() => { setSearchTarget(ex.id); setSearchQuery(''); setSearchResults([]); }}
                    style={{ padding: '8px', background: 'rgba(200,241,53,0.06)', border: '1px solid rgba(200,241,53,0.3)', borderRadius: 8, color: 'var(--accent)', fontSize: 13, cursor: 'pointer' }}
                  >
                    ↔ Cambiar
                  </button>
                  <button
                    onClick={() => window.open(wikiUrl, '_blank')}
                    style={{ padding: '8px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--muted)', fontSize: 13, cursor: 'pointer' }}
                  >
                    ▶ Ver técnica
                  </button>
                </div>

                {/* Instructions */}
                {instructions.length > 0 && (
                  <div style={{ marginBottom: 12, padding: '10px 12px', background: 'var(--bg3)', borderRadius: 8 }}>
                    <p style={{ fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Ejecución</p>
                    {instructions.slice(0, 3).map((inst: string, i: number) => (
                      <p key={i} style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4, lineHeight: 1.5 }}>
                        <span style={{ color: 'var(--accent)', marginRight: 6 }}>{i + 1}.</span>{inst}
                      </p>
                    ))}
                  </div>
                )}

                {/* Sets */}
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

      {/* Search Modal */}
      {searchTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: 'var(--bg2)', borderRadius: '16px 16px 0 0', marginTop: 'auto', maxHeight: '90dvh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 20 }}>CAMBIAR EJERCICIO</h2>
              <button onClick={() => { setSearchTarget(null); setSearchQuery(''); setSearchResults([]); setPreviewVideo(null); }} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 24, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <input
                autoFocus
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); doSearch(e.target.value) }}
                placeholder="Buscar ejercicio... ej: hip thrust, lateral raise"
                style={{ fontSize: 15 }}
              />
            </div>
            <div style={{ overflowY: 'auto', padding: '0 16px 16px', flex: 1 }}>
              {searching && <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>Buscando...</p>}
              {!searching && searchQuery && searchResults.length === 0 && (
                <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>Sin resultados</p>
              )}
              {searchResults.map(result => (
                <div key={result.id} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                  {/* Video thumbnail */}
                  <div
                    onClick={() => setPreviewVideo(previewVideo === result.videoUrl ? null : result.videoUrl)}
                    style={{ width: 72, height: 72, background: 'var(--bg3)', borderRadius: 8, flexShrink: 0, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                  >
                    {result.videoUrl && (
                      <video src={result.videoUrl} muted loop playsInline autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{result.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--muted)' }}>{result.category} · {result.target}</p>
                  </div>
                  <button
                    onClick={() => selectExercise(searchTarget, result)}
                    style={{ background: 'var(--accent)', border: 'none', borderRadius: 8, color: '#0a0a0a', fontSize: 13, fontWeight: 600, padding: '8px 14px', cursor: 'pointer', flexShrink: 0 }}
                  >
                    Usar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video fullscreen preview */}
      {previewVideo && !searchTarget && (
        <div
          onClick={() => setPreviewVideo(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <video src={previewVideo} muted loop playsInline autoPlay controls style={{ maxWidth: '90vw', maxHeight: '80dvh', borderRadius: 12 }} />
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}