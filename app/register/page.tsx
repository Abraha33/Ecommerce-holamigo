"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, X, Shield, Loader2, Eye, EyeOff, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"

// Funciones de validación
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidName = (name: string): boolean => {
  return name.trim().length >= 3
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })

  // Estados para validación en tiempo real
  const [fieldTouched, setFieldTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    acceptTerms: false,
  })

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: "",
  })

  const [formValid, setFormValid] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value

    setFormData((prev) => ({ ...prev, [name]: newValue }))
  }

  // Marcar un campo como tocado
  const handleBlur = (field: string) => {
    setFieldTouched((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  // Validar la fortaleza de la contraseña
  useEffect(() => {
    const password = formData.password

    // Verificar requisitos individuales
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }

    setPasswordRequirements(requirements)

    // Calcular fortaleza (0-100)
    const requirementCount = Object.values(requirements).filter(Boolean).length
    setPasswordStrength(requirementCount * 20)
  }, [formData.password])

  // Validar todos los campos cuando cambian
  useEffect(() => {
    const errors = { ...fieldErrors }

    // Validar nombre
    if (fieldTouched.name) {
      if (!formData.name.trim()) {
        errors.name = "El nombre es obligatorio"
      } else if (!isValidName(formData.name)) {
        errors.name = "El nombre debe tener al menos 3 caracteres"
      } else {
        errors.name = ""
      }
    }

    // Validar email
    if (fieldTouched.email) {
      if (!formData.email.trim()) {
        errors.email = "El correo electrónico es obligatorio"
      } else if (!isValidEmail(formData.email)) {
        errors.email = "Ingresa un correo electrónico válido"
      } else {
        errors.email = ""
      }
    }

    // Validar contraseña
    if (fieldTouched.password) {
      if (!formData.password) {
        errors.password = "La contraseña es obligatoria"
      } else if (passwordStrength < 60) {
        errors.password = "La contraseña no cumple con los requisitos mínimos de seguridad"
      } else {
        errors.password = ""
      }
    }

    // Validar confirmación de contraseña
    if (fieldTouched.confirmPassword) {
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Debes confirmar tu contraseña"
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Las contraseñas no coinciden"
      } else {
        errors.confirmPassword = ""
      }
    }

    // Validar términos
    if (fieldTouched.acceptTerms) {
      if (!formData.acceptTerms) {
        errors.acceptTerms = "Debes aceptar los términos y condiciones"
      } else {
        errors.acceptTerms = ""
      }
    }

    setFieldErrors(errors)

    // Verificar si el formulario es válido
    const isValid =
      isValidName(formData.name) &&
      isValidEmail(formData.email) &&
      passwordStrength >= 60 &&
      formData.password === formData.confirmPassword &&
      formData.acceptTerms

    setFormValid(isValid)
  }, [formData, fieldTouched, passwordStrength])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Marcar todos los campos como tocados para mostrar errores
    setFieldTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true,
    })

    // Verificar si el formulario es válido
    if (!formValid) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Registrar al usuario con Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      // Verificar si se requiere confirmación de correo electrónico
      if (data?.user?.identities?.length === 0) {
        setError("Este correo electrónico ya está registrado.")
        setIsLoading(false)
        return
      }

      // Establecer que se ha enviado la verificación
      setVerificationSent(true)
    } catch (err) {
      setError("Error al crear la cuenta. Por favor intente de nuevo.")
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
          redirectTo: `${window.location.origin}/auth/callback`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-950 py-6 sm:py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-5 sm:mb-6 md:mb-8 text-white drop-shadow-md">
          Crear una cuenta
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
          {/* Columna izquierda: Formulario de registro */}
          <div className="rounded-xl p-4 sm:p-6 md:p-8 bg-white/90 backdrop-blur-sm shadow-2xl shadow-blue-900/30 border-0">
            {error && (
              <div className="p-3 sm:p-4 rounded-lg bg-red-50 text-red-600 text-sm mb-4 sm:mb-6 border-l-4 border-red-500">
                {error}
              </div>
            )}

            {verificationSent ? (
              <div className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 md:space-y-6">
                <div className="w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 bg-blue-50 rounded-full flex items-center justify-center mb-2">
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
                    className="h-7 sm:h-8 md:h-10 w-7 sm:w-8 md:w-10 text-blue-600"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-blue-900">
                  Verifica tu correo electrónico
                </h3>
                <p className="text-blue-700 text-sm sm:text-base">
                  Hemos enviado un enlace de verificación a{" "}
                  <span className="font-medium text-blue-800">{formData.email}</span>
                </p>
                <p className="text-blue-700 text-sm sm:text-base">
                  Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                </p>

                <div className="border-t border-blue-100 w-full my-4 sm:my-5 md:my-6 pt-4 sm:pt-5 md:pt-6">
                  <p className="text-xs sm:text-sm text-blue-600 mb-3 sm:mb-4">
                    ¿No recibiste el correo de verificación?
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 text-sm sm:text-base"
                    onClick={() => {
                      // Simulate resending verification email
                      setIsLoading(true)
                      setTimeout(() => {
                        setIsLoading(false)
                        // Show a message that would normally come from toast
                        toast({
                          title: "Correo reenviado",
                          description: "Hemos enviado nuevamente el correo de verificación",
                        })
                      }, 1500)
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Reenviando...
                      </>
                    ) : (
                      "Reenviar correo de verificación"
                    )}
                  </Button>
                </div>

                <div className="w-full">
                  <Link href="/login" className="w-full">
                    <Button
                      variant="secondary"
                      className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 text-sm sm:text-base"
                    >
                      Ir a iniciar sesión
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-blue-900">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Juan Pérez"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur("name")}
                      required
                      className={`border-blue-200 focus:ring-blue-500 focus:border-blue-500 bg-white/80 ${
                        fieldTouched.name && fieldErrors.name
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : fieldTouched.name && !fieldErrors.name
                            ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                            : ""
                      }`}
                      aria-invalid={fieldTouched.name && !!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? "name-error" : undefined}
                    />
                    {fieldTouched.name && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        {fieldErrors.name ? (
                          <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
                        )}
                      </div>
                    )}
                  </div>
                  {fieldTouched.name && fieldErrors.name && (
                    <p id="name-error" className="text-xs sm:text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-blue-900">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@correo.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      required
                      className={`border-blue-200 focus:ring-blue-500 focus:border-blue-500 bg-white/80 ${
                        fieldTouched.email && fieldErrors.email
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : fieldTouched.email && !fieldErrors.email
                            ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                            : ""
                      }`}
                      aria-invalid={fieldTouched.email && !!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    />
                    {fieldTouched.email && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        {fieldErrors.email ? (
                          <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
                        )}
                      </div>
                    )}
                  </div>
                  {fieldTouched.email && fieldErrors.email && (
                    <p id="email-error" className="text-xs sm:text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-blue-900">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur("password")}
                      required
                      className={`border-blue-200 focus:ring-blue-500 focus:border-blue-500 pr-10 bg-white/80 ${
                        fieldTouched.password && fieldErrors.password
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : fieldTouched.password && !fieldErrors.password
                            ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                            : ""
                      }`}
                      aria-invalid={fieldTouched.password && !!fieldErrors.password}
                      aria-describedby={fieldErrors.password ? "password-error" : undefined}
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

                  {/* Indicador de fortaleza de contraseña */}
                  {formData.password.length > 0 && (
                    <div className="mt-2 sm:mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-blue-800">
                          Fortaleza:{" "}
                          {passwordStrength < 40 ? (
                            <span className="text-red-500">Débil</span>
                          ) : passwordStrength < 80 ? (
                            <span className="text-yellow-500">Media</span>
                          ) : (
                            <span className="text-green-500">Fuerte</span>
                          )}
                        </span>
                        <span className="text-xs font-medium text-blue-700">{passwordStrength}%</span>
                      </div>
                      <div className="w-full bg-blue-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            passwordStrength < 40
                              ? "bg-red-500"
                              : passwordStrength < 80
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Lista de requisitos */}
                  {formData.password.length > 0 && (
                    <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-2 text-xs sm:text-sm bg-blue-50 p-3 sm:p-4 rounded-lg">
                      <p className="font-medium flex items-center gap-1 text-blue-800">
                        <Shield size={14} className="text-blue-600" />
                        Requisitos de seguridad:
                      </p>
                      <ul className="space-y-1 pl-3 sm:pl-5">
                        <li className="flex items-center gap-1.5">
                          {passwordRequirements.length ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <X size={14} className="text-red-500" />
                          )}
                          <span
                            className={
                              passwordRequirements.length ? "text-blue-700 font-medium" : "text-blue-500 opacity-70"
                            }
                          >
                            Mínimo 8 caracteres
                          </span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          {passwordRequirements.uppercase ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <X size={14} className="text-red-500" />
                          )}
                          <span
                            className={
                              passwordRequirements.uppercase ? "text-blue-700 font-medium" : "text-blue-500 opacity-70"
                            }
                          >
                            Al menos una letra mayúscula (A-Z)
                          </span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          {passwordRequirements.lowercase ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <X size={14} className="text-red-500" />
                          )}
                          <span
                            className={
                              passwordRequirements.lowercase ? "text-blue-700 font-medium" : "text-blue-500 opacity-70"
                            }
                          >
                            Al menos una letra minúscula (a-z)
                          </span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          {passwordRequirements.number ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <X size={14} className="text-red-500" />
                          )}
                          <span
                            className={
                              passwordRequirements.number ? "text-blue-700 font-medium" : "text-blue-500 opacity-70"
                            }
                          >
                            Al menos un número (0-9)
                          </span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          {passwordRequirements.special ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <X size={14} className="text-red-500" />
                          )}
                          <span
                            className={
                              passwordRequirements.special ? "text-blue-700 font-medium" : "text-blue-500 opacity-70"
                            }
                          >
                            Al menos un carácter especial (!@#$%^&*)
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {fieldTouched.password && fieldErrors.password && (
                    <p id="password-error" className="text-xs sm:text-sm text-red-500 mt-2 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-900">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => handleBlur("confirmPassword")}
                      required
                      className={`border-blue-200 focus:ring-blue-500 focus:border-blue-500 pr-10 bg-white/80 ${
                        fieldTouched.confirmPassword && fieldErrors.confirmPassword
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : fieldTouched.confirmPassword && !fieldErrors.confirmPassword
                            ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                            : ""
                      }`}
                      aria-invalid={fieldTouched.confirmPassword && !!fieldErrors.confirmPassword}
                      aria-describedby={fieldErrors.confirmPassword ? "confirm-password-error" : undefined}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {fieldTouched.confirmPassword && fieldErrors.confirmPassword && (
                    <p
                      id="confirm-password-error"
                      className="text-xs sm:text-sm text-red-500 mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({ ...prev, acceptTerms: checked === true }))
                      handleBlur("acceptTerms")
                    }}
                    className={`text-blue-600 border-blue-300 focus:ring-blue-500 ${
                      fieldTouched.acceptTerms && fieldErrors.acceptTerms ? "border-red-300" : ""
                    }`}
                    aria-invalid={fieldTouched.acceptTerms && !!fieldErrors.acceptTerms}
                    aria-describedby={fieldErrors.acceptTerms ? "terms-error" : undefined}
                  />
                  <label htmlFor="terms" className="text-xs sm:text-sm font-normal cursor-pointer text-blue-700">
                    Acepto los{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline font-medium">
                      términos y condiciones
                    </Link>
                  </label>
                </div>
                {fieldTouched.acceptTerms && fieldErrors.acceptTerms && (
                  <p id="terms-error" className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {fieldErrors.acceptTerms}
                  </p>
                )}

                <Button
                  type="submit"
                  className={`w-full transition-all duration-200 shadow-md hover:shadow-lg shadow-blue-500/20 mt-4 py-2 sm:py-2.5 text-sm sm:text-base ${
                    formValid
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-400 cursor-not-allowed hover:bg-blue-400 text-white"
                  }`}
                  disabled={isLoading || !formValid}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    "Registrarse"
                  )}
                </Button>
              </form>
            )}

            {!verificationSent && !success && (
              <>
                <div className="relative my-5 sm:my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-blue-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-blue-600">O regístrate con</span>
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
              </>
            )}

            {!verificationSent && (
              <div className="mt-5 sm:mt-6 text-center">
                <p className="text-xs sm:text-sm text-blue-600">
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/login" className="font-medium text-blue-700 hover:text-blue-800 hover:underline">
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Columna derecha: Beneficios */}
          <div className="rounded-xl p-4 sm:p-6 md:p-8 bg-white/90 backdrop-blur-sm shadow-2xl shadow-blue-900/30 border-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-blue-900">
              Beneficios de tener tu cuenta
            </h2>

            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-md shadow-blue-500/10 flex-shrink-0">
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
                  <p className="font-medium text-blue-800 text-base sm:text-lg">Ruta de entrega</p>
                  <p className="text-blue-600 text-xs sm:text-sm md:text-base">
                    Configura y guarda tu ruta de entrega preferida para pedidos más rápidos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-md shadow-blue-500/10 flex-shrink-0">
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
                  <p className="font-medium text-blue-800 text-base sm:text-lg">Direcciones y pagos</p>
                  <p className="text-blue-600 text-xs sm:text-sm md:text-base">
                    Guarda tus direcciones y medios de pago favoritos para compras sin esfuerzo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-md shadow-blue-500/10 flex-shrink-0">
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
                  <p className="font-medium text-blue-800 text-base sm:text-lg">Promociones exclusivas</p>
                  <p className="text-blue-600 text-xs sm:text-sm md:text-base">
                    Accede a promociones y descuentos exclusivos para usuarios registrados.
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 md:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-blue-700 text-xs sm:text-sm">
                  Al crear una cuenta, podrás realizar un seguimiento de tus pedidos, guardar tus productos favoritos y
                  recibir recomendaciones personalizadas basadas en tus preferencias de compra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
