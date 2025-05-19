"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Settings, MenuIcon, Phone, Wrench } from "lucide-react"

// Definir las categorías principales con sus iconos
const mainCategories = [
  // { name: "Inicio", href: "/", icon: <Home className="w-5 h-5" /> },
  // { name: "Nosotros", href: "/about", icon: <FileText className="w-5 h-5" /> },
  { name: "Tienda", href: "/shop", icon: <ShoppingCart className="w-5 h-5" /> },
  { name: "Promos", href: "/promos", icon: <Settings className="w-5 h-5" /> },
  { name: "Categorías", href: "/categories", icon: <MenuIcon className="w-5 h-5" /> },
  { name: "Contacto", href: "/contact", icon: <Phone className="w-5 h-5" /> },
  { name: "Mi pedido", href: "/orders", icon: <Wrench className="w-5 h-5" /> },
]

export function MainNavigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-[#f8f9fa] border-b shadow-sm hidden md:block">
      <div className="container mx-auto">
        <div className="flex">
          {mainCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={`flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-[#1e3a8a] ${
                pathname === category.href ? "text-[#1e3a8a] font-bold" : "text-gray-700"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
