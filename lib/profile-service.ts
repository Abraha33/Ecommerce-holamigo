import { createClientComponentClient } from "./supabase"
import { AuthService } from "./auth-service"

export type ProfileUpdateData = {
  full_name?: string
  username?: string
  display_name?: string // Nuevo campo para el nombre a mostrar
  website?: string
  avatar_url?: string
  bio?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  company?: string
  job_title?: string
  preferences?: Record<string, any>
}

export type ProfileData = ProfileUpdateData & {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export const ProfileService = {
  /**
   * Get the current user's profile
   */
  getProfile: async (): Promise<{ data: ProfileData | null; error: string | null }> => {
    try {
      // First get the current user
      const { data: user, error: userError } = await AuthService.getCurrentUser()

      if (userError || !user) {
        return { data: null, error: userError?.message || "User not found" }
      }

      const supabase = createClientComponentClient()

      // Check if we have a profiles table entry
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) {
        console.error("Error fetching profile:", error)

        // If no profile exists yet, return user data as the profile
        return {
          data: {
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || "",
            display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || "",
            avatar_url: user.user_metadata?.avatar_url || "",
            created_at: user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as ProfileData,
          error: null,
        }
      }

      return { data, error: null }
    } catch (err) {
      console.error("Error in getProfile:", err)
      return {
        data: null,
        error: err instanceof Error ? err.message : "An unknown error occurred fetching profile",
      }
    }
  },

  /**
   * Update the current user's profile
   */
  updateProfile: async (profileData: ProfileUpdateData): Promise<{ success: boolean; error: string | null }> => {
    try {
      // First get the current user
      const { data: user, error: userError } = await AuthService.getCurrentUser()

      if (userError || !user) {
        return { success: false, error: userError?.message || "User not found" }
      }

      const supabase = createClientComponentClient()

      // Update auth metadata for name, display name and avatar
      if (profileData.full_name || profileData.avatar_url || profileData.display_name) {
        const metadataToUpdate: Record<string, any> = {}
        if (profileData.full_name) metadataToUpdate.full_name = profileData.full_name
        if (profileData.display_name) metadataToUpdate.display_name = profileData.display_name
        if (profileData.avatar_url) metadataToUpdate.avatar_url = profileData.avatar_url

        const { error: updateError } = await supabase.auth.updateUser({
          data: metadataToUpdate,
        })

        if (updateError) {
          console.error("Error updating user metadata:", updateError)
          return { success: false, error: updateError.message }
        }
      }

      // Check if profile exists
      const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

      let error

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            ...profileData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)

        error = updateError
      } else {
        // Create new profile
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            email: user.email,
            ...profileData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

        error = insertError
      }

      if (error) {
        console.error("Error updating profile in database:", error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (err) {
      console.error("Error in updateProfile:", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "An unknown error occurred updating profile",
      }
    }
  },

  /**
   * Update display name (the name shown in the header)
   */
  updateDisplayName: async (displayName: string): Promise<{ success: boolean; error: string | null }> => {
    try {
      const supabase = createClientComponentClient()

      // Update the user metadata with the new display name
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName },
      })

      if (error) {
        console.error("Error updating display name:", error)
        return { success: false, error: error.message }
      }

      // Also update the profile table
      return await ProfileService.updateProfile({ display_name: displayName })
    } catch (err) {
      console.error("Error in updateDisplayName:", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "An unknown error occurred updating display name",
      }
    }
  },

  /**
   * Upload a profile avatar
   */
  uploadAvatar: async (file: File): Promise<{ url: string | null; error: string | null }> => {
    try {
      // First get the current user
      const { data: user, error: userError } = await AuthService.getCurrentUser()

      if (userError || !user) {
        return { url: null, error: userError?.message || "User not found" }
      }

      const supabase = createClientComponentClient()

      // Create a unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload the file
      const { data, error } = await supabase.storage.from("avatars").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("Error uploading avatar:", error)
        return { url: null, error: error.message }
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(data.path)

      // Update the user's avatar_url
      await ProfileService.updateProfile({ avatar_url: publicUrl })

      return { url: publicUrl, error: null }
    } catch (err) {
      console.error("Error in uploadAvatar:", err)
      return {
        url: null,
        error: err instanceof Error ? err.message : "An unknown error occurred uploading avatar",
      }
    }
  },

  /**
   * Update user email
   */
  updateEmail: async (email: string): Promise<{ success: boolean; error: string | null }> => {
    try {
      const supabase = createClientComponentClient()

      const { error } = await supabase.auth.updateUser({ email })

      if (error) {
        console.error("Error updating email:", error)
        return { success: false, error: error.message }
      }

      return {
        success: true,
        error: null,
      }
    } catch (err) {
      console.error("Error in updateEmail:", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "An unknown error occurred updating email",
      }
    }
  },

  /**
   * Update user password
   */
  updatePassword: async (password: string): Promise<{ success: boolean; error: string | null }> => {
    try {
      const supabase = createClientComponentClient()

      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        console.error("Error updating password:", error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (err) {
      console.error("Error in updatePassword:", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "An unknown error occurred updating password",
      }
    }
  },

  /**
   * Update notification preferences
   */
  updateNotificationPreferences: async (
    preferences: Record<string, boolean>,
  ): Promise<{ success: boolean; error: string | null }> => {
    try {
      // First get the current profile
      const { data: profile, error: profileError } = await ProfileService.getProfile()

      if (profileError || !profile) {
        return { success: false, error: profileError || "Profile not found" }
      }

      // Update the preferences
      const currentPreferences = profile.preferences || {}
      const updatedPreferences = { ...currentPreferences, ...preferences }

      return await ProfileService.updateProfile({ preferences: updatedPreferences })
    } catch (err) {
      console.error("Error in updateNotificationPreferences:", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "An unknown error occurred updating notification preferences",
      }
    }
  },
}
