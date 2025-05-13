"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useWishlist } from "@/components/wishlist-provider"
import { useToast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface WishlistButtonProps {
  productId: string | number
  productName: string
  productImage: string
  productPrice: number
  variant?: "icon" | "default"
  size?: "sm" | "default"
}

export function WishlistButton({
  productId,
  productName,
  productImage,
  productPrice,
  variant = "default",
  size = "default",
}: WishlistButtonProps) {
  const { wishlists, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  // Check if product is in any wishlist
  const isInAnyWishlist = wishlists.some((wishlist) =>
    wishlist.items.some((item) => String(item.id) === String(productId)),
  )

  const handleAddToWishlist = (wishlistId: string) => {
    const wishlist = wishlists.find((w) => w.id === wishlistId)

    if (wishlist) {
      addToWishlist(wishlistId, {
        id: productId,
        name: productName,
        image: productImage,
        price: productPrice,
      })

      toast({
        title: "Producto agregado",
        description: `${productName} ha sido agregado a "${wishlist.name}"`,
      })
    }

    setIsOpen(false)
  }

  const handleRemoveFromWishlist = (wishlistId: string) => {
    const wishlist = wishlists.find((w) => w.id === wishlistId)

    if (wishlist) {
      removeFromWishlist(wishlistId, productId)

      toast({
        title: "Producto eliminado",
        description: `${productName} ha sido eliminado de "${wishlist.name}"`,
      })
    }
  }

  if (variant === "icon") {
    return (
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
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
