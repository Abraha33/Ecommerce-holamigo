"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Package, Clipboard, Truck, CheckCircle, ShoppingBag, User, Settings, Clock } from "lucide-react"

type OrderStatus = "creado" | "armado" | "enviado" | "entregado" | "recibido"
type UserRole = "admin" | "vendedor" | "armador" | "transportador"

interface Order {
  id: string
  customer: string
  status: OrderStatus
  items: number
  total: number
  date: string
  assignedTo?: string
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "María García",
    status: "creado",
    items: 3,
    total: 125000,
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Carlos López",
    status: "armado",
    items: 2,
    total: 89000,
    date: "2024-01-14",
    assignedTo: "Juan Pérez",
  },
  {
    id: "ORD-003",
    customer: "Ana Rodríguez",
    status: "enviado",
    items: 4,
    total: 156000,
    date: "2024-01-13",
    assignedTo: "Martha Liliana",
  },
  {
    id: "ORD-004",
    customer: "Luis Martínez",
    status: "entregado",
    items: 1,
    total: 67000,
    date: "2024-01-12",
  },
]

const statusLabels = {
  creado: "Creado",
  armado: "Armado",
  enviado: "Enviado",
  entregado: "Entregado",
  recibido: "Recibido",
}

const statusColors = {
  creado: "bg-gray-100 text-gray-800",
  armado: "bg-blue-100 text-blue-800",
  enviado: "bg-purple-100 text-purple-800",
  entregado: "bg-orange-100 text-orange-800",
  recibido: "bg-green-100 text-green-800",
}

const statusIcons = {
  creado: <ShoppingBag size={16} />,
  armado: <Clipboard size={16} />,
  enviado: <Package size={16} />,
  entregado: <Truck size={16} />,
  recibido: <CheckCircle size={16} />,
}

const rolePermissions = {
  admin: ["creado", "armado", "enviado", "entregado", "recibido"],
  vendedor: ["creado"],
  armador: ["armado"],
  transportador: ["enviado", "entregado"],
}

const roleLabels = {
  admin: "Administrador",
  vendedor: "Vendedor",
  armador: "Armador",
  transportador: "Transportador",
}

const roleIcons = {
  admin: <Settings size={16} />,
  vendedor: <User size={16} />,
  armador: <Clipboard size={16} />,
  transportador: <Truck size={16} />,
}

export default function OrderControlPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [currentRole, setCurrentRole] = useState<UserRole>("admin")
  const { toast } = useToast()

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: OrderStatus[] = ["creado", "armado", "enviado", "entregado", "recibido"]
    const currentIndex = statusFlow.indexOf(currentStatus)

    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1]
    }
    return null
  }

  const canUpdateStatus = (orderStatus: OrderStatus, role: UserRole): boolean => {
    const nextStatus = getNextStatus(orderStatus)
    if (!nextStatus) return false

    return rolePermissions[role].includes(nextStatus)
  }

  const updateOrderStatus = (orderId: string, currentStatus: OrderStatus) => {
    const nextStatus = getNextStatus(currentStatus)
    if (!nextStatus) return

    if (!canUpdateStatus(currentStatus, currentRole)) {
      toast({
        title: "Sin permisos",
        description: "No tienes permisos para actualizar este estado",
        variant: "destructive",
      })
      return
    }

    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order)))

    toast({
      title: "Estado actualizado",
      description: `Pedido ${orderId} actualizado a ${statusLabels[nextStatus]}`,
      variant: "default",
    })
  }

  const getActionButtonText = (status: OrderStatus): string => {
    const nextStatus = getNextStatus(status)
    if (!nextStatus) return "Completado"

    switch (nextStatus) {
      case "armado":
        return "Marcar como Armado"
      case "enviado":
        return "Marcar como Enviado"
      case "entregado":
        return "Marcar como Entregado"
      case "recibido":
        return "Marcar como Recibido"
      default:
        return "Actualizar Estado"
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (currentRole === "admin") return true

    const nextStatus = getNextStatus(order.status)
    return nextStatus && rolePermissions[currentRole].includes(nextStatus)
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Panel de Control de Pedidos</h1>
          <p className="text-muted-foreground">Gestiona el estado de los pedidos según tu rol</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {roleIcons[currentRole]}
            <span className="font-medium">{roleLabels[currentRole]}</span>
          </div>
          <Select value={currentRole} onValueChange={(value: UserRole) => setCurrentRole(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  <Settings size={16} />
                  Administrador
                </div>
              </SelectItem>
              <SelectItem value="vendedor">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  Vendedor
                </div>
              </SelectItem>
              <SelectItem value="armador">
                <div className="flex items-center gap-2">
                  <Clipboard size={16} />
                  Armador
                </div>
              </SelectItem>
              <SelectItem value="transportador">
                <div className="flex items-center gap-2">
                  <Truck size={16} />
                  Transportador
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estadísticas por estado */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusLabels).map(([status, label]) => (
          <Card key={status}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{orders.filter((o) => o.status === status).length}</div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
                <div className={`p-2 rounded-full ${statusColors[status as OrderStatus]}`}>
                  {statusIcons[status as OrderStatus]}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permisos del rol actual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {roleIcons[currentRole]}
            Permisos de {roleLabels[currentRole]}
          </CardTitle>
          <CardDescription>Estados que puedes actualizar con tu rol actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {rolePermissions[currentRole].map((status) => (
              <Badge key={status} className={statusColors[status as OrderStatus]}>
                {statusLabels[status as OrderStatus]}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Asignados ({filteredOrders.length})</CardTitle>
          <CardDescription>Pedidos que puedes gestionar con tu rol actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock size={48} className="mx-auto mb-4 opacity-50" />
                <p>No hay pedidos para gestionar con tu rol actual</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-mono text-sm font-medium">{order.id}</span>
                      <Badge className={statusColors[order.status]}>
                        <div className="flex items-center gap-1">
                          {statusIcons[order.status]}
                          {statusLabels[order.status]}
                        </div>
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{order.customer}</span> •
                      <span className="ml-1">{order.items} productos</span> •
                      <span className="ml-1">${order.total.toLocaleString()}</span>
                      {order.assignedTo && (
                        <>
                          <span className="ml-1">• Asignado a: </span>
                          <span className="font-medium">{order.assignedTo}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {canUpdateStatus(order.status, currentRole) ? (
                      <Button
                        onClick={() => updateOrderStatus(order.id, order.status)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {getActionButtonText(order.status)}
                      </Button>
                    ) : (
                      <Button disabled size="sm" variant="outline">
                        {order.status === "recibido" ? "Completado" : "Sin permisos"}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
