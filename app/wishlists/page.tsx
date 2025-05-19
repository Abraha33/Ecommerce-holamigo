"use client"

import { useState, useEffect } from "react"
import { useWishlist } from "@/components/wishlist-provider"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/cart-provider"
import { WishlistEditDialog } from "@/components/wishlist-edit-dialog"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Minus,
  Heart,
  Calendar,
  Clock,
  Trash,
  Edit,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Opciones de unidades disponibles
const unitOptions = [
  { value: "unidad", label: "Unidad" },
  { value: "paquete", label: "Paquete" },
  { value: "caja", label: "Caja" },
  { value: "kg", label: "Kilogramo" },
  { value: "g", label: "Gramo" },
  { value: "l", label: "Litro" },
  { value: "ml", label: "Mililitro" },
  { value: "docena", label: "Docena" },
]

export default function WishlistsPage() {
  const router = useRouter()
  const {
    wishlists,
    activeWishlistId,
    setActiveWishlistId,
    clearWishlist,
    deleteWishlist,
    updateItemQuantity,
    updateItemUnit,
  } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingWishlistId, setEditingWishlistId] = useState<string | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingWishlistId, setDeletingWishlistId] = useState<string | undefined>()
  const [showProducts, setShowProducts] = useState<Record<string, boolean>>({})
  const [isAddingToCart, setIsAddingToCart] = useState<Record<string, boolean>>({})
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState("lists")

  useEffect(() => {
    setIsMounted(true)

    // Inicializar las cantidades de los productos
    if (wishlists) {
      const quantities: Record<string, number> = {}
      wishlists.forEach((wishlist) => {
        wishlist.items.forEach((item) => {
          quantities[item.id] = item.quantity || 1
        })
      })
      setItemQuantities(quantities)
    }
  }, [wishlists])

  if (!isMounted) {
    return null
  }

  const handleCreateWishlist = () => {
    setEditingWishlistId(undefined)
    setEditDialogOpen(true)
  }

  const handleEditWishlist = (id: string) => {
    setEditingWishlistId(id)
    setEditDialogOpen(true)
  }

  const confirmDeleteWishlist = (id: string) => {
    setDeletingWishlistId(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteWishlist = () => {
    if (deletingWishlistId) {
      deleteWishlist(deletingWishlistId)
      toast({
        title: "Lista eliminada",
        description: "La lista ha sido eliminada correctamente",
      })
      setDeleteDialogOpen(false)
    }
  }

  const toggleShowProducts = (wishlistId: string) => {
    setShowProducts((prev) => ({
      ...prev,
      [wishlistId]: !prev[wishlistId],
    }))
  }

  const handleQuantityChange = (wishlistId: string, itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setItemQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }))

    // Actualizar la cantidad en el wishlist
    updateItemQuantity(wishlistId, itemId, newQuantity)
  }

  const handleUnitChange = (wishlistId: string, itemId: string, unit: string) => {
    // Actualizar la unidad en el wishlist
    updateItemUnit(wishlistId, itemId, unit)
  }

  const addWishlistToCart = async (wishlistId: string) => {
    const wishlist = wishlists.find((w) => w.id === wishlistId)
    if (wishlist && wishlist.items.length > 0) {
      setIsAddingToCart((prev) => ({ ...prev, [wishlistId]: true }))

      try {
        // Añadir cada producto individualmente con su cantidad y unidad
        for (const item of wishlist.items) {
          const quantity = itemQuantities[item.id] || item.quantity || 1
          await addItem({
            // No pasar el id para evitar conflictos con la base de datos
            product_id: item.product_id || item.id, // Usar product_id si existe, o el id como fallback
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: quantity,
            unit: item.unit || "unidad",
            variant: item.variant || "",
          })
        }

        toast({
          title: "Productos agregados al carrito",
          description: `${wishlist.items.length} productos de "${wishlist.name}" han sido agregados al carrito`,
          variant: "success",
        })

        // No redirigir automáticamente para que el usuario pueda seguir añadiendo
        // router.push("/cart")
      } catch (error) {
        console.error("Error al añadir productos al carrito:", error)
        toast({
          title: "Error",
          description: "Ocurrió un error al añadir los productos al carrito",
          variant: "destructive",
        })
      } finally {
        setIsAddingToCart((prev) => ({ ...prev, [wishlistId]: false }))
      }
    }
  }

  const addItemToCart = async (item: any, quantity: number) => {
    try {
      await addItem({
        // No pasar el id para evitar conflictos
        product_id: item.product_id || item.id, // Usar product_id si existe, o el id como fallback
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: quantity,
        unit: item.unit || "unidad",
        variant: item.variant || "",
      })

      toast({
        title: "Producto agregado",
        description: `${item.name} ha sido agregado al carrito (${quantity} ${item.unit || "unidad"}(es))`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error al añadir producto al carrito:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al añadir el producto al carrito",
        variant: "destructive",
      })
    }
  }

  const navigateToShop = () => {
    router.push("/shop")
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link href="/shop" className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Volver a la tienda</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis listas de compra</h1>
          <p className="text-gray-600">Guarda tus productos favoritos y organiza tus compras</p>
        </div>

        <Tabs defaultValue="lists" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 gap-4 mb-8 bg-transparent">
            <TabsTrigger
              value="frequent"
              className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-full border border-gray-200 py-3 text-gray-700 data-[state=active]:text-blue-600 transition-all"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Mis productos frecuentes
            </TabsTrigger>
            <TabsTrigger
              value="lists"
              className="data-[state=active]:bg-blue-50 data-[state=active]:shadow-md rounded-full border border-blue-200 py-3 text-gray-700 data-[state=active]:text-blue-600 transition-all"
            >
              <Heart className="h-4 w-4 mr-2" />
              Mis listas de mercado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lists" className="mt-0">
            <div className="mb-6 bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-blue-800 mb-2">Mis listas de mercado</h2>
                  <p className="text-gray-700">
                    Crea y organiza tus listas para hacer tus compras más rápido.
                    <span className="font-medium text-blue-700 ml-1">
                      Recuerda seleccionar tu método de envío antes de agregar productos.
                    </span>
                  </p>
                </div>
                <Button
                  onClick={handleCreateWishlist}
                  className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear nueva lista
                </Button>
              </div>
            </div>

            {wishlists.length === 0 ? (
              <Card className="p-8 text-center bg-white shadow-md border border-gray-100">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-10 w-10 text-blue-300" />
                </div>
                <CardTitle className="text-xl mb-2">No tienes listas de mercado</CardTitle>
                <CardDescription className="text-gray-500 mb-6">
                  Crea tu primera lista para organizar tus compras y ahorrar tiempo
                </CardDescription>
                <Button onClick={handleCreateWishlist} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear mi primera lista
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {wishlists.map((wishlist) => (
                    <motion.div
                      key={wishlist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-white p-6 border-b border-gray-100">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                              <div className="flex items-center">
                                <CardTitle className="text-xl text-blue-800">{wishlist.name}</CardTitle>
                                <button
                                  onClick={() => handleEditWishlist(wishlist.id)}
                                  className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                                <div className="flex items-center">
                                  <ShoppingBag className="h-4 w-4 mr-1 text-blue-500" />
                                  <span className="font-medium text-blue-600">{wishlist.items.length}</span>
                                  <span className="text-gray-500 ml-1">productos</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                                  <span>Actualizada: {formatDate(wishlist.updatedAt)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center mt-4 md:mt-0 space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDeleteWishlist(wishlist.id)}
                                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Eliminar
                              </Button>
                              <Button
                                onClick={() => toggleShowProducts(wishlist.id)}
                                variant="outline"
                                size="sm"
                                className="border-blue-200 text-blue-600"
                              >
                                {showProducts[wishlist.id] ? (
                                  <>
                                    <ChevronUp className="h-4 w-4 mr-1" />
                                    Ocultar
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-4 w-4 mr-1" />
                                    Ver productos
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <AnimatePresence>
                          {showProducts[wishlist.id] && wishlist.items.length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <CardContent className="p-6 bg-white border-b border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {wishlist.items.map((item) => {
                                    const quantity = itemQuantities[item.id] || item.quantity || 1
                                    return (
                                      <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-4"
                                      >
                                        <div className="flex items-start gap-3">
                                          <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 relative overflow-hidden">
                                            {item.image && (
                                              <Image
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                              />
                                            )}
                                          </div>
                                          <div className="flex-grow">
                                            <div className="text-sm font-medium line-clamp-2 text-gray-800 mb-1">
                                              {item.name}
                                            </div>
                                            <div className="text-sm font-semibold text-blue-600">
                                              {formatCurrency(item.price)}
                                            </div>

                                            <div className="flex items-center mt-2">
                                              <div className="flex items-center border border-gray-200 rounded-l-md">
                                                <button
                                                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                                                  onClick={() =>
                                                    handleQuantityChange(wishlist.id, item.id, quantity - 1)
                                                  }
                                                >
                                                  <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                                                <button
                                                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                                                  onClick={() =>
                                                    handleQuantityChange(wishlist.id, item.id, quantity + 1)
                                                  }
                                                >
                                                  <Plus className="h-3 w-3" />
                                                </button>
                                              </div>

                                              <Select
                                                defaultValue={item.unit || "unidad"}
                                                onValueChange={(value) => handleUnitChange(wishlist.id, item.id, value)}
                                              >
                                                <SelectTrigger className="w-24 h-8 text-xs border-l-0 rounded-l-none">
                                                  <SelectValue placeholder="Unidad" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {unitOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                      {option.label}
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>

                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="ml-2 h-8 w-8 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                onClick={() => addItemToCart(item, quantity)}
                                              >
                                                <ShoppingCart className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )
                                  })}
                                </div>
                              </CardContent>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <CardFooter className="p-4 bg-gray-50 flex flex-col sm:flex-row gap-2 justify-between items-center">
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">{wishlist.items.length}</span> productos en esta lista
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              onClick={() => addWishlistToCart(wishlist.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                              disabled={wishlist.items.length === 0 || isAddingToCart[wishlist.id]}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {isAddingToCart[wishlist.id] ? "Añadiendo..." : "Añadir al Carrito"}
                            </Button>
                            <Button
                              variant="outline"
                              className="border-blue-300 text-blue-700 hover:bg-blue-50"
                              onClick={navigateToShop}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Agregar productos
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          <TabsContent value="frequent">
            <Card className="p-8 text-center bg-white shadow-md border border-gray-100">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-10 w-10 text-blue-300" />
              </div>
              <CardTitle className="text-xl mb-2">Productos frecuentes</CardTitle>
              <CardDescription className="text-gray-500 mb-6">
                Aquí aparecerán los productos que compras con frecuencia para facilitar tus compras futuras.
              </CardDescription>
              <Button onClick={navigateToShop} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                Explorar productos
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Wishlist Dialog */}
      <WishlistEditDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} wishlistId={editingWishlistId} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente esta lista y todos los productos guardados
              en ella.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWishlist} className="bg-red-500 hover:bg-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
