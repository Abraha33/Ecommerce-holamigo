"use client"

import { useState } from "react"
import { Tag, Package, Truck, CheckCircle } from "lucide-react"
import AccountSidebar from "@/components/account-sidebar"

// Datos de ejemplo
const notifications = [
  {
    id: 1,
    type: "order",
    title: "Tu pedido ha sido enviado",
    message: "El pedido ORD-2023-002 ha sido enviado y llegará en 2-3 días hábiles.",
    date: "28 Abr 2023",
    read: false,
  },
  {
    id: 2,
    type: "promo",
    title: "¡Oferta especial para mayoristas!",
    message: "Aprovecha 15% de descuento en todos los productos de la categoría Hogar.",
    date: "25 Abr 2023",
    read: true,
  },
  {
    id: 3,
    type: "delivery",
    title: "Entrega completada",
    message: "Tu pedido ORD-2023-001 ha sido entregado con éxito.",
    date: "20 Abr 2023",
    read: true,
  },
]

export default function NotificationsPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    promos: true,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner superior */}
      <div className="bg-red-100 text-red-600 py-3 px-4 text-center font-semibold">¡ERES UN CLIENTE MAYORISTA!</div>

      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar compartido */}
          <AccountSidebar />

          {/* Contenido principal */}
          <div className="flex-1 space-y-6">
            {/* Notificaciones */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Notificaciones</h2>

              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border rounded-lg p-4 ${notification.read ? "" : "bg-blue-50 border-blue-200"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getNotificationIconBg(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${notification.read ? "text-gray-800" : "text-blue-700"}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.date}</p>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuración de notificaciones eliminada */}
          </div>
        </div>
      </div>
    </div>
  )
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "order":
      return <Package size={20} className="text-blue-600" />
    case "promo":
      return <Tag size={20} className="text-green-600" />
    case "delivery":
      return <Truck size={20} className="text-purple-600" />
    default:
      return <CheckCircle size={20} className="text-blue-600" />
  }
}

function getNotificationIconBg(type: string) {
  switch (type) {
    case "order":
      return "bg-blue-100"
    case "promo":
      return "bg-green-100"
    case "delivery":
      return "bg-purple-100"
    default:
      return "bg-blue-100"
  }
}
