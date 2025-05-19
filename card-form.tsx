"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface CardFormProps {
  cardNumber: string
  setCardNumber: (value: string) => void
  cardholderName: string
  setCardholderName: (value: string) => void
  expiryDate: string
  setExpiryDate: (value: string) => void
  cvv: string
  setCvv: (value: string) => void
  setIsFlipped: (value: boolean) => void
  errors: Record<string, string>
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}

export default function CardForm({
  cardNumber,
  setCardNumber,
  cardholderName,
  setCardholderName,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
  setIsFlipped,
  errors,
  onSubmit,
  isLoading,
}: CardFormProps) {
  // Formatear número de tarjeta
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

  // Formatear fecha de expiración
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCardNumber(formatCardNumber(value))
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value.length <= 5) {
      setExpiryDate(formatExpiryDate(value))
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")

    if (value.length <= 4) {
      setCvv(value)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Número de tarjeta</Label>
        <Input
          id="cardNumber"
          value={cardNumber}
          onChange={handleCardNumberChange}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          className={errors.cardNumber ? "border-red-500" : ""}
        />
        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardholderName">Nombre del titular</Label>
        <Input
          id="cardholderName"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
          placeholder="NOMBRE COMO APARECE EN LA TARJETA"
          className={errors.cardholderName ? "border-red-500" : ""}
        />
        {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Fecha de expiración</Label>
          <Input
            id="expiryDate"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            placeholder="MM/YY"
            maxLength={5}
            className={errors.expiryDate ? "border-red-500" : ""}
          />
          {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            value={cvv}
            onChange={handleCvvChange}
            onFocus={() => setIsFlipped(true)}
            onBlur={() => setIsFlipped(false)}
            placeholder="123"
            maxLength={4}
            className={errors.cvv ? "border-red-500" : ""}
          />
          {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Guardando...
          </>
        ) : (
          "Guardar tarjeta"
        )}
      </Button>
    </form>
  )
}
