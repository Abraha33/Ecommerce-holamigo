import Link from "next/link"
import Image from "next/image"
import type { Order } from "@/lib/orders"
import { OrderStatusBadge } from "./order-status-badge"
import { formatCurrency } from "@/lib/utils"

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  // Formatear la fecha
  const orderDate = new Date(order.date)
  const formattedDate = orderDate.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gray-50 p-4 flex justify-between items-center border-b">
        <div>
          <p className="text-sm text-gray-500">Pedido #{order.id}</p>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-4 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(item.price)} x {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-3 border-t">
          <p className="font-medium">Total: {formatCurrency(order.total)}</p>
          <Link href={`/orders/${order.id}`} className="text-sm font-medium text-primary hover:text-primary/80">
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  )
}
