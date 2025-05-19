import { createClientComponentClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"
import type { CartItem } from "@/lib/cart-sync-service"

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

export interface Order {
  id?: string
  order_number: string
  user_id?: string
  status: string
  total: number
  shipping_cost: number
  discount: number
  shipping_address: ShippingAddress
  payment_method: string
  payment_status: string
  delivery_type: string
  delivery_date?: string
  tracking_number?: string
  notes?: string
  created_at?: string
  updated_at?: string
  items: CartItem[]
}

// Generate a unique order number
export const generateOrderNumber = (): string => {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")

  return `ORD-${year}${month}${day}-${random}`
}

// Create a new order
export const createOrder = async (
  items: CartItem[],
  shippingAddress: ShippingAddress,
  paymentMethod: string,
  deliveryType: string,
  notes?: string,
): Promise<Order | null> => {
  try {
    const supabase = createClientComponentClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = deliveryType === "express" ? 15000 : 8000 // Example shipping cost
    const discount = 0 // Implement discount logic if needed

    // Create the order
    const orderId = uuidv4()
    const orderNumber = generateOrderNumber()

    const order: Order = {
      id: orderId,
      order_number: orderNumber,
      user_id: user?.id,
      status: "pending",
      total: subtotal + shippingCost - discount,
      shipping_cost: shippingCost,
      discount: discount,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      payment_status: paymentMethod.includes("contraentrega") ? "pending" : "processing",
      delivery_type: deliveryType,
      notes: notes,
      items: items,
    }

    // Insert the order into the database
    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      order_number: orderNumber,
      user_id: user?.id,
      status: "pending",
      total: subtotal + shippingCost - discount,
      shipping_cost: shippingCost,
      discount: discount,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      payment_status: paymentMethod.includes("contraentrega") ? "pending" : "processing",
      delivery_type: deliveryType,
      notes: notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (orderError) {
      console.error("Error creating order:", orderError)
      return null
    }

    // Prepare order items
    const orderItems = items.map((item) => {
      // Ensure product_id is valid
      const product_id = item.product_id || `temp-${uuidv4()}`

      return {
        id: uuidv4(),
        order_id: orderId,
        product_id: product_id,
        name: item.name || "Unnamed product",
        price: item.price || 0,
        quantity: item.quantity || 1,
        image: item.image || null,
        variant: item.variant || null,
        unit: item.unit || null,
        sku: item.sku || null,
        created_at: new Date().toISOString(),
      }
    })

    // Check if there are items to insert
    if (orderItems.length === 0) {
      console.error("No items to insert in the order")
      return null
    }

    // Insert order items
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error inserting order items:", itemsError)
      return null
    }

    // Record initial order status
    const { error: statusError } = await supabase.from("order_status_history").insert({
      id: uuidv4(),
      order_id: orderId,
      status: "pending",
      description: "Order received",
      created_at: new Date().toISOString(),
    })

    if (statusError) {
      console.error("Error recording order status:", statusError)
    }

    return order
  } catch (error) {
    console.error("Error creating order:", error)
    return null
  }
}

// Get an order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const supabase = createClientComponentClient()

    // Get the order
    const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (orderError) {
      console.error("Error getting order:", orderError)
      return null
    }

    // Get order items
    const { data: items, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", orderId)

    if (itemsError) {
      console.error("Error getting order items:", itemsError)
      return null
    }

    return {
      ...order,
      items: items || [],
    }
  } catch (error) {
    console.error("Error getting order:", error)
    return null
  }
}

// Get user's orders
export const getUserOrders = async (user: User | null): Promise<Order[]> => {
  try {
    if (!user) {
      return []
    }

    const supabase = createClientComponentClient()

    // Get user's orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (ordersError) {
      console.error("Error getting orders:", ordersError)
      return []
    }

    // Get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id)

        if (itemsError) {
          console.error("Error getting order items:", itemsError)
          return { ...order, items: [] }
        }

        return { ...order, items: items || [] }
      }),
    )

    return ordersWithItems
  } catch (error) {
    console.error("Error getting orders:", error)
    return []
  }
}

// Get the latest order for a user
export const getLatestOrder = async (user: User | null): Promise<Order | null> => {
  try {
    if (!user) {
      return null
    }

    const supabase = createClientComponentClient()

    // Get the most recent order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (orderError) {
      console.error("Error getting latest order:", orderError)
      return null
    }

    // Get order items
    const { data: items, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", order.id)

    if (itemsError) {
      console.error("Error getting order items:", itemsError)
      return null
    }

    return {
      ...order,
      items: items || [],
    }
  } catch (error) {
    console.error("Error getting latest order:", error)
    return null
  }
}

// Update order status
export const updateOrderStatus = async (orderId: string, status: string, description?: string): Promise<boolean> => {
  try {
    const supabase = createClientComponentClient()

    // Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId)

    if (updateError) {
      console.error("Error updating order status:", updateError)
      return false
    }

    // Record status change in history
    const { error: historyError } = await supabase.from("order_status_history").insert({
      id: uuidv4(),
      order_id: orderId,
      status,
      description: description || `Status updated to ${status}`,
      created_at: new Date().toISOString(),
    })

    if (historyError) {
      console.error("Error recording status history:", historyError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error updating order status:", error)
    return false
  }
}
