"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AccountSidebar from "@/components/account-sidebar"

export default function ChangeEmailPage() {
  const { user } = useAuth()
  const [newEmail, setNewEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error de sesión",
        description: "No se pudo detectar tu sesión. Por favor, inicia sesión nuevamente.",
        variant: "destructive",
      })
      return
    }

    if (newEmail !== confirmEmail) {
      toast({
        title: "Error de validación",
        description: "Los correos electrónicos no coinciden.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Update email for electronic invoicing in profiles table
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        invoice_email: newEmail,
        updated_at: new Date().toISOString(),
      })

      if (profileError) throw profileError

      setIsSuccess(true)
      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud para cambiar el email de facturación electrónica ha sido enviada correctamente.",
      })
    } catch (error) {
      console.error("Error updating email:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar tu email para facturación electrónica. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar - 1/4 del ancho en pantallas medianas y grandes */}
        <div className="w-full md:w-1/4">
          <AccountSidebar />
        </div>

        {/* Contenido principal - 3/4 del ancho en pantallas medianas y grandes */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Encabezado con borde inferior */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <Link href="/account" className="mr-4">
                  <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                </Link>
                <h1 className="text-2xl font-semibold text-gray-800">Cambiar Email para Facturación Electrónica</h1>
              </div>
            </div>

            {/* Contenido del formulario */}
            {isSuccess ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Solicitud Enviada</h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  Tu solicitud para cambiar el email de facturación electrónica ha sido enviada correctamente. Recibirás
                  una confirmación cuando sea procesada.
                </p>
                <Button onClick={() => router.push("/account")} className="bg-[#4CB5F9] hover:bg-[#3a9fe0]">
                  Volver a mi cuenta
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Este email será utilizado para recibir tus facturas electrónicas. Este cambio no afecta al email con
                    el que inicias sesión en tu cuenta.
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="currentEmail">Email actual</Label>
                    <Input id="currentEmail" value={user?.email || ""} className="bg-gray-50" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newEmail">Nuevo email para facturación</Label>
                    <Input
                      id="newEmail"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="nuevo@correo.com"
                      className="bg-gray-50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmEmail">Confirmar nuevo email</Label>
                    <Input
                      id="confirmEmail"
                      type="email"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      placeholder="nuevo@correo.com"
                      className="bg-gray-50"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 text-base bg-[#4CB5F9] hover:bg-[#3a9fe0]"
                >
                  {isLoading ? "Enviando solicitud..." : "Enviar solicitud"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
