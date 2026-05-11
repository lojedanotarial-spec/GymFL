'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { getProgramDays, getPhaseConfigs } from '@/lib/program-data'

export default function HomePage() {
  const [profile, setProfile] = useState<{ display_name: string; program: 'male'|'female'; current_phase: number; current_week: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!data?.display_name || data.display_name === user.email) { router.push('/setup'); return }
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--border2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!profile) return null

  const days = getProgramDays(profile.program)
  const phaseConfig = getPhaseConfigs(profile.program).find(p => p.phase === profile.current_phase)!
  const dayNames = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
  const today = new Date().getDay() // 0=Sun
  const todayName = dayNames[today]

  // Map day index to workout
  const workoutMap: Record<number, number> = profile.program === 'male'
    ? { 1: 0, 2: 1, 4: 2, 5: 3 } // Mon=UpperA, Tue=LowerA, Thu=UpperB, Fri=LowerB
    : { 1: 0, 2: 1, 4: 2, 5: 3 }

  const todayWorkoutIdx = workoutMap[today]
  const todayWorkout = todayWorkoutIdx !== undefined ? days[todayWorkoutIdx] : null
  const isRestDay = todayWorkout === null

  return (
    <div className="page fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 2 }}>{todayName}</p>
          <h1 style={{ fontSize: 36 }}>Hola, {profile.display_name.split(' ')[0]}</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="pill pill-accent">Fase {profile.current_phase}</span>
          <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>Semana {profile.current_week}/4</p>
        </div>
      </div>

      {/* Phase card */}
      <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(200,241,53,0.2)' }}>
        <p style={{ fontSize: 12, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{phaseConfig.weeks}</p>
        <h2 style={{ fontSize: 24, marginBottom: 6 }}>{phaseConfig.name.toUpperCase()}</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 14 }}>{phaseConfig.goal}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: 'Reps', val: phaseConfig.reps },
            { label: 'Descanso', val: phaseConfig.rest },
            { label: 'RIR', val: phaseConfig.rir },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>{s.label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{s.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Today's workout or rest */}
      {isRestDay ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>😴</p>
          <h2 style={{ fontSize: 28, color: 'var(--muted)', marginBottom: 8 }}>DÍA DE DESCANSO</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Caminata suave 20–30 min si querés mantenerte activo.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>Entrenamiento de hoy</p>
              <h2 style={{ fontSize: 22 }}>{todayWorkout!.focus.toUpperCase()}</h2>
            </div>
            <span className="pill pill-muted">{todayWorkout!.exercises.length} ejercicios</span>
          </div>

          {/* Exercise list preview */}
          <div style={{ marginBottom: 20 }}>
            {todayWorkout!.exercises.map((ex, i) => (
              <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < todayWorkout!.exercises.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: 'var(--font-display)', color: 'var(--muted)', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{ex.name}</p>
                  {ex.notes && <p style={{ fontSize: 12, color: 'var(--muted)' }}>{ex.notes}</p>}
                </div>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{ex.sets} series</span>
              </div>
            ))}
          </div>

          <Link
            href={`/workout/${todayWorkout!.key}?phase=${profile.current_phase}`}
            style={{ display: 'block' }}
          >
            <button className="btn-primary" style={{ fontSize: 16, padding: '14px', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              EMPEZAR ENTRENAMIENTO →
            </button>
          </Link>
        </>
      )}

      {/* Weekly schedule */}
      <div style={{ marginTop: 28 }}>
        <p style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Semana</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {['D','L','M','X','J','V','S'].map((d, i) => {
            const hasWorkout = workoutMap[i] !== undefined
            const isToday = i === today
            return (
              <div key={d} style={{
                height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: isToday ? 600 : 400,
                background: isToday ? 'var(--accent)' : hasWorkout ? 'var(--bg3)' : 'transparent',
                color: isToday ? '#0a0a0a' : hasWorkout ? 'var(--text)' : 'var(--border2)',
                border: hasWorkout && !isToday ? '1px solid var(--border)' : 'none'
              }}>{d}</div>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
