"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { createOrder } from "@/lib/order-service"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { CreditCard, Smartphone, Building, Truck } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const { items, clearItems, subtotal } = useCart()
  const { user } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Colombia",
    phone: "",
  })

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para continuar",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsProcessing(true)

    try {
      const order = await createOrder(items, shippingAddress, paymentMethod, "express", "Pedido desde la tienda online")

      if (order) {
        clearItems()
        toast({
          title: "¡Pedido creado exitosamente!",
          description: `Tu pedido #${order.order_number} ha sido procesado`,
        })
        router.push(`/orders/${order.id}`)
      } else {
        throw new Error("No se pudo crear el pedido")
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      toast({
        title: "Error",
        description: "No se pudo procesar el pago. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const shippingCost = 8000
  const total = subtotal + shippingCost

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Método de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Tarjeta de Crédito/Débito
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nequi" id="nequi" />
                    <Label htmlFor="nequi" className="flex items-center">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Nequi
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bancolombia" id="bancolombia" />
                    <Label htmlFor="bancolombia" className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      Bancolombia
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="contraentrega" id="contraentrega" />
                    <Label htmlFor="contraentrega" className="flex items-center">
                      <Truck className="mr-2 h-4 w-4" />
                      Pago Contraentrega
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Dirección de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nombre Completo</Label>
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Código Postal</Label>
                    <Input
                      id="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative h-16 w-16">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío:</span>
                    <span>${shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                <Button onClick={handlePayment} disabled={isProcessing} className="w-full" size="lg">
                  {isProcessing ? "Procesando..." : "Confirmar Pedido"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
