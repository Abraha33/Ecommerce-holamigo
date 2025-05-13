"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreditCard, X } from "lucide-react"
import Image from "next/image"

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onAddCard: (cardData: any) => void
}

export function AddCardModal({ isOpen, onClose, onAddCard }: AddCardModalProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [expiryMonth, setExpiryMonth] = useState("")
  const [expiryYear, setExpiryYear] = useState("")
  const [cvv, setCvv] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "amex" | null>(null)

  const detectCardType = (number: string) => {
    const visaRegex = /^4/
    const mastercardRegex = /^5[1-5]/
    const amexRegex = /^3[47]/

    if (visaRegex.test(number)) {
      return "visa"
    } else if (mastercardRegex.test(number)) {
      return "mastercard"
    } else if (amexRegex.test(number)) {
      return "amex"
    }
    return null
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formattedValue = formatCardNumber(value)
    setCardNumber(formattedValue)
    setCardType(detectCardType(value.replace(/\s+/g, "")))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!cardNumber.trim()) {
      newErrors.cardNumber = "El número de tarjeta es requerido"
    } else if (cardNumber.replace(/\s+/g, "").length < 15) {
      newErrors.cardNumber = "El número de tarjeta debe tener al menos 15 dígitos"
    }

    if (!cardholderName.trim()) {
      newErrors.cardholderName = "El nombre del titular es requerido"
    }

    if (!expiryMonth) {
      newErrors.expiryMonth = "El mes es requerido"
    }

    if (!expiryYear) {
      newErrors.expiryYear = "El año es requerido"
    }

    if (!cvv.trim()) {
      newErrors.cvv = "El CVV es requerido"
    } else if (cvv.length < 3) {
      newErrors.cvv = "El CVV debe tener al menos 3 dígitos"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onAddCard({
        cardNumber: cardNumber.replace(/\s+/g, ""),
        cardholderName,
        expiryMonth,
        expiryYear,
        cvv,
        cardType,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Agregar nueva tarjeta
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Número de tarjeta
            </label>
            <div className="relative">
              <input
                type="text"
                id="cardNumber"
                className={`w-full p-2 pl-10 border rounded-md ${errors.cardNumber ? "border-red-500" : ""}`}
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {cardType ? (
                  <div className="w-5 h-5 relative">
                    <Image src={`/${cardType}.png`} alt={cardType} fill className="object-contain" />
                  </div>
                ) : (
                  <CreditCard className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
          </div>

          <div>
            <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del titular
            </label>
            <input
              type="text"
              id="cardholderName"
              className={`w-full p-2 border rounded-md ${errors.cardholderName ? "border-red-500" : ""}`}
              placeholder="Como aparece en la tarjeta"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
            />
            {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de expiración
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <select
                    id="expiryMonth"
                    className={`w-full p-2 border rounded-md ${errors.expiryMonth ? "border-red-500" : ""}`}
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value)}
                  >
                    <option value="">Mes</option>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = i + 1
                      return (
                        <option key={month} value={month.toString().padStart(2, "0")}>
                          {month.toString().padStart(2, "0")}
                        </option>
                      )
                    })}
                  </select>
                  {errors.expiryMonth && <p className="text-red-500 text-xs mt-1">{errors.expiryMonth}</p>}
                </div>
                <div>
                  <select
                    id="expiryYear"
                    className={`w-full p-2 border rounded-md ${errors.expiryYear ? "border-red-500" : ""}`}
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value)}
                  >
                    <option value="">Año</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i
                      return (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      )
                    })}
                  </select>
                  {errors.expiryYear && <p className="text-red-500 text-xs mt-1">{errors.expiryYear}</p>}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                className={`w-full p-2 border rounded-md ${errors.cvv ? "border-red-500" : ""}`}
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                maxLength={4}
              />
              {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
              Guardar tarjeta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
