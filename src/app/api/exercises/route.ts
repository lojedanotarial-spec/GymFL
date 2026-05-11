import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.toLowerCase()
  if (!query) return NextResponse.json([])

  try {
    const res = await fetch(
      `https://workoutapi.vercel.app/exercises?name=${encodeURIComponent(query)}`,
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