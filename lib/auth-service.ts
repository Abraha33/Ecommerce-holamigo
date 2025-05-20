"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/supabase-js"

export type AuthError = {
  message: string
  status?: number
}

export type AuthResponse<T = void> = {
  data: T | null
  error: AuthError | null
}

export type SignInWithPasswordCredentials = {
  email: string
  password: string
}

export type SignUpWithPasswordCredentials = {
  email: string
  password: string
  metadata?: { [key: string]: any }
}

export type Provider = "google" | "facebook" | "twitter" | "apple"

/**
 * Authentication service for handling all auth-related operations
 */
export const AuthService = {
  signInWithPassword: async ({ email, password }) => {
    const supabase = createClientComponentClient()
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  signUpWithPassword: async ({ email, password, metadata = {} }) => {
    const supabase = createClientComponentClient()
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  },

  signInWithMagicLink: async (email) => {
    const supabase = createClientComponentClient()
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  },

  signInWithPhone: async (phone) => {
    const supabase = createClientComponentClient()
    return await supabase.auth.signInWithOtp({
      phone,
    })
  },

  verifyPhoneOtp: async (phone, token) => {
    const supabase = createClientComponentClient()
    return await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    })
  },

  signInWithProvider: async (provider) => {
    const supabase = createClientComponentClient()
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  },

  signOut: async () => {
    const supabase = createClientComponentClient()
    return await supabase.auth.signOut()
  },

  getSession: async () => {
    const supabase = createClientComponentClient()
    return await supabase.auth.getSession()
  },

  getUser: async () => {
    const supabase = createClientComponentClient()
    return await supabase.auth.getUser()
  },

  resetPasswordForEmail: async (email) => {
    const supabase = createClientComponentClient()
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
  },

  updatePassword: async (password) => {
    const supabase = createClientComponentClient()
    return await supabase.auth.updateUser({
      password,
    })
  },

  /**
   * Guarda la información del usuario en la base de datos
   */
  saveUserToDatabase: async (user: User): Promise<boolean> => {
    const supabase = createClientComponentClient()
    try {
      // Extraer información básica del usuario para guardarla en el perfil
      const userProfile = {
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
        avatar_url: user.user_metadata?.avatar_url || "",
        phone: user.phone || "",
      }

      // Guardar el perfil del usuario
      const { error: profileError } = await supabase.from("user_profiles").upsert(
        {
          ...userProfile,
          updated_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      )

      if (profileError) {
        console.error("Error saving user profile:", profileError)
        return false
      }

      // Guardar metadatos adicionales si existen
      if (Object.keys(user.user_metadata || {}).length > 0) {
        const { error: metadataError } = await supabase.from("user_metadata").upsert(
          {
            user_id: user.id,
            metadata: user.user_metadata,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        )

        if (metadataError) {
          console.error("Error saving user metadata:", metadataError)
          // No retornamos false aquí porque el perfil ya se guardó correctamente
        }
      }

      // Guardar el nombre de usuario en localStorage para uso inmediato
      const displayName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.preferred_username ||
        user.email?.split("@")[0] ||
        "Usuario"

      localStorage.setItem("username", displayName)

      return true
    } catch (error) {
      console.error("Error saving user to database:", error)
      return false
    }
  },

  /**
   * Get the current user
   */
  getCurrentUser: async (): Promise<AuthResponse<User>> => {
    const supabase = createClientComponentClient()
    try {
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        return { data: null, error: { message: error.message, status: error.status } }
      }

      return { data: data.user, error: null }
    } catch (err) {
      console.error("Error getting current user:", err)
      return {
        data: null,
        error: { message: err instanceof Error ? err.message : "An unknown error occurred getting user" },
      }
    }
  },
}
