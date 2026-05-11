export type Phase = 1 | 2 | 3
export type ProgramType = 'male' | 'female'

export interface Exercise {
  id: string
  name: string
  exerciseDbQuery: string // query to search in ExerciseDB
  sets: string
  reps: string
  tempo: string
  rest: string
  notes?: string
}

export interface WorkoutDay {
  key: string
  label: string
  focus: string
  exercises: Exercise[]
}

export interface PhaseConfig {
  phase: Phase
  name: string
  weeks: string
  goal: string
  reps: string
  tempo: string
  rest: string
  rir: string
  cardio: string
}

export const phaseConfigs: PhaseConfig[] = [
  {
    phase: 1,
    name: 'Activación y volumen',
    weeks: 'Semanas 1–4',
    goal: 'Reactivar patrones motores, acumular volumen',
    reps: '10–12',
    tempo: '3-1-1',
    rest: '90 seg',
    rir: '3–4',
    cardio: '2× LISS 20 min'
  },
  {
    phase: 2,
    name: 'Hipertrofia + déficit',
    weeks: 'Semanas 5–8',
    goal: 'Ganar músculo y perder grasa simultáneamente',
    reps: '8–10',
    tempo: '3-1-1',
    rest: '75–90 seg',
    rir: '1–2',
    cardio: '2× HIIT + 1× LISS'
  },
  {
    phase: 3,
    name: 'Densidad + definición',
    weeks: 'Semanas 9–12',
    goal: 'Endurecer el músculo, afinar definición',
    reps: '4–6',
    tempo: '4-1-1',
    rest: '2–3 min',
    rir: '1',
    cardio: '3× LISS en ayunas'
  }
]

