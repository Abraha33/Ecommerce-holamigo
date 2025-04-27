"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  variant: string
  addedAt?: number
}

interface CartContextType {
  cart: CartItem[]
  addItem: (item: CartItem) => void
  updateQuantity: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
  lastAddedItem: number | null
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
  lastAddedItem: null,
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [lastAddedItem, setLastAddedItem] = useState<number | null>(null)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addItem = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.variant === item.variant,
      )

      // Add timestamp to track when item was added
      const itemWithTimestamp = {
        ...item,
        addedAt: Date.now(),
      }

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += item.quantity
        updatedCart[existingItemIndex].addedAt = Date.now() // Update timestamp
        return updatedCart
      } else {
        // Item doesn't exist, add it
        return [...prevCart, itemWithTimestamp]
      }
    })

    // Set the last added item for highlighting
    setLastAddedItem(item.id)
    setTimeout(() => setLastAddedItem(null), 2000)
  }

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeItem = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addItem, updateQuantity, removeItem, clearCart, lastAddedItem }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
