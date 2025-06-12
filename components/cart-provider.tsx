"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"

export type CartItem = {
  id: string
  product_id?: string
  name: string
  price: number
  image: string
  quantity: number
  unit?: string
  variant?: string
  brand?: string
  updated_at?: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => Promise<void>
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearItems: () => void
  itemCount: number
  subtotal: number
  isLoading: boolean
  isTemporaryCart: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_KEY = "shopping_cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY)
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (e) {
      console.error("Error loading cart:", e)
    }
  }, [])

  // Save cart to localStorage when items change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = async (item: CartItem): Promise<void> => {
    const newItem = {
      ...item,
      id: item.id || uuidv4(),
      updated_at: new Date().toISOString(),
    }

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) =>
          i.id === newItem.id ||
          (i.product_id === newItem.product_id && i.variant === newItem.variant && i.unit === newItem.unit),
      )

      if (existingItemIndex >= 0) {
        return prevItems.map((i, index) =>
          index === existingItemIndex
            ? { ...i, quantity: i.quantity + newItem.quantity, updated_at: new Date().toISOString() }
            : i,
        )
      } else {
        return [...prevItems, newItem]
      }
    })

    toast({
      title: "Product added",
      description: `${newItem.name} has been added to your cart`,
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity, updated_at: new Date().toISOString() } : item)),
    )
  }

  const clearItems = () => {
    setItems([])
    localStorage.removeItem(CART_KEY)
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearItems,
        itemCount,
        subtotal,
        isLoading,
        isTemporaryCart: false,
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
