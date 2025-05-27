"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Edit, Trash2, FolderPlus, Eye, Settings } from "lucide-react"
import Image from "next/image"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  parentId?: string
  level: number
  isActive: boolean
  productsCount: number
  image?: string
  order: number
  createdAt: string
  updatedAt: string
}

const mockCategories: Category[] = [
  {
    id: "CAT-001",
    name: "Insuperables",
    slug: "insuperables",
    description: "Ofertas y promociones especiales",
    level: 0,
    isActive: true,
    productsCount: 45,
    image: "/categories/insuperables.png",
    order: 1,
    createdAt: "2023-12-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "CAT-002",
    name: "Ofertas Semanales",
    slug: "ofertas-semanales",
    description: "Promociones que cambian cada semana",
    parentId: "CAT-001",
    level: 1,
    isActive: true,
    productsCount: 15,
    image: "/subcategories/ofertas-semanales.png",
    order: 1,
    createdAt: "2023-12-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "CAT-003",
    name: "Liquidación",
    slug: "liquidacion",
    description: "Productos en liquidación con descuentos especiales",
    parentId: "CAT-001",
    level: 1,
    isActive: true,
    productsCount: 12,
    image: "/subcategories/liquidacion.png",
    order: 2,
    createdAt: "2023-12-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "CAT-004",
    name: "Lácteos",
    slug: "lacteos",
    description: "Productos lácteos frescos y derivados",
    level: 0,
    isActive: true,
    productsCount: 78,
    image: "/categories/lacteos.png",
    order: 2,
    createdAt: "2023-12-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "CAT-005",
    name: "Leche",
    slug: "leche",
    description: "Diferentes tipos de leche",
    parentId: "CAT-004",
    level: 1,
    isActive: true,
    productsCount: 25,
    image: "/subcategories/leche.png",
    order: 1,
    createdAt: "2023-12-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "CAT-006",
    name: "Yogurt",
    slug: "yogurt",
    description: "Yogurts naturales y con sabores",
    parentId: "CAT-004",
    level: 1,
    isActive: true,
    productsCount: 30,
    image: "/subcategories/yogurt.png",
    order: 2,
    createdAt: "2023-12-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "CAT-007",
    name: "Aseo",
    slug: "aseo",
    description: "Productos de limpieza y cuidado personal",
    level: 0,
    isActive: true,
    productsCount: 92,
    image: "/categories/aseo.png",
    order: 3,
    createdAt: "2023-12-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "CAT-008",
    name: "Bebidas",
    slug: "bebidas",
    description: "Bebidas refrescantes y energizantes",
    level: 0,
    isActive: false,
    productsCount: 0,
    image: "/categories/bebidas.png",
    order: 4,
    createdAt: "2023-12-01",
    updatedAt: "2024-01-15",
  },
]

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: "",
    isActive: true,
  })
  const { toast } = useToast()

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || category.level.toString() === levelFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && category.isActive) ||
      (statusFilter === "inactive" && !category.isActive)
    return matchesSearch && matchesLevel && matchesStatus
  })

  const toggleCategoryStatus = (categoryId: string) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId ? { ...category, isActive: !category.isActive } : category,
      ),
    )
    toast({
      title: "Estado actualizado",
      description: "El estado de la categoría ha sido actualizado",
    })
  }

  const deleteCategory = (categoryId: string) => {
    const categoryToDelete = categories.find((cat) => cat.id === categoryId)
    if (categoryToDelete && categoryToDelete.productsCount > 0) {
      toast({
        title: "No se puede eliminar",
        description: "La categoría tiene productos asociados",
        variant: "destructive",
      })
      return
    }

    setCategories(categories.filter((category) => category.id !== categoryId))
    toast({
      title: "Categoría eliminada",
      description: "La categoría ha sido eliminada exitosamente",
    })
  }

  const viewCategoryDetails = (category: Category) => {
    setSelectedCategory(category)
    setIsDetailOpen(true)
  }

  const editCategory = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId || "",
      isActive: category.isActive,
    })
    setIsEditOpen(true)
  }

  const handleCreateCategory = () => {
    const newCategory: Category = {
      id: `CAT-${String(categories.length + 1).padStart(3, "0")}`,
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      description: formData.description,
      parentId: formData.parentId || undefined,
      level: formData.parentId ? 1 : 0,
      isActive: formData.isActive,
      productsCount: 0,
      order: categories.filter((c) => c.parentId === formData.parentId).length + 1,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    setCategories([...categories, newCategory])
    setIsCreateOpen(false)
    setFormData({ name: "", slug: "", description: "", parentId: "", isActive: true })
    toast({
      title: "Categoría creada",
      description: "La nueva categoría ha sido creada exitosamente",
    })
  }

  const handleUpdateCategory = () => {
    if (selectedCategory) {
      setCategories(
        categories.map((category) =>
          category.id === selectedCategory.id
            ? {
                ...category,
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                parentId: formData.parentId || undefined,
                level: formData.parentId ? 1 : 0,
                isActive: formData.isActive,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : category,
        ),
      )
      setIsEditOpen(false)
      setSelectedCategory(null)
      setFormData({ name: "", slug: "", description: "", parentId: "", isActive: true })
      toast({
        title: "Categoría actualizada",
        description: "La categoría ha sido actualizada exitosamente",
      })
    }
  }

  const parentCategories = categories.filter((cat) => cat.level === 0)
  const getCategoryHierarchy = (category: Category) => {
    if (category.parentId) {
      const parent = categories.find((cat) => cat.id === category.parentId)
      return parent ? `${parent.name} > ${category.name}` : category.name
    }
    return category.name
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
          <p className="text-muted-foreground">Organiza y administra las categorías de productos</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Categoría</DialogTitle>
              <DialogDescription>Añade una nueva categoría al sistema</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre de la categoría</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Productos Ecológicos"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="productos-ecologicos"
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe la categoría..."
                />
              </div>
              <div>
                <Label htmlFor="parent">Categoría padre (opcional)</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría padre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin categoría padre</SelectItem>
                    {parentCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="active">Categoría activa</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateCategory} disabled={!formData.name}>
                  Crear Categoría
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar categorías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="0">Categorías principales</SelectItem>
                <SelectItem value="1">Subcategorías</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="inactive">Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{categories.filter((c) => c.level === 0).length}</div>
            <p className="text-xs text-muted-foreground">Categorías Principales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{categories.filter((c) => c.level === 1).length}</div>
            <p className="text-xs text-muted-foreground">Subcategorías</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{categories.filter((c) => c.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Activas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{categories.reduce((sum, cat) => sum + cat.productsCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Total Productos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de categorías */}
      <Card>
        <CardHeader>
          <CardTitle>Categorías ({filteredCategories.length})</CardTitle>
          <CardDescription>Lista de todas las categorías organizadas jerárquicamente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Categoría</th>
                  <th className="text-left p-4 font-medium">Jerarquía</th>
                  <th className="text-left p-4 font-medium">Productos</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-left p-4 font-medium">Última Actualización</th>
                  <th className="text-left p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                          {category.image ? (
                            <Image
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FolderPlus className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">/{category.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{getCategoryHierarchy(category)}</div>
                      <Badge variant="outline" className="mt-1">
                        Nivel {category.level}
                      </Badge>
                    </td>
                    <td className="p-4 text-center font-medium">{category.productsCount}</td>
                    <td className="p-4">
                      <Badge
                        className={category.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                      >
                        {category.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{category.updatedAt}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => viewCategoryDetails(category)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => editCategory(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toggleCategoryStatus(category.id)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteCategory(category.id)}
                          disabled={category.productsCount > 0}
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Modal de detalles de categoría */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Categoría</DialogTitle>
            <DialogDescription>Información completa de la categoría</DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                  {selectedCategory.image ? (
                    <Image
                      src={selectedCategory.image || "/placeholder.svg"}
                      alt={selectedCategory.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderPlus className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{selectedCategory.name}</h3>
                  <p className="text-sm text-muted-foreground">/{selectedCategory.slug}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">ID</Label>
                  <p className="text-sm font-mono">{selectedCategory.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nivel</Label>
                  <p className="text-sm">{selectedCategory.level === 0 ? "Principal" : "Subcategoría"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado</Label>
                  <Badge
                    className={selectedCategory.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {selectedCategory.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Productos</Label>
                  <p className="text-lg font-bold">{selectedCategory.productsCount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Creada</Label>
                  <p className="text-sm">{selectedCategory.createdAt}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Actualizada</Label>
                  <p className="text-sm">{selectedCategory.updatedAt}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Descripción</Label>
                <p className="text-sm mt-1">{selectedCategory.description}</p>
              </div>

              {selectedCategory.parentId && (
                <div>
                  <Label className="text-sm font-medium">Categoría Padre</Label>
                  <p className="text-sm">{categories.find((cat) => cat.id === selectedCategory.parentId)?.name}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de edición de categoría */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>Modifica la información de la categoría</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre de la categoría</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Productos Ecológicos"
              />
            </div>
            <div>
              <Label htmlFor="edit-slug">Slug (URL)</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="productos-ecologicos"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe la categoría..."
              />
            </div>
            <div>
              <Label htmlFor="edit-parent">Categoría padre (opcional)</Label>
              <Select
                value={formData.parentId}
                onValueChange={(value) => setFormData({ ...formData, parentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría padre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin categoría padre</SelectItem>
                  {parentCategories
                    .filter((cat) => cat.id !== selectedCategory?.id)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-active">Categoría activa</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateCategory} disabled={!formData.name}>
                Actualizar Categoría
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
