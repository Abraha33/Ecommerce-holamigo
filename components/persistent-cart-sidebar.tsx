"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, X, Plus, Minus, Info, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function PersistentCartSidebar() {
  const router = useRouter()
  const { items = [], removeItem, updateQuantity, subtotal = 0, isLoading } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  // Verificar si estamos en el cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Verificar si estamos en la página de checkout
  const isCheckoutPage = pathname?.includes("/checkout")

  // Calcular el número de items solo si items está definido
  const itemCount = isMounted && items ? items.reduce((count, item) => count + item.quantity, 0) : 0

  // Cerrar el carrito al hacer clic fuera
  useEffect(() => {
    if (!isMounted) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isOpen && !target.closest(".cart-sidebar") && !target.closest(".cart-toggle")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, isMounted])

  // Prevenir scroll cuando el carrito está abierto
  useEffect(() => {
    if (!isMounted) return

    if (isOpen) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY

      // Bloquear el scroll de la página y fijarla en la posición actual
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
    } else {
      // Restaurar el scroll cuando se cierra el carrito
      const scrollY = document.body.style.top
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""

      // Volver a la posición original del scroll
      if (scrollY) {
        window.scrollTo(0, Number.parseInt(scrollY || "0") * -1)
      }
    }

    return () => {
      // Limpiar los estilos al desmontar el componente
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
    }
  }, [isOpen, isMounted])

  const handleRemoveItem = async (itemId: string) => {
    if (!itemId) return

    try {
      await removeItem(itemId)
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado del carrito",
      })
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      })
    }
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (!itemId) return

    try {
      await updateQuantity(itemId, newQuantity)
    } catch (error) {
      console.error("Error al actualizar cantidad:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad",
        variant: "destructive",
      })
    }
  }

  const handleGoToCheckout = () => {
    setIsOpen(false)
    router.push("/checkout")
  }

  const handleContinueShopping = () => {
    setIsOpen(false)
    // Redirección a la página de tienda
    console.log("Redirigiendo a la página de tienda: /tienda")
    router.push("/tienda")
  }

  // Si no estamos montados en el cliente, no renderizamos nada o renderizamos un placeholder
  if (!isMounted) {
    return null // O un placeholder si prefieres
  }

  return (
    <>
      {/* Botón del carrito */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cart-toggle fixed right-4 top-20 z-40 bg-[#004a93] text-white p-3 rounded-full shadow-lg flex items-center justify-center hover:bg-[#0071bc] transition-all md:hidden"
        aria-label="Abrir carrito"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#e30613] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Overlay oscuro cuando el carrito está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar del carrito */}
      <div
        className={`cart-sidebar fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Agregados al carrito</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Cerrar carrito"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Mensaje informativo */}
        {items && items.length > 0 && (
          <div className="bg-[#FFFF1A] p-3 mx-4 my-3 rounded-md flex items-start">
            <Info className="h-5 w-5 text-gray-800 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-800">Los descuentos serán visualizados al seleccionar el método de pago</p>
          </div>
        )}

        {/* Contenido del carrito */}
        <div className="flex-1 overflow-auto p-4 max-h-[calc(100vh-200px)] overscroll-contain">
          {isLoading && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          {!isLoading && (!items || items.length === 0) && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
              <p>Tu carrito está vacío</p>
            </div>
          )}
          {!isLoading &&
            items &&
            items.map((item) => (
              <div key={item.id} className="flex py-4 border-b">
                {/* Imagen del producto */}
                <div className="relative h-20 w-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                </div>

                {/* Información del producto */}
                <div className="ml-3 flex-1">
                  <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                  <p className="text-xs text-gray-500 uppercase">{item.variant}</p>
                  <div className="mt-1">
                    <span className="font-bold text-base">{formatCurrency(item.price)}</span>
                  </div>
                </div>

                {/* Controles de cantidad */}
                <div className="flex flex-col items-end justify-between ml-2">
                  <button
                    onClick={() => item.id && handleRemoveItem(item.id)}
                    className="text-gray-400 hover:text-[#e30613] p-1"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="flex items-center border rounded-md bg-gray-50">
                    <button
                      onClick={() => item.id && handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded-l-md"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                    <span className="text-xs text-gray-500 mr-1">und.</span>
                    <button
                      onClick={() => item.id && handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded-r-md"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Footer con subtotal y botones */}
        {items && items.length > 0 && (
          <div className="border-t p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-lg">Subtotal:</span>
              <span className="font-bold text-xl">{formatCurrency(subtotal)}</span>
            </div>

            {!isCheckoutPage && (
              <Button
                className="w-full mb-2 bg-[#F47B20] hover:bg-[#e06a10] text-white font-medium py-3 h-auto"
                onClick={handleGoToCheckout}
              >
                Ver carrito / Ir a pagar
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full border-[#004a93] text-[#004a93] font-medium"
              onClick={handleContinueShopping}
              data-testid="continue-shopping-button"
            >
              Seguir comprando
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
