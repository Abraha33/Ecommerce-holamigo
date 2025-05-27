"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useDelivery } from "@/contexts/delivery-context"
import { useCart } from "@/components/cart-provider"
import { MapPin, Calendar, Home, Truck } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const { deliveryInfo } = useDelivery()
  const { items, subtotal } = useCart()

  const [guestInfo, setGuestInfo] = useState<any>(null)

  useEffect(() => {
    const savedGuestInfo = localStorage.getItem("guestCheckoutInfo")
    if (savedGuestInfo) {
      setGuestInfo(JSON.parse(savedGuestInfo))
    }
  }, [])

  const getDeliveryIcon = () => {
    switch (deliveryInfo.type) {
      case "sprint":
        return <Truck className="h-5 w-5 text-blue-600" />
      case "programada":
        return <Calendar className="h-5 w-5 text-green-600" />
      case "tienda":
        return <Home className="h-5 w-5 text-purple-600" />
      default:
        return <Truck className="h-5 w-5 text-blue-600" />
    }
  }

  const getDeliveryTitle = () => {
    switch (deliveryInfo.type) {
      case "sprint":
        return "Entrega Express"
      case "programada":
        return "Entrega Programada"
      case "tienda":
        return "Recoger en Tienda"
      default:
        return "Entrega Express"
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Información de Pago</h1>

      {/* Delivery Information */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h3 className="font-medium mb-3 flex items-center">
          {getDeliveryIcon()}
          <span className="ml-2">Método de Entrega: {getDeliveryTitle()}</span>
        </h3>

        {deliveryInfo.type === "tienda" && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-600 mt-1" />
            <div>
              <p className="text-sm font-medium">Dirección de la tienda:</p>
              <p className="text-sm text-gray-600">Calle 31# 15-09, Centro</p>
            </div>
          </div>
        )}

        {deliveryInfo.type === "programada" && deliveryInfo.schedule && (
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-gray-600 mt-1" />
            <div>
              <p className="text-sm font-medium">Fecha programada:</p>
              <p className="text-sm text-gray-600">
                {deliveryInfo.schedule.day} - {deliveryInfo.schedule.timeSlot}
              </p>
            </div>
          </div>
        )}

        {deliveryInfo.selectedAddress && (
          <div className="flex items-start gap-2 mt-2">
            <MapPin className="h-4 w-4 text-gray-600 mt-1" />
            <div>
              <p className="text-sm font-medium">Dirección de entrega:</p>
              <p className="text-sm text-gray-600">
                {deliveryInfo.selectedAddress.address}, {deliveryInfo.selectedAddress.city}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h3 className="font-medium mb-3">Resumen del Pedido</h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-medium">
            <span>Total:</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6 p-4 bg-white rounded-lg border">
        <h3 className="font-medium mb-3">Método de Pago</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="radio" name="payment" id="cash" className="mr-3" defaultChecked />
            <label htmlFor="cash" className="flex-1 cursor-pointer">
              <div className="font-medium">Efectivo</div>
              <div className="text-sm text-gray-600">Pago contra entrega</div>
            </label>
          </div>
          <div className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="radio" name="payment" id="card" className="mr-3" />
            <label htmlFor="card" className="flex-1 cursor-pointer">
              <div className="font-medium">Tarjeta de Crédito/Débito</div>
              <div className="text-sm text-gray-600">Visa, Mastercard</div>
            </label>
          </div>
          <div className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="radio" name="payment" id="transfer" className="mr-3" />
            <label htmlFor="transfer" className="flex-1 cursor-pointer">
              <div className="font-medium">Transferencia Bancaria</div>
              <div className="text-sm text-gray-600">Nequi, Bancolombia</div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.back()} className="flex-1">
          Volver
        </Button>
        <Button onClick={() => router.push("/checkout/confirmation")} className="flex-1 bg-blue-600 hover:bg-blue-700">
          Confirmar Pedido
        </Button>
      </div>
    </div>
  )
}
