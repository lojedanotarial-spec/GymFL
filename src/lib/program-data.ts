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

export const malePhaseConfigs: PhaseConfig[] = [
  {
    phase: 1,
    name: 'Adaptación + Volumen',
    weeks: 'Semanas 1–4',
    goal: 'Reactivar patrones, construir base, evaluar rodillas',
    reps: '10–12',
    tempo: '3-1-1',
    rest: '75–90 seg',
    rir: '3–4',
    cardio: '20 min elíptica post-entreno'
  },
  {
    phase: 2,
    name: 'Fuerza + Densidad',
    weeks: 'Semanas 5–8',
    goal: 'Subir cargas, densificar músculo, recomposición activa',
    reps: '6–8',
    tempo: '3-1-1',
    rest: '2 min',
    rir: '2',
    cardio: '15 min HIIT elíptica + 10 min treadmill inclinado'
  },
  {
    phase: 3,
    name: 'Definición Máxima',
    weeks: 'Semanas 9–12',
    goal: 'Máxima densidad muscular, reducción de grasa',
    reps: '3–5',
    tempo: '4-1-1',
    rest: '2–3 min',
    rir: '1',
    cardio: '10 min HIIT elíptica + 15 min treadmill inclinado'
  }
]

export const maleProgramDays: WorkoutDay[] = [
  {
    key: 'pull-b',
    label: 'Lunes/Jueves',
    focus: 'Pull B — Espalda + Bíceps + Post + Isquios',
    exercises: [
      { id: 'pulldown', name: 'Jalón al pecho', exerciseDbQuery: 'machine pulldown', sets: 'según fase', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Agarre ancho, codos hacia cadera.', muscleWikiSlug: 'machine-pulldown' },
      { id: 'cable-row', name: 'Remo sentado en cable', exerciseDbQuery: 'machine seated cable row', sets: 'según fase', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Pecho afuera, codos pegados al cuerpo.', muscleWikiSlug: 'machine-seated-cable-row' },
      { id: 'face-pull', name: 'Face Pull con cuerda', exerciseDbQuery: 'cable rope face pulls', sets: 'según fase', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Halar hacia la frente, codos altos.', muscleWikiSlug: 'cable-rope-face-pulls' },
      { id: 'rear-delt-fly', name: 'Vuelo posterior alto en cable', exerciseDbQuery: 'cable high reverse fly', sets: 'según fase', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Deltoides posterior. Brazos casi rectos.', muscleWikiSlug: 'cable-high-reverse-fly' },
      { id: 'bayesian-curl', name: 'Curl Bayesiano en cable', exerciseDbQuery: 'cable bayesian curl', sets: 'según fase', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Máximo estiramiento del bíceps.', muscleWikiSlug: 'cable-bayesian-curl' },
      { id: 'rdl', name: 'Peso Muerto Rumano con barra', exerciseDbQuery: 'barbell romanian deadlift', sets: 'según fase', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Bisagra de cadera. Espalda neutra.', muscleWikiSlug: 'barbell-romanian-deadlift' },
      { id: 'leg-curl', name: 'Curl de isquiotibiales en máquina', exerciseDbQuery: 'machine hamstring curl', sets: 'según fase', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Isquiotibiales aislados.', muscleWikiSlug: 'machine-hamstring-curl' },
    ]
  },
  {
    key: 'push-a',
    label: 'Martes/Viernes',
    focus: 'Push A — Pecho + Hombros + Tríceps + Cuáds',
    exercises: [
      { id: 'incline-press', name: 'Press inclinado con barra', exerciseDbQuery: 'barbell incline bench press', sets: 'según fase', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Énfasis pectoral superior.', muscleWikiSlug: 'barbell-incline-bench-press' },
      { id: 'cable-pec-fly', name: 'Fly pectoral en cable', exerciseDbQuery: 'cable pec fly', sets: 'según fase', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Pecho medio/bajo. Brazos ligeramente flexionados.', muscleWikiSlug: 'cable-pec-fly' },
      { id: 'seated-military', name: 'Press vertical sentado con mancuerna', exerciseDbQuery: 'dumbbell seated overhead press', sets: 'según fase', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Deltoides anterior y lateral.', muscleWikiSlug: 'dumbbell-seated-overhead-press' },
      { id: 'lateral-raises', name: 'Elevación lateral en cable', exerciseDbQuery: 'cable low single arm lateral raise', sets: 'según fase', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Anchura de hombros. Unilateral.', muscleWikiSlug: 'cable-low-single-arm-lateral-raise' },
      { id: 'tricep-pushdown', name: 'Extensión con cuerda en polea', exerciseDbQuery: 'cable rope pushdown', sets: 'según fase', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Codos fijos. Separar manos al final.', muscleWikiSlug: 'cable-rope-pushdown' },
      { id: 'leg-press', name: 'Prensa de piernas', exerciseDbQuery: 'machine leg press', sets: 'según fase', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Pisada alta para proteger rodilla.', muscleWikiSlug: 'machine-leg-press' },
      { id: 'leg-extension', name: 'Leg Extension (0–60° rango)', exerciseDbQuery: 'machine leg extension', sets: 'según fase', reps: 'según fase', tempo: 'según fase', rest: 'según fase', notes: 'Rango parcial. Testear rodilla derecha.', muscleWikiSlug: 'machine-leg-extension' },
    ]
  },
]

export const femaleProgramDays: WorkoutDay[] = [
  {
    key: 'pull-b-f',
    label: 'Lunes/Jueves',
    focus: 'Pull B — Glúteo + Isquios + Espalda',
    exercises: [
      { id: 'hip-thrust-f', name: 'Hip Thrust con barra', exerciseDbQuery: 'barbell hip thrust', sets: 'según fase', reps: 'según fase', tempo: '3-1-1', rest: '2 min', notes: 'Glúteo máximo. Empuje desde los talones.', muscleWikiSlug: 'barbell-hip-thrust' },
      { id: 'rdl-f', name: 'Peso Muerto Rumano con barra', exerciseDbQuery: 'barbell romanian deadlift', sets: 'según fase', reps: 'según fase', tempo: '3-1-1', rest: '2 min', notes: 'Bisagra de cadera. Espalda neutra.', muscleWikiSlug: 'barbell-romanian-deadlift' },
      { id: 'leg-curl-f', name: 'Curl de isquiotibiales en máquina', exerciseDbQuery: 'machine hamstring curl', sets: 'según fase', reps: 'según fase', tempo: '3-1-1', rest: '2 min', notes: 'Isquiotibiales aislados.', muscleWikiSlug: 'machine-hamstring-curl' },
      { id: 'pulldown-f', name: 'Jalón al pecho en máquina', exerciseDbQuery: 'machine pulldown', sets: 'según fase', reps: 'según fase', tempo: '3-1-1', rest: '2 min', notes: 'Dorsal. Crea forma V, achica cintura visualmente.', muscleWikiSlug: 'machine-pulldown' },
      { id: 'seated-row-f', name: 'Remo sentado en máquina', exerciseDbQuery: 'machine seated cable row', sets: 'según fase', reps: 'según fase', tempo: '3-1-1', rest: '2 min', notes: 'Espalda media. Postura erguida.', muscleWikiSlug: 'machine-seated-cable-row' },
      { id: 'bayesian-curl-f', name: 'Curl Bayesiano en cable', exerciseDbQuery: 'cable bayesian curl', sets: 'según fase', reps: 'según fase', tempo: '3-1-1', rest: '90 seg', notes: 'Bíceps. Lejos del fallo.', muscleWikiSlug: 'cable-bayesian-curl' },
      { id: 'rear-delt-f', name: 'Vuelo posterior alto en cable', exerciseDbQuery: 'cable high reverse fly', sets: 'según fase', reps: 'según fase', tempo: '3-1-1', rest: '90 seg', notes: 'Deltoides posterior. Mejora postura.', muscleWikiSlug: 'cable-high-reverse-fly' },
    ]
  },
  {
    key: 'push-a-f',
    label: 'Martes/Viernes',
    focus: 'Push A — Cuáds + Glúteo + Pecho + Hombros',
    exercises: [
      { id: 'leg-press-f', name: 'Prensa de piernas', exerciseDbQuery: 'machine leg press', sets: 'según fase', reps: 'según fase', tempo: '3-1-1', rest: '2 min', notes: 'Pisada alta: más glúteo, menos rodilla.', muscleWikiSlug: 'machine-leg-press' },
      { id: 'leg-ext-f', name: 'Leg Extension (0–60° rango)', exerciseDbQuery: 'machine leg extension', sets: 'según fase', reps: 'según fase', tempo: '3-1-1', rest: '2 min', notes: 'Cuádriceps aislado. Rango parcial.', muscleWikiSlug: 'machine-leg-extension' },
      { id: 'abductor-f', name: 'Abducción de cadera en máquina', exerciseDbQuery: 'machine hip abduction', sets: 'según fase', reps: 'según fase', tempo: '3-1-1', rest: '90 seg', notes: 'Glúteo medio. Zona problemática lateral.', muscleWikiSlug: 'machine-hip-abduction' },
      { id: 'incline-press-f', name: 'Press inclinado con mancuernas', exerciseDbQuery: 'dumbbell incline bench press', sets: 'según fase', reps: 'según fase', tempo: '3-1-1', rest: '2 min', notes: 'Pecho superior. Peso liviano, lejos del fallo.', muscleWikiSlug: 'dumbbell-incline-bench-press' },
      { id: 'cable-fly-f', name: 'Fly pectoral en cable', exerciseDbQuery: 'cable pec fly', sets: 'según fase', reps: 'según fase', tempo: '3-1-1', rest: '90 seg', notes: 'Definición de pecho sin volumen.', muscleWikiSlug: 'cable-pec-fly' },
      { id: 'lateral-f', name: 'Elevación lateral en cable', exerciseDbQuery: 'cable low single arm lateral raise', sets: 'según fase', reps: 'según fase', tempo: '3-1-1', rest: '90 seg', notes: 'Hombros. Muy liviano, lejos del fallo.', muscleWikiSlug: 'cable-low-single-arm-lateral-raise' },
      { id: 'tricep-f', name: 'Extensión con cuerda en polea', exerciseDbQuery: 'cable rope pushdown', sets: 'según fase', reps: 'según fase', tempo: '3-1-1', rest: '90 seg', notes: 'Tríceps firme. Evita flacidez en la parte posterior del brazo.', muscleWikiSlug: 'cable-rope-pushdown' },
    ]
  },
]

export function getProgramDays(program: ProgramType): WorkoutDay[] {
  return program === 'male' ? maleProgramDays : femaleProgramDays
}

export const femalePhaseConfigs: PhaseConfig[] = [
  {
    phase: 1,
    name: 'Adaptación + Volumen',
    weeks: 'Semanas 1–4',
    goal: 'Reactivar patrones motores, construir el hábito',
    reps: '3–5',
    tempo: '3-1-1',
    rest: '2 min',
    rir: '3–4',
    cardio: '20 min HIIT + LISS post-entreno'
  },
  {
    phase: 2,
    name: 'Fuerza + Tono',
    weeks: 'Semanas 5–8',
    goal: 'Ganar fuerza sin volumen, definir silueta',
    reps: '3–5',
    tempo: '3-1-1',
    rest: '2 min',
    rir: '2–3',
    cardio: 'HIIT 30×60 + LISS 15 min'
  },
  {
    phase: 3,
    name: 'Densidad + Definición',
    weeks: 'Semanas 9–12',
    goal: 'Máximo tono, reducción de grasa',
    reps: '3–5',
    tempo: '4-1-1',
    rest: '2 min',
    rir: '1–2',
    cardio: 'HIIT 30×45 + LISS 15 min'
  }
]

export function getPhaseConfigs(program: ProgramType): PhaseConfig[] {
  return program === 'male' ? malePhaseConfigs : femalePhaseConfigs
}