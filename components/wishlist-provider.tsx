"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type WishlistItem = {
  id: string | number
  name: string
  price: number
  image: string
  variant?: string
}

type WishlistContextType = {
  items: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (itemId: string | number) => void
  isInWishlist: (itemId: string | number) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  // Cargar wishlist del localStorage al iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        try {
          setItems(JSON.parse(savedWishlist))
        } catch (error) {
          console.error("Error parsing wishlist from localStorage:", error)
        }
      }
    }
  }, [])

  // Guardar wishlist en localStorage cuando cambia
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(items))
    }
  }, [items])

  const addToWishlist = (item: WishlistItem) => {
    setItems((prevItems) => {
      // Verificar si el item ya existe en la wishlist
      if (prevItems.some((i) => i.id === item.id)) {
        return prevItems
      }
      return [...prevItems, item]
    })
  }

  const removeFromWishlist = (itemId: string | number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const isInWishlist = (itemId: string | number) => {
    return items.some((item) => item.id === itemId)
  }

  const clearWishlist = () => {
    setItems([])
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
