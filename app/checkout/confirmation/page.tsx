"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"
import Link from "next/link"
import { createDemoOrder, saveDemoOrder } from "@/lib/demo-order-service"

const ConfirmationPage = () => {
  const { clearItems } = useCart()

  useEffect(() => {
    // Crear y guardar un pedido demo cuando se confirma
    const demoOrder = createDemoOrder()
    saveDemoOrder(demoOrder)

    // Limpiar el carrito
    clearItems()

    // Mostrar toast de confirmación
    toast({
      title: "¡Pedido confirmado!",
      description: `Tu pedido #${demoOrder.orderNumber} ha sido creado exitosamente`,
      variant: "default",
    })
  }, [clearItems])

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold">¡Gracias por tu pedido!</h1>
      <p className="text-muted-foreground">Tu pedido ha sido confirmado y está en camino.</p>
      <div className="mt-4">
        <Link href="/orders/latest">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver estado del pedido</Button>
        </Link>
      </div>
    </div>
  )
}

export default ConfirmationPage
