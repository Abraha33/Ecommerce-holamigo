import type { Order } from "@/lib/orders"
import { OrderStatusBadge } from "./order-status-badge"

interface OrderHistoryProps {
  order: Order
}

export function OrderHistory({ order }: OrderHistoryProps) {
  // Ordenar el historial por fecha, del más reciente al más antiguo
  const sortedHistory = [...order.statusHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sortedHistory.map((event, eventIdx) => (
          <li key={event.date}>
            <div className="relative pb-8">
              {eventIdx !== sortedHistory.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center ring-8 ring-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-800">{event.description}</p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <OrderStatusBadge status={event.status} className="mb-1" />
                    <time dateTime={event.date}>
                      {new Date(event.date).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
