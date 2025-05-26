"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signOut: async () => {},
  error: null,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Solo ejecutamos esto en el cliente
    if (typeof window === "undefined") return

    let mounted = true
    let subscription: { unsubscribe: () => void } | null = null

    const initializeAuth = async () => {
      try {
        // Importamos dinámicamente para evitar errores de SSR
        const { getSupabaseClient } = await import("@/lib/supabase")

        const supabase = getSupabaseClient()

        // Obtenemos el usuario actual
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (mounted) {
          setUser(user)
          setIsLoading(false)
        }

        // Configuramos el listener de cambios de autenticación
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          if (!mounted) return

          if (event === "SIGNED_IN" && session?.user) {
            setUser(session.user)
          } else if (event === "SIGNED_OUT") {
            setUser(null)
          }
        })

        subscription = data.subscription
      } catch (err) {
        console.error("Error initializing auth:", err)
        if (mounted) {
          setError("Error al inicializar la autenticación")
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      mounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const signOut = async () => {
    try {
      // Importamos dinámicamente para evitar errores de SSR
      const { signOut: supabaseSignOut } = await import("@/lib/supabase")

      await supabaseSignOut()
      setUser(null)
    } catch (err) {
      console.error("Error signing out:", err)
      setError("Error al cerrar sesión")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signOut,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
