import { createClientComponentClient } from "./supabase"
import { v4 as uuidv4 } from "uuid"

export interface CartItem {
  id?: string
  cart_id?: string
  product_id: string
  name: string
  price: number
  quantity: number
  image?: string
  variant?: string
  unit?: string
  sku?: string
}

// Obtener o crear un ID de carrito
export const getOrCreateCartId = async (): Promise<string> => {
  try {
    // Verificar si estamos en el cliente
    if (typeof window === "undefined") {
      return "server-side-cart-id"
    }

    // Intentar obtener el ID del carrito del localStorage
    let cartId = localStorage.getItem("cartId")

    if (!cartId) {
      // Si no existe, crear un nuevo carrito en Supabase
      const supabase = createClientComponentClient()

      // Crear un nuevo carrito sin requerir autenticación
      const newCartId = uuidv4()

      try {
        // Intentar crear el carrito en Supabase, pero no fallar si hay error
        const { error } = await supabase
          .from("carts")
          .insert({
            id: newCartId,
            user_id: null, // No asociamos a un usuario por ahora
          })
          .select("id")
          .single()

        if (error) {
          console.warn("No se pudo crear el carrito en Supabase, usando ID local:", error)
        }
      } catch (e) {
        console.warn("Error al crear carrito en Supabase, usando ID local:", e)
      }

      // Usar el nuevo ID generado
      cartId = newCartId

      // Guardar el ID del carrito en localStorage
      localStorage.setItem("cartId", cartId)
    }

    return cartId
  } catch (error) {
    console.error("Error en getOrCreateCartId:", error)
    // Fallback: crear un ID local si hay un error
    if (typeof window !== "undefined") {
      const fallbackId = uuidv4()
      localStorage.setItem("cartId", fallbackId)
      return fallbackId
    }
    return "error-cart-id"
  }
}

// Obtener los items del carrito
export const getCartItems = async (): Promise<CartItem[]> => {
  try {
    // Verificar si estamos en el cliente
    if (typeof window === "undefined") {
      return []
    }

    const cartId = await getOrCreateCartId()
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.from("cart_items").select("*").eq("cart_id", cartId)

    if (error) {
      console.error("Error al obtener los items del carrito:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error al obtener items del carrito:", error)
    return []
  }
}

// Añadir un item al carrito
export const addToCart = async (item: CartItem): Promise<void> => {
  try {
    const cartId = await getOrCreateCartId()
    const supabase = createClientComponentClient()

    // Verificar si el producto ya está en el carrito
    const { data: existingItems, error: queryError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cartId)
      .eq("product_id", item.product_id)
      .eq("variant", item.variant || "")

    if (queryError) {
      console.error("Error al buscar item en el carrito:", queryError)
      throw new Error("Error al buscar item en el carrito")
    }

    if (existingItems && existingItems.length > 0) {
      // Actualizar la cantidad si el producto ya está en el carrito
      const existingItem = existingItems[0]
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({
          quantity: existingItem.quantity + item.quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id)

      if (updateError) {
        console.error("Error al actualizar item en el carrito:", updateError)
        throw new Error("Error al actualizar item en el carrito")
      }
    } else {
      // Añadir nuevo item al carrito
      const { error: insertError } = await supabase.from("cart_items").insert({
        ...item,
        cart_id: cartId,
      })

      if (insertError) {
        console.error("Error al añadir item al carrito:", insertError)
        throw new Error("Error al añadir item al carrito")
      }
    }
  } catch (error) {
    console.error("Error en addToCart:", error)
    throw error
  }
}

// Actualizar la cantidad de un item en el carrito
export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<void> => {
  try {
    const supabase = createClientComponentClient()

    await supabase
      .from("cart_items")
      .update({
        quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
  } catch (error) {
    console.error("Error al actualizar cantidad:", error)
    throw error
  }
}

// Eliminar un item del carrito
export const removeFromCart = async (itemId: string): Promise<void> => {
  try {
    const supabase = createClientComponentClient()

    await supabase.from("cart_items").delete().eq("id", itemId)
  } catch (error) {
    console.error("Error al eliminar item del carrito:", error)
    throw error
  }
}

// Vaciar el carrito
export const clearCart = async (): Promise<void> => {
  try {
    const cartId = await getOrCreateCartId()
    const supabase = createClientComponentClient()

    await supabase.from("cart_items").delete().eq("cart_id", cartId)
  } catch (error) {
    console.error("Error al vaciar el carrito:", error)
    throw error
  }
}

// Calcular el subtotal del carrito
export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}
