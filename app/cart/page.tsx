"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/components/cart-provider"
import { formatCurrency } from "@/lib/utils"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { toast } from "sonner"

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, clearItems } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  // Ensure the component only renders completely on the client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Calculate subtotal only if we're on the client and items exists
  const subtotal = isClient && items ? items.reduce((total, item) => total + item.price * item.quantity, 0) : 0
  const shipping = subtotal > 0 ? 10 : 0
  const total = subtotal + shipping

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return

    setIsApplyingCoupon(true)

    // Simulate coupon application
    setTimeout(() => {
      toast({
        title: "Cupón aplicado",
        description: `Cupón "${couponCode}" aplicado correctamente`,
      })
      setCouponCode("")
      setIsApplyingCoupon(false)
    }, 1000)
  }

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Tu carrito está vacío. Añade productos antes de continuar.",
        variant: "destructive",
      })
      return
    }

    router.push("/checkout")
  }

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

  // Show a loading state until we're on the client
  if (!isClient) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Carrito", href: "/cart", active: true },
        ]}
      />

      <h1 className="text-3xl font-bold mt-6 mb-8">Tu Carrito de Compras</h1>

      {!items || items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
          <p className="mb-8 text-gray-500">Parece que aún no has añadido productos a tu carrito.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/shop">Continuar comprando</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Producto</th>
                    <th className="px-4 py-3 text-center">Cantidad</th>
                    <th className="px-4 py-3 text-right">Precio</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            {item.variant && <p className="text-sm text-gray-500">{item.variant}</p>}
                            {item.unit && <p className="text-sm text-gray-500">Unidad: {item.unit}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 rounded-l border bg-gray-50 hover:bg-gray-100 transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = Number.parseInt(e.target.value)
                              if (!isNaN(value) && value > 0) {
                                updateQuantity(item.id, value)
                              }
                            }}
                            className="w-12 text-center border-t border-b h-8"
                            aria-label="Cantidad"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-r border bg-gray-50 hover:bg-gray-100 transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-4 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t bg-gray-50 flex justify-between">
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    if (confirm("¿Estás seguro de vaciar el carrito?")) {
                      clearItems()
                    }
                  }}
                >
                  Vaciar carrito
                </Button>
                <Button asChild variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Link href="/shop">Seguir comprando</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="border-t pt-3 mt-3 font-semibold flex justify-between">
                  <span>Total</span>
                  <span className="text-lg text-blue-600">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Código de cupón"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isApplyingCoupon}
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || isApplyingCoupon}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    {isApplyingCoupon ? "Aplicando..." : "Aplicar"}
                  </Button>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleProceedToCheckout}>
                  Proceder al pago
                </Button>

                <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50" asChild>
                  <Link href="/shop">Continuar comprando</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
