"use server"

import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

// Definición de tipos de usuario
export type UserProfile = "regular" | "vip" | "new" | "business" | "international"

// Configuraciones para cada tipo de perfil
const profileConfigs = {
  regular: {
    full_name: "Cliente Regular",
    phone: "+573001234567",
    avatar_url: "/diverse-woman-avatar.png",
    address: {
      name: "Casa",
      address: "Calle 123 # 45-67",
      city: "Bucaramanga",
      state: "Santander",
      postal_code: "680001",
      country: "Colombia",
    },
    orderHistory: true,
  },
  vip: {
    full_name: "Cliente VIP",
    phone: "+573009876543",
    avatar_url: "/man-avatar.png",
    address: {
      name: "Apartamento",
      address: "Carrera 45 # 67-89, Apto 1201, Edificio Mirador",
      city: "Medellín",
      state: "Antioquia",
      postal_code: "050021",
      country: "Colombia",
    },
    orderHistory: true,
    isVip: true,
  },
  new: {
    full_name: "Cliente Nuevo",
    phone: "+573005551234",
    avatar_url: "/woman-avatar-2.png",
    address: null, // Sin dirección guardada
    orderHistory: false,
  },
  business: {
    full_name: "Cliente Empresarial",
    phone: "+573007778899",
    avatar_url: "/chef-avatar.png",
    address: {
      name: "Oficina Principal",
      address: "Avenida El Dorado # 100-25, Edificio Empresarial, Piso 15",
      city: "Bogotá",
      state: "Cundinamarca",
      postal_code: "110911",
      country: "Colombia",
    },
    orderHistory: true,
    isBusiness: true,
    nit: "901.234.567-8",
    companyName: "Distribuidora Empresarial S.A.S.",
  },
  international: {
    full_name: "Cliente Internacional",
    phone: "+17865551234",
    avatar_url: "/diverse-woman-avatar.png",
    address: {
      name: "Dirección Internacional",
      address: "123 Main Street, Apt 4B",
      city: "Miami",
      state: "Florida",
      postal_code: "33101",
      country: "Estados Unidos",
    },
    orderHistory: true,
    isInternational: true,
  },
}

