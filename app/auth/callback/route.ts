import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const redirectTo = requestUrl.searchParams.get("redirectTo") || "/"

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Intercambiar el código por una sesión
    await supabase.auth.exchangeCodeForSession(code)

    // Obtener información del usuario para guardarla en la base de datos
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Guardar información del usuario en la base de datos
      const userProfile = {
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
        avatar_url: user.user_metadata?.avatar_url || "",
        phone: user.phone || "",
      }

      try {
        // Intentar guardar el perfil del usuario
        const { error: profileError } = await supabase.from("user_profiles").upsert(
          {
            ...userProfile,
            updated_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        )

        if (profileError) {
          console.error("Error saving user profile in callback:", profileError)
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
            console.error("Error saving user metadata in callback:", metadataError)
          }
        }

        // Establecer cookies para el nombre de usuario
        const displayName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.preferred_username ||
          user.email?.split("@")[0] ||
          "Usuario"

        cookieStore.set("username", displayName, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 días
          sameSite: "lax",
        })

        console.log("Usuario guardado correctamente en la base de datos:", user.id)
      } catch (error) {
        console.error("Error saving user data in callback:", error)
      }

      // Establecer cookies adicionales
      cookieStore.set("user-logged-in", "true", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
        sameSite: "lax",
      })
    }
  }

  // Redirigir al usuario a la página de destino
  return NextResponse.redirect(new URL(redirectTo, requestUrl.url))
}

export const dynamic = "force-dynamic"
