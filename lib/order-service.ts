import { createClientComponentClient } from "./supabase"
import { v4 as uuidv4 } from "uuid"
import type { CartItem } from "./cart-service"

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

// Generar un número de orden único
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

// Crear un nuevo pedido
export const createOrder = async (
  items: CartItem[],
  shippingAddress: ShippingAddress,
  paymentMethod: string,
  deliveryType: string,
  notes?: string,
): Promise<Order | null> => {
  try {
    const supabase = createClientComponentClient()

    // Verificar si el usuario está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Calcular el total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = deliveryType === "express" ? 15000 : 8000 // Ejemplo de costo de envío
    const discount = 0 // Implementar lógica de descuentos si es necesario

    // Crear el pedido
    const orderId = uuidv4()
    const orderNumber = generateOrderNumber()

    const order: Order = {
      id: orderId,
      order_number: orderNumber,
      user_id: user?.id,
      status: "pending",
      total: total + shippingCost - discount,
      shipping_cost: shippingCost,
      discount: discount,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      payment_status: paymentMethod.includes("contraentrega") ? "pending" : "processing",
      delivery_type: deliveryType,
      notes: notes,
      items: items,
    }

    // Insertar el pedido en la base de datos
    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      order_number: orderNumber,
      user_id: user?.id,
      status: "pending",
      total: total + shippingCost - discount,
      shipping_cost: shippingCost,
      discount: discount,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      payment_status: paymentMethod.includes("contraentrega") ? "pending" : "processing",
      delivery_type: deliveryType,
      notes: notes,
    })

    if (orderError) {
      console.error("Error al crear el pedido:", orderError)
      return null
    }

    // Insertar los items del pedido
    const orderItems = items.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      variant: item.variant,
      unit: item.unit,
      sku: item.sku,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error al insertar los items del pedido:", itemsError)
      return null
    }

    // Registrar el estado inicial del pedido
    const { error: statusError } = await supabase.from("order_status_history").insert({
      order_id: orderId,
      status: "pending",
      description: "Pedido recibido",
    })

    if (statusError) {
      console.error("Error al registrar el estado del pedido:", statusError)
    }

    return order
  } catch (error) {
    console.error("Error al crear el pedido:", error)
    return null
  }
}

// Obtener un pedido por ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const supabase = createClientComponentClient()

    // Obtener el pedido
    const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (orderError) {
      console.error("Error al obtener el pedido:", orderError)
      return null
    }

    // Obtener los items del pedido
    const { data: items, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", orderId)

    if (itemsError) {
      console.error("Error al obtener los items del pedido:", itemsError)
      return null
    }

    return {
      ...order,
      items: items || [],
    }
  } catch (error) {
    console.error("Error al obtener el pedido:", error)
    return null
  }
}

// Obtener los pedidos de un usuario
export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const supabase = createClientComponentClient()

    // Verificar si el usuario está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    // Obtener los pedidos del usuario
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (ordersError) {
      console.error("Error al obtener los pedidos:", ordersError)
      return []
    }

    // Para cada pedido, obtener sus items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id)

        if (itemsError) {
          console.error("Error al obtener los items del pedido:", itemsError)
          return { ...order, items: [] }
        }

        return { ...order, items: items || [] }
      }),
    )

    return ordersWithItems
  } catch (error) {
    console.error("Error al obtener los pedidos:", error)
    return []
  }
}

// Actualizar el estado de un pedido
export const updateOrderStatus = async (orderId: string, status: string, description?: string): Promise<boolean> => {
  try {
    const supabase = createClientComponentClient()

    // Actualizar el estado del pedido
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId)

    if (updateError) {
      console.error("Error al actualizar el estado del pedido:", updateError)
      return false
    }

    // Registrar el cambio de estado en el historial
    const { error: historyError } = await supabase.from("order_status_history").insert({
      order_id: orderId,
      status,
      description: description || `Estado actualizado a ${status}`,
    })

    if (historyError) {
      console.error("Error al registrar el historial de estado:", historyError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error)
    return false
  }
}
