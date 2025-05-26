"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AccountSidebar from "@/components/account-sidebar"
import { User, Mail, Phone, MapPin, Calendar, Building, Camera, Edit3, Save, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Juan Pérez",
    email: "juan.perez@email.com",
    phone: "+57 300 123 4567",
    address: "Calle 123 #45-67, Bogotá",
    company: "Mi Empresa SAS",
    bio: "Empresario dedicado al comercio electrónico y la innovación tecnológica.",
  })
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=120&width=120")

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Perfil actualizado",
      description: "Tu información ha sido guardada exitosamente",
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      toast({
        title: "Foto actualizada",
        description: "Tu foto de perfil ha sido actualizada",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-100 to-red-50 text-red-600 py-3 px-4 text-center font-semibold shadow-sm">
        ¡ERES UN CLIENTE MAYORISTA!
      </div>

      <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 lg:flex-shrink-0">
            <AccountSidebar />
          </div>

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mi Cuenta</h1>
                  <p className="text-gray-600">Administra tu información personal y preferencias</p>
                </div>
                <Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))} className="w-fit">
                  {isEditing ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar
                    </>
                  ) : (
                    <>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Editar Perfil
                    </>
                  )}
                </Button>
              </div>

              {/* Foto de perfil */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Foto de Perfil
                  </CardTitle>
                  <CardDescription>Actualiza tu foto de perfil para personalizar tu cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 border-blue-200 shadow-lg">
                        <AvatarImage src={profileImage || "/placeholder.svg"} alt="Foto de perfil" />
                        <AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-700">
                          {profileData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="profile-upload"
                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                      >
                        <Camera className="h-4 w-4 text-white" />
                        <input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-semibold text-lg text-gray-900">{profileData.name}</h3>
                      <p className="text-gray-600">{profileData.email}</p>
                      <p className="text-sm text-gray-500 mt-1">Formatos soportados: JPG, PNG, GIF (máx. 5MB)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información personal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información Personal
                  </CardTitle>
                  <CardDescription>Mantén tu información actualizada para una mejor experiencia</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nombre completo
                      </Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Correo electrónico
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Empresa
                      </Label>
                      <Input
                        id="company"
                        value={profileData.company}
                        onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Dirección
                    </Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio" className="flex items-center gap-2">
                      <Edit3 className="h-4 w-4" />
                      Biografía
                    </Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                      rows={3}
                      placeholder="Cuéntanos un poco sobre ti..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas de cuenta */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pedidos realizados</p>
                        <p className="text-2xl font-bold text-gray-900">24</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total gastado</p>
                        <p className="text-2xl font-bold text-gray-900">$2,450,000</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Puntos acumulados</p>
                        <p className="text-2xl font-bold text-gray-900">1,250</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <User className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar cambios
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
