import type React from "react"
import type { Order, OrderStatus } from "@/lib/orders"
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react"

interface OrderTrackingProps {
  order: Order
}

export function OrderTracking({ order }: OrderTrackingProps) {
  const steps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
    {
      status: "pending",
      label: "Pedido recibido",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      status: "processing",
      label: "En preparación",
      icon: <Package className="h-6 w-6" />,
    },
    {
      status: "shipped",
      label: "Enviado",
      icon: <Truck className="h-6 w-6" />,
    },
    {
      status: "delivered",
      label: "Entregado",
      icon: <CheckCircle className="h-6 w-6" />,
    },
  ]

  // Determinar el índice del estado actual
  const statusOrder = ["pending", "processing", "shipped", "delivered", "cancelled"]
  const currentStatusIndex = statusOrder.indexOf(order.status)

  // Si el pedido está cancelado, mostrar un mensaje especial
  if (order.status === "cancelled") {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-100 text-center">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-red-800">Pedido Cancelado</h3>
        <p className="text-red-600 mt-1">
          Este pedido ha sido cancelado. Si tienes alguna pregunta, por favor contacta a nuestro servicio al cliente.
        </p>
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="relative">
        {/* Línea de progreso */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-1 bg-gray-200 rounded">
            <div
              className="h-1 bg-primary rounded transition-all duration-500"
              style={{
                width: `${Math.max(0, (currentStatusIndex / (steps.length - 1)) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Pasos */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = statusOrder.indexOf(order.status) >= statusOrder.indexOf(step.status)
            const isPast = statusOrder.indexOf(order.status) > statusOrder.indexOf(step.status)

            return (
              <div key={step.status} className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isActive ? "bg-primary text-white" : "bg-gray-200 text-gray-400"
                  } transition-colors duration-300`}
                >
                  {step.icon}
                </div>
                <p className={`mt-2 text-xs font-medium ${isActive ? "text-primary" : "text-gray-500"}`}>
                  {step.label}
                </p>
                {isPast && (
                  <span className="text-xs text-gray-500 mt-1">
                    {order.statusHistory.find((h) => h.status === step.status)?.date
                      ? new Date(order.statusHistory.find((h) => h.status === step.status)!.date).toLocaleDateString()
                      : ""}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Información adicional de seguimiento */}
      {order.trackingNumber && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium">
            Número de seguimiento: <span className="font-bold">{order.trackingNumber}</span>
          </p>
          {order.estimatedDelivery && (
            <p className="text-sm text-gray-600 mt-1">
              Entrega estimada:{" "}
              {new Date(order.estimatedDelivery).toLocaleDateString("es-CO", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
