export type Phase = 1 | 2 | 3
export type ProgramType = 'male' | 'female'

export interface Exercise {
  id: string
  name: string
  exerciseDbQuery: string
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
    key: 'lower-a-f',
    label: 'Lunes',
    focus: 'Lower A — Glúteo + isquios',
    exercises: [
      { id: 'hip-thrust-f', name: 'Hip Thrust con barra', exerciseDbQuery: 'barbell hip thrust', sets: '2–3', reps: '3–5', tempo: '3-1-1', rest: '2 min', notes: 'Ejercicio principal. Sin carga en el pie, máximo glúteo.' },
      { id: 'leg-curl-f', name: 'Leg Curl acostada', exerciseDbQuery: 'lying leg curl', sets: '2–3', reps: '3–5', tempo: '3-1-1', rest: '2 min', notes: 'Isquiotibiales aislados, sin pie.' },
      { id: 'abductor-f', name: 'Abductor en máquina (sentada)', exerciseDbQuery: 'hip abduction', sets: '2–3', reps: '3–5', tempo: '3-1-1', rest: '90 seg', notes: 'Glúteo medio. Sentada, cero carga en pie.' },
      { id: 'aductor-f', name: 'Aductor en máquina (sentada)', exerciseDbQuery: 'adductor', sets: '2–3', reps: '3–5', tempo: '3-1-1', rest: '90 seg', notes: 'Cara interna del muslo.' },
      { id: 'glute-bridge-f', name: 'Glute Bridge con banda', exerciseDbQuery: 'glute bridge', sets: '3', reps: '10–12', tempo: '2-1-2', rest: '60 seg', notes: 'Activación glúteo al final. Más reps, peso liviano.' },
    ]
  },
  {
    key: 'upper-a-f',
    label: 'Martes',
    focus: 'Upper A — Espalda + hombros',
    exercises: [
      { id: 'pulldown-f', name: 'Jalón al pecho (agarre ancho)', exerciseDbQuery: 'lat pulldown', sets: '2–3', reps: '3–5', tempo: '3-1-1', rest: '2 min', notes: 'Dorsal. Forma en V — hace la cintura parecer más angosta.' },
      { id: 'seated-row-f', name: 'Remo sentada en cable', exerciseDbQuery: 'cable seated row', sets: '2–3', reps: '3–5', tempo: '3-1-1', rest: '2 min', notes: 'Espalda media. Postura erguida.' },
      { id: 'lateral-f', name: 'Elevaciones laterales (muy liviano)', exerciseDbQuery: 'dumbbell lateral raise', sets: '2–3', reps: '3–5', tempo: '3-1-1', rest: '90 seg', notes: 'Hombros anchos sin volumen. Peso muy liviano, lejos del fallo.' },
      { id: 'face-pull-f', name: 'Face Pull en polea', exerciseDbQuery: 'face pull', sets: '2–3', reps: '3–5', tempo: '2-1-2', rest: '90 seg', notes: 'Salud de hombros y postura. Imprescindible.' },
      { id: 'shrug-f', name: 'Encogimiento de hombros (mancuernas)', exerciseDbQuery: 'dumbbell shrug', sets: '2', reps: '3–5', tempo: '2-1-2', rest: '90 seg' },
    ]
  },
  {
    key: 'lower-b-f',
    label: 'Jueves',
    focus: 'Lower B — Cuádriceps + core',
    exercises: [
      { id: 'leg-press-f', name: 'Prensa a 45° (pisada alta)', exerciseDbQuery: 'leg press', sets: '2–3', reps: '3–5', tempo: '3-1-1', rest: '2 min', notes: 'Pisada alta: más glúteo, menos rodilla. Fase 1 sin carga en pie.' },
      { id: 'leg-ext-f', name: 'Leg Extension (0°–60° rango parcial)', exerciseDbQuery: 'leg extension', sets: '2–3', reps: '3–5', tempo: '3-1-1', rest: '2 min', notes: 'Solo rango parcial. Sin estrés patelar.' },
      { id: 'goblet-f', name: 'Sentadilla Goblet (Fase 2+)', exerciseDbQuery: 'dumbbell goblet squat', sets: '2–3', reps: '3–5', tempo: '3-1-1', rest: '2 min', notes: 'Solo desde Fase 2. Si hay molestia en el pie, omitir.' },
      { id: 'plank-f', name: 'Plancha (en rodillas si necesita)', exerciseDbQuery: 'plank', sets: '3', reps: '20–40 seg', tempo: 'isométrico', rest: '60 seg', notes: 'Empezar en rodillas. Progresar a plancha completa.' },
      { id: 'dead-bug-f', name: 'Dead Bug', exerciseDbQuery: 'dead bug', sets: '3', reps: '6 c/lado', tempo: '3-1-1', rest: '60 seg', notes: 'Core profundo. Movimiento lento y controlado.' },
    ]
  },
  {
    key: 'upper-b-f',
    label: 'Viernes',
    focus: 'Upper B — Pecho + brazos',
    exercises: [
      { id: 'incline-press-f', name: 'Press inclinado con mancuernas (liviano)', exerciseDbQuery: 'dumbbell incline bench press', sets: '2–3', reps: '3–5', tempo: '3-1-1', rest: '2 min', notes: 'Peso que permita parar 2–3 reps antes del fallo.' },
      { id: 'fly-f', name: 'Fly en máquina o cable bajo', exerciseDbQuery: 'cable fly', sets: '2–3', reps: '3–5', tempo: '3-1-1', rest: '90 seg', notes: 'Definición de pecho sin volumen.' },
      { id: 'curl-f', name: 'Curl bíceps con mancuernas', exerciseDbQuery: 'dumbbell bicep curl', sets: '2–3', reps: '3–5', tempo: '3-1-1', rest: '90 seg', notes: 'Lejos del fallo. Tono sin volumen.' },
      { id: 'tricep-f', name: 'Extensión tríceps en polea alta', exerciseDbQuery: 'cable triceps pushdown', sets: '2–3', reps: '3–5', tempo: '3-1-1', rest: '90 seg', notes: 'Tríceps firme. Evita "brazos bingo".' },
      { id: 'dips-assisted-f', name: 'Dips asistidos en máquina', exerciseDbQuery: 'assisted dip', sets: '2', reps: '3–5', tempo: '3-1-1', rest: '2 min', notes: 'Empezar con mucha asistencia. Reducir con el tiempo.' },
    ]
  }
]

export function getProgramDays(program: ProgramType): WorkoutDay[] {
  return program === 'male' ? maleProgramDays : femaleProgramDays
}

export function getPhaseConfigs(program: ProgramType): PhaseConfig[] {
  return program === 'male' ? phaseConfigs : femalePhaseConfigs
}