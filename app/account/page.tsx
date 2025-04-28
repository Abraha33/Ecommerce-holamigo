"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Heart,
  Bell,
  LogOut,
  ShoppingBag,
  Gift,
  Truck,
  Clock,
  Calendar,
} from "lucide-react"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile")

  // Mock user data
  const user = {
    name: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    phone: "300 123 4567",
    memberSince: "Enero 2023",
    points: 1250,
  }

  // Mock orders data
  const orders = [
    {
      id: "ORD-2023-001",
      date: "15 Mar 2023",
      total: "$125.000",
      status: "Entregado",
      items: 5,
    },
    {
      id: "ORD-2023-002",
      date: "28 Abr 2023",
      total: "$78.500",
      status: "En camino",
      items: 3,
    },
    {
      id: "ORD-2023-003",
      date: "10 May 2023",
      total: "$215.000",
      status: "Procesando",
      items: 8,
    },
  ]

  // Mock addresses data
  const addresses = [
    {
      id: 1,
      name: "Casa",
      address: "Calle 123 #45-67",
      city: "Bogotá",
      isDefault: true,
    },
    {
      id: 2,
      name: "Oficina",
      address: "Carrera 78 #90-12, Edificio Centro, Oficina 304",
      city: "Bogotá",
      isDefault: false,
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Mi cuenta</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                <button
                  className={`flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                    activeTab === "profile" ? "bg-blue-50 text-ecoplast-blue font-medium" : ""
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User size={18} />
                  <span>Perfil</span>
                </button>
                <button
                  className={`flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                    activeTab === "orders" ? "bg-blue-50 text-ecoplast-blue font-medium" : ""
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <Package size={18} />
                  <span>Mis pedidos</span>
                </button>
                <button
                  className={`flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                    activeTab === "addresses" ? "bg-blue-50 text-ecoplast-blue font-medium" : ""
                  }`}
                  onClick={() => setActiveTab("addresses")}
                >
                  <MapPin size={18} />
                  <span>Direcciones</span>
                </button>
                <button
                  className={`flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                    activeTab === "payment" ? "bg-blue-50 text-ecoplast-blue font-medium" : ""
                  }`}
                  onClick={() => setActiveTab("payment")}
                >
                  <CreditCard size={18} />
                  <span>Métodos de pago</span>
                </button>
                <button
                  className={`flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                    activeTab === "wishlist" ? "bg-blue-50 text-ecoplast-blue font-medium" : ""
                  }`}
                  onClick={() => setActiveTab("wishlist")}
                >
                  <Heart size={18} />
                  <span>Lista de deseos</span>
                </button>
                <button
                  className={`flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                    activeTab === "notifications" ? "bg-blue-50 text-ecoplast-blue font-medium" : ""
                  }`}
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell size={18} />
                  <span>Notificaciones</span>
                </button>
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 text-red-500"
                >
                  <LogOut size={18} />
                  <span>Cerrar sesión</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Información personal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                        <User size={40} className="text-gray-500" />
                      </div>
                      <Button variant="outline" size="sm">
                        Cambiar foto
                      </Button>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Nombre completo</p>
                          <p className="font-medium">{user.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Correo electrónico</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Teléfono</p>
                          <p className="font-medium">{user.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Miembro desde</p>
                          <p className="font-medium">{user.memberSince}</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          className="bg-ecoplast-blue hover:bg-blue-700"
                          onClick={() => {
                            alert("Función de editar perfil activada")
                            // Aquí iría la lógica para abrir un modal de edición o navegar a una página de edición
                          }}
                        >
                          Editar perfil
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Programa de fidelidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-full md:w-1/3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-4 text-white">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm opacity-80">Holamigo Rewards</p>
                          <p className="text-xl font-bold">Tarjeta Plata</p>
                        </div>
                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white bg-opacity-20">
                          <Gift className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm opacity-80">Puntos disponibles</p>
                        <p className="text-2xl font-bold">{user.points}</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-3">Beneficios actuales</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Truck className="h-4 w-4 text-ecoplast-blue" />
                          </div>
                          <div>
                            <p className="font-medium">Envío gratuito</p>
                            <p className="text-sm text-gray-500">En compras superiores a $100.000</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Gift className="h-4 w-4 text-ecoplast-blue" />
                          </div>
                          <div>
                            <p className="font-medium">Regalo de cumpleaños</p>
                            <p className="text-sm text-gray-500">Descuento especial en tu día</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-ecoplast-blue" />
                          </div>
                          <div>
                            <p className="font-medium">Acceso anticipado</p>
                            <p className="text-sm text-gray-500">A promociones exclusivas</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-ecoplast-blue" />
                          </div>
                          <div>
                            <p className="font-medium">Eventos especiales</p>
                            <p className="text-sm text-gray-500">Invitaciones a eventos exclusivos</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "orders" && (
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Mis pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-500">Fecha: {order.date}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2">
                          <ShoppingBag size={16} className="text-gray-500" />
                          <span className="text-sm text-gray-600">{order.items} productos</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 md:mt-0">
                          <p className="font-medium">{order.total}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              alert(`Viendo detalles del pedido`)
                              // Aquí iría la navegación a la página de detalles del pedido
                            }}
                          >
                            Ver detalles
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "addresses" && (
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mis direcciones</CardTitle>
                <Button className="bg-ecoplast-blue hover:bg-blue-700">Añadir dirección</Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4 relative">
                      {address.isDefault && (
                        <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                          Predeterminada
                        </span>
                      )}
                      <div className="mb-3">
                        <p className="font-medium">{address.name}</p>
                      </div>
                      <p className="text-gray-600 mb-1">{address.address}</p>
                      <p className="text-gray-600 mb-4">{address.city}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            alert("Función de editar activada")
                            // Aquí iría la lógica para editar
                          }}
                        >
                          Editar
                        </Button>
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              alert("Función de eliminar activada")
                              // Aquí iría la lógica para eliminar
                            }}
                          >
                            Eliminar
                          </Button>
                        )}
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              alert("Estableciendo como dirección predeterminada")
                              // Aquí iría la lógica para establecer como predeterminada
                            }}
                          >
                            Establecer como predeterminada
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "payment" && (
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Métodos de pago</CardTitle>
                <Button className="bg-ecoplast-blue hover:bg-blue-700">Añadir método de pago</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <Image src="/visa.png" alt="Visa" width={30} height={20} />
                      </div>
                      <div>
                        <p className="font-medium">Visa terminada en 4567</p>
                        <p className="text-sm text-gray-500">Expira: 05/2025</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Eliminar
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <Image src="/mastercard.png" alt="Mastercard" width={30} height={20} />
                      </div>
                      <div>
                        <p className="font-medium">Mastercard terminada en 8901</p>
                        <p className="text-sm text-gray-500">Expira: 11/2024</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "wishlist" && (
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Mi lista de deseos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Tu lista de deseos está vacía</h3>
                  <p className="text-gray-500 mb-4">
                    Añade productos a tu lista de deseos para guardarlos para más tarde
                  </p>
                  <Button className="bg-ecoplast-blue hover:bg-blue-700" asChild>
                    <Link href="/shop">Explorar productos</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Notificaciones</CardTitle>
                <Button variant="outline">Marcar todas como leídas</Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="unread">No leídas</TabsTrigger>
                    <TabsTrigger value="orders">Pedidos</TabsTrigger>
                    <TabsTrigger value="promotions">Promociones</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4 py-2">
                        <p className="font-medium">Tu pedido ha sido enviado</p>
                        <p className="text-sm text-gray-500">
                          Tu pedido #ORD-2023-002 ha sido enviado y llegará en 2-3 días.
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Hace 2 horas</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4 py-2">
                        <p className="font-medium">¡Oferta exclusiva para ti!</p>
                        <p className="text-sm text-gray-500">Disfruta de un 15% de descuento en tu próxima compra.</p>
                        <p className="text-xs text-gray-400 mt-1">Ayer</p>
                      </div>
                      <div className="border-l-4 border-gray-300 pl-4 py-2">
                        <p className="font-medium">Pedido entregado</p>
                        <p className="text-sm text-gray-500">Tu pedido #ORD-2023-001 ha sido entregado. ¡Disfrútalo!</p>
                        <p className="text-xs text-gray-400 mt-1">16 Mar 2023</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="unread">
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4 py-2">
                        <p className="font-medium">Tu pedido ha sido enviado</p>
                        <p className="text-sm text-gray-500">
                          Tu pedido #ORD-2023-002 ha sido enviado y llegará en 2-3 días.
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Hace 2 horas</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4 py-2">
                        <p className="font-medium">¡Oferta exclusiva para ti!</p>
                        <p className="text-sm text-gray-500">Disfruta de un 15% de descuento en tu próxima compra.</p>
                        <p className="text-xs text-gray-400 mt-1">Ayer</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="orders">
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4 py-2">
                        <p className="font-medium">Tu pedido ha sido enviado</p>
                        <p className="text-sm text-gray-500">
                          Tu pedido #ORD-2023-002 ha sido enviado y llegará en 2-3 días.
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Hace 2 horas</p>
                      </div>
                      <div className="border-l-4 border-gray-300 pl-4 py-2">
                        <p className="font-medium">Pedido entregado</p>
                        <p className="text-sm text-gray-500">Tu pedido #ORD-2023-001 ha sido entregado. ¡Disfrútalo!</p>
                        <p className="text-xs text-gray-400 mt-1">16 Mar 2023</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="promotions">
                    <div className="space-y-4">
                      <div className="border-l-4 border-green-500 pl-4 py-2">
                        <p className="font-medium">¡Oferta exclusiva para ti!</p>
                        <p className="text-sm text-gray-500">Disfruta de un 15% de descuento en tu próxima compra.</p>
                        <p className="text-xs text-gray-400 mt-1">Ayer</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
