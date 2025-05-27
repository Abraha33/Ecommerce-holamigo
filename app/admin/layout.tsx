"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, ShoppingCart, Users, FolderTree, BarChart3, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Productos",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Pedidos",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Usuarios",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Categorías",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Reportes",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Configuración",
    href: "/admin/settings",
    icon: Settings,
  },
]

function SidebarContent() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <span className="font-bold">Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-1 min-h-0 overflow-y-auto p-4 max-h-full">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      <div className="border-t p-4">
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}

      {/* Main Content */}
      <div className="flex flex-col flex-1 lg:pl-72">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Panel de Administración</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Administrador</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
