"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  getCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  calculateSubtotal,
  type CartItem,
} from "@/lib/cart-service"

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearItems: () => Promise<void>
  subtotal: number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar los items del carrito al iniciar
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        setIsLoading(true)
        const cartItems = await getCartItems()
        setItems(cartItems)
        setSubtotal(calculateSubtotal(cartItems))
      } catch (error) {
        console.error("Error al cargar el carrito:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCartItems()
  }, [])

  // Añadir un item al carrito
  const addItem = async (item: CartItem) => {
    try {
      setIsLoading(true)
      await addToCart(item)

      // Recargar los items para reflejar los cambios
      const updatedItems = await getCartItems()
      setItems(updatedItems)
      setSubtotal(calculateSubtotal(updatedItems))
    } catch (error) {
      console.error("Error al añadir item al carrito:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Eliminar un item del carrito
  const removeItem = async (itemId: string) => {
    try {
      setIsLoading(true)
      await removeFromCart(itemId)

      // Actualizar el estado local
      const updatedItems = items.filter((item) => item.id !== itemId)
      setItems(updatedItems)
      setSubtotal(calculateSubtotal(updatedItems))
    } catch (error) {
      console.error("Error al eliminar item del carrito:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Actualizar la cantidad de un item
  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setIsLoading(true)
      await updateCartItemQuantity(itemId, quantity)

      // Actualizar el estado local
      const updatedItems = items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      setItems(updatedItems)
      setSubtotal(calculateSubtotal(updatedItems))
    } catch (error) {
      console.error("Error al actualizar cantidad:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Vaciar el carrito
  const clearItems = async () => {
    try {
      setIsLoading(true)
      await clearCart()
      setItems([])
      setSubtotal(0)
    } catch (error) {
      console.error("Error al vaciar el carrito:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearItems,
        subtotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
