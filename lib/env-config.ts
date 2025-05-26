// Valores de fallback para desarrollo local
const FALLBACK_SUPABASE_URL = "https://your-project-id.supabase.co"
const FALLBACK_SUPABASE_ANON_KEY = "your-anon-key"

// Función para obtener las variables de entorno con fallback
export function getEnv() {
  // Verificamos si estamos en el navegador
  if (typeof window !== "undefined") {
    // Intentamos obtener las variables de las propiedades window si existen
    // Esto permite inyectarlas desde el servidor si es necesario
    const windowWithEnv = window as any

    return {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || windowWithEnv.__SUPABASE_URL || FALLBACK_SUPABASE_URL,

      SUPABASE_ANON_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || windowWithEnv.__SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY,
    }
  }

  // En el servidor, usamos las variables de entorno directamente
  return {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY,
  }
}
