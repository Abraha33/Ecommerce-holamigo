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
import { Search, Package, AlertTriangle, TrendingUp, TrendingDown, Plus, Edit, BarChart3 } from "lucide-react"
import Image from "next/image"

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  price: number
  cost: number
  supplier: string
  lastRestocked: string
  status: "in_stock" | "low_stock" | "out_of_stock" | "discontinued"
  image?: string
  location: string
}

const mockInventory: InventoryItem[] = [
  {
    id: "INV-001",
    name: "Botella Ecológica 500ml",
    sku: "ECO-BOT-500",
    category: "Contenedores",
    currentStock: 150,
    minStock: 50,
    maxStock: 300,
    price: 25000,
    cost: 15000,
    supplier: "EcoPlast",
    lastRestocked: "2024-01-10",
    status: "in_stock",
    image: "/sustainable-hydration.png",
    location: "A1-B2",
  },
  {
    id: "INV-002",
    name: "Maceta Biodegradable",
    sku: "BIO-MAC-001",
    category: "Jardinería",
    currentStock: 25,
    minStock: 30,
    maxStock: 100,
    price: 18000,
    cost: 12000,
    supplier: "GreenLife",
    lastRestocked: "2024-01-05",
    status: "low_stock",
    image: "/garden-biodegradable-pots.png",
    location: "B2-C1",
  },
  {
    id: "INV-003",
    name: "Cubiertos de Bambú",
    sku: "BAM-CUB-SET",
    category: "Utensilios",
    currentStock: 0,
    minStock: 20,
    maxStock: 80,
    price: 35000,
    cost: 22000,
    supplier: "BioTech",
    lastRestocked: "2023-12-20",
    status: "out_of_stock",
    image: "/eco-friendly-bamboo-cutlery.png",
    location: "C1-D2",
  },
  {
    id: "INV-004",
    name: "Bolsa Reutilizable",
    sku: "REU-BOL-001",
    category: "Bolsas",
    currentStock: 200,
    minStock: 100,
    maxStock: 400,
    price: 12000,
    cost: 8000,
    supplier: "EcoMax",
    lastRestocked: "2024-01-12",
    status: "in_stock",
    image: "/colorful-market-bags.png",
    location: "D2-E1",
  },
  {
    id: "INV-005",
    name: "Contenedor Compostable",
    sku: "COM-CON-250",
    category: "Contenedores",
    currentStock: 75,
    minStock: 40,
    maxStock: 150,
    price: 28000,
    cost: 18000,
    supplier: "NaturaPlast",
    lastRestocked: "2024-01-08",
    status: "in_stock",
    image: "/open-eco-container.png",
    location: "E1-F2",
  },
]

const statusColors = {
  in_stock: "bg-green-100 text-green-800",
  low_stock: "bg-yellow-100 text-yellow-800",
  out_of_stock: "bg-red-100 text-red-800",
  discontinued: "bg-gray-100 text-gray-800",
}

