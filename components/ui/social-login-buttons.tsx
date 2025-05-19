"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type SocialProvider = "google" | "facebook" | "apple" | "twitter"

interface SocialLoginButtonsProps {
  className?: string
  redirectAfterLogin?: boolean
}

export function SocialLoginButtons({ className = "", redirectAfterLogin = true }: SocialLoginButtonsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null)

  // Obtener la URL de redirección si existe
  const redirectTo = searchParams.get("redirectTo") || "/"

  const handleSocialSignIn = async (provider: SocialProvider) => {
    setLoadingProvider(provider)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (error) {
        console.error(`Error al iniciar sesión con ${provider}:`, error)
        toast({
          title: "Error de inicio de sesión",
          description: `No se pudo iniciar sesión con ${provider}. Por favor, intenta de nuevo.`,
          variant: "destructive",
        })
        setLoadingProvider(null)
      }
      // No necesitamos hacer nada más aquí, ya que Supabase redirigirá al usuario
    } catch (error: any) {
      console.error(`Error al iniciar sesión con ${provider}:`, error)
      toast({
        title: "Error de inicio de sesión",
        description: `No se pudo iniciar sesión con ${provider}. Por favor, intenta de nuevo.`,
        variant: "destructive",
      })
      setLoadingProvider(null)
    }
  }

  const getProviderName = (provider: SocialProvider): string => {
    const names: Record<SocialProvider, string> = {
      google: "Google",
      facebook: "Facebook",
      apple: "Apple",
      twitter: "Twitter",
    }
    return names[provider]
  }

  return (
    <div className={`grid grid-cols-1 gap-3 ${className}`}>
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 h-11 relative hover:bg-gray-50 transition-all duration-200"
        onClick={() => handleSocialSignIn("google")}
        disabled={loadingProvider !== null}
      >
        {loadingProvider === "google" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Image src="/google-logo.png" alt="Google" width={20} height={20} />
        )}
        <span className="ml-2">Continuar con Google</span>
      </Button>

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 h-11 relative hover:bg-gray-50 transition-all duration-200"
        onClick={() => handleSocialSignIn("facebook")}
        disabled={loadingProvider !== null}
      >
        {loadingProvider === "facebook" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Image src="/facebook-logo.png" alt="Facebook" width={20} height={20} />
        )}
        <span className="ml-2">Continuar con Facebook</span>
      </Button>

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 h-11 relative hover:bg-gray-50 transition-all duration-200"
        onClick={() => handleSocialSignIn("apple")}
        disabled={loadingProvider !== null}
      >
        {loadingProvider === "apple" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Image src="/apple-logo.png" alt="Apple" width={20} height={20} />
        )}
        <span className="ml-2">Continuar con Apple</span>
      </Button>
    </div>
  )
}
