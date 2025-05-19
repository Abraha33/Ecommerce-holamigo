"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, ShoppingBag, MapPin, CreditCard, Bell, LogOut, Heart, FileText, Camera } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// AccountSidebar - Componente de barra lateral para todas las páginas de cuenta
//
// IMPORTANTE: Este componente debe ser incluido en todas las páginas bajo /account/
// para mantener una experiencia de usuario consistente.
//
// Ejemplo de uso:
// export default function AccountPage() {
//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex flex-col md:flex-row gap-8">
//         <AccountSidebar />
//         <div className="flex-1">
//           {/* Contenido de la página */}
//         </div>
//       </div>
//     </div>
//   )
// }

export default function AccountSidebar() {
  const pathname = usePathname()
  const { signOut, user } = useAuth()

  // Menú fijo que no cambia con la navegación
  const menuItems = [
    {
      href: "/account",
      icon: User,
      label: "Información personal",
    },
    {
      href: "/orders",
      icon: ShoppingBag,
      label: "Mis pedidos",
    },
    {
      href: "/account/wishlists",
      icon: Heart,
      label: "Listas de compra",
    },
    {
      href: "/account/branches",
      icon: MapPin,
      label: "Sucursales",
    },
    {
      href: "/account/payment-methods",
      icon: CreditCard,
      label: "Métodos de pago",
    },
    {
      href: "/account/documents",
      icon: FileText,
      label: "Documentos",
    },
    {
      href: "/account/notifications",
      icon: Bell,
      label: "Notificaciones",
    },
  ]

  return (
    <Card className="w-full lg:w-80 shadow-md border-none overflow-hidden shrink-0 sticky top-4">
      {/* Cabecera de perfil */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
        <div className="flex flex-col items-center">
          <div className="relative group mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-white flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user?.name || "Usuario"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} />
              )}
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <h2 className="font-bold text-xl">{user?.name || "Usuario"}</h2>
          <p className="text-gray-200 text-sm">{user?.email || "usuario@ejemplo.com"}</p>
          <span className="mt-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">Cliente Premium</span>
        </div>
      </div>

      {/* Menú de navegación */}
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            // Verificamos si la ruta actual coincide con este elemento del menú
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full",
                    isActive ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50",
                  )}
                >
                  <item.icon size={18} className={isActive ? "text-gray-900" : "text-gray-500"} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
          {/* Ocultar temporalmente la pestaña de configuraciones */}
          <li className="pt-2 border-t mt-2">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full text-left transition-all duration-200"
            >
              <LogOut size={18} className="text-red-500" />
              <span>Cerrar sesión</span>
            </button>
          </li>
        </ul>
      </nav>
    </Card>
  )
}