export const maleProgramDays: WorkoutDay[] = [
  {
    key: 'upper-a',
    label: 'Lunes',
    focus: 'Upper A — Push + hombros',
    exercises: [
      { id: 'incline-press', name: 'Press inclinado con barra', exerciseDbQuery: 'barbell incline bench press', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Énfasis pectoral superior' },
      { id: 'incline-dumbbell-fly', name: 'Fly inclinado con mancuernas', exerciseDbQuery: 'dumbbell incline fly', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'seated-military', name: 'Press militar sentado', exerciseDbQuery: 'dumbbell shoulder press', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'lateral-raises', name: 'Elevaciones laterales', exerciseDbQuery: 'dumbbell lateral raise', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Para anchura de hombros' },
      { id: 'tricep-pushdown', name: 'Extensión tríceps en polea', exerciseDbQuery: 'cable triceps pushdown', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
    ]
  },
  {
    key: 'lower-a',
    label: 'Martes',
    focus: 'Lower A — Bisagra + glúteo',
    exercises: [
      { id: 'rdl', name: 'Romanian Deadlift', exerciseDbQuery: 'romanian deadlift', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Bisagra principal, rodillas seguras' },
      { id: 'hip-thrust', name: 'Hip Thrust con barra', exerciseDbQuery: 'barbell hip thrust', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'leg-curl', name: 'Leg Curl acostado', exerciseDbQuery: 'lying leg curl', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'bulgarian-split', name: 'Bulgarian Split Squat', exerciseDbQuery: 'dumbbell bulgarian split squat', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Peso moderado, rango controlado' },
      { id: 'calf-raise', name: 'Calf Raise en máquina', exerciseDbQuery: 'calf raise', sets: '4', reps: '12–15', tempo: '2-1-2', rest: '60 seg' },
    ]
  },
  {
    key: 'upper-b',
    label: 'Jueves',
    focus: 'Upper B — Pull + brazos',
    exercises: [
      { id: 'pulldown', name: 'Jalón al pecho o dominadas', exerciseDbQuery: 'lat pulldown', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'cable-row', name: 'Remo en cable sentado', exerciseDbQuery: 'cable seated row', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'face-pull', name: 'Face Pull', exerciseDbQuery: 'face pull', sets: '3', reps: '15', tempo: '2-1-2', rest: '60 seg', notes: 'Salud de hombros' },
      { id: 'hammer-curl', name: 'Curl martillo', exerciseDbQuery: 'dumbbell hammer curl', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'concentration-curl', name: 'Curl concentrado', exerciseDbQuery: 'dumbbell concentration curl', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
    ]
  },
  {
    key: 'lower-b',
    label: 'Viernes',
    focus: 'Lower B — Cuáds suave + core',
    exercises: [
      { id: 'leg-press', name: 'Prensa a 45° (pisada alta)', exerciseDbQuery: 'leg press', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Pisada alta para rodillas' },
      { id: 'leg-extension', name: 'Leg Extension (0°–60° rango)', exerciseDbQuery: 'leg extension', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Solo rango parcial, sin estrés patelar' },
      { id: 'adductor', name: 'Aductor en máquina', exerciseDbQuery: 'adductor', sets: '3', reps: '15', tempo: '2-1-2', rest: '60 seg' },
      { id: 'plank', name: 'Plank', exerciseDbQuery: 'plank', sets: '3', reps: '30–60 seg', tempo: 'isométrico', rest: '60 seg' },
      { id: 'ab-wheel', name: 'Rueda abdominal', exerciseDbQuery: 'ab wheel', sets: '3', reps: '8–12', tempo: '3-1-1', rest: '90 seg' },
    ]
  }
]

export const femaleProgramDays: WorkoutDay[] = [
  {
    key: 'lower-a',
    label: 'Lunes',
    focus: 'Lower A — Glúteo + isquios',
    exercises: [
      { id: 'hip-thrust-f', name: 'Hip Thrust con barra', exerciseDbQuery: 'barbell hip thrust', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Ejercicio principal del programa femenino' },
      { id: 'rdl-f', name: 'Romanian Deadlift', exerciseDbQuery: 'romanian deadlift', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'leg-curl-f', name: 'Leg Curl acostado', exerciseDbQuery: 'lying leg curl', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'sumo-squat', name: 'Sentadilla sumo con mancuerna', exerciseDbQuery: 'dumbbell sumo squat', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'abduction', name: 'Abductor en máquina', exerciseDbQuery: 'hip abduction', sets: '4', reps: '15', tempo: '2-1-2', rest: '60 seg' },
    ]
  },
  {
    key: 'upper-a-f',
    label: 'Martes',
    focus: 'Upper A — Espalda + hombros',
    exercises: [
      { id: 'pulldown-f', name: 'Jalón al pecho', exerciseDbQuery: 'lat pulldown', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'seated-row-f', name: 'Remo sentado en cable', exerciseDbQuery: 'cable seated row', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'lateral-f', name: 'Elevaciones laterales', exerciseDbQuery: 'dumbbell lateral raise', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Definición de hombros sin volumen' },
      { id: 'face-pull-f', name: 'Face Pull', exerciseDbQuery: 'face pull', sets: '3', reps: '15', tempo: '2-1-2', rest: '60 seg' },
      { id: 'incline-press-f', name: 'Press inclinado liviano', exerciseDbQuery: 'dumbbell incline bench press', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
    ]
  },
  {
    key: 'lower-b-f',
    label: 'Jueves',
    focus: 'Lower B — Cuáds + core',
    exercises: [
      { id: 'bulgarian-f', name: 'Bulgarian Split Squat', exerciseDbQuery: 'dumbbell bulgarian split squat', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'leg-press-f', name: 'Prensa a 45°', exerciseDbQuery: 'leg press', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'calf-f', name: 'Calf Raise', exerciseDbQuery: 'calf raise', sets: '4', reps: '15', tempo: '2-1-2', rest: '60 seg' },
      { id: 'plank-f', name: 'Plank', exerciseDbQuery: 'plank', sets: '3', reps: '30–45 seg', tempo: 'isométrico', rest: '60 seg' },
      { id: 'dead-bug', name: 'Dead Bug', exerciseDbQuery: 'dead bug', sets: '3', reps: '8 c/lado', tempo: '3-1-1', rest: '60 seg' },
    ]
  },
  {
    key: 'full-f',
    label: 'Viernes',
    focus: 'Full body — Potencia + brazos',
    exercises: [
      { id: 'cable-pull-f', name: 'Pull-through en cable', exerciseDbQuery: 'cable pull through', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'step-up', name: 'Step-up con mancuernas', exerciseDbQuery: 'dumbbell step up', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'curl-f', name: 'Curl bíceps con mancuernas', exerciseDbQuery: 'dumbbell bicep curl', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'tricep-f', name: 'Extensión tríceps en polea', exerciseDbQuery: 'cable triceps pushdown', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase' },
      { id: 'glute-bridge-f', name: 'Glute Bridge con banda', exerciseDbQuery: 'glute bridge', sets: '4', reps: '20', tempo: '2-1-2', rest: '45 seg' },
    ]
  }
]

export function getProgramDays(program: ProgramType): WorkoutDay[] {
  return program === 'male' ? maleProgramDays : femaleProgramDays
}
