import { getOrderById } from "@/lib/orders"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { OrderTracking } from "@/components/order-tracking"
import { OrderHistory } from "@/components/order-history"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MapPin, Package } from "lucide-react"
import { notFound } from "next/navigation"

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const order = getOrderById(params.id)

  if (!order) {
    notFound()
  }

  // Formatear la fecha
  const orderDate = new Date(order.date)
  const formattedDate = orderDate.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link href="/orders" className="flex items-center text-sm text-gray-600 hover:text-gray-900 mr-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a mis pedidos
        </Link>
        <h1 className="text-2xl font-bold">Detalles del Pedido</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h2 className="text-lg font-semibold">Pedido #{order.id}</h2>
              <p className="text-gray-600">{formattedDate}</p>
            </div>
            <OrderStatusBadge status={order.status} className="text-sm px-3 py-1" />
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Seguimiento del Pedido</h3>
          <OrderTracking order={order} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                Productos
              </h3>
            </div>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex items-start space-x-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-medium">{formatCurrency(item.price)}</p>
                    <p className="text-sm text-gray-500 mt-1">Subtotal: {formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex justify-between text-base font-medium">
                <p>Total</p>
                <p>{formatCurrency(order.total)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium">Historial del Pedido</h3>
            </div>
            <div className="p-6">
              <OrderHistory order={order} />
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Dirección de Envío
              </h3>
            </div>
            <div className="p-6">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p className="text-gray-600 mt-1">{order.shippingAddress.street}</p>
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium">Necesitas ayuda?</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Si tienes alguna pregunta o problema con tu pedido, nuestro equipo de atención al cliente está listo
                para ayudarte.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 w-full justify-center"
              >
                Contactar Soporte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
