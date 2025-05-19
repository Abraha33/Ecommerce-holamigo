"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Función para obtener y establecer el usuario actual
  const getUser = async () => {
    try {
      // Intentar recuperar la sesión
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
        // Guardar en localStorage para referencia rápida
        localStorage.setItem("user", JSON.stringify(session.user))
        // Guardar la fecha de último acceso
        localStorage.setItem("lastLogin", new Date().toISOString())
      } else {
        // Intentar recuperar del localStorage si no hay sesión activa
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          // Intentar refrescar la sesión
          refreshSession(parsedUser)
        } else {
          setUser(null)
          localStorage.removeItem("user")
        }
      }
    } catch (error) {
      console.error("Error getting session:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para refrescar la sesión
  const refreshSession = async (storedUser: User) => {
    try {
      // Intentar refrescar el token
      const { data, error } = await supabase.auth.refreshSession()

      if (error || !data.session) {
        console.warn("No se pudo refrescar la sesión:", error)
        // Si han pasado más de 7 días, eliminar la sesión local
        const lastLogin = localStorage.getItem("lastLogin")
        if (lastLogin) {
          const lastLoginDate = new Date(lastLogin)
          const now = new Date()
          const diffDays = Math.floor((now.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24))

          if (diffDays > 7) {
            setUser(null)
            localStorage.removeItem("user")
            localStorage.removeItem("lastLogin")
          }
        }
      } else {
        // Actualizar el usuario con la información fresca
        setUser(data.session.user)
        localStorage.setItem("user", JSON.stringify(data.session.user))
        localStorage.setItem("lastLogin", new Date().toISOString())
      }
    } catch (err) {
      console.error("Error refreshing session:", err)
    }
  }

  // Función para refrescar el usuario actual
  const refreshUser = async () => {
    try {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
    }
  }

  useEffect(() => {
    // Obtener usuario inicial
    getUser()

    // Suscribirse a cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      if (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          setUser(session.user)
          localStorage.setItem("user", JSON.stringify(session.user))
          router.refresh()
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        localStorage.removeItem("user")
        router.refresh()
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase, router])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      localStorage.removeItem("user")
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, signOut, refreshUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
