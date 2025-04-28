"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useWishlist } from "@/components/wishlist-provider"

interface WishlistButtonProps {
  productId: string
  productName: string
  productImage: string
  productPrice: number
  variant?: "icon" | "full"
  className?: string
}

export function WishlistButton({
  productId,
  productName,
  productImage,
  productPrice,
  variant = "icon",
  className = "",
}: WishlistButtonProps) {
  const { toast } = useToast()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const [isInList, setIsInList] = useState(false)

  useEffect(() => {
    setIsInList(isInWishlist(productId))
  }, [isInWishlist, productId])

  const handleToggleWishlist = () => {
    if (isInList) {
      removeFromWishlist(productId)
      toast({
        title: "Producto eliminado",
        description: `${productName} ha sido eliminado de tu lista de deseos`,
      })
    } else {
      addToWishlist({
        id: productId,
        name: productName,
        image: productImage,
        price: productPrice,
      })
      toast({
        title: "Producto añadido",
        description: `${productName} ha sido añadido a tu lista de deseos`,
      })
    }
    setIsInList(!isInList)
  }

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-full ${isInList ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-700"} ${className}`}
        onClick={handleToggleWishlist}
        aria-label={isInList ? "Eliminar de lista de deseos" : "Añadir a lista de deseos"}
      >
        <Heart className={`h-5 w-5 ${isInList ? "fill-current" : ""}`} />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className={`flex items-center gap-2 ${isInList ? "border-red-500 text-red-500 hover:bg-red-50" : ""} ${className}`}
      onClick={handleToggleWishlist}
    >
      <Heart className={`h-5 w-5 ${isInList ? "fill-current text-red-500" : ""}`} />
      {isInList ? "Eliminar de lista" : "Agregar a lista"}
    </Button>
  )
}
