"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, ShoppingCart, Edit, Trash2, Plus, ListPlus, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function WishlistsPage() {
  const [activeTab, setActiveTab] = useState("lists")
  const { addItem } = useCart()
  const { toast } = useToast()
  const [editingList, setEditingList] = useState<string | null>(null)
  const [newListName, setNewListName] = useState("")
  const [isCreatingList, setIsCreatingList] = useState(false)
  const [lists, setLists] = useState([
    {
      id: "1",
      name: "Compra negocio",
      date: "2023/02/28",
      productCount: 12,
      products: [
        {
          id: 1,
          name: "Toallas de cocina ECONO",
          price: 5.99,
          image: "/stack-of-paper-towels.png",
          quantity: 1,
        },
        {
          id: 2,
          name: "PAPEL ALUMINIO CAJA 11/0",
          price: 3.49,
          image: "/crumpled-foil-texture.png",
          quantity: 1,
        },
        {
          id: 3,
          name: "Vasos 7-Oz ECONO (38728)",
          price: 2.99,
          image: "/colorful-plastic-cups.png",
          quantity: 1,
        },
      ],
    },
    {
      id: "2",
      name: "Productos favoritos",
      date: "2023/03/15",
      productCount: 5,
      products: [
        {
          id: 4,
          name: "Eco Storage Container",
          price: 24.99,
          image: "/sustainable-kitchen-storage.png",
          quantity: 1,
        },
        {
          id: 5,
          name: "Biodegradable Plant Pots",
          price: 12.99,
          image: "/seedling-nursery.png",
          quantity: 1,
        },
      ],
    },
  ])

  const handleAddAllToCart = (listId) => {
    const list = lists.find((l) => l.id === listId)
    if (!list) return

    list.products.forEach((product) => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: product.quantity,
        variant: "Default",
      })
    })

    toast({
      title: "Productos agregados",
      description: `${list.products.length} productos de "${list.name}" agregados al carrito.`,
    })
  }

  const handleDeleteList = (listId) => {
    setLists(lists.filter((list) => list.id !== listId))
    toast({
      title: "Lista eliminada",
      description: "La lista ha sido eliminada correctamente.",
    })
  }

  const handleSaveListName = () => {
    if (editingList) {
      setLists(lists.map((list) => (list.id === editingList ? { ...list, name: newListName } : list)))
      setEditingList(null)
      toast({
        title: "Lista actualizada",
        description: "El nombre de la lista ha sido actualizado.",
      })
    }
  }

  const handleCreateNewList = () => {
    if (newListName.trim()) {
      const newList = {
        id: `list-${Date.now()}`,
        name: newListName,
        date: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
        productCount: 0,
        products: [],
      }
      setLists([...lists, newList])
      setIsCreatingList(false)
      setNewListName("")
      toast({
        title: "Lista creada",
        description: `La lista "${newListName}" ha sido creada correctamente.`,
      })
    }
  }

  const handleRemoveProduct = (listId, productId) => {
    setLists(
      lists.map((list) => {
        if (list.id === listId) {
          const updatedProducts = list.products.filter((product) => product.id !== productId)
          return {
            ...list,
            products: updatedProducts,
            productCount: updatedProducts.length,
          }
        }
        return list
      }),
    )
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado de la lista.",
    })
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Listas de mercado", href: "/wishlists", active: true },
        ]}
      />

      <div className="flex items-center gap-2 mt-6 mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Lista de mercado</h1>
      </div>

      <p className="text-muted-foreground mb-6">
        Lista de mercado, reusable para volver a comprar, click agregar al carrito
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="frequent" className="flex-1">
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Mis productos frecuentes
            </div>
          </TabsTrigger>
          <TabsTrigger value="lists" className="flex-1">
            <div className="flex items-center justify-center gap-2">
              <ListPlus className="h-4 w-4" />
              Mis listas de mercado
            </div>
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex-1">
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Lista de deseos
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="frequent">
          <div className="text-center py-12">
            <p>Aquí aparecerán tus productos comprados con frecuencia.</p>
          </div>
        </TabsContent>

        <TabsContent value="lists">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Mis listas de mercado</h2>
            <p className="text-muted-foreground text-sm">
              Recuerda que puedes crear nuevas listas, adicionarlas o eliminarlas y de hacer tu próxima compra más
              rápido. Ten presente que debes seleccionar tu método de envío, antes de agregar más productos a tus
              listas.
            </p>

            <div className="flex justify-end mt-4">
              <Button
                onClick={() => {
                  setNewListName("")
                  setIsCreatingList(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear nueva lista
              </Button>
            </div>
          </div>

          {lists.map((list) => (
            <div key={list.id} className="border rounded-lg mb-8">
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  {editingList === list.id ? (
                    <div className="flex items-center gap-2">
                      <Input value={newListName} onChange={(e) => setNewListName(e.target.value)} className="w-48" />
                      <Button size="sm" variant="ghost" onClick={handleSaveListName}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{list.name}</h3>
                      <button
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingList(list.id)
                          setNewListName(list.name)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    ({list.productCount} productos) {list.date}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDeleteList(list.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar lista
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddAllToCart(list.id)}
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={list.products.length === 0}
                  >
                    Añadir al carrito
                  </Button>
                </div>
              </div>

              <div className="p-4 flex flex-wrap gap-4">
                <Button variant="outline" size="sm">
                  Ver productos
                </Button>
                <Button variant="outline" size="sm">
                  Agregar productos
                </Button>
              </div>

              {list.products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 border-t">
                  {list.products.map((product) => (
                    <div key={product.id} className="border rounded-md p-2 relative group">
                      <button
                        className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveProduct(list.id, product.id)}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </button>
                      <div className="relative h-24 mb-2">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h4 className="text-xs font-medium line-clamp-2 mb-1">{product.name}</h4>
                      <div className="text-xs font-semibold">{formatCurrency(product.price)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border-t">
                  <p className="text-muted-foreground">Esta lista no tiene productos.</p>
                </div>
              )}
            </div>
          ))}

          {lists.length === 0 && (
            <div className="text-center py-12 border rounded-lg">
              <ListPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No tienes listas de mercado creadas.</p>
              <Button
                onClick={() => {
                  setNewListName("")
                  setIsCreatingList(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear nueva lista
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="wishlist">
          <div className="text-center py-12">
            <p>Aquí aparecerán tus productos guardados en la lista de deseos.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog for creating new list */}
      <Dialog open={isCreatingList} onOpenChange={setIsCreatingList}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nueva lista</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="new-list-name">Nombre de la lista</Label>
            <Input
              id="new-list-name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Ej: Mi lista de compras"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingList(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateNewList} disabled={!newListName.trim()}>
              Crear lista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
