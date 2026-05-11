// Traducción de términos comunes español → inglés para búsqueda de ejercicios
const translations: Record<string, string> = {
  // Músculos / grupos
  'pecho': 'chest',
  'espalda': 'back',
  'hombros': 'shoulder',
  'hombro': 'shoulder',
  'biceps': 'bicep',
  'bíceps': 'bicep',
  'triceps': 'tricep',
  'tríceps': 'tricep',
  'piernas': 'leg',
  'pierna': 'leg',
  'gluteos': 'glute',
  'glúteos': 'glute',
  'gluteo': 'glute',
  'glúteo': 'glute',
  'isquios': 'hamstring',
  'isquiotibiales': 'hamstring',
  'cuadriceps': 'quad',
  'cuádriceps': 'quad',
  'pantorrillas': 'calf',
  'abdomen': 'ab',
  'abdominales': 'ab',
  'core': 'core',
  'antebrazos': 'forearm',
  'trapecio': 'trap',
  'dorsales': 'lat',
  'lumbar': 'lower back',
  'aductores': 'adductor',
  'abductores': 'abductor',

  // Equipamiento
  'barra': 'barbell',
  'mancuernas': 'dumbbell',
  'mancuerna': 'dumbbell',
  'polea': 'cable',
  'cable': 'cable',
  'maquina': 'machine',
  'máquina': 'machine',
  'banda': 'band',
  'banda elastica': 'resistance band',
  'banda elástica': 'resistance band',
  'pesas': 'barbell',
  'kettlebell': 'kettlebell',
  'peso corporal': 'bodyweight',
  'smith': 'smith machine',

  // Ejercicios comunes
  'press': 'press',
  'press inclinado': 'incline press',
  'press plano': 'bench press',
  'press militar': 'shoulder press',
  'remo': 'row',
  'jalon': 'pulldown',
  'jalón': 'pulldown',
  'dominadas': 'pull up',
  'sentadilla': 'squat',
  'peso muerto': 'deadlift',
  'hip thrust': 'hip thrust',
  'curl': 'curl',
  'curl de biceps': 'bicep curl',
  'curl de bíceps': 'bicep curl',
  'extension': 'extension',
  'extensión': 'extension',
  'elevaciones laterales': 'lateral raise',
  'elevacion lateral': 'lateral raise',
  'elevación lateral': 'lateral raise',
  'face pull': 'face pull',
  'plancha': 'plank',
  'plank': 'plank',
  'fondos': 'dip',
  'dips': 'dip',
  'leg press': 'leg press',
  'prensa': 'leg press',
  'leg curl': 'leg curl',
  'leg extension': 'leg extension',
  'calf raise': 'calf raise',
  'pantorilla': 'calf raise',
  'encogimiento': 'shrug',
  'rueda abdominal': 'ab wheel',
  'romanian': 'romanian deadlift',
  'rdl': 'romanian deadlift',
  'split squat': 'split squat',
  'bulgarian': 'bulgarian split squat',
  'hip abduction': 'hip abduction',
  'hip adduction': 'hip adduction',
  'glute bridge': 'glute bridge',
  'puente de gluteo': 'glute bridge',
  'puente de glúteo': 'glute bridge',
}

export function translateToEnglish(query: string): string {
  const lower = query.toLowerCase().trim()
  
  // Try full phrase match first
  if (translations[lower]) return translations[lower]
  
  // Try replacing known words
  let translated = lower
  // Sort by length descending to match longer phrases first
  const keys = Object.keys(translations).sort((a, b) => b.length - a.length)
  for (const key of keys) {
    if (translated.includes(key)) {
      translated = translated.replace(key, translations[key])
      break
    }
  }
  
  return translated
}