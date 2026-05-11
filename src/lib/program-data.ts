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
  muscleWikiSlug?: string
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
      { id: 'incline-press', name: 'Press inclinado con barra', exerciseDbQuery: 'barbell incline bench press', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase',
        muscleWikiSlug: 'barbell-incline-bench-press', notes: 'Énfasis pectoral superior' },
      { id: 'incline-dumbbell-fly', name: 'Fly inclinado con mancuernas', exerciseDbQuery: 'dumbbell incline chest flys', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase',
        muscleWikiSlug: 'dumbbell-incline-chest-flys' },
      { id: 'seated-military', name: 'Press militar sentado', exerciseDbQuery: 'dumbbell shoulder press', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase',
        muscleWikiSlug: 'dumbbell-shoulder-press' },
      { id: 'lateral-raises', name: 'Elevaciones laterales', exerciseDbQuery: 'dumbbell lateral raise', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase',
        muscleWikiSlug: 'dumbbell-lateral-raise', notes: 'Para anchura de hombros' },
      { id: 'tricep-pushdown', name: 'Extensión tríceps en polea', exerciseDbQuery: 'cable tricep pushdown', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase',
        muscleWikiSlug: 'cable-tricep-pushdown' },
    ]
  },
  {
    key: 'lower-a',
    label: 'Martes',
    focus: 'Lower A — Bisagra + glúteo',
    exercises: [
      { id: 'rdl', name: 'Romanian Deadlift', exerciseDbQuery: 'barbell romanian deadlift', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase',
        muscleWikiSlug: 'barbell-romanian-deadlift', notes: 'Bisagra principal, rodillas seguras' },
      { id: 'hip-thrust', name: 'Hip Thrust con barra', exerciseDbQuery: 'barbell hip thrust', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase',
        muscleWikiSlug: 'barbell-hip-thrust' },
      { id: 'leg-curl', name: 'Leg Curl acostado', exerciseDbQuery: 'dumbbell leg curl', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase',
        muscleWikiSlug: 'dumbbell-leg-curl' },
      { id: 'bulgarian-split', name: 'Bulgarian Split Squat', exerciseDbQuery: 'bulgarian split squat', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase',
        muscleWikiSlug: 'dumbbell-goblet-bulgarian-split-squat', notes: 'Peso moderado, rango controlado' },
      { id: 'calf-raise', name: 'Calf Raise en máquina', exerciseDbQuery: 'machine standing calf raises', sets: '4', reps: '12–15', tempo: '2-1-2', rest: '60 seg',
        muscleWikiSlug: 'machine-standing-calf-raises' },
    ]
  },
  {
    key: 'upper-b',
    label: 'Jueves',
    focus: 'Upper B — Pull + brazos',
    exercises: [
      { id: 'pulldown', name: 'Jalón al pecho o dominadas', exerciseDbQuery: 'machine pulldown', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase',
        muscleWikiSlug: 'machine-pulldown' },
      { id: 'cable-row', name: 'Remo en cable sentado', exerciseDbQuery: 'machine seated cable row', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase',
        muscleWikiSlug: 'machine-seated-cable-row' },
      { id: 'face-pull', name: 'Face Pull', exerciseDbQuery: 'machine face pulls', sets: '3', reps: '15', tempo: '2-1-2', rest: '60 seg',
        muscleWikiSlug: 'machine-face-pulls', notes: 'Salud de hombros' },
      { id: 'hammer-curl', name: 'Curl martillo', exerciseDbQuery: 'dumbbell hammer curl', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase',
        muscleWikiSlug: 'dumbbell-hammer-curl' },
      { id: 'concentration-curl', name: 'Curl concentrado', exerciseDbQuery: 'dumbbell concentration curl', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase',
        muscleWikiSlug: 'dumbbell-concentration-curl' },
    ]
  },
  {
    key: 'lower-b',
    label: 'Viernes',
    focus: 'Lower B — Cuáds suave + core',
    exercises: [
      { id: 'leg-press', name: 'Prensa a 45° (pisada alta)', exerciseDbQuery: 'machine leg press', sets: '4', reps: 'según fase', tempo: 'según fase', rest: 'según fase',
        muscleWikiSlug: 'machine-leg-press', notes: 'Pisada alta para rodillas' },
      { id: 'leg-extension', name: 'Leg Extension (0°–60° rango)', exerciseDbQuery: 'machine leg extension', sets: '3', reps: 'según fase', tempo: 'según fase', rest: 'según fase',
        muscleWikiSlug: 'machine-leg-extension', notes: 'Solo rango parcial, sin estrés patelar' },
      { id: 'adductor', name: 'Aductor en máquina', exerciseDbQuery: 'band hip adduction', sets: '3', reps: '15', tempo: '2-1-2', rest: '60 seg',
        muscleWikiSlug: 'band-hip-adduction' },
      { id: 'plank', name: 'Plank', exerciseDbQuery: 'forearm plank', sets: '3', reps: '30–60 seg', tempo: 'isométrico', rest: '60 seg',
        muscleWikiSlug: 'forearm-plank' },
      { id: 'ab-wheel', name: 'Rueda abdominal', exerciseDbQuery: 'ab wheel rollout', sets: '3', reps: '8–12', tempo: '3-1-1', rest: '90 seg',
        muscleWikiSlug: 'ab-wheel-rollout' },
    ]
  }
]

