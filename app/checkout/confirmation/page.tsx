"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function CheckoutConfirmationPage() {
  return (
    <div className="container px-4 py-16 mx-auto max-w-3xl">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h1>
        <p className="text-lg mb-8">
          Tu pedido ha sido recibido y está siendo procesado. Recibirás una confirmación por correo electrónico.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Detalles del pedido</h2>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-gray-500">Número de pedido:</p>
              <p className="font-medium">#FT-2023-0012345</p>
            </div>
            <div>
              <p className="text-gray-500">Fecha:</p>
              <p className="font-medium">11 de mayo, 2025</p>
            </div>
            <div>
              <p className="text-gray-500">Total:</p>
              <p className="font-medium">$179.530</p>
            </div>
            <div>
              <p className="text-gray-500">Método de pago:</p>
              <p className="font-medium">PSE</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link href="/orders/latest">Ver estado del pedido</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Continuar comprando</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
