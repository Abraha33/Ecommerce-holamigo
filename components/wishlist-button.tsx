"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Plus } from "lucide-react"
import { useWishlist } from "@/components/wishlist-provider"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface WishlistButtonProps {
  productId: string | number
  productName: string
  productImage: string
  productPrice: number
  productUnit?: string
  variant?: "icon" | "default"
  size?: "sm" | "default"
}

export function WishlistButton({
  productId,
  productName,
  productImage,
  productPrice,
  productUnit = "unidad",
  variant = "default",
  size = "default",
}: WishlistButtonProps) {
  const { wishlists, addToWishlist, removeFromWishlist, isInWishlist, createWishlist } = useWishlist()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newListName, setNewListName] = useState("")

  // Check if product is in any wishlist
  const isInAnyWishlist = wishlists.some((wishlist) =>
    wishlist.items.some((item) => String(item.id) === String(productId)),
  )

  useEffect(() => {
    // Este efecto se ejecutará cada vez que cambie el estado de las listas
    // No necesita hacer nada, solo forzar un rerender
  }, [wishlists])

  const handleAddToWishlist = (wishlistId: string) => {
    const wishlist = wishlists.find((w) => w.id === wishlistId)

    if (wishlist) {
      // Añadir el producto a la lista de deseos
      addToWishlist(wishlistId, {
        id: productId.toString(),
        name: productName,
        image: productImage,
        price: productPrice,
        quantity: 1,
        unit: productUnit,
      })

      // Forzar una actualización del estado para reflejar el cambio inmediatamente
      setIsOpen(false)

      // Mostrar notificación
      toast({
        title: "Producto agregado",
        description: `${productName} ha sido agregado a "${wishlist.name}"`,
      })

      // Forzar un rerender para actualizar el icono
      setTimeout(() => {
        setIsOpen(false)
      }, 100)
    }

    setIsOpen(false)
  }

  const handleRemoveFromWishlist = (wishlistId: string) => {
    const wishlist = wishlists.find((w) => w.id === wishlistId)

    if (wishlist) {
      removeFromWishlist(wishlistId, productId.toString())

      toast({
        title: "Producto eliminado",
        description: `${productName} ha sido eliminado de "${wishlist.name}"`,
      })
    }
  }

  const handleCreateNewList = () => {
    if (newListName.trim()) {
      const newListId = createWishlist(newListName.trim())

      // Añadir el producto a la nueva lista
      addToWishlist(newListId, {
        id: productId.toString(),
        name: productName,
        image: productImage,
        price: productPrice,
        quantity: 1,
        unit: productUnit,
      })

      toast({
        title: "Lista creada",
        description: `Se ha creado la lista "${newListName}" y se ha añadido el producto`,
      })

      setNewListName("")
      setIsCreateDialogOpen(false)
      setIsOpen(false)
    }
  }

  if (variant === "icon") {
    return (
      <>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size={size === "sm" ? "icon-sm" : "icon"}
              className={`rounded-full border border-gray-200 hover:border-gray-400 hover:bg-gray-100 hover:shadow-md transition-all ${
                isInAnyWishlist ? "text-red-500 hover:bg-red-50" : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label="Agregar a lista de deseos"
            >
              <Heart className={`h-5 w-5 ${isInAnyWishlist ? "fill-current" : ""}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="text-sm font-medium px-2 py-1.5 text-gray-500">Agregar a lista de deseos</div>
            {wishlists.map((wishlist) => {
              const isInList = isInWishlist(wishlist.id, productId)
              return (
                <DropdownMenuItem
                  key={wishlist.id}
                  onClick={() => (isInList ? handleRemoveFromWishlist(wishlist.id) : handleAddToWishlist(wishlist.id))}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>{wishlist.name}</span>
                  {isInList && <Heart className="h-4 w-4 fill-red-500 text-red-500" />}
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center text-blue-600 cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>Crear nueva lista</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear nueva lista</DialogTitle>
              <DialogDescription>
                Crea una nueva lista de deseos para guardar tus productos favoritos.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="col-span-3"
                  placeholder="Mi lista de compras"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateNewList} disabled={!newListName.trim()}>
                Crear y añadir producto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={size} className={`${isInAnyWishlist ? "text-red-500 border-red-500" : ""}`}>
            <Heart className={`h-4 w-4 mr-2 ${isInAnyWishlist ? "fill-current" : ""}`} />
            {isInAnyWishlist ? "Guardado" : "Guardar"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="text-sm font-medium px-2 py-1.5 text-gray-500">Seleccionar lista</div>
          {wishlists.map((wishlist) => {
            const isInList = isInWishlist(wishlist.id, productId)
            return (
              <DropdownMenuItem
                key={wishlist.id}
                onClick={() => (isInList ? handleRemoveFromWishlist(wishlist.id) : handleAddToWishlist(wishlist.id))}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{wishlist.name}</span>
                {isInList && <Heart className="h-4 w-4 fill-red-500 text-red-500" />}
              </DropdownMenuItem>
            )
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center text-blue-600 cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Crear nueva lista</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear nueva lista</DialogTitle>
            <DialogDescription>Crea una nueva lista de deseos para guardar tus productos favoritos.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="col-span-3"
                placeholder="Mi lista de compras"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateNewList} disabled={!newListName.trim()}>
              Crear y añadir producto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
