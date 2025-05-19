"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import AccountSidebar from "@/components/account-sidebar"
import { orders } from "@/lib/orders"
import { OrderCard } from "@/components/order-card"

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filtrar órdenes según la pestaña activa
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    return order.status === activeTab
  })

  // Filtrar órdenes según la búsqueda
  const searchedOrders = filteredOrders.filter((order) => {
    if (!searchQuery) return true
    return (
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="bg-gradient-to-r from-red-100 to-red-50 text-red-600 py-3 px-4 text-center font-semibold shadow-sm">
        ¡ERES UN CLIENTE MAYORISTA!
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar compartido */}
          <AccountSidebar />

          {/* Contenido principal */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">Mis pedidos</h2>

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar por número de pedido o producto..."
                    className="pl-10 py-6 bg-gray-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="processing">En proceso</TabsTrigger>
                  <TabsTrigger value="shipped">Enviados</TabsTrigger>
                  <TabsTrigger value="delivered">Entregados</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {searchedOrders.length > 0 ? (
                    searchedOrders.map((order) => <OrderCard key={order.id} order={order} />)
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pedidos</h3>
                      <p className="text-gray-500">
                        {searchQuery
                          ? "No hay pedidos que coincidan con tu búsqueda."
                          : "No tienes pedidos en esta categoría."}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
