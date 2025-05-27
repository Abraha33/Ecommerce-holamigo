"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, X, ChevronRight, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export function PersistentCartSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem, updateQuantity, subtotal, itemCount, isTemporaryCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  // Cerrar el carrito cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("cart-sidebar")
      if (sidebar && !sidebar.contains(event.target) && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Manejar cambio de cantidad
  const handleQuantityChange = (id, currentQuantity, change) => {
    const newQuantity = Math.max(1, currentQuantity + change)
    updateQuantity(id, newQuantity)
  }

  // Ir a la página de login
  const handleLogin = () => {
    router.push("/login?redirectTo=" + encodeURIComponent(window.location.pathname))
  }

  return (
    <>
      {/* Sidebar del carrito */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[90]"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              id="cart-sidebar"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-screen w-full sm:w-96 bg-white shadow-xl z-[100] flex flex-col"
            >
              {/* Encabezado */}
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Carrito
                  {itemCount > 0 && <span className="ml-2 text-sm text-gray-500">({itemCount})</span>}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Indicador de carrito temporal */}
              {isTemporaryCart && (
                <div className="p-4 bg-blue-50 border-b border-blue-100">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <LogIn className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Carrito temporal</h3>
                      <div className="mt-1 text-sm text-blue-700">
                        <p>
                          Estás usando un carrito temporal. Tus productos se guardarán localmente y se sincronizarán
                          cuando inicies sesión.
                        </p>
                      </div>
                      <div className="mt-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="text-blue-700 border-blue-300 hover:bg-blue-50"
                          onClick={handleLogin}
                        >
                          <LogIn className="h-4 w-4 mr-1" />
                          Iniciar sesión
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contenido del carrito */}
              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Tu carrito está vacío</h3>
                    <p className="text-gray-500 mb-6">Agrega productos para comenzar tu compra</p>
                    <Button
                      variant="outline"
                      className="flex items-center"
                      onClick={() => {
                        setIsOpen(false)
                        router.push("/shop")
                      }}
                    >
                      Explorar productos
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <ul className="divide-y">
                    {items.map((item) => (
                      <li key={item.id} className="py-4 flex">
                        <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400 hover:text-gray-500"
                              onClick={() => removeItem(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(item.price)}</div>
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-none"
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                              >
                                <span className="text-lg font-medium">-</span>
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-none"
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                              >
                                <span className="text-lg font-medium">+</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Pie del carrito */}
              {items.length > 0 && (
                <div className="p-4 border-t flex-shrink-0 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-base font-medium">Subtotal</span>
                    <span className="text-lg font-bold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="space-y-2">
                    <Link href="/cart" onClick={() => setIsOpen(false)} className="w-full block">
                      <Button variant="outline" className="w-full">
                        Ver carrito
                      </Button>
                    </Link>
                    <Link href="/checkout" onClick={() => setIsOpen(false)} className="w-full block">
                      <Button className="w-full bg-[#004a93] hover:bg-[#003366]">Proceder al pago</Button>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
