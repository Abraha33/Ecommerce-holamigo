"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Store, Truck } from "lucide-react"

interface AddressFormProps {
  onCancel: () => void
  onSave: () => void
}

export function AddressForm({ onCancel, onSave }: AddressFormProps) {
  const [deliveryType, setDeliveryType] = useState("delivery")
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    isDefault: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the address to your backend
    // For now, we'll just call onSave
    onSave()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const departments = [
    "Amazonas",
    "Antioquia",
    "Arauca",
    "Atlántico",
    "Bolívar",
    "Boyacá",
    "Caldas",
    "Caquetá",
    "Casanare",
    "Cauca",
    "Cesar",
    "Chocó",
    "Córdoba",
    "Cundinamarca",
    "Guainía",
    "Guaviare",
    "Huila",
    "La Guajira",
    "Magdalena",
    "Meta",
    "Nariño",
    "Norte de Santander",
    "Putumayo",
    "Quindío",
    "Risaralda",
    "San Andrés y Providencia",
    "Santander",
    "Sucre",
    "Tolima",
    "Valle del Cauca",
    "Vaupés",
    "Vichada",
  ]

  const cities = {
    Antioquia: ["Medellín", "Bello", "Envigado", "Itagüí", "Rionegro"],
    Cundinamarca: ["Bogotá", "Soacha", "Zipaquirá", "Chía", "Facatativá"],
    "Valle del Cauca": ["Cali", "Buenaventura", "Palmira", "Tuluá", "Yumbo"],
  }

  const addressTypes = ["Casa", "Apartamento", "Oficina", "Otro"]

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-6">
        <RadioGroup defaultValue={deliveryType} onValueChange={setDeliveryType} className="flex gap-4">
          <div
            className={`flex-1 border rounded-md p-4 cursor-pointer ${deliveryType === "pickup" ? "border-primary bg-primary/5" : ""}`}
          >
            <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
            <Label htmlFor="pickup" className="cursor-pointer flex flex-col items-center gap-2">
              <Store className="h-6 w-6" />
              <span>Compra y Recoge en Costo</span>
            </Label>
          </div>
          <div
            className={`flex-1 border rounded-md p-4 cursor-pointer ${deliveryType === "delivery" ? "border-primary bg-primary/5" : ""}`}
          >
            <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
            <Label htmlFor="delivery" className="cursor-pointer flex flex-col items-center gap-2">
              <Truck className="h-6 w-6" />
              <span>Envío a Domicilio</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {deliveryType === "delivery" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isDefault">Establecer como dirección predeterminada</Label>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Guardar dirección
        </Button>
      </div>
    </form>
  )
}
