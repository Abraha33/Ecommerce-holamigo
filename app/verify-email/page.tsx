"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, Mail, AlertCircle, ArrowRight, Loader2, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const email = searchParams.get("email") || ""
  const [verificationCode, setVerificationCode] = useState<string[]>(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [inputRefs, setInputRefs] = useState<(HTMLInputElement | null)[]>([])

  // Initialize input refs
  useEffect(() => {
    setInputRefs(Array(6).fill(null))
  }, [])

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If pasting multiple digits
      const digits = value.split("").slice(0, 6)
      const newCode = [...verificationCode]

      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit
        }
      })

      setVerificationCode(newCode)

      // Focus on the next empty input or the last one
      const nextIndex = Math.min(index + digits.length, 5)
      if (inputRefs[nextIndex]) {
        inputRefs[nextIndex]?.focus()
      }
    } else {
      // Single digit input
      if (/^[0-9]$/.test(value) || value === "") {
        const newCode = [...verificationCode]
        newCode[index] = value
        setVerificationCode(newCode)

        // Auto-focus next input
        if (value !== "" && index < 5) {
          inputRefs[index + 1]?.focus()
        }
      }
    }
  }

  // Handle key down
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && verificationCode[index] === "" && index > 0) {
      // Move to previous input when backspace is pressed on empty input
      inputRefs[index - 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      // Move to previous input with left arrow
      inputRefs[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      // Move to next input with right arrow
      inputRefs[index + 1]?.focus()
    }
  }

  // Verify code
  const verifyCode = () => {
    const code = verificationCode.join("")

    if (code.length !== 6) {
      setError("Por favor ingresa el código completo de 6 dígitos")
      return
    }

    setIsVerifying(true)
    setError(null)

    // Simulate API call to verify code
    setTimeout(() => {
      // For demo purposes, any code is valid
      // In a real app, you would verify the code with your backend
      setIsVerifying(false)
      setSuccess(true)

      toast({
        title: "Correo verificado",
        description: "Tu correo electrónico ha sido verificado correctamente.",
        variant: "default",
      })

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }, 1500)
  }

  // Resend verification code
  const resendCode = () => {
    setIsResending(true)

    // Simulate API call to resend code
    setTimeout(() => {
      setIsResending(false)
      setTimeLeft(300) // Reset timer to 5 minutes

      toast({
        title: "Código reenviado",
        description: "Hemos enviado un nuevo código de verificación a tu correo electrónico.",
        variant: "default",
      })
    }, 1500)
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-10">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
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
              <CardTitle className="text-2xl text-center">Verifica tu correo electrónico</CardTitle>
              <CardDescription className="text-center">
                Hemos enviado un código de verificación a <span className="font-medium">{email}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {success ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">¡Verificación exitosa!</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Tu correo electrónico ha sido verificado correctamente. Serás redirigido al inicio de sesión.
                  </p>
                  <div className="w-8 h-8">
                    <svg className="animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  </div>
                </motion.div>
              ) : (
                <>
                  <div className="flex justify-center mb-2">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                      <Mail className="h-8 w-8 text-ecoplast-blue" />
                    </div>
                  </div>

                  <p className="text-center text-sm text-gray-600 mb-4">
                    Ingresa el código de 6 dígitos que enviamos a tu correo electrónico para verificar tu cuenta.
                  </p>

                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-center gap-2">
                    {verificationCode.map((digit, index) => (
                      <Input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        ref={(el) => {
                          inputRefs[index] = el
                        }}
                        className="w-12 h-12 text-center text-lg font-semibold"
                      />
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <p className="text-sm text-gray-500">
                      El código expira en <span className="font-medium">{formatTime(timeLeft)}</span>
                    </p>
                  </div>

                  <Button
                    className="w-full bg-ecoplast-blue hover:bg-blue-700 mt-4 flex items-center justify-center gap-2"
                    onClick={verifyCode}
                    disabled={isVerifying || verificationCode.join("").length !== 6}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Verificando...</span>
                      </>
                    ) : (
                      <>
                        <span>Verificar correo</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600 mb-2">¿No recibiste el código?</p>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={resendCode}
                      disabled={isResending || timeLeft > 0}
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Reenviando...</span>
                        </>
                      ) : timeLeft > 0 ? (
                        <>
                          <span>Reenviar código en {formatTime(timeLeft)}</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          <span>Reenviar código</span>
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm text-gray-500">
                Si no recibiste el correo, revisa tu carpeta de spam o solicita un nuevo código.
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
