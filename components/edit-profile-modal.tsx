"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, refreshUser } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [documentType, setDocumentType] = useState("C.C")
  const [documentNumber, setDocumentNumber] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState("Masculino")
  const [birthDate, setBirthDate] = useState("")
  const [phone, setPhone] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Validation states
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    documentNumber: "",
    phone: "",
    birthDate: "",
  })

  useEffect(() => {
    if (user) {
      // Split full name into first and last name if available
      const fullName = user.user_metadata?.display_name || user.user_metadata?.full_name || ""
      const nameParts = fullName.split(" ")
      setFirstName(nameParts[0] || "")
      setLastName(nameParts.slice(1).join(" ") || "")

      setEmail(user.email || "")
      setPhone(user.user_metadata?.phone || "")
      setDocumentType(user.user_metadata?.document_type || "C.C")
      setDocumentNumber(user.user_metadata?.document_number || "")
      setGender(user.user_metadata?.gender || "Masculino")
      setBirthDate(user.user_metadata?.birth_date || "")
      setTermsAccepted(true) // Assuming terms were accepted previously
    }
  }, [user])

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      firstName: "",
      lastName: "",
      documentNumber: "",
      phone: "",
      birthDate: "",
    }

    // Validate first name
    if (!firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio"
      isValid = false
    } else if (firstName.length < 2) {
      newErrors.firstName = "El nombre debe tener al menos 2 caracteres"
      isValid = false
    }

    // Validate last name
    if (!lastName.trim()) {
      newErrors.lastName = "El apellido es obligatorio"
      isValid = false
    } else if (lastName.length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres"
      isValid = false
    }

    // Validate document number
    if (!documentNumber.trim()) {
      newErrors.documentNumber = "El número de documento es obligatorio"
      isValid = false
    } else if (!/^\d+$/.test(documentNumber)) {
      newErrors.documentNumber = "El número de documento debe contener solo dígitos"
      isValid = false
    }

    // Validate phone
    if (phone && !/^\d{10}$/.test(phone)) {
      newErrors.phone = "El teléfono debe tener 10 dígitos"
      isValid = false
    }

    // Validate birth date
    if (birthDate) {
      const birthDateObj = new Date(birthDate)
      const today = new Date()
      const minAge = 18
      const maxAge = 100

      // Calculate age
      let age = today.getFullYear() - birthDateObj.getFullYear()
      const monthDiff = today.getMonth() - birthDateObj.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--
      }

      if (age < minAge) {
        newErrors.birthDate = "Debes tener al menos 18 años"
        isValid = false
      } else if (age > maxAge) {
        newErrors.birthDate = "La fecha de nacimiento no es válida"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!user) {
      toast({
        title: "Error de sesión",
        description: "No se pudo detectar tu sesión. Por favor, inicia sesión nuevamente.",
        variant: "destructive",
      })
      onClose()
      return
    }

    if (!termsAccepted) {
      toast({
        title: "Términos y condiciones",
        description: "Debes aceptar los términos y condiciones para continuar.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Combine first and last name
      const fullName = `${firstName} ${lastName}`.trim()

      // Create a new Supabase client for this operation
      const supabase = createClientComponentClient()

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          display_name: fullName,
          full_name: fullName,
          phone: phone,
          document_type: documentType,
          document_number: documentNumber,
          gender: gender,
          birth_date: birthDate,
        },
      })

      if (updateError) throw updateError

      // Update profile in profiles table if it exists
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user?.id,
        full_name: fullName,
        phone: phone,
        email: email,
        document_type: documentType,
        document_number: documentNumber,
        gender: gender,
        birth_date: birthDate,
        updated_at: new Date().toISOString(),
      })

      if (profileError) throw profileError

      if (typeof refreshUser === "function") {
        await refreshUser()
      }

      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada correctamente.",
      })

      onClose()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar tu perfil. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-center text-xl">Editar Perfil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Nombre"
                className={`bg-gray-50 ${errors.firstName ? "border-red-500" : ""}`}
                required
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Apellido"
                className={`bg-gray-50 ${errors.lastName ? "border-red-500" : ""}`}
                required
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentType">Tipo de documento</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="documentType" className="bg-gray-50">
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C.C">C.C</SelectItem>
                  <SelectItem value="T.I">T.I</SelectItem>
                  <SelectItem value="C.E">C.E</SelectItem>
                  <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentNumber">Cédula de ciudadanía</Label>
              <Input
                id="documentNumber"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="Número de documento"
                className={`bg-gray-50 ${errors.documentNumber ? "border-red-500" : ""}`}
                required
              />
              {errors.documentNumber && <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="bg-gray-50"
                disabled
              />
              <div className="flex justify-between items-center mt-1">
                <Link
                  href="/account/change-email"
                  className="text-xs text-blue-500 hover:text-blue-700 hover:underline"
                >
                  Cambiar email para facturación electrónica
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender" className="bg-gray-50">
                  <SelectValue placeholder="Selecciona género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                  <SelectItem value="Prefiero no decir">Prefiero no decir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Fecha de nacimiento</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={`bg-gray-50 ${errors.birthDate ? "border-red-500" : ""}`}
              />
              {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Tu número de teléfono"
                className={`bg-gray-50 ${errors.phone ? "border-red-500" : ""}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              className="mt-1"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Acepto{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  términos y condiciones
                </a>
                ,{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  términos y condiciones marketplace
                </a>{" "}
                y autorizo el tratamiento de{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  mis datos personales
                </a>
              </label>
            </div>
          </div>

          <div className="bg-gray-100 p-3 text-xs text-gray-600 rounded-md h-24 overflow-y-auto">
            <p>
              Intereses a quien Usted autoriza en Colombia o en el exterior, (iv) Cualquier otra finalidad que llegare a
              resultar en desarrollo del contrato o la relación comercial que se llegare a establecer con tales datos.
            </p>
            <p className="mt-2">
              Consulta nuestra política de protección de datos personales en www.grupoexito.com.co y ten presente que
              entre los canales para el ejercicio de tus derechos de habeas data a consultar, actualizar, corregir,
              rectificar, suprimir tus datos o revocar tu autorización, tenemos a tu disposición el correo electrónico
              proteccion.datos@grupo-exito.com
            </p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full py-6 text-base bg-[#4CB5F9] hover:bg-[#3a9fe0]">
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
