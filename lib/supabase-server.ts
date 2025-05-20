import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

// Verificamos que las variables de entorno estén definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing")
}

// Creamos un cliente directo para operaciones del servidor
export const createDirectServerClient = () => {
  return createClient(supabaseUrl!, supabaseAnonKey!)
}

// Cliente para componentes del servidor que necesitan cookies
export const createServerSupabaseClient = () => {
  try {
    const cookieStore = cookies()
    return createServerComponentClient({ cookies: () => cookieStore })
  } catch (error) {
    console.error("Error creating server supabase client:", error)
    // Fallback a cliente directo si hay problemas con las cookies
    return createDirectServerClient()
  }
}

export const getServerSession = async () => {
  const supabase = createServerSupabaseClient()
  try {
    const { data } = await supabase.auth.getSession()
    return data.session
  } catch (error) {
    console.error("Error getting server session:", error)
    return null
  }
}

export const getServerUser = async () => {
  const supabase = createServerSupabaseClient()
  try {
    const { data } = await supabase.auth.getUser()
    return data.user
  } catch (error) {
    console.error("Error getting server user:", error)
    return null
  }
}
