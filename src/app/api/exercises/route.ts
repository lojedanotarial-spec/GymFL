import { NextRequest, NextResponse } from 'next/server'

interface Exercise {
  exerciseId: string
  name: string
  gifUrl: string
  targetMuscles: string[]
  bodyParts: string[]
  equipments: string[]
  secondaryMuscles: string[]
  instructions: string[]
}

let cache: Exercise[] = []

async function loadExercises(): Promise<Exercise[]> {
  if (cache.length > 0) return cache

  const all: Exercise[] = []

  for (let offset = 0; offset < 1500; offset += 100) {
    const res = await fetch(
      `https://oss.exercisedb.dev/api/v1/exercises?limit=100&offset=${offset}`
    )
    if (!res.ok) break
    const data = await res.json()
    const exercises: Exercise[] = data.data || []
    if (exercises.length === 0) break
    all.push(...exercises)
    console.log(`offset ${offset}: ${exercises.length} ejercicios, total: ${all.length}`)
  }

  cache = all
  console.log('Cache final:', all.length)
  return all
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.toLowerCase()
  if (!query) return NextResponse.json([])

  try {
    const all = await loadExercises()
    const results = all
      .filter(ex =>
        ex.name.toLowerCase().includes(query) ||
        query.split(' ').every(word => ex.name.toLowerCase().includes(word))
      )
      .slice(0, 5)
      .map(ex => ({
        id: ex.exerciseId,
        name: ex.name,
        gifUrl: ex.gifUrl,
        target: ex.targetMuscles?.[0] || '',
        bodyPart: ex.bodyParts?.[0] || '',
        equipment: ex.equipments?.[0] || '',
        instructions: ex.instructions || [],
        secondaryMuscles: ex.secondaryMuscles || []
      }))

    console.log('Buscando:', query, '— Resultados:', results.length)
    return NextResponse.json(results)
  } catch (e) {
    console.error('Error:', e)
    return NextResponse.json([])
  }
}