const statusLabels = {
  in_stock: "En Stock",
  low_stock: "Stock Bajo",
  out_of_stock: "Sin Stock",
  discontinued: "Descontinuado",
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isRestockOpen, setIsRestockOpen] = useState(false)
  const [restockQuantity, setRestockQuantity] = useState("")
  const { toast } = useToast()

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const updateStock = (itemId: string, newStock: number) => {
    setInventory(
      inventory.map((item) => {
        if (item.id === itemId) {
          let newStatus: InventoryItem["status"] = "in_stock"
          if (newStock === 0) newStatus = "out_of_stock"
          else if (newStock <= item.minStock) newStatus = "low_stock"

          return {
            ...item,
            currentStock: newStock,
            status: newStatus,
            lastRestocked: new Date().toISOString().split("T")[0],
          }
        }
        return item
      }),
    )

    toast({
      title: "Stock actualizado",
      description: `El stock ha sido actualizado exitosamente`,
    })
  }

  const handleRestock = () => {
    if (selectedItem && restockQuantity) {
      const newStock = selectedItem.currentStock + Number.parseInt(restockQuantity)
      updateStock(selectedItem.id, newStock)
      setIsRestockOpen(false)
      setRestockQuantity("")
      setSelectedItem(null)
    }
  }

  const openRestockModal = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsRestockOpen(true)
  }

  const viewItemDetails = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsDetailOpen(true)
  }

  const categories = Array.from(new Set(inventory.map((item) => item.category)))
  const lowStockItems = inventory.filter((item) => item.status === "low_stock" || item.status === "out_of_stock")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
          <p className="text-muted-foreground">Controla el stock y movimientos de productos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Reportes
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Alertas de stock bajo */}
      {lowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h3 className="font-medium text-yellow-800">Alertas de Inventario</h3>
            </div>
            <p className="text-sm text-yellow-700">
              {lowStockItems.length} productos requieren atención: stock bajo o agotado
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, SKU o proveedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="in_stock">En Stock</SelectItem>
                <SelectItem value="low_stock">Stock Bajo</SelectItem>
                <SelectItem value="out_of_stock">Sin Stock</SelectItem>
                <SelectItem value="discontinued">Descontinuado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{inventory.filter((i) => i.status === "in_stock").length}</div>
                <p className="text-xs text-muted-foreground">En Stock</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{inventory.filter((i) => i.status === "low_stock").length}</div>
                <p className="text-xs text-muted-foreground">Stock Bajo</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{inventory.filter((i) => i.status === "out_of_stock").length}</div>
                <p className="text-xs text-muted-foreground">Sin Stock</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{inventory.reduce((sum, item) => sum + item.currentStock, 0)}</div>
                <p className="text-xs text-muted-foreground">Total Items</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de inventario */}
      <Card>
        <CardHeader>
          <CardTitle>Inventario ({filteredInventory.length})</CardTitle>
          <CardDescription>Lista completa del inventario con niveles de stock</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Producto</th>
                  <th className="text-left p-4 font-medium">SKU</th>
                  <th className="text-left p-4 font-medium">Categoría</th>
                  <th className="text-left p-4 font-medium">Stock Actual</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-left p-4 font-medium">Precio</th>
                  <th className="text-left p-4 font-medium">Ubicación</th>
                  <th className="text-left p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                          {item.image ? (
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.supplier}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm">{item.sku}</td>
                    <td className="p-4">{item.category}</td>
                    <td className="p-4">
                      <div className="text-center">
                        <div className="font-medium">{item.currentStock}</div>
                        <div className="text-xs text-muted-foreground">
                          Min: {item.minStock} | Max: {item.maxStock}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={statusColors[item.status]}>{statusLabels[item.status]}</Badge>
                    </td>
                    <td className="p-4 font-medium">${item.price.toLocaleString()}</td>
                    <td className="p-4 font-mono text-sm">{item.location}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => viewItemDetails(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRestockModal(item)}
                          disabled={item.status === "discontinued"}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de restock */}
      <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reabastecer Inventario</DialogTitle>
            <DialogDescription>Añadir stock al producto: {selectedItem?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current">Stock Actual</Label>
              <Input id="current" value={selectedItem?.currentStock || 0} disabled />
            </div>
            <div>
              <Label htmlFor="quantity">Cantidad a Añadir</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Ingresa la cantidad"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(e.target.value)}
              />
            </div>
            <div>
              <Label>Nuevo Stock Total</Label>
              <div className="text-lg font-medium">
                {(selectedItem?.currentStock || 0) + Number.parseInt(restockQuantity || "0")}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRestockOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleRestock} disabled={!restockQuantity}>
                Reabastecer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de detalles del producto */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Producto</DialogTitle>
            <DialogDescription>Información completa del inventario</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                  {selectedItem.image ? (
                    <Image
                      src={selectedItem.image || "/placeholder.svg"}
                      alt={selectedItem.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{selectedItem.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedItem.sku}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Categoría</Label>
                  <p className="text-sm">{selectedItem.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Proveedor</Label>
                  <p className="text-sm">{selectedItem.supplier}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Stock Actual</Label>
                  <p className="text-lg font-bold">{selectedItem.currentStock}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado</Label>
                  <Badge className={statusColors[selectedItem.status]}>{statusLabels[selectedItem.status]}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Stock Mínimo</Label>
                  <p className="text-sm">{selectedItem.minStock}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Stock Máximo</Label>
                  <p className="text-sm">{selectedItem.maxStock}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Precio de Venta</Label>
                  <p className="text-sm font-medium">${selectedItem.price.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Costo</Label>
                  <p className="text-sm">${selectedItem.cost.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Ubicación</Label>
                  <p className="text-sm font-mono">{selectedItem.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Último Restock</Label>
                  <p className="text-sm">{selectedItem.lastRestocked}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Margen de Ganancia</Label>
                <p className="text-lg font-bold text-green-600">
                  {(((selectedItem.price - selectedItem.cost) / selectedItem.cost) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
