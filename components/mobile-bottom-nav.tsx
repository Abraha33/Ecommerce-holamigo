"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Home, Search, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"
import { SearchModal } from "@/components/search-modal"

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { itemCount } = useCart()
  const [showSearch, setShowSearch] = useState(false)

  // No mostrar en páginas de checkout
  if (pathname?.includes("/checkout") || pathname?.includes("/mobile-checkout")) {
    return null
  }

  const navItems = [
    { href: "/", icon: <Home className="h-5 w-5" />, label: "Inicio" },
    { href: "#", icon: <Search className="h-5 w-5" />, label: "Buscar", onClick: () => setShowSearch(true) },
    {
      href: "/cart",
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Carrito",
      count: itemCount > 0 ? itemCount : null,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-blue-50 to-white border-t-2 border-blue-300 z-50 md:hidden shadow-lg">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600"></div>
      <nav className="flex justify-between items-center py-1">
        {navItems.map((item) => (
          <div
            key={item.href}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-2 flex-1 text-sm cursor-pointer relative",
              pathname === item.href
                ? "text-blue-600 font-medium after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-0.5 after:bg-blue-500 after:rounded-full"
                : "text-gray-600",
            )}
            onClick={(e) => {
              e.preventDefault()
              if (item.onClick) {
                item.onClick()
              } else if (item.href && item.href !== "#") {
                router.push(item.href)
              }
            }}
          >
            <div className="relative">
              <div className="scale-110">{item.icon}</div>
              {item.count && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {item.count}
                </span>
              )}
            </div>
            <span className="mt-1 text-xs font-medium">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Modal de búsqueda */}
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </div>
  )
}
