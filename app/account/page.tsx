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
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Camera,
  Edit3,
  Save,
  X,
  Package,
  CreditCard,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
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

  // Datos de ejemplo para pedidos
  const sampleOrders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      total: 125000,
      status: "Entregado",
      items: 3,
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      total: 89000,
      status: "En camino",
      items: 2,
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      total: 156000,
      status: "Procesando",
      items: 5,
    },
  ]

  // Datos de ejemplo para sucursales
  const sampleBranches = [
    {
      id: 1,
      name: "Sucursal Principal",
      address: "Calle 31 #15-09, Centro, Bucaramanga",
      phone: "+57 300 123 4567",
      isDefault: true,
    },
    {
      id: 2,
      name: "Sucursal Norte",
      address: "Carrera 27 #42-18, Cabecera, Bucaramanga",
      phone: "+57 300 987 6543",
      isDefault: false,
    },
  ]

  // Datos de ejemplo para métodos de pago
  const samplePaymentMethods = [
    {
      id: 1,
      type: "Tarjeta",
      name: "Visa terminada en 4242",
      isDefault: true,
    },
    {
      id: 2,
      type: "Nequi",
      name: "Nequi - 300 123 4567",
      isDefault: false,
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <div className="space-y-6">
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
          </div>
        )

      case "orders":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Mis Pedidos
              </CardTitle>
              <CardDescription>Historial de tus pedidos recientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-lg">Pedido {order.id}</h4>
                        <p className="text-sm text-gray-600">Fecha: {order.date}</p>
                        <p className="text-sm text-gray-600">{order.items} productos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(order.total)}</p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "Entregado"
                              ? "bg-green-100 text-green-800"
                              : order.status === "En camino"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                      <Button variant="outline" size="sm">
                        Reordenar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/orders">
                  <Button variant="outline">Ver todos los pedidos</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )

      case "branches":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Sucursales
              </CardTitle>
              <CardDescription>Gestiona las sucursales de tu empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleBranches.map((branch) => (
                  <div key={branch.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-lg flex items-center gap-2">
                          {branch.name}
                          {branch.isDefault && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Principal</span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {branch.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          <Phone className="h-4 w-4 inline mr-1" />
                          {branch.phone}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        {!branch.isDefault && (
                          <Button variant="outline" size="sm">
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/account/branches">
                  <Button>Gestionar sucursales</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )

      case "payment":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Métodos de Pago
              </CardTitle>
              <CardDescription>Administra tus métodos de pago</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {samplePaymentMethods.map((method) => (
                  <div key={method.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {method.name}
                          {method.isDefault && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Predeterminado
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600">{method.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        {!method.isDefault && (
                          <Button variant="outline" size="sm">
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/account/payment-methods">
                  <Button>Gestionar métodos de pago</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
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
                {activeTab === "personal" && (
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
                )}
              </div>

              {/* Pestañas de navegación */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("personal")}
                    className={`border-b-2 py-2 px-1 text-sm font-medium ${
                      activeTab === "personal"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Información Personal
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`border-b-2 py-2 px-1 text-sm font-medium ${
                      activeTab === "orders"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Mis Pedidos
                  </button>
                  <button
                    onClick={() => setActiveTab("branches")}
                    className={`border-b-2 py-2 px-1 text-sm font-medium ${
                      activeTab === "branches"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Sucursales
                  </button>
                  <button
                    onClick={() => setActiveTab("payment")}
                    className={`border-b-2 py-2 px-1 text-sm font-medium ${
                      activeTab === "payment"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Métodos de Pago
                  </button>
                </nav>
              </div>

              {/* Contenido de la pestaña activa */}
              {renderTabContent()}

              {/* Estadísticas de cuenta */}
              {activeTab === "personal" && (
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
              )}

              {isEditing && activeTab === "personal" && (
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
