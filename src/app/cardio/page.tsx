'use client'
import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Stage = 'hiit-work' | 'hiit-rest' | 'liss' | 'done'

interface PhaseConfig {
  workSeconds: number
  restSeconds: number
  hiitMinutes: number
  lissMinutes: number
}

const PHASE_CONFIGS: Record<number, PhaseConfig> = {
  1: { workSeconds: 30, restSeconds: 90, hiitMinutes: 10, lissMinutes: 15 },
  2: { workSeconds: 30, restSeconds: 60, hiitMinutes: 10, lissMinutes: 15 },
  3: { workSeconds: 30, restSeconds: 45, hiitMinutes: 10, lissMinutes: 15 },
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function CardioContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phase = Number(searchParams.get('phase') || 1) as 1 | 2 | 3
  const config = PHASE_CONFIGS[phase] || PHASE_CONFIGS[1]

  const [stage, setStage] = useState<Stage>('hiit-work')
  const [timeLeft, setTimeLeft] = useState(config.workSeconds)
  const [totalTimeLeft, setTotalTimeLeft] = useState(config.hiitMinutes * 60)
  const [lissTimeLeft, setLissTimeLeft] = useState(config.lissMinutes * 60)
  const [intervalCount, setIntervalCount] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [started, setStarted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const totalHiit = config.hiitMinutes * 60
  const totalLiss = config.lissMinutes * 60

  const nextStage = useCallback(() => {
    if (stage === 'hiit-work') {
      setStage('hiit-rest')
      setTimeLeft(config.restSeconds)
    } else if (stage === 'hiit-rest') {
      if (totalTimeLeft <= 0) {
        setStage('liss')
        setTimeLeft(config.lissMinutes * 60)
      } else {
        setStage('hiit-work')
        setTimeLeft(config.workSeconds)
        setIntervalCount(c => c + 1)
      }
    } else if (stage === 'liss') {
      setStage('done')
    }
  }, [stage, config, totalTimeLeft])

  useEffect(() => {
    if (!started || isPaused || stage === 'done') return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { nextStage(); return 0 }
        return prev - 1
      })
      if (stage === 'liss') {
        setLissTimeLeft(prev => Math.max(0, prev - 1))
      } else {
        setTotalTimeLeft(prev => Math.max(0, prev - 1))
      }
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [started, isPaused, stage, nextStage])

  const stageInfo = {
    'hiit-work': { label: '¡FUERTE!', color: '#FF4444', bg: 'rgba(255,68,68,0.1)', emoji: '🔥' },
    'hiit-rest': { label: 'RECUPERACIÓN', color: '#4A9EFF', bg: 'rgba(74,158,255,0.1)', emoji: '💨' },
    'liss': { label: 'RITMO CONSTANTE', color: 'var(--accent)', bg: 'rgba(200,241,53,0.1)', emoji: '🚶' },
    'done': { label: '¡TERMINASTE!', color: 'var(--accent)', bg: 'rgba(200,241,53,0.1)', emoji: '✅' },
  }

  const current = stageInfo[stage]
  const totalForStage = stage === 'hiit-work' ? config.workSeconds : stage === 'hiit-rest' ? config.restSeconds : stage === 'liss' ? totalLiss : 1
  const progress = stage === 'done' ? 1 : 1 - (timeLeft / totalForStage)
  const circumference = 2 * Math.PI * 100
  const strokeDashoffset = circumference * (1 - progress)

  if (!started) {
    return (
      <div className="page fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', textAlign: 'center' }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>🏃</p>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>CARDIO</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 8 }}>Fase {phase}</p>
        <div style={{ background: 'var(--bg2)', borderRadius: 12, padding: '16px 24px', marginBottom: 32, textAlign: 'left' }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>HIIT — 10 minutos</p>
          <p style={{ fontSize: 14, marginBottom: 4 }}>🔥 {config.workSeconds} seg fuerte</p>
          <p style={{ fontSize: 14, marginBottom: 16 }}>💨 {config.restSeconds} seg suave</p>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>LISS — 15 minutos</p>
          <p style={{ fontSize: 14 }}>🚶 Ritmo constante moderado</p>
        </div>
        <button className="btn-primary" onClick={() => setStarted(true)} style={{ fontSize: 18, padding: '16px 40px' }}>EMPEZAR</button>
        <button onClick={() => router.push('/home')} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 14, marginTop: 16, cursor: 'pointer' }}>Saltear cardio</button>
      </div>
    )
  }

  if (stage === 'done') {
    return (
      <div className="page fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', textAlign: 'center' }}>
        <p style={{ fontSize: 64, marginBottom: 16 }}>🎉</p>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>¡CARDIO COMPLETO!</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>25 minutos. Buen trabajo.</p>
        <button className="btn-primary" onClick={() => router.push('/home')} style={{ fontSize: 18, padding: '16px 40px' }}>VOLVER AL INICIO</button>
      </div>
    )
  }

  return (
    <div className="page fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40 }}>
      <div style={{ background: current.bg, border: `1px solid ${current.color}`, borderRadius: 12, padding: '8px 20px', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: current.color, fontWeight: 600, letterSpacing: '0.08em' }}>{current.emoji} {current.label}</p>
      </div>
      <div style={{ position: 'relative', width: 240, height: 240, marginBottom: 32 }}>
        <svg width="240" height="240" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="120" cy="120" r="100" fill="none" stroke="var(--bg3)" strokeWidth="8" />
          <circle cx="120" cy="120" r="100" fill="none" stroke={current.color} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: 56, fontWeight: 700, color: current.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{formatTime(timeLeft)}</p>
          {stage !== 'liss' && <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Intervalo {intervalCount}</p>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>{stage === 'liss' ? 'LISS restante' : 'HIIT restante'}</p>
          <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>{formatTime(stage === 'liss' ? lissTimeLeft : totalTimeLeft)}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 40, alignItems: 'center' }}>
        <div style={{ width: 80, height: 4, borderRadius: 2, background: stage !== 'liss' ? current.color : 'var(--accent)', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--bg3)', width: `${(totalTimeLeft / totalHiit) * 100}%`, transition: 'width 1s' }} />
        </div>
        <p style={{ fontSize: 11, color: 'var(--muted)' }}>HIIT</p>
        <div style={{ width: 80, height: 4, borderRadius: 2, background: stage === 'liss' ? current.color : 'var(--border2)', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--bg3)', width: `${(lissTimeLeft / totalLiss) * 100}%`, transition: 'width 1s' }} />
        </div>
        <p style={{ fontSize: 11, color: 'var(--muted)' }}>LISS</p>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <button onClick={() => setIsPaused(p => !p)} style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isPaused ? '▶' : '⏸'}
        </button>
        <button onClick={nextStage} style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--border2)', background: 'var(--bg2)', color: 'var(--muted)', fontSize: 13, cursor: 'pointer' }}>skip</button>
      </div>
      <button onClick={() => router.push('/home')} style={{ background: 'none', border: 'none', color: 'var(--border2)', fontSize: 13, marginTop: 24, cursor: 'pointer' }}>Salir del cardio</button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function CardioPage() {
  return (
    <Suspense>
      <CardioContent />
    </Suspense>
  )
}