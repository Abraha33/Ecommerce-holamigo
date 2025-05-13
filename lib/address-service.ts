import { createClientComponentClient } from "./supabase"
import { v4 as uuidv4 } from "uuid"

export interface Address {
  id: string
  user_id: string
  name: string
  recipient: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
  is_default: boolean
  neighborhood?: string
  additional_info?: string
  created_at?: string
  updated_at?: string
}

export type AddressInput = Omit<Address, "id" | "user_id" | "created_at" | "updated_at">

/**
 * Obtiene todas las direcciones del usuario actual
 */
export const getUserAddresses = async (): Promise<Address[]> => {
  try {
    const supabase = createClientComponentClient()

    // Verificar si el usuario está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.warn("No hay usuario autenticado para obtener direcciones")
      return []
    }

    // Obtener las direcciones del usuario
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error al obtener direcciones:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error al obtener direcciones:", error)
    return []
  }
}

/**
 * Obtiene una dirección por su ID
 */
export const getAddressById = async (addressId: string): Promise<Address | null> => {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.from("addresses").select("*").eq("id", addressId).single()

    if (error) {
      console.error("Error al obtener dirección:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error al obtener dirección:", error)
    return null
  }
}

/**
 * Obtiene la dirección predeterminada del usuario
 */
export const getDefaultAddress = async (): Promise<Address | null> => {
  try {
    const supabase = createClientComponentClient()

    // Verificar si el usuario está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.warn("No hay usuario autenticado para obtener dirección predeterminada")
      return null
    }

    // Obtener la dirección predeterminada
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 es el código para "no se encontraron resultados"
      console.error("Error al obtener dirección predeterminada:", error)
      return null
    }

    // Si no hay dirección predeterminada, intentar obtener la primera dirección
    if (!data) {
      const { data: firstAddress, error: firstAddressError } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (firstAddressError) {
        return null
      }

      return firstAddress
    }

    return data
  } catch (error) {
    console.error("Error al obtener dirección predeterminada:", error)
    return null
  }
}

/**
 * Crea una nueva dirección para el usuario
 */
export const createAddress = async (addressData: AddressInput): Promise<Address | null> => {
  try {
    const supabase = createClientComponentClient()

    // Verificar si el usuario está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.warn("No hay usuario autenticado para crear dirección")
      return null
    }

    // Si la dirección es predeterminada, actualizar las demás direcciones
    if (addressData.is_default) {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id)
    }

    // Crear la nueva dirección
    const newAddress: Address = {
      id: uuidv4(),
      user_id: user.id,
      ...addressData,
    }

    const { data, error } = await supabase.from("addresses").insert(newAddress).select().single()

    if (error) {
      console.error("Error al crear dirección:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error al crear dirección:", error)
    return null
  }
}

/**
 * Actualiza una dirección existente
 */
export const updateAddress = async (addressId: string, addressData: Partial<AddressInput>): Promise<Address | null> => {
  try {
    const supabase = createClientComponentClient()

    // Verificar si el usuario está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.warn("No hay usuario autenticado para actualizar dirección")
      return null
    }

    // Si la dirección es predeterminada, actualizar las demás direcciones
    if (addressData.is_default) {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id)
    }

    // Actualizar la dirección
    const { data, error } = await supabase
      .from("addresses")
      .update({
        ...addressData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", addressId)
      .eq("user_id", user.id) // Asegurar que la dirección pertenece al usuario
      .select()
      .single()

    if (error) {
      console.error("Error al actualizar dirección:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error al actualizar dirección:", error)
    return null
  }
}

/**
 * Elimina una dirección
 */
export const deleteAddress = async (addressId: string): Promise<boolean> => {
  try {
    const supabase = createClientComponentClient()

    // Verificar si el usuario está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.warn("No hay usuario autenticado para eliminar dirección")
      return false
    }

    // Verificar si la dirección es predeterminada
    const { data: address } = await supabase
      .from("addresses")
      .select("is_default")
      .eq("id", addressId)
      .eq("user_id", user.id)
      .single()

    // Eliminar la dirección
    const { error } = await supabase.from("addresses").delete().eq("id", addressId).eq("user_id", user.id) // Asegurar que la dirección pertenece al usuario

    if (error) {
      console.error("Error al eliminar dirección:", error)
      return false
    }

    // Si la dirección eliminada era predeterminada, establecer otra como predeterminada
    if (address?.is_default) {
      const { data: addresses } = await supabase
        .from("addresses")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)

      if (addresses && addresses.length > 0) {
        await supabase.from("addresses").update({ is_default: true }).eq("id", addresses[0].id)
      }
    }

    return true
  } catch (error) {
    console.error("Error al eliminar dirección:", error)
    return false
  }
}

/**
 * Establece una dirección como predeterminada
 */
export const setDefaultAddress = async (addressId: string): Promise<boolean> => {
  try {
    const supabase = createClientComponentClient()

    // Verificar si el usuario está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.warn("No hay usuario autenticado para establecer dirección predeterminada")
      return false
    }

    // Actualizar todas las direcciones para quitar la marca de predeterminada
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id)

    // Establecer la dirección seleccionada como predeterminada
    const { error } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", addressId)
      .eq("user_id", user.id) // Asegurar que la dirección pertenece al usuario

    if (error) {
      console.error("Error al establecer dirección predeterminada:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error al establecer dirección predeterminada:", error)
    return false
  }
}

/**
 * Guarda una dirección temporal para usuarios no autenticados
 */
export const saveTemporaryAddress = (address: Partial<AddressInput>): void => {
  try {
    localStorage.setItem("temporaryAddress", JSON.stringify(address))
  } catch (error) {
    console.error("Error al guardar dirección temporal:", error)
  }
}

/**
 * Obtiene la dirección temporal para usuarios no autenticados
 */
export const getTemporaryAddress = (): Partial<AddressInput> | null => {
  try {
    const savedAddress = localStorage.getItem("temporaryAddress")
    if (savedAddress) {
      return JSON.parse(savedAddress)
    }
    return null
  } catch (error) {
    console.error("Error al obtener dirección temporal:", error)
    return null
  }
}

/**
 * Sincroniza la dirección temporal con la cuenta del usuario cuando inicia sesión
 */
export const syncTemporaryAddress = async (): Promise<void> => {
  try {
    const tempAddress = getTemporaryAddress()
    if (!tempAddress) return

    const supabase = createClientComponentClient()

    // Verificar si el usuario está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    // Crear la dirección para el usuario
    if (tempAddress.address && tempAddress.city) {
      await createAddress({
        name: tempAddress.name || "Dirección principal",
        recipient: tempAddress.recipient || user.email || "",
        address: tempAddress.address,
        city: tempAddress.city,
        state: tempAddress.state || "",
        postal_code: tempAddress.postal_code || "",
        country: tempAddress.country || "Colombia",
        phone: tempAddress.phone || "",
        is_default: true,
        neighborhood: tempAddress.neighborhood,
        additional_info: tempAddress.additional_info,
      })

      // Eliminar la dirección temporal
      localStorage.removeItem("temporaryAddress")
    }
  } catch (error) {
    console.error("Error al sincronizar dirección temporal:", error)
  }
}
