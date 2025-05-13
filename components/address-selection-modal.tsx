"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

interface Address {
  id: string
  name: string
  address: string
  city: string
  isDefault: boolean
}

interface AddressSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddressSelect: (addressId: string) => void
  onDeliveryTypeChange?: (type: string) => void
}

export function AddressSelectionModal({
  isOpen,
  onClose,
  onAddressSelect,
  onDeliveryTypeChange,
}: AddressSelectionModalProps) {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)

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

  const handleAddressSelect = (addressId: string) => {
    // Mantener el método de entrega actual
    const currentDeliveryType = localStorage.getItem("deliveryType") || "sprint"
    if (onDeliveryTypeChange) {
      onDeliveryTypeChange(currentDeliveryType)
    }

    onAddressSelect(addressId)
    onClose()
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

      // Reset form
      setNewAddress({
        name: "",
        address: "",
        city: "",
        isDefault: false,
      })
    }
  }

  const handleConfirm = () => {
    if (selectedAddress) {
      onAddressSelect(selectedAddress)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-md">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

        <div className="p-0">
          {/* Título */}
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Selecciona una dirección de entrega</h2>
            <div className="flex items-center mt-2 text-blue-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span className="font-medium">Entrega programada</span>
            </div>
          </div>

          {/* Selección de dirección */}
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
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                    onClick={handleAddNewAddress}
                    disabled={!newAddress.name || !newAddress.address || !newAddress.city}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="p-4 border-t flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Volver
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleConfirm} disabled={!selectedAddress}>
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
