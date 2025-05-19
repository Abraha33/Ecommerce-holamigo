import { createClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import type { CartItem } from "@/components/cart-provider"

export type CartSyncResult = {
  success: boolean
  items: CartItem[]
  error?: string
}

export const CartService = {
  // Save cart to Supabase
  async saveCart(userId: string, items: CartItem[]): Promise<CartSyncResult> {
    try {
      const supabase = createClient()

      // First, delete existing cart items
      await supabase.from("cart_items").delete().eq("user_id", userId)

      if (items.length === 0) {
        return { success: true, items: [] }
      }

      // Then insert new items
      const { error } = await supabase.from("cart_items").insert(
        items.map((item) => ({
          id: uuidv4(),
          user_id: userId,
          product_id: item.product_id,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          image: item.image,
          variant: item.variant,
          unit: item.unit,
          brand: item.brand,
        })),
      )

      if (error) {
        console.error("Error saving cart to Supabase:", error)
        return { success: false, items, error: error.message }
      }

      return { success: true, items }
    } catch (error) {
      console.error("Exception saving cart:", error)
      return { success: false, items, error: "Failed to save cart" }
    }
  },

  // Load cart from Supabase
  async loadCart(userId: string): Promise<CartSyncResult> {
    try {
      const supabase = createClient()

      const { data, error } = await supabase.from("cart_items").select("*").eq("user_id", userId)

      if (error) {
        console.error("Error loading cart from Supabase:", error)
        return { success: false, items: [], error: error.message }
      }

      const items = data.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        variant: item.variant,
        unit: item.unit,
        brand: item.brand,
        updated_at: item.updated_at,
      }))

      return { success: true, items }
    } catch (error) {
      console.error("Exception loading cart:", error)
      return { success: false, items: [], error: "Failed to load cart" }
    }
  },

  // Remove item from cart
  async removeItem(userId: string, itemId: string): Promise<CartSyncResult> {
    try {
      const supabase = createClient()

      const { error } = await supabase.from("cart_items").delete().eq("user_id", userId).eq("id", itemId)

      if (error) {
        console.error("Error removing item from Supabase:", error)
        return { success: false, items: [], error: error.message }
      }

      return { success: true, items: [] }
    } catch (error) {
      console.error("Exception removing item:", error)
      return { success: false, items: [], error: "Failed to remove item" }
    }
  },

  // Update item quantity
  async updateItemQuantity(userId: string, itemId: string, quantity: number): Promise<CartSyncResult> {
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("cart_items")
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("id", itemId)

      if (error) {
        console.error("Error updating quantity in Supabase:", error)
        return { success: false, items: [], error: error.message }
      }

      return { success: true, items: [] }
    } catch (error) {
      console.error("Exception updating quantity:", error)
      return { success: false, items: [], error: "Failed to update quantity" }
    }
  },

  // Clear cart
  async clearCart(userId: string): Promise<CartSyncResult> {
    try {
      const supabase = createClient()

      const { error } = await supabase.from("cart_items").delete().eq("user_id", userId)

      if (error) {
        console.error("Error clearing cart in Supabase:", error)
        return { success: false, items: [], error: error.message }
      }

      return { success: true, items: [] }
    } catch (error) {
      console.error("Exception clearing cart:", error)
      return { success: false, items: [], error: "Failed to clear cart" }
    }
  },
}
