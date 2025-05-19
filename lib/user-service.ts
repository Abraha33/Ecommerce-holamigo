import { createClientComponentClient } from "./supabase"

export type UserProfile = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone?: string
  created_at?: string
  updated_at?: string
  last_sign_in_at?: string
}

export const UserService = {
  /**
   * Crea o actualiza un usuario en la base de datos de Supabase
   */
  upsertUser: async (userData: Partial<UserProfile> & { id: string }): Promise<boolean> => {
    const supabase = createClientComponentClient()
    try {
      // Preparar datos para inserción o actualización
      const now = new Date().toISOString()
      const userInfo = {
        ...userData,
        updated_at: now,
        last_sign_in_at: now,
      }

      // Insertar o actualizar el usuario
      const { error: upsertError } = await supabase.from("user_profiles").upsert(userInfo, {
        onConflict: "id",
        ignoreDuplicates: false,
      })

      if (upsertError) {
        console.error("Error upserting user:", upsertError)
        return false
      }

      return true
    } catch (error) {
      console.error("Error in upsertUser:", error)
      return false
    }
  },

  /**
   * Guarda metadatos adicionales del usuario
   */
  saveUserMetadata: async (userId: string, metadata: Record<string, any>): Promise<boolean> => {
    const supabase = createClientComponentClient()
    try {
      const { error } = await supabase.from("user_metadata").upsert(
        {
          user_id: userId,
          metadata,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      )

      if (error) {
        console.error("Error saving user metadata:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error in saveUserMetadata:", error)
      return false
    }
  },

  /**
   * Obtiene el perfil de usuario por ID
   */
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    const supabase = createClientComponentClient()
    try {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error("Error in getUserProfile:", error)
      return null
    }
  },
}
