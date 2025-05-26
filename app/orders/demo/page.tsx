"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createDemoOrder, saveDemoOrder } from "@/lib/demo-order-service"
import { toast } from "@/components/ui/use-toast"
import { Package, ShoppingCart, ArrowRight } from "lucide-react"

export default function CreateDemoOrderPage() {
  const router = useRouter()

  const handleCreateDemoOrder = () => {
    // Crear pedido demo
    const demoOrder = createDemoOrder()
    saveDemoOrder(demoOrder)

    toast({
      title: "¡Pedido demo creado!",
      description: `Pedido #${demoOrder.orderNumber} listo para seguimiento`,
      variant: "default",
    })

    // Redirigir al estado del pedido
    router.push("/orders/latest")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="text-center">
        <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Package className="h-10 w-10 text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold mb-4">Crear Pedido de Demostración</h1>
        <p className="text-gray-600 mb-8">
          Crea un pedido de ejemplo para probar el sistema de seguimiento de pedidos.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-4">El pedido demo incluirá:</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-lg mr-3 flex items-center justify-center">
                <img src="/open-eco-container.png" alt="Contenedor" className="w-8 h-8 object-cover" />
              </div>
              <div>
                <p className="font-medium">Contenedor Ecológico 500ml</p>
                <p className="text-sm text-gray-600">$12.500 x 1</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-lg mr-3 flex items-center justify-center">
                <img src="/colorful-plastic-cups.png" alt="Vasos" className="w-8 h-8 object-cover" />
              </div>
              <div>
                <p className="font-medium">Set de Vasos Biodegradables</p>
                <p className="text-sm text-gray-600">$18.000 x 1</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>$30.500</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleCreateDemoOrder}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Crear Pedido Demo
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-sm text-gray-500 mt-4">Este pedido es solo para demostración y no se procesará realmente.</p>
      </div>
    </div>
  )
}
