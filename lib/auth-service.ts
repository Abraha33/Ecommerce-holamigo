import { createClientComponentClient } from "./supabase"
import type { User, Session } from "@supabase/supabase-js"

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
   * Sign in with email and password
   */
  signInWithPassword: async (credentials: SignInWithPasswordCredentials): Promise<AuthResponse<Session>> => {
    const supabase = createClientComponentClient()
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
        options: {
          // Asegurar que la sesión persista por 30 días
          persistSession: true,
        },
      })

      if (error) {
        return { data: null, error: { message: error.message, status: error.status } }
      }

      // Guardar explícitamente en localStorage para mayor seguridad
      if (data.session) {
        localStorage.setItem("supabase.auth.token", JSON.stringify(data.session))

        // Guardar el usuario en la base de datos
        if (data.user) {
          await AuthService.saveUserToDatabase(data.user)
        }
      }

      return { data: data.session, error: null }
    } catch (err) {
      console.error("Error signing in:", err)
      return {
        data: null,
        error: { message: err instanceof Error ? err.message : "An unknown error occurred during sign in" },
      }
    }
  },

  /**
   * Sign up with email and password
   */
  signUpWithPassword: async (credentials: SignUpWithPasswordCredentials): Promise<AuthResponse> => {
    const supabase = createClientComponentClient()
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: credentials.metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { data: null, error: { message: error.message, status: error.status } }
      }

      // Si la autenticación es inmediata (sin verificación por email), guardar el usuario
      if (data.user && data.session) {
        await AuthService.saveUserToDatabase(data.user)
      }

      return { data: null, error: null }
    } catch (err) {
      console.error("Error signing up:", err)
      return {
        data: null,
        error: { message: err instanceof Error ? err.message : "An unknown error occurred during sign up" },
      }
    }
  },

  /**
   * Sign in with a third-party provider
   */
  signInWithProvider: async (provider: Provider): Promise<AuthResponse> => {
    const supabase = createClientComponentClient()
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            // Solicitar acceso al perfil y email del usuario
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        return { data: null, error: { message: error.message, status: error.status } }
      }

      return { data: null, error: null }
    } catch (err) {
      console.error(`Error signing in with ${provider}:`, err)
      return {
        data: null,
        error: { message: err instanceof Error ? err.message : `An unknown error occurred during ${provider} sign in` },
      }
    }
  },

  /**
   * Sign in with magic link (passwordless)
   */
  signInWithMagicLink: async (email: string): Promise<AuthResponse> => {
    const supabase = createClientComponentClient()
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { data: null, error: { message: error.message, status: error.status } }
      }

      return { data: null, error: null }
    } catch (err) {
      console.error("Error sending magic link:", err)
      return {
        data: null,
        error: { message: err instanceof Error ? err.message : "An unknown error occurred sending magic link" },
      }
    }
  },

  /**
   * Sign in with phone OTP
   */
  signInWithPhone: async (phone: string): Promise<AuthResponse> => {
    const supabase = createClientComponentClient()
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      })

      if (error) {
        return { data: null, error: { message: error.message, status: error.status } }
      }

      return { data: null, error: null }
    } catch (err) {
      console.error("Error sending OTP:", err)
      return {
        data: null,
        error: { message: err instanceof Error ? err.message : "An unknown error occurred sending OTP" },
      }
    }
  },

  /**
   * Verify phone OTP
   */
  verifyPhoneOtp: async (phone: string, token: string): Promise<AuthResponse<Session>> => {
    const supabase = createClientComponentClient()
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: "sms",
      })

      if (error) {
        return { data: null, error: { message: error.message, status: error.status } }
      }

      // Guardar el usuario en la base de datos si la verificación es exitosa
      if (data.user) {
        await AuthService.saveUserToDatabase(data.user)
      }

      return { data: data.session, error: null }
    } catch (err) {
      console.error("Error verifying OTP:", err)
      return {
        data: null,
        error: { message: err instanceof Error ? err.message : "An unknown error occurred verifying OTP" },
      }
    }
  },

  /**
   * Sign out the current user
   */
  signOut: async (): Promise<AuthResponse> => {
    const supabase = createClientComponentClient()
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        return { data: null, error: { message: error.message, status: error.status } }
      }

      // Limpiar localStorage
      localStorage.removeItem("username")
      localStorage.removeItem("supabase.auth.token")

      return { data: null, error: null }
    } catch (err) {
      console.error("Error signing out:", err)
      return {
        data: null,
        error: { message: err instanceof Error ? err.message : "An unknown error occurred during sign out" },
      }
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

  /**
   * Reset password
   */
  resetPassword: async (email: string): Promise<AuthResponse> => {
    const supabase = createClientComponentClient()
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { data: null, error: { message: error.message, status: error.status } }
      }

      return { data: null, error: null }
    } catch (err) {
      console.error("Error resetting password:", err)
      return {
        data: null,
        error: { message: err instanceof Error ? err.message : "An unknown error occurred resetting password" },
      }
    }
  },

  /**
   * Update password
   */
  updatePassword: async (password: string): Promise<AuthResponse> => {
    const supabase = createClientComponentClient()
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        return { data: null, error: { message: error.message, status: error.status } }
      }

      return { data: null, error: null }
    } catch (err) {
      console.error("Error updating password:", err)
      return {
        data: null,
        error: { message: err instanceof Error ? err.message : "An unknown error occurred updating password" },
      }
    }
  },
}