export const femaleProgramDays: WorkoutDay[] = [
  {
    key: 'lower-a-f',
    label: 'Lunes',
    focus: 'Lower A — Glúteo + isquios',
    exercises: [
      {
        id: 'hip-thrust-f',
        name: 'Hip Thrust con barra',
        exerciseDbQuery: 'barbell hip thrust',
        sets: '2–3',
        reps: '3–5',
        tempo: '3-1-1',
        rest: '2 min',
        muscleWikiSlug: 'barbell-hip-thrust',
        notes: 'Ejercicio principal. Sin carga en el pie, máximo glúteo.'
      },
      {
        id: 'leg-curl-f',
        name: 'Leg Curl acostada',
        exerciseDbQuery: 'dumbbell leg curl',
        sets: '2–3',
        reps: '3–5',
        tempo: '3-1-1',
        rest: '2 min',
        muscleWikiSlug: 'dumbbell-leg-curl',
        notes: 'Isquiotibiales aislados, sin pie.'
      },
      {
        id: 'abductor-f',
        name: 'Abductor en máquina (sentada)',
        exerciseDbQuery: 'cable hip abduction',
        sets: '2–3',
        reps: '3–5',
        tempo: '3-1-1',
        rest: '90 seg',
        muscleWikiSlug: 'cable-hip-abduction',
        notes: 'Glúteo medio. Sentada, cero carga en pie.'
      },
      {
        id: 'aductor-f',
        name: 'Aductor en máquina (sentada)',
        exerciseDbQuery: 'band hip adduction',
        sets: '2–3',
        reps: '3–5',
        tempo: '3-1-1',
        rest: '90 seg',
        muscleWikiSlug: 'band-hip-adduction',
        notes: 'Cara interna del muslo.'
      },
      {
        id: 'glute-bridge-f',
        name: 'Glute Bridge con banda',
        exerciseDbQuery: 'dumbbell glute bridge',
        sets: '3',
        reps: '10–12',
        tempo: '2-1-2',
        rest: '60 seg',
        muscleWikiSlug: 'dumbbell-glute-bridge',
        notes: 'Activación glúteo al final. Más reps, peso liviano.'
      },
    ]
  },
  {
    key: 'upper-a-f',
    label: 'Martes',
    focus: 'Upper A — Espalda + hombros',
    exercises: [
      {
        id: 'pulldown-f',
        name: 'Jalón al pecho (agarre ancho)',
        exerciseDbQuery: 'machine pulldown',
        sets: '2–3',
        reps: '3–5',
        tempo: '3-1-1',
        rest: '2 min',
        muscleWikiSlug: 'machine-pulldown',
        notes: 'Dorsal. Forma en V — hace la cintura parecer más angosta.'
      },
      {
        id: 'seated-row-f',
        name: 'Remo sentada en cable',
        exerciseDbQuery: 'machine seated cable row',
        sets: '2–3',
        reps: '3–5',
        tempo: '3-1-1',
        rest: '2 min',
        muscleWikiSlug: 'machine-seated-cable-row',
        notes: 'Espalda media. Postura erguida.'
      },
      {
        id: 'lateral-f',
        name: 'Elevaciones laterales (muy liviano)',
        exerciseDbQuery: 'dumbbell lateral raise',
        sets: '2–3',
        reps: '3–5',
        tempo: '3-1-1',
        rest: '90 seg',
        muscleWikiSlug: 'dumbbell-lateral-raise',
        notes: 'Hombros anchos sin volumen. Peso muy liviano, lejos del fallo.'
      },
      {
        id: 'face-pull-f',
        name: 'Face Pull en polea',
        exerciseDbQuery: 'machine face pulls',
        sets: '2–3',
        reps: '3–5',
        tempo: '2-1-2',
        rest: '90 seg',
        muscleWikiSlug: 'machine-face-pulls',
        notes: 'Salud de hombros y postura. Imprescindible.'
      },
      {
        id: 'shrug-f',
        name: 'Encogimiento de hombros (mancuernas)',
        exerciseDbQuery: 'dumbbell seated shrug',
        sets: '2',
        reps: '3–5',
        tempo: '2-1-2',
        rest: '90 seg',
        muscleWikiSlug: 'dumbbell-seated-shrug',
      },
    ]
  },
  {
    key: 'lower-b-f',
    label: 'Jueves',
    focus: 'Lower B — Cuádriceps + core',
    exercises: [
      {
        id: 'leg-press-f',
        name: 'Prensa a 45° (pisada alta)',
        exerciseDbQuery: 'machine leg press',
        sets: '2–3',
        reps: '3–5',
        tempo: '3-1-1',
        rest: '2 min',
        muscleWikiSlug: 'machine-leg-press',
        notes: 'Pisada alta: más glúteo, menos rodilla. F1 sin carga en pie.'
      },
      {
        id: 'leg-ext-f',
        name: 'Leg Extension (0°–60° rango parcial)',
        exerciseDbQuery: 'machine leg extension',
        sets: '2–3',
        reps: '3–5',
        tempo: '3-1-1',
        rest: '2 min',
        muscleWikiSlug: 'machine-leg-extension',
        notes: 'Solo rango parcial. Sin estrés patelar.'
      },
      {
        id: 'goblet-f',
        name: 'Sentadilla Goblet con mancuerna (Fase 2+)',
        exerciseDbQuery: 'goblet squat',
        sets: '2–3',
        reps: '3–5',
        tempo: '3-1-1',
        rest: '2 min',
        muscleWikiSlug: 'dumbbell-goblet-squat',
        notes: 'Solo desde Fase 2. Primera vuelta de pie. Si hay molestia en el pie, omitir.'
      },
      {
        id: 'plank-f',
        name: 'Plancha (en rodillas si necesita)',
        exerciseDbQuery: 'forearm plank',
        sets: '3',
        reps: '20–40 seg',
        tempo: 'isométrico',
        rest: '60 seg',
        muscleWikiSlug: 'forearm-plank',
        notes: 'Empezar en rodillas. Progresar a plancha completa cuando sea posible.'
      },
      {
        id: 'dead-bug-f',
        name: 'Dead Bug',
        exerciseDbQuery: 'dead bug',
        sets: '3',
        reps: '6 c/lado',
        tempo: '3-1-1',
        rest: '60 seg',
        muscleWikiSlug: 'dead-bug',
        notes: 'Core profundo. Movimiento lento y controlado.'
      },
    ]
  },
  {
    key: 'upper-b-f',
    label: 'Viernes',
    focus: 'Upper B — Pecho + brazos',
    exercises: [
      {
        id: 'incline-press-f',
        name: 'Press inclinado con mancuernas (liviano)',
        exerciseDbQuery: 'dumbbell incline bench press',
        sets: '2–3',
        reps: '3–5',
        tempo: '3-1-1',
        rest: '2 min',
        muscleWikiSlug: 'dumbbell-incline-bench-press',
        notes: 'Pectoral superior. Peso que permita parar 2–3 reps antes del fallo.'
      },
      {
        id: 'fly-f',
        name: 'Fly en máquina o cable bajo',
        exerciseDbQuery: 'cable fly',
        sets: '2–3',
        reps: '3–5',
        tempo: '3-1-1',
        rest: '90 seg',
        muscleWikiSlug: 'cable-fly',
        notes: 'Definición de pecho sin volumen.'
      },
      {
        id: 'curl-f',
        name: 'Curl bíceps con mancuernas',
        exerciseDbQuery: 'dumbbell curl',
        sets: '2–3',
        reps: '3–5',
        tempo: '3-1-1',
        rest: '90 seg',
        muscleWikiSlug: 'dumbbell-curl',
        notes: 'Lejos del fallo. Evita "brazos bingo" con tono sin volumen.'
      },
      {
        id: 'tricep-f',
        name: 'Extensión tríceps en polea alta',
        exerciseDbQuery: 'cable tricep pushdown',
        sets: '2–3',
        reps: '3–5',
        tempo: '3-1-1',
        rest: '90 seg',
        muscleWikiSlug: 'cable-tricep-pushdown',
        notes: 'Tríceps firme. El músculo más importante para el aspecto del brazo.'
      },
      {
        id: 'dips-assisted-f',
        name: 'Dips asistidos en máquina',
        exerciseDbQuery: 'dips',
        sets: '2',
        reps: '3–5',
        tempo: '3-1-1',
        rest: '2 min',
        muscleWikiSlug: 'dips',
        notes: 'Rusty los recomienda específicamente para mujeres. Empezar con mucha asistencia.'
      },
    ]
  }
]

