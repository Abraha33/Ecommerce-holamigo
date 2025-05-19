"use client"

import type React from "react"

import { useState } from "react"
import CardForm from "./card-form"
import CreditCard from "./credit-card"
import { detectCardType } from "./card-utils"

interface CreditCardFormProps {
  onSubmit: (cardData: any) => void
}

export default function CreditCardForm({ onSubmit }: CreditCardFormProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const cardType = detectCardType(cardNumber.replace(/\s/g, ""))

  // Modificar la función handleSubmit para asegurarnos de que todos los datos necesarios estén presentes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar los campos
    const newErrors: Record<string, string> = {}

    if (!cardNumber.trim()) {
      newErrors.cardNumber = "El número de tarjeta es requerido"
    } else if (cardNumber.replace(/\s/g, "").length < 15) {
      newErrors.cardNumber = "El número de tarjeta debe tener al menos 15 dígitos"
    }

    if (!cardholderName.trim()) {
      newErrors.cardholderName = "El nombre del titular es requerido"
    }

    if (!expiryDate.trim()) {
      newErrors.expiryDate = "La fecha de expiración es requerida"
    } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = "Formato inválido. Use MM/YY"
    }

    if (!cvv.trim()) {
      newErrors.cvv = "El CVV es requerido"
    } else if (cvv.length < 3) {
      newErrors.cvv = "El CVV debe tener al menos 3 dígitos"
    }

    setErrors(newErrors)

    // Si no hay errores, proceder con el envío
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)

      // Asegurarnos de que expiryDate tenga el formato correcto antes de dividirlo
      let expMonth = ""
      let expYear = ""

      if (expiryDate && expiryDate.includes("/")) {
        const parts = expiryDate.split("/")
        expMonth = parts[0] || ""
        expYear = parts[1] ? `20${parts[1]}` : ""
      }

      // Asegurarnos de que cardNumber existe y no es undefined antes de usar slice
      const cleanCardNumber = cardNumber ? cardNumber.replace(/\s/g, "") : ""
      const last4 = cleanCardNumber.length >= 4 ? cleanCardNumber.slice(-4) : "0000"

      // Simular una petición a la API
      setTimeout(() => {
        onSubmit({
          cardNumber: cleanCardNumber,
          cardholderName,
          expMonth,
          expYear,
          cvv,
          brand: cardType || "unknown",
          last4,
          cardType: cardType || "visa",
        })

        setIsLoading(false)
      }, 1500)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex flex-col justify-center">
        <div className="mb-6 transform transition-all duration-500 hover:scale-105">
          <CreditCard
            cardNumber={cardNumber}
            cardholderName={cardholderName}
            expiryDate={expiryDate}
            cvv={cvv}
            isFlipped={isFlipped}
            cardType={cardType}
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Información segura</h3>
          <p className="text-xs text-blue-700">
            Tus datos de pago están protegidos con encriptación de nivel bancario. Nunca almacenamos tu CVV.
          </p>
        </div>
      </div>

      <div>
        <CardForm
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          cardholderName={cardholderName}
          setCardholderName={setCardholderName}
          expiryDate={expiryDate}
          setExpiryDate={setExpiryDate}
          cvv={cvv}
          setCvv={setCvv}
          setIsFlipped={setIsFlipped}
          errors={errors}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
