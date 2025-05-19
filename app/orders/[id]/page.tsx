"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { OrderHistory } from "@/components/order-history"
import { OrderReorderButton } from "@/components/order-reorder-button"
import { formatCurrency } from "@/lib/utils"
import { getOrderById } from "@/lib/orders"
import { Loader2, ArrowLeft } from "lucide-react"
import type { Order } from "@/lib/orders"

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true)
      try {
        // Obtener el pedido por ID
        const orderData = await getOrderById(id as string)
        setOrder(orderData)
      } catch (error) {
        console.error("Error al cargar el pedido:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchOrder()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Cargando detalles del pedido...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Pedido no encontrado</CardTitle>
            <CardDescription>No pudimos encontrar el pedido que estás buscando.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a mis pedidos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Formatear la fecha
  const orderDate = new Date(order.date)
  const formattedDate = orderDate.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Detalles del Pedido #{order.id}</h1>
          <p className="text-gray-500">{formattedDate}</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <OrderStatusBadge status={order.status} />
          <OrderReorderButton order={order} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 py-3 border-b last:border-0">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.variant && `Variante: ${item.variant}`}
                        {item.unit && ` • ${item.unit}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.price)}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Impuestos</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Historial del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              {order && order.statusHistory ? (
                <OrderHistory order={order} />
              ) : (
                <div className="text-center py-4 text-gray-500">No hay historial disponible para este pedido.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Envío</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.shipping_address?.name || "Cliente"}</p>
                <p>{order.shipping_address?.address}</p>
                <p>
                  {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}
                </p>
                <p>{order.shipping_address?.country}</p>
                {order.shipping_address?.phone && <p>Teléfono: {order.shipping_address?.phone}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Método de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                {order.payment_method?.type === "card" && (
                  <>
                    <div className="relative h-8 w-12">
                      <Image
                        src={
                          order.payment_method.brand === "visa"
                            ? "/visa.png"
                            : order.payment_method.brand === "mastercard"
                              ? "/mastercard.png"
                              : "/placeholder.svg"
                        }
                        alt={order.payment_method.brand || "Tarjeta"}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-medium">
                        {order.payment_method.brand?.charAt(0).toUpperCase() + order.payment_method.brand?.slice(1) ||
                          "Tarjeta"}
                      </p>
                      <p className="text-sm text-gray-500">Termina en {order.payment_method.last4}</p>
                    </div>
                  </>
                )}

                {order.payment_method?.type === "cash" && (
                  <>
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-lg">$</span>
                    </div>
                    <div>
                      <p className="font-medium">Efectivo</p>
                      <p className="text-sm text-gray-500">Pago contra entrega</p>
                    </div>
                  </>
                )}

                {order.payment_method?.type === "transfer" && (
                  <>
                    <div className="relative h-8 w-12">
                      <Image
                        src={order.payment_method.bank === "bancolombia" ? "/bancolombia-logo.png" : "/placeholder.svg"}
                        alt={order.payment_method.bank || "Banco"}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Transferencia Bancaria</p>
                      <p className="text-sm text-gray-500">{order.payment_method.bank}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
