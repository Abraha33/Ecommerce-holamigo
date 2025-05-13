"use client"

import { useState } from "react"
import { useWishlist } from "@/components/wishlist-provider"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
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
import { ArrowLeft, ShoppingBag, Pencil, Plus } from "lucide-react"

export default function WishlistsPage() {
  const router = useRouter()
  const { wishlists, activeWishlistId, setActiveWishlistId, clearWishlist, deleteWishlist } = useWishlist()
  const { addItem, addItems } = useCart()
  const { toast } = useToast()

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingWishlistId, setEditingWishlistId] = useState<string | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingWishlistId, setDeletingWishlistId] = useState<string | undefined>()
  const [showProducts, setShowProducts] = useState<Record<string, boolean>>({})

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

  const addWishlistToCart = (wishlistId: string) => {
    const wishlist = wishlists.find((w) => w.id === wishlistId)
    if (wishlist && wishlist.items.length > 0) {
      addItems(
        wishlist.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
        })),
      )
      toast({
        title: "Productos agregados al carrito",
        description: `${wishlist.items.length} productos de "${wishlist.name}" han sido agregados al carrito`,
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
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/shop" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Regreso</span>
        </Link>
      </div>

      <Tabs defaultValue="lists" className="w-full">
        <TabsList className="w-full grid grid-cols-2 gap-4 mb-8 bg-transparent">
          <TabsTrigger
            value="frequent"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-full border border-gray-200 py-3"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Mis productos frecuentes
          </TabsTrigger>
          <TabsTrigger
            value="lists"
            className="data-[state=active]:bg-amber-50 data-[state=active]:shadow-sm rounded-full border border-amber-200 py-3"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Mis lista de mercado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lists" className="mt-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Mis listas de mercado</h1>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <p className="text-gray-700">
                Recuerda que puedes crear nuevas listas, actualizarlas o eliminarlas y así hacer tu próxima compra más
                rápido.
                <span className="font-medium">
                  {" "}
                  Ten presente que debes seleccionar tu método de envío, antes de agregar más productos a tus listas.
                </span>
              </p>
              <Button
                onClick={handleCreateWishlist}
                className="whitespace-nowrap bg-orange-400 hover:bg-orange-500 text-white"
              >
                Crear nueva lista
              </Button>
            </div>
          </div>

          {wishlists.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 mb-4">No tienes listas de mercado creadas</p>
              <Button onClick={handleCreateWishlist} className="bg-orange-400 hover:bg-orange-500 text-white">
                Crear mi primera lista
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {wishlists.map((wishlist) => (
                <div key={wishlist.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-xl font-semibold">{wishlist.name}</h3>
                        <button
                          onClick={() => handleEditWishlist(wishlist.id)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-gray-500 text-sm mt-1">
                        ({wishlist.items.length} de 200 productos) {formatDate(wishlist.updatedAt)}
                      </div>
                      <button
                        onClick={() => confirmDeleteWishlist(wishlist.id)}
                        className="text-gray-500 hover:text-red-500 text-sm mt-1 underline"
                      >
                        Eliminar lista
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0 w-full md:w-auto">
                      <button
                        onClick={() => toggleShowProducts(wishlist.id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center justify-center md:justify-start"
                      >
                        Ver productos <Plus className="h-4 w-4 ml-1" />
                      </button>
                      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
                        <Button
                          onClick={() => addWishlistToCart(wishlist.id)}
                          className="bg-orange-400 hover:bg-orange-500 text-white w-full md:w-auto"
                          disabled={wishlist.items.length === 0}
                        >
                          Añadir al Carrito
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-300 text-gray-700 w-full md:w-auto"
                          onClick={navigateToShop}
                        >
                          Agregar productos
                        </Button>
                      </div>
                    </div>
                  </div>

                  {showProducts[wishlist.id] && wishlist.items.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wishlist.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                            <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 relative overflow-hidden">
                              {item.image && (
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="object-cover w-full h-full"
                                />
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="text-sm font-medium line-clamp-1">{item.name}</div>
                              <div className="text-sm text-gray-500">{formatCurrency(item.price)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="frequent">
          <div className="p-8 text-center border rounded-lg">
            <p className="text-gray-500">Aquí aparecerán tus productos comprados con frecuencia</p>
          </div>
        </TabsContent>
      </Tabs>

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
