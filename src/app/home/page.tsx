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
  const [completedToday, setCompletedToday] = useState<string[]>([])
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!data?.display_name || data.display_name === user.email) { router.push('/setup'); return }
      setProfile(data)

      // Check which workouts were completed today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { data: logs } = await supabase
        .from('workout_logs')
        .select('day')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
      if (logs) {
        const days = [...new Set(logs.map((l: { day: string }) => l.day))]
        setCompletedToday(days)
      }

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
  const today = new Date().getDay()
  const todayName = dayNames[today]

  const workoutMap: Record<number, number> = profile.program === 'male'
    ? { 1: 0, 4: 0, 2: 1, 5: 1 }
    : { 1: 0, 4: 0, 2: 1, 5: 1 }

  const todayWorkoutIdx = workoutMap[today]
  const isRestDay = todayWorkoutIdx === undefined

  // Selected day — default to today's workout
  const activeDayIdx = selectedDayIdx !== null ? selectedDayIdx : (todayWorkoutIdx ?? 0)
  const activeWorkout = days[activeDayIdx]

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

      {/* Day selector */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Entrenamientos</p>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${days.length}, 1fr)`, gap: 8 }}>
          {days.map((day, idx) => {
            const isActive = activeDayIdx === idx
            const isDoneToday = completedToday.includes(day.key)
            const isToday = workoutMap[today] === idx

            let bg = 'var(--bg2)'
            let border = '1px solid var(--border)'
            let color = 'var(--text)'

            if (isDoneToday) {
              bg = 'rgba(251,191,36,0.1)'
              border = '1px solid rgba(251,191,36,0.5)'
              color = '#FBBf24'
            } else if (isActive) {
              bg = 'rgba(200,241,53,0.08)'
              border = '1px solid var(--accent)'
              color = 'var(--accent)'
            }

            const label = day.focus.split('—')[0].trim()

            return (
              <button
                key={day.key}
                onClick={() => setSelectedDayIdx(idx)}
                style={{ background: bg, border, borderRadius: 10, padding: '12px 8px', cursor: 'pointer', textAlign: 'center', position: 'relative' }}
              >
                {isToday && !isDoneToday && (
                  <div style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
                )}
                {isDoneToday && (
                  <div style={{ position: 'absolute', top: 6, right: 6, fontSize: 10 }}>✓</div>
                )}
                <p style={{ fontSize: 12, fontWeight: 600, color, marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.3 }}>
                  {day.focus.split('—')[1]?.trim() || ''}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected workout */}
      {isRestDay && selectedDayIdx === null ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>😴</p>
          <h2 style={{ fontSize: 28, color: 'var(--muted)', marginBottom: 8 }}>DÍA DE DESCANSO</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Caminata suave 20–30 min si querés mantenerte activo.</p>
        </div>
      ) : (
        <>
          <Link href={`/workout/${activeWorkout.key}?phase=${profile.current_phase}`} style={{ display: 'block', marginBottom: 20 }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: '14px', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              EMPEZAR {activeWorkout.focus.split('—')[0].trim().toUpperCase()} →
            </button>
          </Link>

          {/* Exercise list preview */}
          <div style={{ marginBottom: 20 }}>
            {activeWorkout.exercises.map((ex, i) => (
              <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < activeWorkout.exercises.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--muted)', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{ex.name}</p>
                  {ex.notes && <p style={{ fontSize: 12, color: 'var(--muted)' }}>{ex.notes}</p>}
                </div>
              </div>
            ))}
          </div>
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}