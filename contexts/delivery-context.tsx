"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type DeliveryType, type DeliveryInfo, getDeliveryMethod, saveDeliveryMethod } from "@/lib/delivery-service"

// Add this type at the top of the file, after other imports
type Address = {
  id: string
  name: string
  address: string
  city: string
  isDefault: boolean
}

// Añade esta función al inicio del archivo para verificar si estamos en el cliente
const isClient = typeof window !== "undefined"

// Modifica la función getLocalDeliveryInfo para manejar el caso del servidor
const getLocalDeliveryInfo = (): DeliveryInfo => {
  if (!isClient) {
    return {
      type: "tienda",
      storeAddress: "Calle 31#15-09, Centro",
      scheduledDate: null,
      scheduledTime: null,
      address: null,
    }
  }

  try {
    const savedInfo = localStorage.getItem("deliveryInfo")
    if (savedInfo) {
      return JSON.parse(savedInfo)
    }
  } catch (error) {
    console.error("Error al obtener método de envío:", error)
  }

  return {
    type: "tienda",
    storeAddress: "Calle 31#15-09, Centro",
    scheduledDate: null,
    scheduledTime: null,
    address: null,
  }
}

// Update the DeliveryContextType interface to include selectedAddress
interface DeliveryContextType {
  deliveryInfo: DeliveryInfo & { selectedAddress?: Address }
  updateDeliveryType: (type: DeliveryType) => void
  updateSchedule: (day: string | null, timeSlot: string | null) => void
  updateStoreAddress: (address: string) => void
  updateSelectedAddress: (address: Address) => void // Add this line
  isDeliveryModalOpen: boolean
  openDeliveryModal: () => void
  closeDeliveryModal: () => void
  isScheduleModalOpen: boolean
  openScheduleModal: () => void
  closeScheduleModal: () => void
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined)

const DELIVERY_INFO_KEY = "deliveryInfo"

export function DeliveryProvider({ children }: { children: ReactNode }) {
  // Obtener el método de envío guardado
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>(getDeliveryMethod())
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)

  // Actualizar el método de envío
  const updateDeliveryType = (type: DeliveryType) => {
    const newDeliveryInfo: DeliveryInfo = {
      ...deliveryInfo,
      type,
    }

    // If we change to a type that is not scheduled, remove the schedule
    if (type !== "programada") {
      delete newDeliveryInfo.schedule
    }

    // If we change to a type that is not store pickup, remove the store address
    if (type !== "tienda") {
      delete newDeliveryInfo.storeAddress
    }

    // Save the delivery method
    saveDeliveryMethod(newDeliveryInfo)

    // Update the local state immediately
    setDeliveryInfo(newDeliveryInfo)

    // Emit a custom event to synchronize other components
    window.dispatchEvent(new CustomEvent("delivery-update", { detail: newDeliveryInfo }))

    console.log("Delivery type updated:", type, newDeliveryInfo)
  }

  // Actualizar la programación
  const updateSchedule = (day: string | null, timeSlot: string | null) => {
    const newDeliveryInfo: DeliveryInfo = {
      ...deliveryInfo,
      type: "programada", // Si actualizamos la programación, cambiamos a tipo programada
      schedule: {
        day,
        timeSlot,
      },
      // Preservar la dirección seleccionada si existe
      selectedAddress: deliveryInfo.selectedAddress,
    }

    // Guardar el método de envío
    saveDeliveryMethod(newDeliveryInfo)

    // Actualizar el estado local inmediatamente
    setDeliveryInfo(newDeliveryInfo)

    // Emitir evento personalizado para sincronizar otros componentes
    window.dispatchEvent(new CustomEvent("delivery-update", { detail: newDeliveryInfo }))
  }

  // Actualizar la dirección de la tienda
  const updateStoreAddress = (address: string) => {
    const newDeliveryInfo: DeliveryInfo = {
      ...deliveryInfo,
      type: "tienda", // Si actualizamos la dirección de la tienda, cambiamos a tipo tienda
      storeAddress: address,
    }

    // Guardar el método de envío
    saveDeliveryMethod(newDeliveryInfo)

    // Actualizar el estado local inmediatamente
    setDeliveryInfo(newDeliveryInfo)

    // Emitir evento personalizado para sincronizar otros componentes
    window.dispatchEvent(new CustomEvent("delivery-update", { detail: newDeliveryInfo }))
  }

  // Add this function after the updateStoreAddress function
  const updateSelectedAddress = (address: Address) => {
    const newDeliveryInfo = {
      ...deliveryInfo,
      selectedAddress: address,
    }

    // Save the delivery method
    saveDeliveryMethod(newDeliveryInfo)

    // Update the local state immediately
    setDeliveryInfo(newDeliveryInfo)

    // Emit a custom event to synchronize other components
    window.dispatchEvent(new CustomEvent("delivery-update", { detail: newDeliveryInfo }))
  }

  // Abrir el modal de opciones de entrega
  const openDeliveryModal = () => {
    setIsDeliveryModalOpen(true)
  }

  // Cerrar el modal de opciones de entrega
  const closeDeliveryModal = () => {
    setIsDeliveryModalOpen(false)
    // Actualizar la información de entrega después de cerrar el modal
    const currentInfo = getDeliveryMethod()
    setDeliveryInfo(currentInfo)
  }

  // Abrir el modal de programación
  const openScheduleModal = () => {
    setIsScheduleModalOpen(true)
  }

  // Cerrar el modal de programación
  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false)
    // Actualizar la información de entrega después de cerrar el modal
    const currentInfo = getDeliveryMethod()
    setDeliveryInfo(currentInfo)
  }

  // Update the useEffect to better handle delivery info updates
  useEffect(() => {
    // Load delivery info on startup
    const initialDeliveryInfo = getDeliveryMethod()
    setDeliveryInfo(initialDeliveryInfo)
    console.log("Initial delivery info loaded:", initialDeliveryInfo)

    // Function to handle changes in localStorage or update events
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === DELIVERY_INFO_KEY || !event.key) {
        const updatedInfo = getDeliveryMethod()
        setDeliveryInfo(updatedInfo)
        console.log("Delivery info updated from storage:", updatedInfo)
      }
    }

    // Subscribe to storage events to detect changes in other tabs/components
    window.addEventListener("storage", handleStorageChange)

    // Create a custom event for synchronization within the same tab
    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail) {
        setDeliveryInfo(e.detail)
        console.log("Delivery info updated from custom event:", e.detail)
      }
    }

    // Use a custom event type to avoid conflicts
    window.addEventListener("delivery-update" as any, handleCustomEvent)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("delivery-update" as any, handleCustomEvent)
    }
  }, [])

  // Update the DeliveryContext.Provider value to include the new function
  return (
    <DeliveryContext.Provider
      value={{
        deliveryInfo,
        updateDeliveryType,
        updateSchedule,
        updateStoreAddress,
        updateSelectedAddress, // Add this line
        isDeliveryModalOpen,
        openDeliveryModal,
        closeDeliveryModal,
        isScheduleModalOpen,
        openScheduleModal,
        closeScheduleModal,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  )
}

export function useDelivery() {
  const context = useContext(DeliveryContext)
  if (context === undefined) {
    throw new Error("useDelivery must be used within a DeliveryProvider")
  }
  return context
}
