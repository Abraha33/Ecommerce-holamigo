"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface Address {
  id: string
  name: string
  recipient: string
  address: string
  city: string
  state: string
  isDefault: boolean
}

interface AddressStepProps {
  onNext: () => void
  onSelectAddress: (address: Address) => void
  selectedAddress: Address | null
}

export function AddressStep({ onNext, onSelectAddress, selectedAddress }: AddressStepProps) {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "addr1",
      name: "Casa",
      recipient: "Pedro Pérez",
      address: "Calle 10 #18-24, Laureles, Torre 4 Apto 345",
      city: "Medellín",
      state: "Antioquia",
      isDefault: true,
    },
    {
      id: "addr2",
      name: "Oficina",
      recipient: "Pedro Pérez",
      address: "Carrera 43A #1-50, El Poblado, Edificio Santillana P.8",
      city: "Medellín",
      state: "Antioquia",
      isDefault: false,
    },
  ])
  const [selected, setSelected] = useState<string>(selectedAddress?.id || addresses[0]?.id || "")
  const [showNewForm, setShowNewForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    name: "",
    recipient: "",
    address: "",
    city: "",
    state: "",
    isDefault: false,
  })

  const handleSelect = (addressId: string) => {
    setSelected(addressId)
    const address = addresses.find((a) => a.id === addressId)
    if (address) {
      onSelectAddress(address)
    }
  }

  const handleAddNew = () => {
    setShowNewForm(true)
  }

  const handleCancelNew = () => {
    setShowNewForm(false)
    setNewAddress({
      name: "",
      recipient: "",
      address: "",
      city: "",
      state: "",
      isDefault: false,
    })
  }

  const handleSaveNew = () => {
    if (newAddress.name && newAddress.address && newAddress.city) {
      const newId = `addr${addresses.length + 1}`
      const addressToAdd: Address = {
        id: newId,
        ...newAddress,
      }

      // If this is the default address, update other addresses
      if (newAddress.isDefault) {
        setAddresses(
          [...addresses.map((a) => ({ ...a, isDefault: false })), addressToAdd].sort((a, b) =>
            a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1,
          ),
        )
      } else {
        setAddresses([...addresses, addressToAdd])
      }

      setSelected(newId)
      onSelectAddress(addressToAdd)
      setShowNewForm(false)
      setNewAddress({
        name: "",
        recipient: "",
        address: "",
        city: "",
        state: "",
        isDefault: false,
      })
    }
  }

  const handleContinue = () => {
    const address = addresses.find((a) => a.id === selected)
    if (address) {
      onSelectAddress(address)
      onNext()
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setNewAddress((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      {!showNewForm ? (
        <>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Select shipping address</h2>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={cn(
                      "border rounded-lg p-3 cursor-pointer transition-colors",
                      selected === address.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-600 hover:bg-blue-50",
                    )}
                    onClick={() => handleSelect(address.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium flex items-center">
                          {address.name}
                          {address.isDefault && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-sm mt-1">{address.recipient}</div>
                        <div className="text-sm text-gray-600 mt-1">{address.address}</div>
                        <div className="text-sm text-gray-600">
                          {address.city}, {address.state}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">No saved addresses</p>
                <Button variant="outline" className="mt-4" onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add new address
                </Button>
              </div>
            )}
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleContinue}
            disabled={!selected || addresses.length === 0}
          >
            Continue to payment
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Add new address</h2>

          <div className="space-y-3">
            <div>
              <Label htmlFor="address-name">Address nickname</Label>
              <Input
                id="address-name"
                placeholder="Home, Work, etc."
                value={newAddress.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="recipient">Recipient name</Label>
              <Input
                id="recipient"
                placeholder="Full name"
                value={newAddress.recipient}
                onChange={(e) => handleInputChange("recipient", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Street address</Label>
              <Input
                id="address"
                placeholder="Street, number, apartment"
                value={newAddress.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="state">State/Department</Label>
                <Select value={newAddress.state} onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger id="state" className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Antioquia", "Cundinamarca", "Valle del Cauca", "Atlántico", "Santander"].map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                id="default-address"
                className="rounded border-gray-300"
                checked={newAddress.isDefault}
                onChange={(e) => handleInputChange("isDefault", e.target.checked)}
              />
              <Label htmlFor="default-address" className="text-sm">
                Set as default address
              </Label>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={handleCancelNew}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleSaveNew}
              disabled={!newAddress.name || !newAddress.address || !newAddress.city}
            >
              Save address
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
