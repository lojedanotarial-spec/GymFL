# VI Gym — Visual Impact App

App de gym para seguir el programa Visual Impact actualizado. Pensada para mobile (PWA).

## Setup en 5 pasos

### 1. Supabase
1. Creá un proyecto en [supabase.com](https://supabase.com)
2. Andá a **SQL Editor** y ejecutá el contenido de `supabase-schema.sql`
3. Copiá la **Project URL** y la **anon key** (Settings → API)

### 2. Variables de entorno
Renombrá `.env.local.example` a `.env.local` y completá:
```
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 3. Deploy en Vercel
Conectá el repo en vercel.com o:
```bash
npx vercel
```
En el dashboard de Vercel, agregá las variables de entorno en:
**Settings → Environment Variables**

### 4. Registrar usuarios
- Vos: creá tu cuenta con tu email
- Fátima: crea la suya con el suyo
- En setup, cada uno elige programa (masculino/femenino)

### 5. Instalar como app en el celu
En Safari/Chrome, tocá "Compartir → Agregar a pantalla de inicio"

## Stack
- Next.js 15 · Supabase · ExerciseDB API · PWA-ready
