"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import CreditCardForm from "@/credit-card-form"

export default function AddCardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (cardData: any) => {
    setIsSubmitting(true)

    // Simular guardado de tarjeta
    setTimeout(() => {
      console.log("Tarjeta guardada:", cardData)

      toast({
        title: "Tarjeta guardada",
        description: "Tu tarjeta ha sido guardada correctamente.",
      })

      // Redirigir a la página de métodos de pago
      router.push("/account/payment-methods")

      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/account/payment-methods"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Volver a métodos de pago</span>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Añadir nueva tarjeta</h1>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <CreditCardForm onSubmit={handleSubmit} />
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Tus datos de tarjeta están seguros y encriptados.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
