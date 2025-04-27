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
    <div className="p-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="department">Departamento</Label>
          <Select>
            <SelectTrigger id="department">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="city">Municipio o ciudad capital</Label>
          <Select>
            <SelectTrigger id="city">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {cities["Cundinamarca"]?.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="address-type">Tipo de dirección</Label>
          <Select>
            <SelectTrigger id="address-type">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {addressTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="street">Calle</Label>
          <Input id="street" placeholder="Ej: Calle 10" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="number-from">Número</Label>
          <Input id="number-from" placeholder="Ej: 18" />
        </div>

        <div className="flex items-end justify-center">
          <span className="mb-3">-</span>
        </div>

        <div>
          <Label htmlFor="number-to" className="invisible">
            Hasta
          </Label>
          <Input id="number-to" placeholder="Ej: 24" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="neighborhood">Barrio</Label>
          <Input id="neighborhood" placeholder="Ej: Laureles" />
        </div>

        <div>
          <Label htmlFor="apartment">Piso / Apartamento / Torre / Edificio</Label>
          <Input id="apartment" placeholder="Ej: Torre 4 Apto 345" />
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="recipient">Persona que recibe</Label>
        <Input id="recipient" placeholder="Nombre completo" />
      </div>

      <div className="mb-4">
        <Label htmlFor="address-notes">Dirección</Label>
        <Input id="address-notes" placeholder="-- Instrucciones adicionales --" />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Volver
        </Button>
        <Button onClick={onSave}>Confirmar</Button>
      </div>
    </div>
  )
}
