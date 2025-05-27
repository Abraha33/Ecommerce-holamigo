"use client"

import { CreditCard, File, FileText, Home, Settings, User, Package, Bell } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface AccountSidebarProps {
  isMobile?: boolean
  closeSidebar?: () => void
}

interface NavItem {
  href: string
  label: string
  icon: any
  badge?: string
}

const navItems: NavItem[] = [
  {
    href: "/account",
    label: "General",
    icon: Home,
  },
  {
    href: "/profile",
    label: "Perfil",
    icon: User,
  },
  {
    href: "/orders",
    label: "Mis Pedidos",
    icon: Package,
  },
  {
    href: "/account/notifications",
    label: "Notificaciones",
    icon: Bell,
  },
  {
    href: "/account/payment-methods",
    label: "Métodos de Pago",
    icon: CreditCard,
  },
  {
    href: "/account/documents",
    label: "Documentos",
    icon: File,
  },
  {
    href: "/account/electronic-invoicing",
    label: "Facturación Electrónica",
    icon: FileText,
    badge: "Nuevo",
  },
  {
    href: "/account/settings",
    label: "Ajustes",
    icon: Settings,
  },
]

export default function AccountSidebar({ isMobile, closeSidebar }: AccountSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="lg:w-64 lg:flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm border p-6 h-fit">
        <div className="space-y-1 mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Mi Cuenta</h2>
          <p className="text-sm text-gray-500">Administra tu cuenta y preferencias</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? closeSidebar : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-gray-50",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-gray-400")} />
                {item.label}
                {item.badge && (
                  <span className="ml-auto rounded-full bg-red-500 px-2 py-1 text-xs text-white font-medium">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
