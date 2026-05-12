'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Exercise {
  id: string
  name: string
  muscle_group: string
  equipment: string
  difficulty: string
  musclewiki_slug: string
}

const MUSCLE_GROUPS = [
  'Pecho Superior', 'Pecho Medio/Bajo', 'Hombros', 'Tríceps', 'Bíceps',
  'Dorsales', 'Trapecios (espalda media)', 'Trapecios Superiores', 'Zona Lumbar',
  'Glúteos', 'Cuádriceps', 'Isquiotibiales', 'Pantorrillas',
  'Abdominales', 'Oblicuos'
]

const EQUIPMENT_COLORS: Record<string, string> = {
  'Cable': '#4A9EFF',
  'Machine': '#A78BFA',
  'Barbell': '#F59E0B',
  'Dumbbells': '#10B981',
  'Bodyweight': '#6B7280',
}

export default function LibraryPage() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)
  const [videoCache, setVideoCache] = useState<Record<string, string | null>>({})
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/')
    }
    checkAuth()
  }, [])

  async function loadGroup(group: string) {
    setSelectedGroup(group)
    setLoading(true)
    const { data } = await supabase
      .from('exercise_library')
      .select('*')
      .eq('muscle_group', group)
      .order('name')
    setExercises(data || [])
    setLoading(false)
    if (data) {
      data.forEach(async (ex: Exercise) => {
        if (videoCache[ex.id] !== undefined) return
        const res = await fetch(`/api/exercises?q=${encodeURIComponent(ex.name)}`)
        const results = await res.json()
        const videoUrl = results[0]?.videoUrl || null
        setVideoCache(prev => ({ ...prev, [ex.id]: videoUrl }))
      })
    }
  }

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => selectedGroup ? setSelectedGroup(null) : router.back()}
          style={{ background: 'none', border: 'none', color: 'var(--muted)', padding: 4, display: 'flex' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 style={{ fontSize: 22 }}>{selectedGroup ? selectedGroup.toUpperCase() : 'LIBRERÍA'}</h1>
      </div>

      {!selectedGroup ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {MUSCLE_GROUPS.map(group => (
            <button key={group} onClick={() => loadGroup(group)}
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 12px', textAlign: 'left', cursor: 'pointer' }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.3 }}>{group}</p>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>10 ejercicios</p>
            </button>
          ))}
        </div>
      ) : (
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <div style={{ width: 28, height: 28, border: '2px solid var(--border2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : (
            exercises.map(ex => {
              const videoUrl = videoCache[ex.id]
              const equipColor = EQUIPMENT_COLORS[ex.equipment] || 'var(--muted)'
              return (
                <div key={ex.id} className="exercise-card" style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
                    <div onClick={() => window.open(`https://musclewiki.com/exercise/${ex.musclewiki_slug}?model=m`, '_blank')}
                      style={{ width: 72, height: 72, background: 'var(--bg3)', border: `1px solid ${videoUrl ? 'var(--accent)' : 'var(--border2)'}`, borderRadius: 8, flexShrink: 0, overflow: 'hidden', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {videoUrl
                        ? <video src={videoUrl} muted loop playsInline autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--border2)" stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{ex.name}</p>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ fontSize: 10, color: equipColor, background: `${equipColor}20`, padding: '2px 7px', borderRadius: 4 }}>{ex.equipment}</span>
                        <span style={{ fontSize: 10, color: 'var(--muted)', background: 'var(--bg3)', padding: '2px 7px', borderRadius: 4 }}>{ex.difficulty}</span>
                      </div>
                    </div>
                    <button onClick={() => window.open(`https://musclewiki.com/exercise/${ex.musclewiki_slug}?model=m`, '_blank')}
                      style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--muted)', fontSize: 12, padding: '6px 10px', cursor: 'pointer', flexShrink: 0 }}>
                      ▶ Ver
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}