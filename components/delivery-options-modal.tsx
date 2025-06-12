"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Home, BikeIcon as Motorcycle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useDelivery } from "@/contexts/delivery-context"
import type { DeliveryType } from "@/lib/delivery-service"

interface Address {
  id: string
  name: string
  address: string
  city: string
  isDefault: boolean
}

interface DeliveryOptionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DeliveryOptionsModal({ isOpen, onClose }: DeliveryOptionsModalProps) {
  const { deliveryInfo, updateDeliveryType, updateSchedule, updateStoreAddress, updateSelectedAddress } = useDelivery()

  const [selectedOption, setSelectedOption] = useState<string | null>(deliveryInfo.type)
  const [step, setStep] = useState<"options" | "address" | "schedule">("options")
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | null>(deliveryInfo.schedule?.day || null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(deliveryInfo.schedule?.timeSlot || null)

  // Mock addresses - in a real app, these would come from an API or context
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "addr1",
      name: "Casa",
      address: "Calle 123 #45-67",
      city: "Bogotá",
      isDefault: true,
    },
    {
      id: "addr2",
      name: "Oficina",
      address: "Avenida 7 #12-34, Edificio Central, Piso 5",
      city: "Bogotá",
      isDefault: false,
    },
  ])

  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    city: "",
    isDefault: false,
  })

  const deliveryOptions = [
    {
      id: "programada",
      title: "Entrega programada",
      description: "Recibe tu pedido en la fecha y hora que prefieras",
      icon: <Calendar className="h-5 w-5" />,
      requiresAddress: true,
    },
    {
      id: "tienda",
      title: "Recoge en tienda",
      description: "Recoge tu pedido en nuestra tienda más cercana",
      icon: <Home className="h-5 w-5" />,
      requiresAddress: false,
    },
    {
      id: "sprint",
      title: "Sprint",
      description: "Entrega inmediata a domicilio (11-17 min)",
      icon: <Motorcycle className="h-5 w-5" />,
      requiresAddress: true,
    },
  ]

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

  useEffect(() => {
    // Synchronize the local state with the global context
    if (deliveryInfo) {
      setSelectedOption(deliveryInfo.type)
      setSelectedDay(deliveryInfo.schedule?.day || null)
      setSelectedTimeSlot(deliveryInfo.schedule?.timeSlot || null)
      console.log("Modal synchronized with delivery info:", deliveryInfo)
    }
  }, [deliveryInfo])

  const getSelectedOptionTitle = () => {
    const option = deliveryOptions.find((opt) => opt.id === selectedOption)
    return option ? option.title : ""
  }

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    const selectedOpt = deliveryOptions.find((opt) => opt.id === option)
    console.log("Option selected:", option)

    // Update the delivery type in the context
    updateDeliveryType(option as DeliveryType)

    // If it's store pickup, update the store address
    if (option === "tienda") {
      updateStoreAddress("Calle 31#15-09, Centro")
      onClose()
      return
    }

    if (selectedOpt?.requiresAddress) {
      setStep("address")
    } else if (option === "tienda") {
      // If it's store pickup, we don't need an address or schedule
      onClose()
    }
  }

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddress(addressId)
    setShowNewAddressForm(false)

    // Find the selected address
    const address = addresses.find((addr) => addr.id === addressId)
    if (address) {
      // Update the selected address in the context
      updateSelectedAddress(address)
    }

    // Si la opción seleccionada es entrega programada, vamos al paso de programación
    if (selectedOption === "programada") {
      setStep("schedule")
    } else {
      // Para otras opciones que requieren dirección (como sprint), cerramos el modal
      onClose()
    }
  }

  const handleNewAddressChange = (field: string, value: string | boolean) => {
    setNewAddress((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddNewAddress = () => {
    if (newAddress.name && newAddress.address && newAddress.city) {
      const newId = `addr${addresses.length + 1}`
      const addressToAdd = {
        ...newAddress,
        id: newId,
      }

      setAddresses((prev) => [...prev, addressToAdd])
      setSelectedAddress(newId)
      setShowNewAddressForm(false)

      // Update the selected address in the context
      updateSelectedAddress(addressToAdd)

      // Si la opción seleccionada es entrega programada, vamos al paso de programación
      if (selectedOption === "programada") {
        setStep("schedule")
      } else {
        // Para otras opciones que requieren dirección, cerramos el modal
        onClose()
      }

      // Reset form
      setNewAddress({
        name: "",
        address: "",
        city: "",
        isDefault: false,
      })
    }
  }

  const handleBack = () => {
    if (step === "address") {
      setStep("options")
      setSelectedAddress(null)
    } else if (step === "schedule") {
      setStep("address")
      setSelectedDay(null)
      setSelectedTimeSlot(null)
    }
  }

  const handleConfirm = () => {
    // Si estamos en el paso de programación y tenemos día y hora seleccionados
    if (step === "schedule" && selectedDay && selectedTimeSlot) {
      // Actualizar la programación en el contexto
      updateSchedule(selectedDay, selectedTimeSlot)
    } else if (step === "address" && selectedAddress) {
      // Si estamos en el paso de dirección, confirmar la selección
      // Si la opción seleccionada es entrega programada, vamos al paso de programación
      if (selectedOption === "programada") {
        setStep("schedule")
        return // No cerramos el modal todavía
      }
    }

    // Cerrar el modal
    onClose()
  }

  const isConfirmDisabled = () => {
    if (step === "options") {
      const selectedOpt = deliveryOptions.find((opt) => opt.id === selectedOption)
      return !selectedOption || (selectedOpt?.requiresAddress ?? false)
    } else if (step === "address") {
      return !selectedAddress
    } else if (step === "schedule") {
      return !selectedDay || !selectedTimeSlot
    }
    return true
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-md">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

        <div className="p-0">
          {/* Título */}
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">
              {step === "options"
                ? "Elige cómo recibir tu pedido"
                : step === "address"
                  ? "Selecciona una dirección de entrega"
                  : "Programa tu entrega"}
            </h2>
            {(step === "address" || step === "schedule") && (
              <div className="flex items-center mt-2">
                <div className="bg-[#1e4db7] text-white p-2 rounded-full flex items-center justify-center mr-2">
                  {deliveryOptions.find((opt) => opt.id === selectedOption)?.icon}
                </div>
                <span className="font-medium text-[#1e4db7]">{getSelectedOptionTitle()}</span>
              </div>
            )}
          </div>

          {step === "options" ? (
            /* Opciones de entrega */
            <div className="p-4 space-y-3">
              {deliveryOptions.map((option) => (
                <div
                  key={option.id}
                  className={`border rounded-md p-4 flex items-center gap-4 cursor-pointer hover:border-blue-600 transition-colors ${selectedOption === option.id ? "border-blue-600 bg-blue-50" : ""}`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <div className="bg-[#1e4db7] text-white p-3 rounded-full flex items-center justify-center">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{option.title}</h3>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : step === "address" ? (
            /* Selección de dirección */
            <div className="p-4">
              {!showNewAddressForm ? (
                <>
                  <RadioGroup value={selectedAddress || ""} className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-md p-3 cursor-pointer hover:border-blue-600 transition-colors ${selectedAddress === address.id ? "border-blue-600 bg-blue-50" : ""}`}
                        onClick={() => handleAddressSelect(address.id)}
                      >
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={address.id} className="font-medium cursor-pointer flex items-center">
                              {address.name}
                              {address.isDefault && (
                                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                  Predeterminada
                                </span>
                              )}
                            </Label>
                            <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                            <p className="text-sm text-gray-500">{address.city}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>

                  <Button
                    variant="outline"
                    className="mt-4 w-full flex items-center justify-center"
                    onClick={() => setShowNewAddressForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar nueva dirección
                  </Button>
                </>
              ) : (
                <div className="space-y-4 border rounded-md p-4">
                  <h3 className="font-medium">Nueva dirección</h3>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="address-name">Nombre de la dirección</Label>
                      <Input
                        id="address-name"
                        placeholder="Ej: Casa, Trabajo, etc."
                        value={newAddress.name}
                        onChange={(e) => handleNewAddressChange("name", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address-line">Dirección</Label>
                      <Input
                        id="address-line"
                        placeholder="Calle, número, apartamento"
                        value={newAddress.address}
                        onChange={(e) => handleNewAddressChange("address", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address-city">Ciudad</Label>
                      <Input
                        id="address-city"
                        placeholder="Ciudad"
                        value={newAddress.city}
                        onChange={(e) => handleNewAddressChange("city", e.target.value)}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="default-address"
                        className="rounded border-gray-300"
                        checked={newAddress.isDefault}
                        onChange={(e) => handleNewAddressChange("isDefault", e.target.checked)}
                      />
                      <Label htmlFor="default-address">Establecer como dirección predeterminada</Label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowNewAddressForm(false)}>
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1 bg-[#1e4db7]"
                      onClick={handleAddNewAddress}
                      disabled={!newAddress.name || !newAddress.address || !newAddress.city}
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Programación de entrega */
            <div className="p-4">
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
            </div>
          )}

          {/* Botones de acción */}
          <div className="p-4 border-t flex justify-between">
            {(step === "address" || step === "schedule") && (
              <Button variant="outline" onClick={handleBack}>
                Volver
              </Button>
            )}
            <Button
              className={`${step === "options" ? "w-full" : ""} bg-[#1e4db7] hover:bg-[#15397f]`}
              onClick={handleConfirm}
              disabled={isConfirmDisabled()}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
