"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"

// Función de validación de email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  // Estados para validación
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [formValid, setFormValid] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/"
  const supabase = createClientComponentClient()

  // Validar formulario cuando cambian los valores
  useEffect(() => {
    // Validar email
    if (emailTouched) {
      if (!email) {
        setEmailError("El correo electrónico es obligatorio")
      } else if (!isValidEmail(email)) {
        setEmailError("Ingresa un correo electrónico válido")
      } else {
        setEmailError("")
      }
    }

    // Validar contraseña
    if (passwordTouched) {
      if (!password) {
        setPasswordError("La contraseña es obligatoria")
      } else if (password.length < 6) {
        setPasswordError("La contraseña debe tener al menos 6 caracteres")
      } else {
        setPasswordError("")
      }
    }

    // Verificar si el formulario es válido
    const isValid = email && isValidEmail(email) && password && password.length >= 6
    setFormValid(isValid)
  }, [email, password, emailTouched, passwordTouched])

  const handleLogin = async (e) => {
    e.preventDefault()

    // Validar formulario antes de enviar
    if (!email) setEmailError("El correo electrónico es obligatorio")
    if (!password) setPasswordError("La contraseña es obligatoria")

    if (!formValid) {
      // Marcar todos los campos como tocados para mostrar errores
      setEmailTouched(true)
      setPasswordTouched(true)
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Manejar errores específicos
        if (error.message.includes("Invalid login")) {
          toast({
            title: "Error al iniciar sesión",
            description: "Correo electrónico o contraseña incorrectos",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error al iniciar sesión",
            description: error.message,
            variant: "destructive",
          })
        }
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

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
        },
      })

      if (error) {
        toast({
          title: "Error al iniciar sesión con Google",
          description: error.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión con Google:", error)
      toast({
        title: "Error al iniciar sesión",
        description: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setEmailTouched(true)
      setEmailError("Ingresa tu correo electrónico para recuperar tu contraseña")
      return
    }

    if (!isValidEmail(email)) {
      setEmailTouched(true)
      setEmailError("Ingresa un correo electrónico válido")
      return
    }

    try {
      setIsLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        toast({
          title: "Error al enviar el correo",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-950 py-6 sm:py-8 md:py-10 px-4">
      <div className="container max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-10 text-white drop-shadow-md">
          Iniciar sesión
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-6 md:gap-8">
          {/* Columna izquierda: Formulario de login */}
          <div className="border-0 rounded-xl p-5 sm:p-6 md:p-8 bg-white/90 backdrop-blur-sm shadow-2xl shadow-blue-900/30">
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-blue-900">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="nombre@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    className={`w-full pr-10 ${
                      emailTouched && emailError
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : emailTouched && !emailError
                          ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                          : "border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    aria-invalid={emailTouched && !!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                  {emailTouched && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {emailError ? (
                        <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
                      )}
                    </div>
                  )}
                </div>
                {emailTouched && emailError && (
                  <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {emailError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap justify-between gap-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-blue-900">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setPasswordTouched(true)}
                    className={`w-full pr-10 ${
                      passwordTouched && passwordError
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : passwordTouched && !passwordError
                          ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                          : "border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    aria-invalid={passwordTouched && !!passwordError}
                    aria-describedby={passwordError ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordTouched && passwordError && (
                  <p id="password-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="text-blue-600 border-blue-300 focus:ring-blue-500"
                />
                <label htmlFor="remember" className="text-sm font-normal cursor-pointer text-blue-800">
                  Recordarme en este dispositivo
                </label>
              </div>

              <Button
                type="submit"
                className={`w-full text-white shadow-md shadow-blue-500/20 transition-all duration-200 py-2 sm:py-2.5 text-sm sm:text-base ${
                  formValid ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 cursor-not-allowed hover:bg-blue-400"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Iniciando sesión...
                  </div>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </form>

            <div className="relative my-5 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-blue-600">O continúa con</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-10 sm:h-11 relative hover:bg-blue-50 transition-all duration-200 border-blue-200 text-blue-700 text-sm sm:text-base"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              ) : (
                <Image src="/google-logo.png" alt="Google" width={20} height={20} />
              )}
              <span className="ml-2">Continuar con Google</span>
            </Button>

            <div className="mt-5 sm:mt-6 text-center">
              <p className="text-sm text-blue-800">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-blue-600 font-medium hover:text-blue-800 hover:underline">
                  Registrarse
                </Link>
              </p>
            </div>

            <div className="mt-4 text-xs text-blue-700 text-center mx-auto">
              Al iniciar o crear una cuenta aceptas los{" "}
              <Link href="/terms" className="text-blue-600 font-medium hover:text-blue-800 hover:underline">
                términos y condiciones
              </Link>{" "}
              y autorizas el{" "}
              <Link href="/privacy" className="text-blue-600 font-medium hover:text-blue-800 hover:underline">
                tratamiento de tus datos personales
              </Link>
            </div>
          </div>

          {/* Columna derecha: Beneficios */}
          <div className="border-0 rounded-xl p-5 sm:p-6 md:p-8 bg-white/90 backdrop-blur-sm shadow-2xl shadow-blue-900/30">
            <h2 className="text-xl sm:text-xl md:text-2xl font-bold mb-5 sm:mb-6 md:mb-8 text-blue-900">
              Beneficios de tener tu cuenta
            </h2>

            <div className="space-y-5 sm:space-y-6 md:space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-md flex-shrink-0">
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
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  >
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-base sm:text-lg text-blue-900">Ruta de entrega</p>
                  <p className="text-blue-700 text-sm sm:text-base">Configura y guarda tu ruta de entrega preferida.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-md flex-shrink-0">
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
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-base sm:text-lg text-blue-900">Direcciones y pagos</p>
                  <p className="text-blue-700 text-sm sm:text-base">
                    Guarda tus direcciones y medios de pago favoritos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-md flex-shrink-0">
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
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  >
                    <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z" />
                    <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z" />
                    <line x1="12" x2="12" y1="22" y2="13" />
                    <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-base sm:text-lg text-blue-900">Promociones</p>
                  <p className="text-blue-700 text-sm sm:text-base">
                    Accede a promociones exclusivas para usuarios registrados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
