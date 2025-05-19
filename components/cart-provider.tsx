"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"
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

// Key for temporary cart
const TEMP_CART_KEY = "temp_cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTemporaryCart, setIsTemporaryCart] = useState(false)
  const { user, isLoading: authLoading } = useAuth()

  // Use refs to avoid infinite loops
  const initialLoadComplete = useRef(false)
  const syncInProgress = useRef(false)
  const previousAuthState = useRef<boolean | null>(null)
  const itemsRef = useRef<CartItem[]>([])

  // Update ref when items change
  useEffect(() => {
    itemsRef.current = items
  }, [items])

  // Function to load temporary cart
  const loadTemporaryCart = useCallback(() => {
    if (syncInProgress.current) return

    try {
      const savedCart = localStorage.getItem(TEMP_CART_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
        setIsTemporaryCart(true)
      } else {
        setItems([])
      }
    } catch (e) {
      console.error("Error loading temporary cart:", e)
      setItems([])
    }
  }, [])

  // Function to load user cart from localStorage
  const loadUserCart = useCallback((userId: string) => {
    if (syncInProgress.current) return []

    try {
      const savedCart = localStorage.getItem(`cart_${userId}`)
      if (savedCart) {
        return JSON.parse(savedCart)
      }
      return []
    } catch (e) {
      console.error("Error loading user cart:", e)
      return []
    }
  }, [])

  // Function to sync temporary cart with user cart
  const syncTemporaryCartWithUserCart = useCallback(
    (userId: string) => {
      if (syncInProgress.current) return
      syncInProgress.current = true

      try {
        // Load temporary cart
        const tempCart = localStorage.getItem(TEMP_CART_KEY)
        if (!tempCart) {
          syncInProgress.current = false
          return
        }

        // Load user cart
        const userCart = loadUserCart(userId)

        // Parse temporary cart
        const tempCartItems: CartItem[] = JSON.parse(tempCart)
        if (tempCartItems.length === 0) {
          syncInProgress.current = false
          return
        }

        // Combine carts
        const combinedItems = [...userCart]

        // Add items from temporary cart to user cart
        tempCartItems.forEach((tempItem) => {
          const existingItemIndex = combinedItems.findIndex(
            (item) =>
              item.product_id === tempItem.product_id &&
              item.variant === tempItem.variant &&
              item.unit === tempItem.unit,
          )

          if (existingItemIndex >= 0) {
            // If product already exists, sum quantities
            combinedItems[existingItemIndex] = {
              ...combinedItems[existingItemIndex],
              quantity: combinedItems[existingItemIndex].quantity + tempItem.quantity,
              updated_at: new Date().toISOString(),
            }
          } else {
            // If it doesn't exist, add the new item
            combinedItems.push({
              ...tempItem,
              id: tempItem.id || uuidv4(),
              updated_at: new Date().toISOString(),
            })
          }
        })

        // Update state and localStorage
        setItems(combinedItems)
        localStorage.setItem(`cart_${userId}`, JSON.stringify(combinedItems))

        // Clear temporary cart
        localStorage.removeItem(TEMP_CART_KEY)
        setIsTemporaryCart(false)

        // Show sync notification
        if (tempCartItems.length > 0) {
          toast({
            title: "Cart synchronized",
            description: "Your temporary cart items have been synced with your account",
          })
        }
      } catch (e) {
        console.error("Error syncing carts:", e)
      } finally {
        syncInProgress.current = false
      }
    },
    [loadUserCart],
  )

  // Load cart on init or when user changes
  useEffect(() => {
    if (authLoading || syncInProgress.current) return

    const loadCart = async () => {
      if (syncInProgress.current) return
      syncInProgress.current = true
      setIsLoading(true)

      try {
        const isAuthenticated = !!user
        const wasAuthenticated = previousAuthState.current

        // Detect auth state change
        if (wasAuthenticated === false && isAuthenticated && user) {
          // User just logged in, sync carts
          syncTemporaryCartWithUserCart(user.id)
        } else if (isAuthenticated && user) {
          // User already authenticated, load their cart
          const userId = user.id
          const userCart = loadUserCart(userId)
          setItems(userCart)
          setIsTemporaryCart(false)
        } else {
          // User not authenticated, load temporary cart
          loadTemporaryCart()
        }

        // Update previous auth state
        previousAuthState.current = isAuthenticated
      } catch (error) {
        console.error("Error loading cart:", error)
        setItems([])
      } finally {
        setIsLoading(false)
        initialLoadComplete.current = true
        syncInProgress.current = false
      }
    }

    loadCart()
  }, [user, authLoading, loadTemporaryCart, syncTemporaryCartWithUserCart, loadUserCart])

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (!initialLoadComplete.current || syncInProgress.current) return

    const saveCart = () => {
      if (user) {
        // Save to user's cart
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(items))
      } else {
        // Save to temporary cart
        localStorage.setItem(TEMP_CART_KEY, JSON.stringify(items))
      }
    }

    // Use a timeout to avoid excessive saves
    const timeoutId = setTimeout(saveCart, 300)
    return () => clearTimeout(timeoutId)
  }, [items, user])

  // Function to add an item to the cart
  const addItem = async (item: CartItem): Promise<void> => {
    return new Promise((resolve) => {
      // Ensure item has a unique ID
      const newItem = {
        ...item,
        id: item.id || uuidv4(),
        updated_at: new Date().toISOString(),
      }

      // Update local state
      setItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (i) =>
            i.id === newItem.id ||
            (i.product_id === newItem.product_id && i.variant === newItem.variant && i.unit === newItem.unit),
        )

        let updatedItems: CartItem[]

        if (existingItemIndex >= 0) {
          // Update quantity if item already exists
          updatedItems = prevItems.map((i, index) =>
            index === existingItemIndex
              ? { ...i, quantity: i.quantity + newItem.quantity, updated_at: new Date().toISOString() }
              : i,
          )
        } else {
          // Add new item
          updatedItems = [...prevItems, newItem]
        }

        return updatedItems
      })

      // Show success notification
      toast({
        title: "Product added",
        description: `${newItem.name} has been added to your cart`,
      })

      resolve()
    })
  }

  // Function to remove an item from the cart
  const removeItem = (id: string) => {
    // Update local state
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Function to update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    // Update local state
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity, updated_at: new Date().toISOString() } : item)),
    )
  }

  // Function to clear the cart
  const clearItems = () => {
    // Update local state
    setItems([])

    if (user) {
      localStorage.removeItem(`cart_${user.id}`)
    } else {
      localStorage.removeItem(TEMP_CART_KEY)
    }
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
        isTemporaryCart,
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
