"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Search, Eye, Filter } from "lucide-react"

interface Order {
  id: string
  customer: string
  email: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  date: string
  items: number
  address: string
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "María García",
    email: "maria@email.com",
    total: 125000,
    status: "delivered",
    date: "2024-01-15",
    items: 3,
    address: "Calle 123 #45-67, Bogotá",
  },
  {
    id: "ORD-002",
    customer: "Carlos López",
    email: "carlos@email.com",
    total: 89000,
    status: "shipped",
    date: "2024-01-14",
    items: 2,
    address: "Carrera 45 #12-34, Medellín",
  },
  {
    id: "ORD-003",
    customer: "Ana Rodríguez",
    email: "ana@email.com",
    total: 156000,
    status: "processing",
    date: "2024-01-13",
    items: 4,
    address: "Avenida 68 #23-45, Cali",
  },
  {
    id: "ORD-004",
    customer: "Luis Martínez",
    email: "luis@email.com",
    total: 67000,
    status: "pending",
    date: "2024-01-12",
    items: 1,
    address: "Calle 50 #78-90, Barranquilla",
  },
  {
    id: "ORD-005",
    customer: "Sofia Hernández",
    email: "sofia@email.com",
    total: 234000,
    status: "cancelled",
    date: "2024-01-11",
    items: 5,
    address: "Carrera 15 #34-56, Cartagena",
  },
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels = {
  pending: "Pendiente",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const { toast } = useToast()

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    toast({
      title: "Estado actualizado",
      description: `El pedido ${orderId} ha sido actualizado a ${statusLabels[newStatus]}`,
    })
  }

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">Administra todos los pedidos de la tienda</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente, ID o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="processing">Procesando</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{orders.filter((o) => o.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{orders.filter((o) => o.status === "processing").length}</div>
            <p className="text-xs text-muted-foreground">Procesando</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{orders.filter((o) => o.status === "shipped").length}</div>
            <p className="text-xs text-muted-foreground">Enviados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{orders.filter((o) => o.status === "delivered").length}</div>
            <p className="text-xs text-muted-foreground">Entregados</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
          <CardDescription>Lista de todos los pedidos con sus estados actuales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">ID Pedido</th>
                  <th className="text-left p-4 font-medium">Cliente</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-left p-4 font-medium">Fecha</th>
                  <th className="text-left p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-mono text-sm">{order.id}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-muted-foreground">{order.email}</div>
                      </div>
                    </td>
                    <td className="p-4 font-medium">${order.total.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                    </td>
                    <td className="p-4 text-sm">{order.date}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => viewOrderDetails(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="processing">Procesando</SelectItem>
                            <SelectItem value="shipped">Enviado</SelectItem>
                            <SelectItem value="delivered">Entregado</SelectItem>
                            <SelectItem value="cancelled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalles del pedido */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Pedido {selectedOrder?.id}</DialogTitle>
            <DialogDescription>Información completa del pedido</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Cliente</Label>
                  <p className="text-sm">{selectedOrder.customer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedOrder.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total</Label>
                  <p className="text-sm font-medium">${selectedOrder.total.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado</Label>
                  <Badge className={statusColors[selectedOrder.status]}>{statusLabels[selectedOrder.status]}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Dirección de Entrega</Label>
                <p className="text-sm">{selectedOrder.address}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Productos ({selectedOrder.items} items)</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Detalles de productos se mostrarían aquí...</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
