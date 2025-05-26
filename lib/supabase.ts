"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Singleton para el cliente de Supabase en el lado del cliente
let supabaseClient

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient()
  }
  return supabaseClient
}

// Función para obtener el usuario actual
export const getCurrentUser = async () => {
  const supabase = getSupabaseClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

// Función para obtener la sesión actual
export const getSession = async () => {
  const supabase = getSupabaseClient()
  const { data } = await supabase.auth.getSession()
  return data.session
}

// Función para verificar si el usuario está autenticado
export const isAuthenticated = async () => {
  const session = await getSession()
  return !!session
}

// Función para cerrar sesión
export const signOut = async () => {
  const supabase = getSupabaseClient()
  return await supabase.auth.signOut()
}

// Exportamos directamente createClientComponentClient para compatibilidad
export { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Añadimos las exportaciones faltantes
export { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

// Exportamos createClient como alias de createClientComponentClient para compatibilidad
export const createClient = createClientComponentClient
