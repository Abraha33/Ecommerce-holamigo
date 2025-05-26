"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

export function SupabaseErrorFallback() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Verificamos si hay un error de Supabase
    const checkForErrors = () => {
      const hasSupabaseError =
        !window.__SUPABASE_URL ||
        !window.__SUPABASE_ANON_KEY ||
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      setIsVisible(hasSupabaseError)
    }

    // Verificamos inmediatamente
    checkForErrors()

    // Y también después de un breve retraso para dar tiempo a que se carguen las variables
    const timeoutId = setTimeout(checkForErrors, 1000)

    return () => clearTimeout(timeoutId)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Error de Conexión</h2>
        <p className="mb-6 text-gray-600">
          No se pudo conectar con la base de datos. Esto puede deberse a un problema temporal.
        </p>
        <div className="space-y-4">
          <Button onClick={() => window.location.reload()} className="w-full flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Recargar Página
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/inicio")} className="w-full">
            Ir a la Página Principal
          </Button>
        </div>
      </div>
    </div>
  )
}
