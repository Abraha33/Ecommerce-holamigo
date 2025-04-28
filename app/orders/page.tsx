import { getAllOrders } from "@/lib/orders"
import { OrderCard } from "@/components/order-card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function OrdersPage() {
  const orders = getAllOrders()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900 mr-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver al inicio
        </Link>
        <h1 className="text-2xl font-bold">Mis Pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-900 mb-2">No tienes pedidos aún</h2>
          <p className="text-gray-500 mb-6">Cuando realices una compra, tus pedidos aparecerán aquí.</p>
          <Link
            href="/shop"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
