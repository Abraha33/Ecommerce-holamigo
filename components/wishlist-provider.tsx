"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface WishlistItem {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
  unit: string
}

export interface Wishlist {
  id: string
  name: string
  icon: string
  description: string
  items: WishlistItem[]
  createdAt: Date
  updatedAt: Date
}

interface WishlistContextType {
  wishlists: Wishlist[]
  activeWishlistId: string | null
  setActiveWishlistId: (id: string | null) => void
  createWishlist: (name: string, icon?: string, description?: string) => string
  updateWishlist: (id: string, name: string, icon?: string, description?: string) => void
  deleteWishlist: (id: string) => void
  addToWishlist: (wishlistId: string, item: WishlistItem) => void
  removeFromWishlist: (wishlistId: string, itemId: string) => void
  clearWishlist: (wishlistId: string) => void
  updateItemQuantity: (wishlistId: string, itemId: string, quantity: number) => void
  updateItemUnit: (wishlistId: string, itemId: string, unit: string) => void
  isInWishlist: (wishlistId: string, itemId: string | number) => boolean
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [activeWishlistId, setActiveWishlistId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Cargar las listas de deseos al iniciar
  useEffect(() => {
    setIsMounted(true)
    const loadWishlists = () => {
      try {
        if (typeof window !== "undefined") {
          const savedWishlists = localStorage.getItem("wishlists")
          if (savedWishlists) {
            const parsedWishlists = JSON.parse(savedWishlists)
            // Convertir las fechas de string a Date
            const processedWishlists = parsedWishlists.map((wishlist: any) => ({
              ...wishlist,
              createdAt: new Date(wishlist.createdAt),
              updatedAt: new Date(wishlist.updatedAt),
              // Asegurarse de que todos los items tengan una unidad
              items: wishlist.items.map((item: any) => ({
                ...item,
                unit: item.unit || "unidad",
              })),
            }))
            setWishlists(processedWishlists)
          } else {
            // Crear una lista por defecto si no hay ninguna
            const defaultWishlist: Wishlist = {
              id: `wishlist-${Date.now()}`,
              name: "Mi lista de compras",
              icon: "shopping-bag",
              description: "",
              items: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            }
            setWishlists([defaultWishlist])
            setActiveWishlistId(defaultWishlist.id)
          }

          const savedActiveWishlistId = localStorage.getItem("activeWishlistId")
          if (savedActiveWishlistId) {
            setActiveWishlistId(savedActiveWishlistId)
          }
        }
      } catch (error) {
        console.error("Error al cargar las listas de deseos:", error)
      }
    }

    loadWishlists()
  }, [])

  // Guardar las listas de deseos cuando cambien
  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      try {
        localStorage.setItem("wishlists", JSON.stringify(wishlists))
      } catch (error) {
        console.error("Error al guardar las listas de deseos:", error)
      }
    }
  }, [wishlists, isMounted])

  // Guardar el ID de la lista activa cuando cambie
  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      try {
        if (activeWishlistId) {
          localStorage.setItem("activeWishlistId", activeWishlistId)
        } else {
          localStorage.removeItem("activeWishlistId")
        }
      } catch (error) {
        console.error("Error al guardar el ID de la lista activa:", error)
      }
    }
  }, [activeWishlistId, isMounted])

  // Crear una nueva lista de deseos
  const createWishlist = (name: string, icon = "shopping-bag", description = ""): string => {
    const newWishlist: Wishlist = {
      id: `wishlist-${Date.now()}`,
      name,
      icon,
      description,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setWishlists((prevWishlists) => [...prevWishlists, newWishlist])
    setActiveWishlistId(newWishlist.id)
    return newWishlist.id
  }

  // Actualizar una lista de deseos
  const updateWishlist = (id: string, name: string, icon = "shopping-bag", description = "") => {
    setWishlists((prevWishlists) =>
      prevWishlists.map((wishlist) =>
        wishlist.id === id
          ? {
              ...wishlist,
              name,
              icon,
              description,
              updatedAt: new Date(),
            }
          : wishlist,
      ),
    )
  }

  // Eliminar una lista de deseos
  const deleteWishlist = (id: string) => {
    setWishlists((prevWishlists) => prevWishlists.filter((wishlist) => wishlist.id !== id))
    if (activeWishlistId === id) {
      setActiveWishlistId(null)
    }
  }

  // Añadir un producto a una lista de deseos
  const addToWishlist = (wishlistId: string, item: WishlistItem) => {
    setWishlists((prevWishlists) => {
      const updatedWishlists = prevWishlists.map((wishlist) => {
        if (wishlist.id === wishlistId) {
          // Verificar si el producto ya existe en la lista
          const existingItemIndex = wishlist.items.findIndex((i) => i.id === item.id)
          let updatedItems

          if (existingItemIndex >= 0) {
            // Si el producto ya existe, actualizar la cantidad
            updatedItems = [...wishlist.items]
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + (item.quantity || 1),
            }
          } else {
            // Si el producto no existe, añadirlo a la lista
            updatedItems = [
              ...wishlist.items,
              {
                ...item,
                quantity: item.quantity || 1,
                unit: item.unit || "unidad",
              },
            ]
          }

          return {
            ...wishlist,
            items: updatedItems,
            updatedAt: new Date(),
          }
        }
        return wishlist
      })

      // Guardar en localStorage inmediatamente para asegurar persistencia
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("wishlists", JSON.stringify(updatedWishlists))
        } catch (error) {
          console.error("Error al guardar las listas de deseos:", error)
        }
      }

      // Disparar un evento personalizado para notificar a otros componentes
      if (typeof window !== "undefined") {
        const event = new CustomEvent("wishlist-update", { detail: { wishlists: updatedWishlists } })
        window.dispatchEvent(event)
      }

      return updatedWishlists
    })
  }

  // Eliminar un producto de una lista de deseos
  const removeFromWishlist = (wishlistId: string, itemId: string) => {
    setWishlists((prevWishlists) =>
      prevWishlists.map((wishlist) => {
        if (wishlist.id === wishlistId) {
          return {
            ...wishlist,
            items: wishlist.items.filter((item) => item.id !== itemId),
            updatedAt: new Date(),
          }
        }
        return wishlist
      }),
    )
  }

  // Vaciar una lista de deseos
  const clearWishlist = (wishlistId: string) => {
    setWishlists((prevWishlists) =>
      prevWishlists.map((wishlist) => {
        if (wishlist.id === wishlistId) {
          return {
            ...wishlist,
            items: [],
            updatedAt: new Date(),
          }
        }
        return wishlist
      }),
    )
  }

  // Actualizar la cantidad de un producto en una lista de deseos
  const updateItemQuantity = (wishlistId: string, itemId: string, quantity: number) => {
    setWishlists((prevWishlists) =>
      prevWishlists.map((wishlist) => {
        if (wishlist.id === wishlistId) {
          return {
            ...wishlist,
            items: wishlist.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
            updatedAt: new Date(),
          }
        }
        return wishlist
      }),
    )
  }

  // Actualizar la unidad de un producto en una lista de deseos
  const updateItemUnit = (wishlistId: string, itemId: string, unit: string) => {
    setWishlists((prevWishlists) =>
      prevWishlists.map((wishlist) => {
        if (wishlist.id === wishlistId) {
          return {
            ...wishlist,
            items: wishlist.items.map((item) => (item.id === itemId ? { ...item, unit } : item)),
            updatedAt: new Date(),
          }
        }
        return wishlist
      }),
    )
  }

  // Verificar si un producto está en una lista de deseos específica
  const isInWishlist = (wishlistId: string, itemId: string | number) => {
    const wishlist = wishlists.find((w) => w.id === wishlistId)
    return wishlist ? wishlist.items.some((item) => String(item.id) === String(itemId)) : false
  }

  // Añadir esta propiedad calculada al contexto
  const wishlistCount = wishlists.reduce((count, wishlist) => {
    // Contar productos únicos en todas las listas
    const uniqueProductIds = new Set()
    wishlist.items.forEach((item) => uniqueProductIds.add(item.id))
    return count + uniqueProductIds.size
  }, 0)

  return (
    <WishlistContext.Provider
      value={{
        wishlists,
        activeWishlistId,
        setActiveWishlistId,
        createWishlist,
        updateWishlist,
        deleteWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        updateItemQuantity,
        updateItemUnit,
        isInWishlist,
        wishlistCount, // Añadir esta propiedad
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
