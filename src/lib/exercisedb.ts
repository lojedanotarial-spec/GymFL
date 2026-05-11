const BASE = 'https://exercisedb.dev/api/v1'

export interface ExerciseDBItem {
  id: string
  name: string
  gifUrl: string
  target: string
  bodyPart: string
  equipment: string
  instructions: string[]
  secondaryMuscles: string[]
}

export async function searchExercise(query: string): Promise<ExerciseDBItem | null> {
  try {
    const res = await fetch(
      `${BASE}/exercises?limit=100&offset=0`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return null
    const data: ExerciseDBItem[] = await res.json()
    const q = query.toLowerCase()
    const match = data.find(e =>
      e.name.toLowerCase().includes(q) ||
      q.split(' ').every(word => e.name.toLowerCase().includes(word))
    )
    return match || null
  } catch {
    return null
  }
}

export async function getExerciseById(id: string): Promise<ExerciseDBItem | null> {
  try {
    const res = await fetch(`${BASE}/exercises/${id}`, {
      next: { revalidate: 86400 }
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function searchExercisesByName(name: string): Promise<ExerciseDBItem[]> {
  try {
    const encoded = encodeURIComponent(name.toLowerCase())
    const res = await fetch(
      `${BASE}/exercises/name/${encoded}?limit=5`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}
