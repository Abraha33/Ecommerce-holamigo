"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { AuthService } from "@/lib/auth-service"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number
    message: string
    color: string
  }>({
    score: 0,
    message: "",
    color: "",
  })

  useEffect(() => {
    // Check if we have a valid hash in the URL
    const hash = window.location.hash
    if (!hash || !hash.includes("type=recovery")) {
      setError("Enlace de recuperación inválido o expirado")
    }
  }, [])

  useEffect(() => {
    // Password strength checker
    if (!password) {
      setPasswordStrength({ score: 0, message: "", color: "" })
      return
    }

    let score = 0
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    let message = ""
    let color = ""

    if (score <= 2) {
      message = "Débil"
      color = "text-red-500"
    } else if (score <= 3) {
      message = "Media"
      color = "text-yellow-500"
    } else {
      message = "Fuerte"
      color = "text-green-500"
    }

    setPasswordStrength({ score, message, color })
  }, [password])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (passwordStrength.score < 3) {
      setError("La contraseña es demasiado débil. Intenta con una combinación de letras, números y símbolos.")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await AuthService.updatePassword(password)

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setIsLoading(false)

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/auth")
      }, 3000)
    } catch (error: any) {
      setError(error.message || "Error al restablecer la contraseña")
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-10">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Restablecer contraseña</CardTitle>
            <CardDescription className="text-center">Crea una nueva contraseña para tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-green-600"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">Contraseña actualizada</h3>
                <p className="text-gray-600">
                  Tu contraseña ha sido actualizada correctamente. Serás redirigido a la página de inicio de sesión.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
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
                  {password && (
                    <div className="mt-1">
                      <p className={`text-sm ${passwordStrength.color}`}>Fortaleza: {passwordStrength.message}</p>
                      <div className="w-full h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full ${
                            passwordStrength.score <= 2
                              ? "bg-red-500"
                              : passwordStrength.score <= 3
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-sm text-red-500">Las contraseñas no coinciden</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    "Actualizar contraseña"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => router.push("/auth")}>
              Volver a inicio de sesión
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
