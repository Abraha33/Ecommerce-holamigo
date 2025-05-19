"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { GoogleAuthButton } from "@/components/ui/google-auth-button"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/"
  const supabase = createClientComponentClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: "Error al iniciar sesión",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Si rememberMe está activado, establecer una cookie de larga duración
      if (rememberMe) {
        localStorage.setItem("remember-user", "true")
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente.",
      })

      // Redirigir al usuario a la página desde la que vino o a la página principal
      router.push(redirectTo)
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error)
      toast({
        title: "Error al iniciar sesión",
        description: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Ingresa tu correo electrónico",
        description: "Por favor, ingresa tu correo electrónico para recuperar tu contraseña.",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        toast({
          title: "Error al enviar el correo",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Correo enviado",
        description: "Hemos enviado un correo con instrucciones para recuperar tu contraseña.",
      })
    } catch (error) {
      console.error("Error al solicitar recuperación de contraseña:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al solicitar la recuperación de contraseña.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">Iniciar sesión</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna izquierda: Formulario de login */}
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full max-w-md"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <button type="button" onClick={handleForgotPassword} className="text-xs text-blue-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative max-w-md">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Recordarme en este dispositivo
              </label>
            </div>

            <Button type="submit" className="w-full max-w-md bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="relative my-6 max-w-md">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O continúa con</span>
            </div>
          </div>

          <GoogleAuthButton mode="signin" className="w-full max-w-md" redirectTo={redirectTo} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-blue-600 font-medium hover:underline">
                Registrarse
              </Link>
            </p>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center max-w-md mx-auto">
            Al iniciar o crear una cuenta aceptas los{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              términos y condiciones
            </Link>{" "}
            y autorizas el{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              tratamiento de tus datos personales
            </Link>
          </div>
        </div>

        {/* Columna derecha: Beneficios */}
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-bold mb-6">Beneficios de tener tu cuenta</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Ruta de entrega</p>
                <p className="text-gray-600">Configura y guarda tu ruta de entrega preferida.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Direcciones y pagos</p>
                <p className="text-gray-600">Guarda tus direcciones y medios de pago favoritos.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z" />
                  <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z" />
                  <line x1="12" x2="12" y1="22" y2="13" />
                  <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Promociones</p>
                <p className="text-gray-600">Accede a promociones exclusivas para usuarios registrados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