export async function createTestUser(profileType: UserProfile = "regular") {
  // Crear cliente de Supabase con las credenciales de servicio
  const supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

  // Obtener configuración del perfil seleccionado
  const profileConfig = profileConfigs[profileType]

  // Generar email único basado en el tipo de perfil
  const timestamp = new Date().getTime().toString().slice(-6) // Últimos 6 dígitos del timestamp
  const email = `${profileType}.${timestamp}@holamigo.com`
  const password = "Prueba123!"

  try {
    // Crear el usuario en Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: profileConfig.full_name,
        phone: profileConfig.phone,
        avatar_url: profileConfig.avatar_url,
        profile_type: profileType,
        ...(profileConfig.isBusiness && {
          is_business: true,
          nit: profileConfig.nit,
          company_name: profileConfig.companyName,
        }),
        ...(profileConfig.isVip && { is_vip: true }),
        ...(profileConfig.isInternational && { is_international: true }),
      },
    })

    if (authError) {
      console.error("Error al crear usuario en Auth:", authError)
      return { success: false, message: authError.message }
    }

    // Crear el perfil del usuario en la tabla user_profiles
    const { error: profileError } = await supabase.from("user_profiles").insert({
      id: authUser.user.id,
      email,
      full_name: profileConfig.full_name,
      phone: profileConfig.phone,
      avatar_url: profileConfig.avatar_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      ...(profileConfig.isBusiness && {
        is_business: true,
        nit: profileConfig.nit,
        company_name: profileConfig.companyName,
      }),
      ...(profileConfig.isVip && { is_vip: true }),
      ...(profileConfig.isInternational && { is_international: true }),
    })

    if (profileError) {
      console.error("Error al crear perfil de usuario:", profileError)
      return { success: false, message: profileError.message }
    }

    // Crear dirección si está definida en el perfil
    let addressId = null
    if (profileConfig.address) {
      // Generar un UUID para la dirección
      addressId = uuidv4()

      const { error: addressError } = await supabase.from("addresses").insert({
        id: addressId, // Proporcionar un ID explícito
        user_id: authUser.user.id,
        name: profileConfig.address.name,
        address: profileConfig.address.address,
        city: profileConfig.address.city,
        state: profileConfig.address.state,
        postal_code: profileConfig.address.postal_code,
        country: profileConfig.address.country,
        is_default: true,
        phone: profileConfig.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (addressError) {
        console.error("Error al crear dirección:", addressError)
        addressId = null // Resetear si hay error
      }
    }

    // Crear historial de pedidos si está configurado
    if (profileConfig.orderHistory) {
      await createSampleOrders(supabase, authUser.user.id, profileType, addressId)
    }

    return {
      success: true,
      message: `Usuario de prueba (${profileType}) creado correctamente`,
      email,
      password,
      profileType,
    }
  } catch (error) {
    console.error("Error inesperado:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

// Función para crear pedidos de muestra
async function createSampleOrders(supabase: any, userId: string, profileType: UserProfile, addressId: string | null) {
  // Configuraciones de pedidos según el tipo de perfil
  const orderConfigs = {
    regular: [
      { status: "completed", items: 3, total: 75000, date: -15 }, // Hace 15 días
      { status: "processing", items: 2, total: 45000, date: -2 }, // Hace 2 días
    ],
    vip: [
      { status: "completed", items: 5, total: 350000, date: -30 }, // Hace 30 días
      { status: "completed", items: 4, total: 280000, date: -20 }, // Hace 20 días
      { status: "completed", items: 6, total: 420000, date: -10 }, // Hace 10 días
      { status: "processing", items: 3, total: 190000, date: -1 }, // Hace 1 día
    ],
    business: [
      { status: "completed", items: 10, total: 1200000, date: -45 }, // Hace 45 días
      { status: "completed", items: 12, total: 1500000, date: -30 }, // Hace 30 días
      { status: "completed", items: 8, total: 950000, date: -15 }, // Hace 15 días
      { status: "processing", items: 15, total: 1800000, date: -3 }, // Hace 3 días
    ],
    international: [
      { status: "completed", items: 4, total: 320000, date: -60 }, // Hace 60 días
      { status: "processing", items: 3, total: 250000, date: -5 }, // Hace 5 días
    ],
    new: [], // Sin historial de pedidos
  }

  const orders = orderConfigs[profileType] || []

  // Primero, verificar la estructura de la tabla orders
  const { data: tableInfo, error: tableError } = await supabase.from("orders").select("*").limit(1)

  if (tableError) {
    console.error("Error al verificar la estructura de la tabla orders:", tableError)
    return
  }

  // Verificar si la tabla está vacía
  if (!tableInfo || tableInfo.length === 0) {
    // Si la tabla está vacía, necesitamos crear la estructura primero
    const { error: createError } = await supabase.from("orders").insert({
      id: uuidv4(),
      user_id: userId,
      status: "test",
      total_amount: 0,
      payment_method: "test",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // No incluimos shipping_address_id
    })

    if (createError) {
      console.error("Error al crear la estructura inicial de orders:", createError)
      return
    }
  }

  for (const order of orders) {
    const orderDate = new Date()
    orderDate.setDate(orderDate.getDate() + order.date)

    // Generar un UUID para el pedido
    const orderId = uuidv4()

    // Crear el pedido sin shipping_address_id
    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      user_id: userId,
      status: order.status,
      total_amount: order.total,
      payment_method: order.status === "completed" ? "credit_card" : "pending",
      created_at: orderDate.toISOString(),
      updated_at: orderDate.toISOString(),
      // Omitimos shipping_address_id
    })

    if (orderError) {
      console.error("Error al crear pedido:", orderError)
      continue
    }

    // Verificar la estructura de la tabla order_items
    const { data: itemsTableInfo, error: itemsTableError } = await supabase.from("order_items").select("*").limit(1)

    if (itemsTableError) {
      console.error("Error al verificar la estructura de la tabla order_items:", itemsTableError)
      continue
    }

    // Crear elementos del pedido
    for (let i = 0; i < order.items; i++) {
      const orderItemId = uuidv4()
      const productId = uuidv4() // Generar un ID de producto ficticio

      const { error: itemError } = await supabase.from("order_items").insert({
        id: orderItemId,
        order_id: orderId,
        product_id: productId,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: Math.floor(order.total / order.items),
        created_at: orderDate.toISOString(),
      })

      if (itemError) {
        console.error("Error al crear item de pedido:", itemError)
      }
    }
  }
}
