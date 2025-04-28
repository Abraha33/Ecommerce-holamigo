import type { OrderStatus } from "@/lib/orders"
import { cn } from "@/lib/utils"

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: "Pendiente",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    processing: {
      label: "En proceso",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    shipped: {
      label: "Enviado",
      className: "bg-purple-100 text-purple-800 border-purple-200",
    },
    delivered: {
      label: "Entregado",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    cancelled: {
      label: "Cancelado",
      className: "bg-red-100 text-red-800 border-red-200",
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
