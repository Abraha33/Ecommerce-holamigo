import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerComponentClient as createSupaServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClientComponentClient as createSupaClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Singleton pattern for the Supabase client on the client-side
let clientSingleton: ReturnType<typeof createSupabaseClient> | null = null

// Create a client-side Supabase client (for client components)
export const createClientComponentClient = () => {
  if (clientSingleton) return clientSingleton

  // Create client with explicit persistence
  clientSingleton = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
    {
      auth: {
        persistSession: true,
        storageKey: "holamigo-auth-token",
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  )

  return clientSingleton
}

// Create a server-side Supabase client (for server components)
export const createServerComponentClient = () => {
  const cookieStore = cookies()
  return createSupaServerComponentClient<Database>({ cookies: () => cookieStore })
}

// Create a server-side Supabase client with admin privileges (for API routes)
export const createServiceClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Export createClient as an alias for createClientComponentClient for backward compatibility
export const createClient = createClientComponentClient
