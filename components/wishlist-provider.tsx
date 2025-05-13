"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Update the interfaces to support multiple wishlists
interface WishlistItem {
  id: string | number
  name: string
  image: string
  price: number
}

interface Wishlist {
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
  createWishlist: (name: string, icon: string, description: string) => void
  updateWishlist: (id: string, data: Partial<Omit<Wishlist, "id" | "items" | "createdAt" | "updatedAt">>) => void
  deleteWishlist: (id: string) => void
  addToWishlist: (wishlistId: string, item: WishlistItem) => void
  removeFromWishlist: (wishlistId: string, itemId: string | number) => void
  isInWishlist: (wishlistId: string, itemId: string | number) => boolean
  clearWishlist: (wishlistId: string) => void
  wishlistCount: number
  getWishlistById: (id: string) => Wishlist | undefined
  getAllWishlistItems: () => WishlistItem[]
}

// Crear el contexto
const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

// Replace the existing WishlistProvider with this updated version
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [activeWishlistId, setActiveWishlistId] = useState<string | null>(null)
  const [wishlistCount, setWishlistCount] = useState(0)

  // Generate a unique ID for new wishlists
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Load wishlists from localStorage on init
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWishlists = localStorage.getItem("wishlists")
      if (savedWishlists) {
        try {
          const parsedWishlists = JSON.parse(savedWishlists, (key, value) => {
            // Convert date strings back to Date objects
            if (key === "createdAt" || key === "updatedAt") {
              return new Date(value)
            }
            return value
          })
          setWishlists(parsedWishlists)

          // Set total count of all items across all wishlists
          const totalItems = parsedWishlists.reduce((total, list) => total + list.items.length, 0)
          setWishlistCount(totalItems)

          // Set active wishlist to the first one if it exists
          if (parsedWishlists.length > 0 && !activeWishlistId) {
            setActiveWishlistId(parsedWishlists[0].id)
          }
        } catch (error) {
          console.error("Error parsing wishlists from localStorage", error)
        }
      } else {
        // Create a default wishlist if none exists
        const defaultWishlist = {
          id: generateId(),
          name: "Favoritos",
          icon: "heart",
          description: "Mi lista de productos favoritos",
          items: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        setWishlists([defaultWishlist])
        setActiveWishlistId(defaultWishlist.id)
      }
    }
  }, [])

  // Save wishlists to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined" && wishlists.length > 0) {
      localStorage.setItem("wishlists", JSON.stringify(wishlists))
      const totalItems = wishlists.reduce((total, list) => total + list.items.length, 0)
      setWishlistCount(totalItems)
    }
  }, [wishlists])

  // Create a new wishlist
  const createWishlist = (name: string, icon: string, description: string) => {
    const newWishlist: Wishlist = {
      id: generateId(),
      name,
      icon,
      description,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setWishlists((prev) => [...prev, newWishlist])
    return newWishlist.id
  }

  // Update an existing wishlist
  const updateWishlist = (id: string, data: Partial<Omit<Wishlist, "id" | "items" | "createdAt" | "updatedAt">>) => {
    setWishlists((prev) =>
      prev.map((wishlist) =>
        wishlist.id === id
          ? {
              ...wishlist,
              ...data,
              updatedAt: new Date(),
            }
          : wishlist,
      ),
    )
  }

  // Delete a wishlist
  const deleteWishlist = (id: string) => {
    setWishlists((prev) => prev.filter((wishlist) => wishlist.id !== id))

    // If the active wishlist is deleted, set the first available one as active
    if (activeWishlistId === id) {
      setActiveWishlistId((prev) => {
        const remaining = wishlists.filter((w) => w.id !== id)
        return remaining.length > 0 ? remaining[0].id : null
      })
    }
  }

  // Add an item to a wishlist
  const addToWishlist = (wishlistId: string, item: WishlistItem) => {
    setWishlists((prev) =>
      prev.map((wishlist) => {
        if (wishlist.id === wishlistId) {
          // Only add if not already in this wishlist
          if (!wishlist.items.some((i) => String(i.id) === String(item.id))) {
            return {
              ...wishlist,
              items: [...wishlist.items, item],
              updatedAt: new Date(),
            }
          }
        }
        return wishlist
      }),
    )
  }

  // Remove an item from a wishlist
  const removeFromWishlist = (wishlistId: string, itemId: string | number) => {
    setWishlists((prev) =>
      prev.map((wishlist) => {
        if (wishlist.id === wishlistId) {
          return {
            ...wishlist,
            items: wishlist.items.filter((item) => String(item.id) !== String(itemId)),
            updatedAt: new Date(),
          }
        }
        return wishlist
      }),
    )
  }

  // Check if an item is in a specific wishlist
  const isInWishlist = (wishlistId: string, itemId: string | number) => {
    const wishlist = wishlists.find((w) => w.id === wishlistId)
    return wishlist ? wishlist.items.some((item) => String(item.id) === String(itemId)) : false
  }

  // Clear all items from a wishlist
  const clearWishlist = (wishlistId: string) => {
    setWishlists((prev) =>
      prev.map((wishlist) => {
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

  // Get a wishlist by ID
  const getWishlistById = (id: string) => {
    return wishlists.find((w) => w.id === id)
  }

  // Get all items from all wishlists (for displaying total count)
  const getAllWishlistItems = () => {
    return wishlists.flatMap((w) => w.items)
  }

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
        isInWishlist,
        clearWishlist,
        wishlistCount,
        getWishlistById,
        getAllWishlistItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

// Update the hook to match the new context
export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
