"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Upload, Edit2 } from "lucide-react"
import AccountSidebar from "@/components/account-sidebar"
import { EditProfileModal } from "@/components/edit-profile-modal"
import { Badge } from "@/components/ui/badge"

export default function AccountPage() {
  const { user } = useAuth()
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)
  const [rutStatus, setRutStatus] = useState<"pending" | "approved" | "rejected" | "not_submitted">("pending")

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario"
  const email = user?.email || "correo@ejemplo.com"
  const phone = user?.user_metadata?.phone || "300 123 4567"
  const rut = user?.user_metadata?.rut || "76.543.210-8"
  const clientSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
      })
    : "Enero 2023"

  const getRutStatusBadge = () => {
    switch (rutStatus) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Aprobado</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rechazado</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">En revisión</Badge>
      case "not_submitted":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">No enviado</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner superior con gradiente */}
      <div className="bg-gradient-to-r from-red-100 to-red-50 text-red-600 py-3 px-4 text-center font-semibold shadow-sm">
        ¡ERES UN CLIENTE MAYORISTA!
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar compartido */}
          <AccountSidebar />

          {/* Contenido principal */}
          <div className="flex-1 space-y-8">
            {/* Información personal */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-semibold mb-8 text-gray-800 border-b pb-4">Información personal</h2>

              <div className="flex flex-col md:flex-row gap-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 flex-1">
                  <div className="transition-all duration-200 hover:bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Nombre completo</p>
                    <p className="font-medium text-gray-800">{displayName}</p>
                  </div>

                  <div className="transition-all duration-200 hover:bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Correo electrónico</p>
                    <p className="font-medium text-gray-800">{email}</p>
                  </div>

                  <div className="transition-all duration-200 hover:bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Teléfono</p>
                    <p className="font-medium text-gray-800">{phone}</p>
                  </div>

                  <div className="transition-all duration-200 hover:bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Cliente desde</p>
                    <p className="font-medium text-gray-800">{clientSince}</p>
                  </div>

                  <div className="transition-all duration-200 hover:bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">RUT</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800">{rut}</p>
                      {getRutStatusBadge()}
                    </div>
                  </div>

                  <div className="transition-all duration-200 hover:bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Tipo de cliente</p>
                    <p className="font-medium text-red-600">Mayorista</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 px-6"
                    onClick={() => setIsEditProfileModalOpen(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar perfil
                  </Button>
                </div>
              </div>
            </div>

            {/* Documentos comerciales */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-semibold mb-8 text-gray-800 border-b pb-4">Documentos comerciales</h2>

              <div className="space-y-8">
                <div>
                  <p className="font-medium mb-3 text-gray-800">RUT (Registro Único Tributario)</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 transition-colors duration-300 hover:border-blue-300 group">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-all duration-300">
                      <Upload
                        className="text-blue-500 group-hover:scale-110 transition-transform duration-300"
                        size={28}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                      Arrastra y suelta tu archivo RUT aquí o
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shadow-sm hover:shadow-md transition-all duration-200 border-blue-200 hover:border-blue-300 hover:bg-blue-100"
                    >
                      Seleccionar archivo
                    </Button>
                    <p className="text-xs text-gray-400 mt-3 group-hover:text-gray-600 transition-colors duration-300">
                      Formatos aceptados: PDF, JPG, PNG (máx. 10MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición de perfil */}
      <EditProfileModal isOpen={isEditProfileModalOpen} onClose={() => setIsEditProfileModalOpen(false)} />
    </div>
  )
}
