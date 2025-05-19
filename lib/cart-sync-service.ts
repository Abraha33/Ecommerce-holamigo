import { createClientComponentClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  unit?: string
  product_id?: string
  variant?: string
  sku?: string
  updated_at?: string
}

export interface CartSyncResponse {
  success: boolean
  items: CartItem[]
  error?: string
}

export const CartSyncService = {
  /**
   * Synchronizes the local cart with the database cart
   */
  syncCart: async (user: User | null, localItems: CartItem[]): Promise<CartSyncResponse> => {
    if (!user) {
      return { success: true, items: localItems }
    }

    try {
      const supabase = createClientComponentClient()

      // 1. Get the user's cart from the database
      const { data: remoteCart, error: fetchError } = await supabase
        .from("user_carts")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is "no rows returned" error
        console.error("Error fetching remote cart:", fetchError)
        return { success: false, items: localItems, error: "Error fetching remote cart" }
      }

      // 2. If no remote cart exists, create one with local items
      if (!remoteCart) {
        if (localItems.length === 0) {
          // No local or remote items, nothing to sync
          return { success: true, items: [] }
        }

        // Create a new cart with local items
        const { error: insertError } = await supabase.from("user_carts").insert({
          user_id: user.id,
          items: localItems,
          updated_at: new Date().toISOString(),
        })

        if (insertError) {
          console.error("Error creating remote cart:", insertError)
          return { success: false, items: localItems, error: "Error creating remote cart" }
        }

        return { success: true, items: localItems }
      }

      // 3. Merge local items with remote items
      const remoteItems: CartItem[] = remoteCart.items || []
      const mergedItems = mergeCartItems(localItems, remoteItems)

      // 4. Update the remote cart with merged items
      const { error: updateError } = await supabase
        .from("user_carts")
        .update({
          items: mergedItems,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      if (updateError) {
        console.error("Error updating remote cart:", updateError)
        return { success: false, items: localItems, error: "Error updating remote cart" }
      }

      return { success: true, items: mergedItems }
    } catch (error) {
      console.error("Unexpected error syncing cart:", error)
      return { success: false, items: localItems, error: "Unexpected error syncing cart" }
    }
  },

  /**
   * Saves the cart to the database
   */
  saveCart: async (user: User | null, items: CartItem[]): Promise<CartSyncResponse> => {
    if (!user) {
      return { success: true, items }
    }

    try {
      const supabase = createClientComponentClient()

      // Check if the user already has a cart
      const { data: existingCart, error: fetchError } = await supabase
        .from("user_carts")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking existing cart:", fetchError)
        return { success: false, items, error: "Error checking existing cart" }
      }

      // Add timestamp to each item
      const itemsWithTimestamp = items.map((item) => ({
        ...item,
        updated_at: new Date().toISOString(),
      }))

      if (existingCart) {
        // Update existing cart
        const { error: updateError } = await supabase
          .from("user_carts")
          .update({
            items: itemsWithTimestamp,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)

        if (updateError) {
          console.error("Error updating cart:", updateError)
          return { success: false, items, error: "Error updating cart" }
        }
      } else {
        // Create a new cart
        const { error: insertError } = await supabase.from("user_carts").insert({
          user_id: user.id,
          items: itemsWithTimestamp,
          updated_at: new Date().toISOString(),
        })

        if (insertError) {
          console.error("Error creating cart:", insertError)
          return { success: false, items, error: "Error creating cart" }
        }
      }

      return { success: true, items: itemsWithTimestamp }
    } catch (error) {
      console.error("Unexpected error saving cart:", error)
      return { success: false, items, error: "Unexpected error saving cart" }
    }
  },

  /**
   * Loads the cart from the database
   */
  loadCart: async (user: User | null): Promise<CartSyncResponse> => {
    if (!user) {
      // Load from localStorage if no user
      try {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          return { success: true, items: JSON.parse(savedCart) }
        }
        return { success: true, items: [] }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
        return { success: false, items: [], error: "Error loading local cart" }
      }
    }

    try {
      const supabase = createClientComponentClient()

      const { data: remoteCart, error: fetchError } = await supabase
        .from("user_carts")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error loading remote cart:", fetchError)
        return { success: false, items: [], error: "Error loading remote cart" }
      }

      if (!remoteCart) {
        return { success: true, items: [] }
      }

      return { success: true, items: remoteCart.items || [] }
    } catch (error) {
      console.error("Unexpected error loading cart:", error)
      return { success: false, items: [], error: "Unexpected error loading cart" }
    }
  },

  /**
   * Removes an item from the cart
   */
  removeItem: async (user: User | null, itemId: string): Promise<CartSyncResponse> => {
    if (!user) {
      // If no user, just return success (will be handled locally)
      return { success: true, items: [] }
    }

    try {
      const supabase = createClientComponentClient()

      // 1. Get the current cart
      const { data: currentCart, error: fetchError } = await supabase
        .from("user_carts")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (fetchError) {
        console.error("Error getting cart to remove item:", fetchError)
        return { success: false, items: [], error: "Error getting cart" }
      }

      if (!currentCart || !currentCart.items) {
        return { success: true, items: [] }
      }

      // 2. Filter out the item to remove
      const updatedItems = currentCart.items.filter((item: CartItem) => item.id !== itemId)

      // 3. Update the cart
      const { error: updateError } = await supabase
        .from("user_carts")
        .update({
          items: updatedItems,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      if (updateError) {
        console.error("Error updating cart after removing item:", updateError)
        return { success: false, items: currentCart.items, error: "Error updating cart" }
      }

      return { success: true, items: updatedItems }
    } catch (error) {
      console.error("Unexpected error removing item from cart:", error)
      return { success: false, items: [], error: "Unexpected error removing item" }
    }
  },

  /**
   * Updates the quantity of an item in the cart
   */
  updateItemQuantity: async (user: User | null, itemId: string, quantity: number): Promise<CartSyncResponse> => {
    if (!user) {
      // If no user, just return success (will be handled locally)
      return { success: true, items: [] }
    }

    try {
      const supabase = createClientComponentClient()

      // 1. Get the current cart
      const { data: currentCart, error: fetchError } = await supabase
        .from("user_carts")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (fetchError) {
        console.error("Error getting cart to update quantity:", fetchError)
        return { success: false, items: [], error: "Error getting cart" }
      }

      if (!currentCart || !currentCart.items) {
        return { success: true, items: [] }
      }

      // 2. Update the quantity of the item
      const updatedItems = currentCart.items.map((item: CartItem) =>
        item.id === itemId ? { ...item, quantity, updated_at: new Date().toISOString() } : item,
      )

      // 3. Update the cart
      const { error: updateError } = await supabase
        .from("user_carts")
        .update({
          items: updatedItems,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      if (updateError) {
        console.error("Error updating quantity in cart:", updateError)
        return { success: false, items: currentCart.items, error: "Error updating cart" }
      }

      return { success: true, items: updatedItems }
    } catch (error) {
      console.error("Unexpected error updating quantity:", error)
      return { success: false, items: [], error: "Unexpected error updating quantity" }
    }
  },

  /**
   * Clears the cart
   */
  clearCart: async (user: User | null): Promise<CartSyncResponse> => {
    if (!user) {
      // If no user, just return success (will be handled locally)
      return { success: true, items: [] }
    }

    try {
      const supabase = createClientComponentClient()

      const { error } = await supabase
        .from("user_carts")
        .update({
          items: [],
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      if (error) {
        console.error("Error clearing cart:", error)
        return { success: false, items: [], error: "Error clearing cart" }
      }

      return { success: true, items: [] }
    } catch (error) {
      console.error("Unexpected error clearing cart:", error)
      return { success: false, items: [], error: "Unexpected error clearing cart" }
    }
  },
}

/**
 * Merges local and remote cart items
 * Strategy: keep the item with the higher quantity or the most recent
 */
function mergeCartItems(localItems: CartItem[], remoteItems: CartItem[]): CartItem[] {
  const mergedMap = new Map<string, CartItem>()

  // Process remote items first
  remoteItems.forEach((item) => {
    const key = `${item.id}-${item.unit || "default"}`
    mergedMap.set(key, { ...item })
  })

  // Process local items and merge with remote
  localItems.forEach((localItem) => {
    const key = `${localItem.id}-${localItem.unit || "default"}`
    const remoteItem = mergedMap.get(key)

    if (!remoteItem) {
      // If item doesn't exist remotely, add it
      mergedMap.set(key, {
        ...localItem,
        updated_at: new Date().toISOString(),
      })
    } else {
      // If it exists, compare timestamps and quantities
      const localDate = localItem.updated_at ? new Date(localItem.updated_at) : new Date(0)
      const remoteDate = remoteItem.updated_at ? new Date(remoteItem.updated_at) : new Date(0)

      // If local is more recent or has higher quantity, update it
      if (localDate > remoteDate || localItem.quantity > remoteItem.quantity) {
        mergedMap.set(key, {
          ...remoteItem,
          quantity: Math.max(localItem.quantity, remoteItem.quantity),
          updated_at: new Date().toISOString(),
        })
      }
    }
  })

  return Array.from(mergedMap.values())
}
