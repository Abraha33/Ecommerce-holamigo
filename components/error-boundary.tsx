"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes("supabase")) {
        setHasError(true)
        setErrorMessage("Error de conexión con la base de datos. Por favor, recarga la página.")
        event.preventDefault()
      }
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Algo salió mal</h2>
          <p className="mb-6 text-gray-600">{errorMessage}</p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Recargar página
          </Button>
        </div>
      </div>
    )
  }

  return children
}
