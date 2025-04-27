"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, X, Plus, Minus, ArrowRight } from "lucide-react"
import { Loader } from "@/components/ui/loader"

export function PersistentCartSidebar() {
  const { cart, updateQuantity, removeItem } = useCart()
  const [highlightedItem, setHighlightedItem] = useState<number | null>(null)
  const [cartLength, setCartLength] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0)

  // Effect to highlight newly added items
  useEffect(() => {
    if (cart.length > cartLength) {
      const lastItem = cart[cart.length - 1]
      if (lastItem) {
        setHighlightedItem(lastItem.id)
        setTimeout(() => {
          setHighlightedItem(null)
        }, 2000)
      }
    }
    setCartLength(cart.length)
  }, [cart, cartLength])

  // Simulate loading when updating quantities
  const handleUpdateQuantity = (id: number, quantity: number) => {
    setIsUpdating(true)
    updateQuantity(id, quantity)
    setTimeout(() => setIsUpdating(false), 500)
  }

  return (
    <div
      className={`fixed right-0 top-0 bottom-0 z-40 transition-all duration-300 ease-in-out ${
        isExpanded || isHovered ? "translate-x-0" : "translate-x-[calc(100%-48px)]"
      }`}
      onMouseEnter={() => {
        setIsHovered(true)
        setIsTransitioning(true)
        setTimeout(() => setIsTransitioning(false), 300)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsTransitioning(true)
        setTimeout(() => setIsTransitioning(false), 300)
      }}
    >
      {/* Hover indicator/handle */}
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full h-24 w-3 bg-[#004a93] rounded-l-md flex items-center justify-center transition-opacity duration-300 ${
          isExpanded || isHovered ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="h-10 w-1 bg-white/50 rounded-full"></div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => {
          setIsExpanded(!isExpanded)
          setIsTransitioning(true)
          setTimeout(() => setIsTransitioning(false), 300)
        }}
        className={`absolute left-0 top-4 -translate-x-full bg-[#004a93] text-white p-3 rounded-l-lg shadow-lg flex items-center transition-opacity duration-300 ${
          isExpanded || isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#e30613] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Cart content */}
      <div className="bg-white border-l border-gray-200 h-full w-72 shadow-lg flex flex-col">
        <div className="pt-[120px]">
          <div className="p-4 border-b bg-[#004a93] text-white">
            <h2 className="font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Mi Carrito ({itemCount}){isUpdating && <Loader size="small" color="white" className="ml-2" />}
            </h2>
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
              <Button asChild className="bg-[#004a93] hover:bg-[#0071bc]">
                <Link href="/products">Ver Productos</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto p-4">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.variant}`}
                    className={`flex py-3 border-b transition-colors ${highlightedItem === item.id ? "bg-blue-50" : ""}`}
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
                            onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-1 py-0.5 text-gray-600 hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
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
                  </div>
                ))}
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
    </div>
  )
}
