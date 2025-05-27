"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, Eye, ArrowUpRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"

// Datos de ejemplo para el dashboard
const dashboardStats = {
  totalSales: 2450000,
  salesGrowth: 12.5,
  totalOrders: 156,
  ordersGrowth: 8.2,
  totalUsers: 1234,
  usersGrowth: 15.3,
  totalProducts: 89,
  productsGrowth: 5.1,
}

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Juan Pérez",
    total: 125000,
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "María García",
    total: 89000,
    status: "processing",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Carlos López",
    total: 156000,
    status: "shipped",
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "Ana Martínez",
    total: 78000,
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "ORD-005",
    customer: "Luis Rodríguez",
    total: 234000,
    status: "completed",
    date: "2024-01-13",
  },
]

const topProducts = [
  {
    id: 1,
    name: "Botella Ecológica 500ml",
    sales: 45,
    revenue: 1125000,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Contenedor Biodegradable",
    sales: 38,
    revenue: 950000,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Bolsa Reutilizable",
    sales: 32,
    revenue: 640000,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Platos Compostables",
    sales: 28,
    revenue: 560000,
    image: "/placeholder.svg?height=40&width=40",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "processing":
      return "bg-blue-100 text-blue-800"
    case "shipped":
      return "bg-purple-100 text-purple-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Completado"
    case "processing":
      return "Procesando"
    case "shipped":
      return "Enviado"
    case "pending":
      return "Pendiente"
    default:
      return status
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">¡Bienvenido al Panel de Administración!</h1>
        <p className="text-blue-100">
          Aquí tienes un resumen de tu tienda. Gestiona productos, pedidos y usuarios desde un solo lugar.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardStats.totalSales)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+{dashboardStats.salesGrowth}%</span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+{dashboardStats.ordersGrowth}%</span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalUsers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+{dashboardStats.usersGrowth}%</span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+{dashboardStats.productsGrowth}%</span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pedidos Recientes</CardTitle>
                <CardDescription>Los últimos pedidos realizados en tu tienda</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{order.id}</span>
                      <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>Los productos con mejor rendimiento este mes</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} ventas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Accede rápidamente a las funciones más utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              className="h-20 flex-col space-y-2"
              variant="outline"
              onClick={() => router.push("/admin/order-control")}
            >
              <ShoppingCart className="h-6 w-6" />
              <span>Ver Pedidos</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline" onClick={() => router.push("/admin/users")}>
              <Users className="h-6 w-6" />
              <span>Gestionar Usuarios</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline" onClick={() => router.push("/admin/reports")}>
              <TrendingUp className="h-6 w-6" />
              <span>Ver Reportes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
