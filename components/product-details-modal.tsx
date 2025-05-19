"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, Check, Minus, Plus, LogIn, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-provider"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

interface ProductDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  product: any
}

// Definir los tipos de empaque disponibles
const packageTypes = [
  { value: "unit", label: "Unidad", factor: 1 },
  { value: "pack", label: "Paquete (10)", factor: 10 },
  { value: "box", label: "Caja (100)", factor: 100 },
  { value: "bulk", label: "Bulto (500)", factor: 500 },
]

export function ProductDetailsModal({ isOpen, onClose, product }: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(packageTypes[0])
  const { toast } = useToast()
  const { addItem, items, removeItem } = useCart()
  const router = useRouter()
  const { user } = useAuth()
  const contentRef = useRef<HTMLDivElement>(null)

  // Verificar si el producto ya está en el carrito
  const cartItem = items.find((item) => item.product_id === product?.id?.toString())
  const isInCart = !!cartItem
  const cartQuantity = cartItem?.quantity || 0

  // Calcular el precio base por unidad (sin descuentos)
  const baseUnitPrice = product?.price || 0

  // Calcular el descuento si hay precio original
  const hasDiscount = product?.originalPrice && product.originalPrice > product.price
  const discountAmount = hasDiscount ? product.originalPrice - product.price : 0
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // Calcular el precio total según el tipo de empaque seleccionado y la cantidad
  const calculateTotalPrice = () => {
    if (!product) return 0
    const packageType = packageTypes.find((p) => p.value === selectedPackage.value) || packageTypes[0]
    return product.price * quantity * packageType.factor
  }

  // Calcular el total de unidades base
  const calculateTotalUnits = () => {
    const packageType = packageTypes.find((p) => p.value === selectedPackage.value) || packageTypes[0]
    return quantity * packageType.factor
  }

  // Manejar selección de paquete
  const handlePackageSelect = (value) => {
    const selected = packageTypes.find((p) => p.value === value)
    if (selected) {
      setSelectedPackage(selected)
    }
  }

  // Efecto para manejar la animación de eliminación
  useEffect(() => {
    if (isRemoving && contentRef.current) {
      const timer = setTimeout(() => {
        // Después de que termine la animación, eliminar el producto y cerrar el modal
        if (cartItem) {
          removeItem(cartItem.id)
          toast({
            title: "Producto eliminado",
            description: `${product.name} ha sido eliminado del carrito`,
            variant: "default",
          })
        }
        setIsRemoving(false)
        onClose()
      }, 800) // Duración de la animación

      return () => clearTimeout(timer)
    }
  }, [isRemoving, cartItem, removeItem, product, onClose, toast])

  const handleAddToCart = async () => {
    if (!product) return

    setIsAdding(true)

    try {
      await addItem({
        product_id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: calculateTotalUnits(),
        variant: selectedPackage.label,
      })

      // Mensaje específico dependiendo si es carrito temporal o de usuario
      if (!user) {
        toast({
          title: "Producto agregado al carrito temporal",
          description: `${quantity} ${selectedPackage.label}(s) de ${product.name} agregado. Se sincronizará cuando inicies sesión.`,
          className: "max-w-xs",
        })
      } else {
        toast({
          title: "Producto agregado",
          description: `${quantity} ${selectedPackage.label}(s) de ${product.name} agregado al carrito.`,
          className: "max-w-xs",
        })
      }

      // Cerrar el modal después de agregar exitosamente
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error("Error al agregar al carrito:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setIsAdding(false)
      }, 1500)
    }
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity)
    } else if (newQuantity === 0) {
      // Iniciar la animación de eliminación
      setIsRemoving(true)
    }
  }

  const handleLogin = () => {
    router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`)
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isRemoving && onClose()}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 sm:p-6 border-b">
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div
          ref={contentRef}
          className={`p-4 sm:p-6 transition-all duration-800 ${
            isRemoving ? "opacity-50 scale-95 animate-shake" : "opacity-100 scale-100"
          }`}
        >
          {/* Imagen del producto - Agrandada */}
          <div className="mb-6">
            <div className="relative w-full h-[250px] bg-gray-50 rounded-lg overflow-hidden">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain p-4" />

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && <Badge className="bg-[#004a93] hover:bg-[#004a93]">Nuevo</Badge>}
                {hasDiscount && <Badge className="bg-[#e30613] hover:bg-[#e30613]">{discountPercentage}% DCTO</Badge>}
              </div>
            </div>
          </div>

          {/* Información de precio y descuento */}
          <div className="mb-6">
            <div className="flex items-baseline">
              <div className="text-black font-bold text-2xl">{formatCurrency(product.price)}</div>
              <span className="text-sm text-gray-500 font-normal ml-1"> / unidad</span>

              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through ml-2">{formatCurrency(product.originalPrice)}</span>
              )}
            </div>

            {/* Mostrar ahorro por descuento si existe */}
            {hasDiscount && (
              <div className="mt-2 text-sm bg-red-50 text-red-600 p-2 rounded flex items-center justify-between">
                <span>Ahorro por descuento:</span>
                <span className="font-bold">
                  {formatCurrency(discountAmount)} ({discountPercentage}%)
                </span>
              </div>
            )}

            <p className="text-sm text-gray-600 mt-3">
              Selecciona la presentación y cantidad que deseas agregar al carrito
            </p>
          </div>

          {/* Aviso de carrito temporal para usuarios no autenticados */}
          {!user && (
            <div className="mb-6 bg-blue-50 p-3 rounded-md border border-blue-100">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <LogIn className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Carrito temporal</h3>
                  <div className="mt-1 text-sm text-blue-700">
                    <p>
                      Estás usando un carrito temporal. Tus productos se guardarán localmente y se sincronizarán cuando
                      inicies sesión.
                    </p>
                  </div>
                  <div className="mt-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-blue-700 border-blue-300 hover:bg-blue-50"
                      onClick={handleLogin}
                    >
                      <LogIn className="h-4 w-4 mr-1" />
                      Iniciar sesión
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Selector de unidades */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Presentación:</h4>
            <div className="grid grid-cols-2 gap-3">
              {packageTypes.map((pkg) => {
                const isSelected = selectedPackage.value === pkg.value
                return (
                  <div
                    key={pkg.value}
                    onClick={() => handlePackageSelect(pkg.value)}
                    className={`cursor-pointer rounded p-3 transition-all relative border ${
                      isSelected
                        ? "bg-[#004a93] text-white border-[#004a93]"
                        : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{pkg.label}</div>
                        <div className="text-xs opacity-80">x{pkg.factor} unidades</div>
                      </div>
                      <div className={`${isSelected ? "text-white" : "text-black"} font-semibold`}>
                        {formatCurrency(product.price * pkg.factor)}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <Check className="h-3 w-3 text-[#004a93]" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Control de cantidad */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Cantidad ({selectedPackage.label}):</h4>
            <div className="flex items-center">
              <div
                className={`flex border-2 border-[#004a93] rounded shadow-sm transition-all ${
                  quantity === 1 ? "hover:border-red-500" : ""
                }`}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 rounded-none border-r transition-colors ${
                    quantity === 1 ? "hover:bg-red-50 hover:text-red-500" : ""
                  }`}
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  {quantity === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                  className="w-16 h-10 text-center border-none text-lg font-bold"
                  inputMode="numeric"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none border-l"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Resumen de total - Destacando más las unidades */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="text-sm text-gray-600 flex justify-between mb-2">
              <span>Total:</span>
              <span className="font-bold text-base text-black">
                {quantity} {selectedPackage.label}
                {quantity > 1 ? "s" : ""}
                <span className="text-gray-600 font-normal ml-1">({calculateTotalUnits()} unidades)</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Subtotal:</div>
              <div className="font-bold">{formatCurrency(calculateTotalPrice())}</div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              className="bg-[#004a93] hover:bg-[#003366] flex items-center justify-center gap-2 text-white"
              onClick={handleAddToCart}
              disabled={isAdding || isRemoving}
            >
              {isAdding ? (
                <>
                  <Check className="h-4 w-4" />
                  Agregado
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Agregar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
