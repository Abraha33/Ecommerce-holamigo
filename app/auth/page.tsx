"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Smartphone, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
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

  // Formulario de email
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Formulario de teléfono
  const [phone, setPhone] = useState("")

  const handleSocialSignIn = async (provider: "google" | "facebook" | "apple") => {
    setLoadingProvider(provider)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(`Error al iniciar sesión con ${provider}: ${error.message}`)
      setLoadingProvider(null)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push("/")
    } catch (error: any) {
      setError(error.message || "Error al iniciar sesión")
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
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setSuccess("Se ha enviado un enlace de verificación a tu correo electrónico")
      setIsLoading(false)
    } catch (error: any) {
      setError(error.message || "Error al registrarse")
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

      if (error) throw error

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
      const { error } = await supabase.auth.verifyOtp({
        phone: formatPhoneNumber(phone),
        token: verificationCode,
        type: "sms",
      })

      if (error) throw error

      router.push("/")
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
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <Card className="w-full">
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
              <div className="grid grid-cols-1 gap-3 mb-4">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 h-11"
                  onClick={() => handleSocialSignIn("google")}
                  disabled={loadingProvider !== null}
                >
                  {loadingProvider === "google" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Image src="/google-logo.png" alt="Google" width={20} height={20} />
                  )}
                  Continuar con Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 h-11"
                  onClick={() => handleSocialSignIn("facebook")}
                  disabled={loadingProvider !== null}
                >
                  {loadingProvider === "facebook" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Image src="/facebook-logo.png" alt="Facebook" width={20} height={20} />
                  )}
                  Continuar con Facebook
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 h-11"
                  onClick={() => handleSocialSignIn("apple")}
                  disabled={loadingProvider !== null}
                >
                  {loadingProvider === "apple" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
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
                      <label htmlFor="email" className="text-sm font-medium">
                        Correo electrónico
                      </label>
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
                        <label htmlFor="password" className="text-sm font-medium">
                          Contraseña
                        </label>
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
                  </form>
                ) : verificationStep ? (
                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="code" className="text-sm font-medium">
                        Código de verificación
                      </label>
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
                      <label htmlFor="phone" className="text-sm font-medium">
                        Número de teléfono
                      </label>
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
                      <label htmlFor="register-email" className="text-sm font-medium">
                        Correo electrónico
                      </label>
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
                      <label htmlFor="register-password" className="text-sm font-medium">
                        Contraseña
                      </label>
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
                      <label htmlFor="register-code" className="text-sm font-medium">
                        Código de verificación
                      </label>
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
                      <label htmlFor="register-phone" className="text-sm font-medium">
                        Número de teléfono
                      </label>
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
