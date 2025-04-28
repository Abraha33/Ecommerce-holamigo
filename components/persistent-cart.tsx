"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, X, Plus, Minus, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function PersistentCart() {
  const { cart, updateQuantity, removeItem } = useCart()
  const [highlightedItem, setHighlightedItem] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Effect to highlight newly added items
  useEffect(() => {
    const cartItemIds = cart.map((item) => item.id)
    if (cartItemIds.length > 0 && highlightedItem === null) {
      setHighlightedItem(cartItemIds[cartItemIds.length - 1])
      setTimeout(() => {
        setHighlightedItem(null)
      }, 2000)
    }
  }, [cart.length])

  // Auto-expand cart when items are added
  useEffect(() => {
    if (cart.length > 0) {
      setIsExpanded(true)
      // Auto-collapse after 5 seconds if not interacted with
      const timer = setTimeout(() => {
        setIsExpanded(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [cart.length])

  return (
    <div
      className={`fixed right-0 top-24 bottom-0 z-30 transition-all duration-300 ${isExpanded ? "translate-x-0" : "translate-x-[calc(100%-48px)]"}`}
    >
      {/* Cart toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute left-0 top-4 -translate-x-full bg-[#004a93] text-white p-3 rounded-l-lg shadow-lg flex items-center"
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#e30613] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cart.reduce((count, item) => count + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Cart content */}
      <div className="bg-white border-l border-gray-200 h-full w-80 shadow-xl flex flex-col">
        <div className="p-4 border-b bg-[#004a93] text-white flex justify-between items-center">
          <h2 className="font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Mi Carrito
          </h2>
          <button onClick={() => setIsExpanded(false)} className="p-1 hover:bg-[#0071bc] rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
            <Button asChild className="bg-[#004a93] hover:bg-[#0071bc]">
              <Link href="/shop">Ver Productos</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.variant}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: highlightedItem === item.id ? 1.05 : 1,
                      backgroundColor: highlightedItem === item.id ? "#f0f9ff" : "transparent",
                    }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex py-3 border-b"
                  >
                    <div className="relative h-16 w-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.variant}</p>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-1 py-0.5 text-gray-600 hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-1 py-0.5 text-gray-600 hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-medium text-sm text-[#e30613]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-2 text-gray-400 hover:text-[#e30613] self-start"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal:</span>
                <span className="font-bold text-[#e30613]">{formatCurrency(subtotal)}</span>
              </div>
              <Button asChild className="w-full bg-[#004a93] hover:bg-[#0071bc]">
                <Link href="/checkout" className="flex items-center justify-center">
                  Finalizar Compra <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full mt-2 border-[#004a93] text-[#004a93]">
                <Link href="/cart">Ver Carrito</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
