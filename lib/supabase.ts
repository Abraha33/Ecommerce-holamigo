import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient as _createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Crear un cliente de Supabase para componentes del lado del cliente
export const createClientComponentClient = () => {
  return _createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  })
}

// Crear un cliente de Supabase para componentes del lado del servidor
export const createServerComponentClient = () => {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
