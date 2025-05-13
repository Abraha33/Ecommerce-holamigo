export type DeliveryType = "sprint" | "programada" | "tienda"

export interface DeliverySchedule {
  day: string | null
  timeSlot: string | null
}

export interface DeliveryInfo {
  type: DeliveryType
  schedule?: DeliverySchedule
  storeAddress?: string
}
