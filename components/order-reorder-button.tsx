"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/cart-provider"
import type { Order } from "@/lib/orders"

interface OrderReorderButtonProps {
  order: Order
}

export function OrderReorderButton({ order }: OrderReorderButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { addItem } = useCart()

  const handleReorder = async () => {
    setIsLoading(true)

    try {
      // Añadir cada item del pedido al carrito
      for (const item of order.items) {
        await addItem({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          variant: item.variant || "",
          unit: item.unit || "",
        })
      }

      toast({
        title: "Productos añadidos al carrito",
        description: `Se han añadido ${order.items.length} productos de tu pedido anterior al carrito.`,
      })
    } catch (error) {
      console.error("Error al volver a pedir:", error)
      toast({
        title: "Error",
        description: "No se pudieron añadir los productos al carrito. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleReorder} disabled={isLoading} className="bg-[#F47B20] hover:bg-[#e06a10] text-white">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Procesando...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Volver a pedir
        </>
      )}
    </Button>
  )
}
