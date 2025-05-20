"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft, Smartphone } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/"
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [activeTab, setActiveTab] = useState("login")
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [verificationStep, setVerificationStep] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")

  const handleSocialSignIn = async (provider: "google" | "facebook" | "apple") => {
    setLoadingProvider(provider)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (error) {
        toast({
          title: "Error de inicio de sesión",
          description: error.message,
          variant: "destructive",
        })
        setLoadingProvider(null)
      }
      // No need to do anything else here - the OAuth flow will redirect the user
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

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      // Guardar información adicional en localStorage si rememberMe está activado
      if (rememberMe) {
        localStorage.setItem("userEmail", email)
        localStorage.setItem("rememberMe", "true")

        // Establecer una cookie para recordar al usuario
        document.cookie = `holamigo-remember=true; max-age=${60 * 60 * 24 * 30}; path=/; samesite=lax`
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente.",
      })

      // Forzar una actualización completa para asegurar que todos los componentes reconozcan el nuevo estado de autenticación
      window.location.href = redirectTo
    } catch (error: any) {
      setError("Error al iniciar sesión. Por favor, intenta de nuevo.")
      console.error("Login error:", error)
      setIsLoading(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      setSuccess("Se ha enviado un enlace de verificación a tu correo electrónico")
      setIsLoading(false)
    } catch (error: any) {
      setError(error.message || "Error al registrarse")
      setIsLoading(false)
    }
  }

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      setSuccess("Se ha enviado un enlace mágico a tu correo electrónico")
      setIsLoading(false)
    } catch (error: any) {
      setError(error.message || "Error al enviar el enlace mágico")
      setIsLoading(false)
    }
  }

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formattedPhone = formatPhoneNumber(phone)

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      setVerificationStep(true)
      setSuccess("Se ha enviado un código de verificación a tu teléfono")
      setIsLoading(false)
    } catch (error: any) {
      setError(error.message || "Error al enviar el código de verificación")
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formatPhoneNumber(phone),
        token: verificationCode,
        type: "sms",
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      toast({
        title: "Verificación exitosa",
        description: "Has iniciado sesión correctamente.",
      })

      router.push(redirectTo)
    } catch (error: any) {
      setError(error.message || "Código de verificación inválido")
      setIsLoading(false)
    }
  }

  const formatPhoneNumber = (phoneNumber: string) => {
    // Asegurarse de que el número tenga el formato internacional correcto
    if (!phoneNumber.startsWith("+")) {
      // Asumimos Colombia (+57) como predeterminado
      return `+57${phoneNumber}`
    }
    return phoneNumber
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-10 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <Card className="w-full shadow-xl border border-gray-100">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Image
                src="/abstract-geometric-logo.png"
                alt="Holamigo Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <CardTitle className="text-2xl text-center">Bienvenido a Holamigo</CardTitle>
            <CardDescription className="text-center">Inicia sesión o crea una cuenta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              {/* Botones de redes sociales */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-3 h-12 text-base hover:bg-gray-50 transition-all duration-200"
                  onClick={() => handleSocialSignIn("google")}
                  disabled={loadingProvider !== null}
                >
                  {loadingProvider === "google" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Image src="/google-logo.png" alt="Google" width={20} height={20} />
                  )}
                  Continuar con Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-3 h-12 text-base hover:bg-gray-50 transition-all duration-200"
                  onClick={() => handleSocialSignIn("facebook")}
                  disabled={loadingProvider !== null}
                >
                  {loadingProvider === "facebook" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Image src="/facebook-logo.png" alt="Facebook" width={20} height={20} />
                  )}
                  Continuar con Facebook
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-3 h-12 text-base hover:bg-gray-50 transition-all duration-200"
                  onClick={() => handleSocialSignIn("apple")}
                  disabled={loadingProvider !== null}
                >
                  {loadingProvider === "apple" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Image src="/apple-logo.png" alt="Apple" width={20} height={20} />
                  )}
                  Continuar con Apple
                </Button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">O continúa con</span>
                </div>
              </div>

              {/* Selector de método de autenticación */}
              <div className="flex rounded-md overflow-hidden border mb-4">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${
                    authMethod === "email" ? "bg-gray-100 font-medium" : "bg-white"
                  }`}
                  onClick={() => setAuthMethod("email")}
                >
                  <Mail className="h-4 w-4" />
                  Email
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${
                    authMethod === "phone" ? "bg-gray-100 font-medium" : "bg-white"
                  }`}
                  onClick={() => setAuthMethod("phone")}
                >
                  <Smartphone className="h-4 w-4" />
                  Teléfono
                </button>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="login">
                {authMethod === "email" ? (
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Correo electrónico
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="nombre@correo.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">
                          Contraseña
                        </Label>
                        <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline">
                          ¿Olvidaste tu contraseña?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Input
                        id="remember"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <Label htmlFor="remember" className="text-sm font-medium">
                        Recordarme
                      </Label>
                    </div>

                    <Button type="submit" className="w-full bg-[#F47B20] hover:bg-[#e06a10]" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Iniciando sesión...
                        </>
                      ) : (
                        "Iniciar sesión"
                      )}
                    </Button>

                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm text-blue-600"
                        onClick={(e) => {
                          e.preventDefault()
                          handleMagicLinkSignIn(e)
                        }}
                        disabled={isLoading || !email}
                      >
                        Iniciar sesión con enlace mágico
                      </Button>
                    </div>
                  </form>
                ) : verificationStep ? (
                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-sm font-medium">
                        Código de verificación
                      </Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="Ingresa el código de 6 dígitos"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-[#F47B20] hover:bg-[#e06a10]" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        "Verificar código"
                      )}
                    </Button>

                    <Button type="button" variant="link" className="w-full" onClick={() => setVerificationStep(false)}>
                      Volver a enviar código
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handlePhoneSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Número de teléfono
                      </Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="3001234567"
                          className="pl-10"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">Te enviaremos un código de verificación por SMS</p>
                    </div>

                    <Button type="submit" className="w-full bg-[#F47B20] hover:bg-[#e06a10]" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando código...
                        </>
                      ) : (
                        "Enviar código"
                      )}
                    </Button>
                  </form>
                )}
              </TabsContent>

              <TabsContent value="register">
                {authMethod === "email" ? (
                  <form onSubmit={handleEmailSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Nombre completo
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Juan Pérez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-sm font-medium">
                        Correo electrónico
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="nombre@correo.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-sm font-medium">
                        Contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">La contraseña debe tener al menos 6 caracteres</p>
                    </div>

                    <Button type="submit" className="w-full bg-[#F47B20] hover:bg-[#e06a10]" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registrando...
                        </>
                      ) : (
                        "Registrarse"
                      )}
                    </Button>
                  </form>
                ) : verificationStep ? (
                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-code" className="text-sm font-medium">
                        Código de verificación
                      </Label>
                      <Input
                        id="register-code"
                        type="text"
                        placeholder="Ingresa el código de 6 dígitos"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-[#F47B20] hover:bg-[#e06a10]" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        "Verificar código"
                      )}
                    </Button>

                    <Button type="button" variant="link" className="w-full" onClick={() => setVerificationStep(false)}>
                      Volver a enviar código
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handlePhoneSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-sm font-medium">
                        Nombre completo
                      </Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Juan Pérez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-phone" className="text-sm font-medium">
                        Número de teléfono
                      </Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="register-phone"
                          type="tel"
                          placeholder="3001234567"
                          className="pl-10"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">Te enviaremos un código de verificación por SMS</p>
                    </div>

                    <Button type="submit" className="w-full bg-[#F47B20] hover:bg-[#e06a10]" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando código...
                        </>
                      ) : (
                        "Enviar código"
                      )}
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-500">
              Al continuar, aceptas nuestros{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Términos de servicio
              </Link>{" "}
              y{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Política de privacidad
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
