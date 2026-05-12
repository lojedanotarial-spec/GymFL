import { NextRequest, NextResponse } from 'next/server'

const translations: Record<string, string> = {
  'pecho': 'chest', 'espalda': 'back', 'hombros': 'shoulder', 'hombro': 'shoulder',
  'biceps': 'bicep', 'bíceps': 'bicep', 'triceps': 'tricep', 'tríceps': 'tricep',
  'piernas': 'leg', 'pierna': 'leg', 'gluteos': 'glute', 'glúteos': 'glute',
  'gluteo': 'glute', 'glúteo': 'glute', 'isquios': 'hamstring', 'isquiotibiales': 'hamstring',
  'cuadriceps': 'quad', 'cuádriceps': 'quad', 'pantorrillas': 'calf', 'abdomen': 'ab',
  'abdominales': 'ab', 'antebrazos': 'forearm', 'trapecio': 'trap', 'dorsales': 'lat',
  'lumbar': 'lower back', 'aductores': 'adductor', 'abductores': 'abductor',
  'barra': 'barbell', 'mancuernas': 'dumbbell', 'mancuerna': 'dumbbell',
  'polea': 'cable', 'cable': 'cable', 'maquina': 'machine', 'máquina': 'machine',
  'press inclinado': 'incline press', 'press militar': 'shoulder press',
  'remo': 'row', 'jalon': 'pulldown', 'jalón': 'pulldown', 'dominadas': 'pull up',
  'sentadilla': 'squat', 'peso muerto': 'deadlift', 'hip thrust': 'hip thrust',
  'curl': 'curl', 'extension': 'extension', 'extensión': 'extension',
  'elevaciones laterales': 'lateral raise', 'elevación lateral': 'lateral raise',
  'face pull': 'face pull', 'plancha': 'plank', 'plank': 'plank',
  'fondos': 'dip', 'dips': 'dip', 'leg press': 'leg press', 'prensa': 'leg press',
  'leg curl': 'leg curl', 'leg extension': 'leg extension', 'calf raise': 'calf raise',
  'encogimiento': 'shrug', 'rueda abdominal': 'ab wheel', 'romanian': 'romanian deadlift',
  'rdl': 'romanian deadlift', 'split squat': 'split squat', 'bulgarian': 'bulgarian split squat',
  'glute bridge': 'glute bridge', 'puente de gluteo': 'glute bridge',
}

function translateToEnglish(query: string): string {
  const lower = query.toLowerCase().trim()
  if (translations[lower]) return translations[lower]
  let translated = lower
  const keys = Object.keys(translations).sort((a, b) => b.length - a.length)
  for (const key of keys) {
    if (translated.includes(key)) {
      translated = translated.replace(key, translations[key])
      break
    }
  }
  return translated
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')
  if (!query) return NextResponse.json([])

  const englishQuery = translateToEnglish(query)

  try {
    const res = await fetch(
      `https://workoutapi.vercel.app/exercises?name=${encodeURIComponent(englishQuery)}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return NextResponse.json([])
    const data = await res.json()

    const results = (Array.isArray(data) ? data : [])
      .slice(0, 8)
      .map((ex: {
        id: number
        exercise_name: string
        videoURL?: string[]
        steps?: string[]
        target?: { Primary?: string[] }
        Category?: string
      }) => ({
        id: String(ex.id),
        name: ex.exercise_name,
        videoUrl: ex.videoURL?.[0]?.replace('#t=0.1', '') || null,
        instructions: ex.steps || [],
        target: ex.target?.Primary?.[0] || '',
        category: ex.Category || '',
      }))

    return NextResponse.json(results)
  } catch (e) {
    console.error(e)
    return NextResponse.json([])
  }
}