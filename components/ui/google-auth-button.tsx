"use client"

import { useState } from "react"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"

interface GoogleAuthButtonProps {
  mode: "signin" | "signup" | "login" | "register"
  className?: string
  redirectTo?: string
}

export function GoogleAuthButton({ mode, className = "", redirectTo = "/" }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handleGoogleAuth = async () => {
    setIsLoading(true)

    try {
      // Configuración básica para evitar problemas de bloqueo
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (error) {
        console.error("Error de autenticación con Google:", error)
        toast({
          title: "Error de autenticación",
          description: "No se pudo conectar con Google. Por favor, intenta más tarde.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error en autenticación con Google:", error)
      toast({
        title: "Error de conexión",
        description: "Ocurrió un problema al conectar con Google. Por favor, intenta más tarde.",
        variant: "destructive",
      })
    } finally {
      // Aunque la redirección ocurrirá, reseteamos el estado por si acaso
      setTimeout(() => setIsLoading(false), 2000)
    }
  }

  const buttonText = mode === "signin" || mode === "login" ? "Iniciar sesión con Google" : "Registrarse con Google"

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={isLoading}
      className={`flex items-center justify-center gap-3 border border-gray-300 rounded-md py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all w-full ${className}`}
    >
      {isLoading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
      ) : (
        <Image src="/google-logo.png" alt="Google" width={20} height={20} className="rounded-full" />
      )}
      <span>{isLoading ? "Conectando..." : buttonText}</span>
    </button>
  )
}