export function getProgramDays(program: ProgramType): WorkoutDay[] {
  return program === 'male' ? maleProgramDays : femaleProgramDays
}

export const femalePhaseConfigs: PhaseConfig[] = [
  {
    phase: 1,
    name: 'Adaptación — pie protegido',
    weeks: 'Semanas 1–4',
    goal: 'Reactivar sin cargar el pie, construir el hábito',
    reps: '3–5',
    tempo: '3-1-1',
    rest: '2 min',
    rir: '3–4',
    cardio: 'Bici estática 20–25 min'
  },
  {
    phase: 2,
    name: 'Progresión — primer carga de pie',
    weeks: 'Semanas 5–8',
    goal: 'Introducir ejercicios bipodales con cuidado',
    reps: '3–5',
    tempo: '3-1-1',
    rest: '2 min',
    rir: '2–3',
    cardio: 'Bici + elíptica 30 min'
  },
  {
    phase: 3,
    name: 'Densidad + definición',
    weeks: 'Semanas 9–12',
    goal: 'Fortalecer lo ganado, maximizar pérdida de grasa',
    reps: '3–5',
    tempo: '4-1-1',
    rest: '2 min',
    rir: '1–2',
    cardio: '3× bici/elíptica + treadmill inclinado'
  }
]

export function getPhaseConfigs(program: ProgramType): PhaseConfig[] {
  return program === 'male' ? phaseConfigs : femalePhaseConfigs
}