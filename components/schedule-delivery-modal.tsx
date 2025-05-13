"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDelivery } from "@/contexts/delivery-context"

interface ScheduleDeliveryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ScheduleDeliveryModal({ isOpen, onClose }: ScheduleDeliveryModalProps) {
  const { deliveryInfo, updateSchedule } = useDelivery()
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | null>(deliveryInfo.schedule?.day || null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(deliveryInfo.schedule?.timeSlot || null)

  // Actualizar los estados locales cuando cambie la información de entrega
  useEffect(() => {
    // Sincronizar el estado local con el contexto global
    setSelectedDay(deliveryInfo.schedule?.day || null)
    setSelectedTimeSlot(deliveryInfo.schedule?.timeSlot || null)

    // Si hay un cambio en el tipo de entrega, resetear el estado de confirmación de dirección
    if (deliveryInfo.type !== "programada") {
      setIsAddressConfirmed(false)
    }
  }, [deliveryInfo])

  // Datos para el modal de programación
  const days = [
    { day: "Dom", date: "11", month: "May" },
    { day: "Lun", date: "12", month: "May" },
    { day: "Mar", date: "13", month: "May" },
    { day: "Mié", date: "14", month: "May" },
  ]

  const timeSlots = [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "5:00 PM - 6:00 PM",
  ]

  const handleAddressConfirm = () => {
    setIsAddressConfirmed(true)
  }

  const handleScheduleDelivery = () => {
    // Actualizar la programación en el contexto
    if (selectedDay && selectedTimeSlot) {
      updateSchedule(selectedDay, selectedTimeSlot)

      // Esperar un momento para que se propague el cambio
      setTimeout(() => {
        // Cerrar el modal
        onClose()
      }, 100)
    } else {
      // Cerrar el modal sin cambios
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-md">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

        <div className="p-6">
          {!isAddressConfirmed ? (
            <>
              <h2 className="text-xl font-semibold mb-4 text-center">Confirma tu dirección de entrega</h2>
              <div className="bg-white p-3 rounded-md border mb-4">
                <div className="font-bold">[BUC] 655</div>
                <div className="text-sm">KR 35 A # 45 - 25 CABECERA DEL LLANO BUCARAMANGA BUCARAMANGA SANTANDER 56</div>
              </div>
              <Button className="w-full bg-blue-500 hover:bg-blue-700 text-white" onClick={handleAddressConfirm}>
                Confirmar dirección
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4 text-center">Programa tu pedido</h2>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input type="checkbox" id="schedule-delivery" className="mr-2" checked={true} readOnly />
                  <label htmlFor="schedule-delivery" className="font-medium">
                    Elige la hora y fecha de entrega
                  </label>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-4">
                  {days.map((day) => (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDay(`${day.day} ${day.date}`)}
                      className={`flex flex-col items-center justify-center p-3 rounded-md transition-colors ${
                        selectedDay === `${day.day} ${day.date}`
                          ? "bg-blue-500 text-white"
                          : "bg-blue-100 hover:bg-blue-200"
                      }`}
                    >
                      <span className="font-medium">{day.day}</span>
                      <span className="text-sm">
                        {day.month} {day.date}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2 mt-4">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`w-full text-left p-3 rounded-md border transition-colors ${
                        selectedTimeSlot === slot
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsAddressConfirmed(false)}>
                  Volver
                </Button>
                <Button
                  className="flex-1 bg-blue-500 hover:bg-blue-700 text-white"
                  onClick={handleScheduleDelivery}
                  disabled={!selectedDay || !selectedTimeSlot}
                >
                  Programar
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
