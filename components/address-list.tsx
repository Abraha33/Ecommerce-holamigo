"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MapPin, Edit, Trash2 } from "lucide-react"

interface AddressListProps {
  onSelect: () => void
  onAddNew: () => void
}

export function AddressList({ onSelect, onAddNew }: AddressListProps) {
  const [selectedAddress, setSelectedAddress] = useState("1")

  // Mock saved addresses
  const savedAddresses = [
    {
      id: "1",
      name: "Casa",
      recipient: "Pedro Pérez",
      address: "Calle 10 #18-24, Laureles, Torre 4 Apto 345",
      city: "Medellín",
      department: "Antioquia",
    },
    {
      id: "2",
      name: "Oficina",
      recipient: "Pedro Pérez",
      address: "Carrera 43A #1-50, El Poblado, Edificio Santillana P.8",
      city: "Medellín",
      department: "Antioquia",
    },
  ]

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Direcciones guardadas a este usuario</h3>

      {savedAddresses.length > 0 ? (
        <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
          <div className="space-y-3">
            {savedAddresses.map((address) => (
              <div
                key={address.id}
                className={`border rounded-md p-4 ${selectedAddress === address.id ? "border-primary" : ""}`}
              >
                <div className="flex items-start">
                  <RadioGroupItem value={address.id} id={`address-${address.id}`} className="mt-1" />
                  <Label htmlFor={`address-${address.id}`} className="flex-1 ml-3 cursor-pointer">
                    <div className="flex justify-between">
                      <span className="font-medium">{address.name}</span>
                      <div className="flex gap-2">
                        <button className="text-gray-500 hover:text-gray-700">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm mt-1">{address.recipient}</div>
                    <div className="text-sm text-gray-600 mt-1">{address.address}</div>
                    <div className="text-sm text-gray-600">
                      {address.city}, {address.department}
                    </div>
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
      ) : (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">No tienes direcciones guardadas</p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onAddNew}>
          Agregar nueva dirección
        </Button>

        <Button onClick={onSelect} disabled={!selectedAddress}>
          Continuar con esta dirección
        </Button>
      </div>
    </div>
  )
}
