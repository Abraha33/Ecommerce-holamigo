"use client"

import { useState } from "react"
import { PlusCircle, Heart, Edit2, Trash2, ShoppingCart, Loader2, Check, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/toast"
import { useCart, type CartItem } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import AccountSidebar from "@/components/account-sidebar"
import { Progress } from "@/components/ui/progress"

export default function AccountWishlistsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { addItem } = useCart()
  const { wishlists, createWishlist, updateWishlist, deleteWishlist } = useWishlist()
  const [newListName, setNewListName] = useState("")
  const [newListDescription, setNewListDescription] = useState("")
  const [isCreatingList, setIsCreatingList] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Estados para la edición de listas
  const [editingList, setEditingList] = useState<any | null>(null)
  const [editListName, setEditListName] = useState("")
  const [editListDescription, setEditListDescription] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUpdatingList, setIsUpdatingList] = useState(false)

  // Estados para añadir al carrito
  const [addingToCartListId, setAddingToCartListId] = useState<string | null>(null)
  const [addToCartProgress, setAddToCartProgress] = useState(0)
  const [isAddToCartDialogOpen, setIsAddToCartDialogOpen] = useState(false)
  const [currentListProducts, setCurrentListProducts] = useState<any[]>([])
  const [addToCartResults, setAddToCartResults] = useState<{
    success: number
    failed: number
    total: number
  }>({ success: 0, failed: 0, total: 0 })

  // Crear nueva lista
  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la lista no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    setIsCreatingList(true)

    try {
      // Aquí está el cambio: pasamos el nombre como string, no como objeto
      const newListId = createWishlist(newListName.trim(), "shopping-bag", newListDescription)

      setNewListName("")
      setNewListDescription("")
      toast({
        title: "Lista creada",
        description: `La lista "${newListName}" ha sido creada exitosamente`,
      })
    } catch (error) {
      console.error("Error al crear lista:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la lista. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingList(false)
      setIsDialogOpen(false)
    }
  }

  // Abrir diálogo de edición
  const openEditDialog = (list) => {
    setEditingList(list)
    setEditListName(list.name)
    setEditListDescription(list.description || "")
    setIsEditDialogOpen(true)
  }

  // Actualizar lista existente
  const handleUpdateList = async () => {
    if (!editingList) return

    if (!editListName.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la lista no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    setIsUpdatingList(true)

    try {
      // Aquí está el cambio: pasamos el nombre directamente, no como objeto
      updateWishlist(editingList.id, editListName, editingList.icon || "shopping-bag", editListDescription)

      toast({
        title: "Lista actualizada",
        description: `La lista "${editListName}" ha sido actualizada exitosamente`,
      })
    } catch (error) {
      console.error("Error al actualizar lista:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la lista. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingList(false)
      setIsEditDialogOpen(false)
      setEditingList(null)
    }
  }

  // Eliminar lista
  const handleDeleteList = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar la lista "${name}"?`)) {
      try {
        await deleteWishlist(id)
        toast({
          title: "Lista eliminada",
          description: `La lista "${name}" ha sido eliminada`,
        })
      } catch (error) {
        console.error("Error al eliminar lista:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar la lista. Intenta nuevamente.",
          variant: "destructive",
        })
      }
    }
  }

  // Iniciar proceso de añadir al carrito
  const startAddToCart = async (listId: string, listName: string) => {
    setAddingToCartListId(listId)
    setAddToCartProgress(0)
    setIsAddToCartDialogOpen(true)

    try {
      // Obtener productos de la lista
      const list = wishlists.find((w) => w.id === listId)
      if (!list) throw new Error("Lista no encontrada")

      const products = list.items || []
      setCurrentListProducts(products)

      // Iniciar proceso de añadir al carrito
      await addListToCart(products, listName)
    } catch (error) {
      console.error("Error al añadir productos al carrito:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al añadir los productos al carrito",
        variant: "destructive",
      })
      setIsAddToCartDialogOpen(false)
      setAddingToCartListId(null)
    }
  }

  // Añadir todos los productos de la lista al carrito
  const addListToCart = async (products: any[], listName: string) => {
    const availableProducts = products.filter((p) => !p.outOfStock)
    const totalProducts = availableProducts.length
    let successCount = 0
    let failedCount = 0

    // Actualizar resultados iniciales
    setAddToCartResults({
      total: totalProducts,
      success: 0,
      failed: 0,
    })

    // Si no hay productos disponibles
    if (totalProducts === 0) {
      setAddToCartProgress(100)
      return
    }

    // Añadir productos uno por uno con un pequeño retraso para simular proceso
    for (let i = 0; i < availableProducts.length; i++) {
      const product = availableProducts[i]

      try {
        // Convertir a formato de CartItem
        const cartItem: CartItem = {
          id: product.id,
          product_id: product.product_id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: product.quantity || 1,
          unit: product.unit || "unidad",
          variant: product.variant || "",
        }

        // Añadir al carrito
        await addItem(cartItem)
        successCount++
      } catch (error) {
        console.error(`Error al añadir producto ${product.name} al carrito:`, error)
        failedCount++
      }

      // Actualizar progreso
      const progress = Math.round(((i + 1) / totalProducts) * 100)
      setAddToCartProgress(progress)

      // Actualizar contadores
      setAddToCartResults({
        total: totalProducts,
        success: successCount,
        failed: failedCount,
      })

      // Pequeña pausa para simular proceso
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    // Mostrar notificación de éxito
    if (successCount > 0) {
      toast({
        title: "Productos añadidos al carrito",
        description: `Se han añadido ${successCount} productos de la lista "${listName}" al carrito`,
      })
    }
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Mis Listas de Compra</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle size={18} />
                  <span>Nueva Lista</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Lista de Compra</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="list-name" className="text-sm font-medium">
                      Nombre de la lista
                    </label>
                    <Input
                      id="list-name"
                      placeholder="Ej: Lista semanal"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="list-description" className="text-sm font-medium">
                      Descripción (opcional)
                    </label>
                    <Textarea
                      id="list-description"
                      placeholder="Describe el propósito de esta lista"
                      value={newListDescription}
                      onChange={(e) => setNewListDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button className="w-full" onClick={handleCreateList} disabled={isCreatingList}>
                    {isCreatingList ? "Creando..." : "Crear Lista"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Diálogo para editar lista */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Lista de Compra</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="edit-list-name" className="text-sm font-medium">
                    Nombre de la lista
                  </label>
                  <Input
                    id="edit-list-name"
                    placeholder="Ej: Lista semanal"
                    value={editListName}
                    onChange={(e) => setEditListName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-list-description" className="text-sm font-medium">
                    Descripción (opcional)
                  </label>
                  <Textarea
                    id="edit-list-description"
                    placeholder="Describe el propósito de esta lista"
                    value={editListDescription}
                    onChange={(e) => setEditListDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateList} disabled={isUpdatingList}>
                  {isUpdatingList ? "Guardando..." : "Guardar cambios"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Diálogo para añadir al carrito */}
          <Dialog
            open={isAddToCartDialogOpen}
            onOpenChange={(open) => {
              // Solo permitir cerrar el diálogo si el proceso ha terminado
              if (!open && addToCartProgress === 100) {
                setIsAddToCartDialogOpen(false)
                setAddingToCartListId(null)
                setCurrentListProducts([])
              }
            }}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Añadiendo productos al carrito</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Progress value={addToCartProgress} className="h-2 w-full" />

                <div className="text-center mb-4">
                  {addToCartProgress < 100 ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                      <p>Añadiendo productos al carrito...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      {addToCartResults.failed === 0 ? (
                        <Check className="h-8 w-8 text-green-500 mb-2" />
                      ) : (
                        <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
                      )}
                      <p className="font-medium">Proceso completado</p>
                    </div>
                  )}
                </div>

                {addToCartProgress === 100 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Resumen:</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex justify-between">
                        <span>Productos procesados:</span>
                        <span>{addToCartResults.total}</span>
                      </li>
                      <li className="flex justify-between text-green-600">
                        <span>Añadidos correctamente:</span>
                        <span>{addToCartResults.success}</span>
                      </li>
                      {addToCartResults.failed > 0 && (
                        <li className="flex justify-between text-red-600">
                          <span>No disponibles:</span>
                          <span>{addToCartResults.failed}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Lista de productos */}
                {currentListProducts.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Productos en la lista:</h3>
                    <div className="max-h-60 overflow-y-auto">
                      {currentListProducts.map((product) => (
                        <div
                          key={product.id}
                          className={`flex items-center p-2 border-b ${product.outOfStock ? "opacity-50" : ""}`}
                        >
                          <div className="w-10 h-10 relative flex-shrink-0 mr-3">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-gray-500">
                              {product.quantity || 1} x ${product.price?.toLocaleString() || "0"}
                            </p>
                          </div>
                          {product.outOfStock && <span className="text-xs text-red-500 ml-2">No disponible</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                {addToCartProgress === 100 && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddToCartDialogOpen(false)
                        setAddingToCartListId(null)
                        setCurrentListProducts([])
                      }}
                    >
                      Cerrar
                    </Button>
                    <Button onClick={() => router.push("/cart")}>Ir al carrito</Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {wishlists.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes listas de compra</h3>
              <p className="text-gray-500 mb-6">
                Crea tu primera lista para guardar productos que quieras comprar más tarde
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>Crear mi primera lista</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlists.map((list) => (
                <Card key={list.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-gray-50 pb-3">
                    <CardTitle className="flex justify-between items-start">
                      <span className="text-lg font-bold truncate">{list.name}</span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Editar"
                          onClick={() => openEditDialog(list)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="Eliminar"
                          onClick={() => handleDeleteList(list.id, list.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{list.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {list.items?.length || 0} {list.items?.length === 1 ? "producto" : "productos"}
                      </span>
                      <span className="text-gray-400">
                        Actualizada: {formatDate(list.updatedAt || list.createdAt || new Date().toISOString())}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 flex justify-between pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mr-2"
                      onClick={() => router.push(`/wishlists?list=${list.id}`)}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Ver lista
                    </Button>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => startAddToCart(list.id, list.name)}
                      disabled={addingToCartListId === list.id || !list.items?.length}
                    >
                      {addingToCartListId === list.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-4 w-4 mr-2" />
                      )}
                      Comprar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
