"use client"

import { useEffect } from "react"

export function EnvScript() {
  useEffect(() => {
    // Solo ejecutamos esto en el cliente
    if (typeof window !== "undefined") {
      // Inyectamos las variables de entorno en el objeto window
      const windowWithEnv = window as any
      windowWithEnv.__SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
      windowWithEnv.__SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
  }, [])

  return null
}
