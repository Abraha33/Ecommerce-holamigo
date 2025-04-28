"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus, Check, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-provider"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { WishlistButton } from "@/components/wishlist-button"
import { ProductDetailsModal } from "@/components/product-details-modal"

// Definir los tipos de empaque disponibles
const packageTypes = [
  { value: "unit", label: "Unidad", factor: 1 },
  { value: "pack", label: "Paquete (10)", factor: 10 },
  { value: "box", label: "Caja (100)", factor: 100 },
  { value: "bulk", label: "Bulto (500)", factor: 500 },
]

interface ProductCardProps {
  product: {
    id: number
    name: string
    slug: string
    price: number
    image: string
    isNew?: boolean
    isSale?: boolean
    originalPrice?: number
    stockStatus?: string
  }
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [selectedPackage, setSelectedPackage] = useState(packageTypes[0])
  const [quantity, setQuantity] = useState(1)
  const [activePackages, setActivePackages] = useState([packageTypes[0].value])
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()
  const { addItem } = useCart()
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Dentro del componente ProductCard, añadir estas opciones de unidades
  const unitOptions = [
    {
      id: "1",
      name: "Paq de 10 uds.",
      unitPrice: product.price,
      factor: 1,
    },
    {
      id: "2",
      name: "A partir de 10",
      unitPrice: product.price * 0.9,
      factor: 10,
    },
    {
      id: "3",
      name: "Bulto x 40 paq de 10 uds.",
      unitPrice: product.price * 0.85,
      factor: 40,
    },
  ]

