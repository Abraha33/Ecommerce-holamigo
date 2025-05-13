// Tipos para los métodos de envío
export type DeliveryType = "sprint" | "programada" | "tienda"

export interface DeliverySchedule {
  day: string | null
  timeSlot: string | null
}

// Add this type at the top of the file
export interface Address {
  id: string
  name: string
  address: string
  city: string
  isDefault: boolean
}

// Update the DeliveryInfo interface
export interface DeliveryInfo {
  type: DeliveryType
  schedule?: DeliverySchedule
  storeAddress?: string
  selectedAddress?: Address // Add this line
}

// Modificar el servicio de entrega para mejorar la persistencia y sincronización

// Definir la clave para localStorage como constante exportada
export const DELIVERY_INFO_KEY = "holamigo_delivery_info"

// Modificar la función saveDeliveryMethod para mejorar la sincronización
export const saveDeliveryMethod = (deliveryInfo: DeliveryInfo): void => {
  try {
    // Save all information in a single object
    localStorage.setItem(DELIVERY_INFO_KEY, JSON.stringify(deliveryInfo))

    // Trigger a storage event so other components are notified
    // This is useful for synchronizing between tabs
    window.dispatchEvent(new Event("storage"))

    // Trigger a custom event to synchronize within the same tab
    window.dispatchEvent(new CustomEvent("delivery-update", { detail: deliveryInfo }))

    console.log("Delivery method updated:", deliveryInfo)
  } catch (error) {
    console.error("Error al guardar método de envío:", error)
  }
}

// Modificar la función getDeliveryMethod para ser más robusta
export const getDeliveryMethod = (): DeliveryInfo => {
  try {
    const savedInfo = localStorage.getItem(DELIVERY_INFO_KEY)
    if (savedInfo) {
      const parsedInfo = JSON.parse(savedInfo) as DeliveryInfo

      // Validate that the information has the correct format
      if (typeof parsedInfo === "object" && parsedInfo !== null && "type" in parsedInfo) {
        return parsedInfo
      }
    }
  } catch (error) {
    console.error("Error al obtener método de envío:", error)
  }

  // Default value - sprint is the default but doesn't restrict user choices
  return { type: "sprint" }
}

// Obtener el tiempo estimado de entrega según el tipo
export const getDeliveryTime = (type: DeliveryType): string => {
  switch (type) {
    case "sprint":
      return "11 - 17 min"
    case "programada":
      return "1 - 3 días"
    case "tienda":
      return "24 horas"
    default:
      return "11 - 17 min"
  }
}

// Obtener el título del método de entrega
export const getDeliveryTitle = (type: DeliveryType): string => {
  switch (type) {
    case "sprint":
      return "Envío express"
    case "programada":
      return "Entrega programada"
    case "tienda":
      return "Recoge en tienda"
    default:
      return "Envío express"
  }
}