  // Añadir esta función para manejar la adición al carrito desde el selector de unidades
  const handleAddToCartFromUnitSelector = (quantity: number, selectedOption: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: selectedOption.unitPrice,
      image: product.image,
      quantity: quantity * selectedOption.factor,
      variant: selectedOption.name,
    })

    toast({
      title: "Producto agregado al carrito",
      description: `${quantity} ${selectedOption.name} de ${product.name} agregado al carrito.`,
    })
  }

  // Calcular el precio base por unidad (sin descuentos)
  const baseUnitPrice = product.price

  // Calcular el precio según el tipo de empaque seleccionado y la cantidad
  const calculatePrice = () => {
    const packageType = packageTypes.find((p) => p.value === selectedPackage.value) || packageTypes[0]
    // Aplicar un pequeño descuento por volumen
    const discountFactor =
      packageType.factor === 1 ? 1 : packageType.factor <= 10 ? 0.95 : packageType.factor <= 100 ? 0.9 : 0.85
    return product.price * packageType.factor * discountFactor * (quantity / packageType.factor)
  }

  // Calcular el precio por unidad para cada tipo de empaque
  const calculateUnitPrice = (packageType) => {
    const discountFactor =
      packageType.factor === 1 ? 1 : packageType.factor <= 10 ? 0.95 : packageType.factor <= 100 ? 0.9 : 0.85
    return (product.price * packageType.factor * discountFactor) / packageType.factor
  }

  // Calcular el ahorro por unidad para un tipo de empaque
  const calculateUnitSavings = (packageType) => {
    const unitPrice = calculateUnitPrice(packageType)
    return baseUnitPrice - unitPrice
  }

  // Calcular el ahorro total
  const calculateTotalSavings = () => {
    const regularPrice = baseUnitPrice * quantity
    const discountedPrice = calculatePrice()
    return regularPrice - discountedPrice
  }

  // Determinar las unidades de empaque óptimas basadas en la cantidad
  useEffect(() => {
    const active = []
    let remainingQuantity = quantity

    // Ordenar los tipos de empaque de mayor a menor factor
    const sortedPackages = [...packageTypes].sort((a, b) => b.factor - a.factor)

    // Determinar qué empaques usar para la cantidad actual
    for (const pkg of sortedPackages) {
      if (remainingQuantity >= pkg.factor) {
        active.push(pkg.value)
        remainingQuantity = remainingQuantity % pkg.factor
      }
    }

    // Si no se activó ningún paquete (cantidad menor que el factor mínimo), activar unidad
    if (active.length === 0) {
      active.push("unit")
    }

    setActivePackages(active)

    // Actualizar el paquete seleccionado al más grande que aplique
    if (active.length > 0 && active[0] !== selectedPackage.value) {
      const newSelectedPackage = packageTypes.find((p) => p.value === active[0])
      if (newSelectedPackage) {
        setSelectedPackage(newSelectedPackage)
      }
    }
  }, [quantity])

  // Manejar cambio de cantidad
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  // Manejar selección de paquete desde el dropdown o barras
  const handlePackageSelect = (value) => {
    const selected = packageTypes.find((p) => p.value === value)
    if (selected) {
      setSelectedPackage(selected)

      // Ajustar la cantidad para que sea un múltiplo del factor del paquete
      if (quantity < selected.factor) {
        setQuantity(selected.factor)
      } else {
        // Redondear al múltiplo más cercano
        const remainder = quantity % selected.factor
        if (remainder > 0) {
          setQuantity(quantity - remainder + selected.factor)
        }
      }
    }
  }

  // Manejar la adición al carrito
  const handleAddToCart = () => {
    setIsAdding(true)

    addItem({
      id: product.id,
      name: product.name,
      price: calculateUnitPrice(selectedPackage),
      image: product.image,
      quantity: quantity,
      variant: selectedPackage.label,
    })

    toast({
      title: (
        <div className="flex items-center">
          <Check className="h-4 w-4 mr-2 text-green-500" />
          Producto agregado al carrito
        </div>
      ),
      duration: 2000,
    })

    setTimeout(() => {
      setIsAdding(false)
    }, 2000)
  }

  // Calcular el porcentaje de ahorro total
  const savingsPercentage = () => {
    const regularPrice = baseUnitPrice * quantity
    const discountedPrice = calculatePrice()
    return Math.round(((regularPrice - discountedPrice) / regularPrice) * 100)
  }

  // Función para abrir el modal de detalles
  const openDetailsModal = (e) => {
    // Solo prevenir el comportamiento predeterminado, no detener la propagación
    e.preventDefault()
    setIsDetailsModalOpen(true)
  }

  return (
    <>
      <Card
        className={`overflow-hidden transition-all shadow-lg hover:shadow-2xl flex flex-col ${
          viewMode === "list" ? "flex-row" : "h-full"
        } border border-gray-200 bg-white rounded-lg m-1`}
      >
        <div
          className={`relative ${viewMode === "list" ? "w-40 min-w-40" : "pt-[100%]"} group m-2 overflow-hidden rounded-lg`}
        >
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain p-1" />

          {/* Badges y botones flotantes */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && <Badge className="bg-[#004a93] hover:bg-[#004a93]">Nuevo</Badge>}
            {product.isSale && <Badge className="bg-[#e30613] hover:bg-[#e30613]">Oferta</Badge>}
          </div>

          <div className="absolute top-2 right-2">
            <WishlistButton
              productId={product.id}
              productName={product.name}
              productImage={product.image}
              productPrice={product.price}
              className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
            />
          </div>

          {/* Quick view button y navegación de galería */}
          <div className="absolute inset-0 flex flex-col">
            {/* Botón de vista rápida en el centro */}
            <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/80 backdrop-blur-sm shadow-md rounded-full flex items-center gap-1"
                onClick={openDetailsModal}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Ver detalles</span>
              </Button>
            </div>

            {/* Controles de navegación de galería */}
            <div className="flex justify-between px-2 pb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/70 hover:bg-white/90 shadow-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/70 hover:bg-white/90 shadow-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className={`p-4 flex-grow flex flex-col ${viewMode === "list" ? "flex-1" : ""}`}>
          <div className="hover:text-[#004a93] cursor-pointer" onClick={openDetailsModal}>
            <h3 className="font-medium text-sm line-clamp-2 h-10">{product.name}</h3>
          </div>

          <div className="mt-2 flex-grow">
            <div className="flex items-baseline">
              <div className="text-black font-bold text-lg">{formatCurrency(product.price)}</div>
              <span className="text-xs text-gray-500 font-normal ml-1"> / unidad</span>

              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through ml-2">{formatCurrency(product.originalPrice)}</span>
              )}
            </div>

            {/* Barras de ahorro - ahora en disposición horizontal */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {packageTypes.map((pkg) => {
                const unitPrice = calculateUnitPrice(pkg)
                const unitSavings = calculateUnitSavings(pkg)
                const isActive = activePackages.includes(pkg.value)
                const isSelected = selectedPackage.value === pkg.value
                return (
                  <motion.div
                    key={pkg.value}
                    onClick={() => handlePackageSelect(pkg.value)}
                    className={`cursor-pointer rounded p-2 transition-all relative flex-1 min-w-[80px] ${
                      isActive
                        ? isSelected
                          ? "bg-[#004a93] text-white ring-2 ring-[#004a93] ring-offset-1"
                          : "bg-[#ccdcf0] text-[#004a93] font-medium"
                        : "bg-gray-100 text-black hover:bg-gray-200"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{pkg.label.split(" ")[0]}</div>
                        <div className="text-[0.65rem] opacity-80">x{pkg.factor}</div>
                      </div>
                      <div
                        className={`${isSelected ? "text-white" : isActive ? "text-black" : "text-black"} font-semibold`}
                      >
                        {formatCurrency(unitPrice)}
                      </div>
                    </div>
                    {isSelected && (
                      <motion.div
                        className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <Check className="h-3 w-3 text-[#004a93]" />
                      </motion.div>
                    )}

                    {/* Mostrar ahorro por unidad para barras activas */}
                    <AnimatePresence>
                      {isActive && unitSavings > 0 && (
                        <motion.div
                          className="mt-1 text-[0.65rem] text-[#004a93] bg-blue-50 rounded-sm px-1"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          Ahorra {formatCurrency(unitSavings)} por unidad
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>

            {/* Resumen de ahorro total */}
            {calculateTotalSavings() > 0 && (
              <motion.div
                className="mt-2 text-xs bg-blue-50 text-[#004a93] p-2 rounded flex items-center justify-between shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span>Ahorro total:</span>
                <span className="font-bold">
                  {formatCurrency(calculateTotalSavings())} ({savingsPercentage()}%)
                </span>
              </motion.div>
            )}

            <div className="mt-3 space-y-3">
              <Select onValueChange={handlePackageSelect} value={selectedPackage.value}>
                <SelectTrigger className="w-full border-[#004a93] shadow-sm">
                  <SelectValue placeholder="Seleccionar empaque" />
                </SelectTrigger>
                <SelectContent>
                  {packageTypes.map((pkg) => (
                    <SelectItem key={pkg.value} value={pkg.value}>
                      {pkg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Control de cantidad */}
              <div className="flex items-center">
                <span className="text-sm mr-2">Cantidad:</span>
                <div className="flex border rounded shadow-sm">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none border-r"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                    className="w-12 h-8 text-center border-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none border-l"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  Total: <span className="font-bold text-black">{formatCurrency(calculatePrice())}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botón fijo en la parte inferior */}
          <div className="mt-4 pt-3 border-t">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full bg-[#004a93] hover:bg-[#0071bc] transition-all h-10 shadow-md"
                onClick={handleAddToCart}
                disabled={isAdding || product.stockStatus === "out_of_stock"}
              >
                {isAdding ? (
                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Agregado
                  </motion.div>
                ) : product.stockStatus === "out_of_stock" ? (
                  "Agotado"
                ) : (
                  <div className="flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Agregar al carrito
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalles del producto */}
      <ProductDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} product={product} />
    </>
  )
}
