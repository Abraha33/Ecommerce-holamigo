"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus, Check, Eye, Tag, Clock, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-provider"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ProductDetailsModal } from "@/components/product-details-modal"
import { WishlistButton } from "@/components/wishlist-button"

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
  const handleAddToCartFromUnitSelector = async (quantity: number, selectedOption: any) => {
    try {
      await addItem({
        product_id: product.id.toString(),
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
    } catch (error) {
      console.error("Error al agregar al carrito:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito",
        variant: "destructive",
      })
    }
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
  const handleAddToCart = async () => {
    setIsAdding(true)

    try {
      await addItem({
        product_id: product.id.toString(),
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
      }, 2000)
    }
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
      {viewMode === "list" ? (
        <Card className="overflow-hidden transition-all shadow-lg hover:shadow-xl border border-gray-200 bg-white rounded-lg m-0">
          {/* Grid layout based on the provided structure */}
          <div className="grid grid-cols-5 gap-3 p-4">
            {/* Box 1: Product Image (left column) */}
            <div className="col-span-2 row-span-6 relative">
              <div className="relative pt-[100%]">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isNew && <Badge className="bg-[#004a93] hover:bg-[#004a93]">Nuevo</Badge>}
                  {product.isSale && <Badge className="bg-[#e30613] hover:bg-[#e30613]">Oferta</Badge>}
                </div>

                {/* Wishlist button */}
                <div className="absolute top-2 right-2 z-10">
                  <WishlistButton
                    productId={product.id}
                    productName={product.name}
                    productImage={product.image}
                    productPrice={product.price}
                    variant="icon"
                    className="bg-white/80 shadow-sm"
                  />
                </div>
              </div>

              {/* Quick view button */}
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full text-[#004a93] border-[#004a93]"
                onClick={openDetailsModal}
              >
                <Eye className="h-3.5 w-3.5 mr-1" />
                Ver detalles
              </Button>
            </div>

            {/* Box 2: Product Name */}
            <div className="col-span-2 col-start-3">
              <div className="hover:text-[#004a93] cursor-pointer" onClick={openDetailsModal}>
                <h3 className="font-medium text-xl line-clamp-2">{product.name}</h3>
              </div>
            </div>

            {/* Box 3: SKU */}
            <div className="col-start-3 row-start-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4 text-gray-600" />
                <span className="text-base font-medium">SKU: {product.id}</span>
              </div>
            </div>

            {/* Box 4: Origin */}
            <div className="col-start-4 row-start-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-base font-medium">Colombia</span>
              </div>
            </div>

            {/* Box 5: Seller (moved from Box 6, removed IVA) */}
            <div className="col-start-5 row-start-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-base">
                  Vendido por: <span className="font-semibold">Holamigo</span>
                </span>
              </div>
            </div>

            {/* Box 6: Unit Price (NEW) */}
            <div className="col-start-3 row-start-3 text-base">
              <div className="flex items-center">
                <span className="font-medium mr-2 text-lg">Precio unitario:</span>
                <span className="font-bold text-black text-lg">
                  {formatCurrency(calculateUnitPrice(selectedPackage))}
                </span>
              </div>
            </div>

            {/* Box 7: Price - Now with more prominence */}
            <div className="col-span-2 col-start-4 row-start-3">
              <div className="flex flex-col items-end">
                {product.isSale && product.originalPrice && (
                  <div className="bg-[#e30613] text-white text-sm font-bold px-2 py-1 rounded mb-1 inline-block">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </div>
                )}

                {product.originalPrice && (
                  <div className="text-gray-500 line-through text-base">{formatCurrency(product.originalPrice)}</div>
                )}

                <div className="text-black font-bold text-2xl">{formatCurrency(product.price)}</div>
              </div>
            </div>

            {/* Box 8: Package Types */}
            <div className="col-span-2 col-start-3 row-start-4">
              <div className="grid grid-cols-4 gap-1 text-xs">
                {packageTypes.map((pkg) => {
                  const unitPrice = calculateUnitPrice(pkg)
                  const unitSavings = calculateUnitSavings(pkg)
                  const isActive = activePackages.includes(pkg.value)
                  const isSelected = selectedPackage.value === pkg.value
                  return (
                    <motion.div
                      key={pkg.value}
                      onClick={() => handlePackageSelect(pkg.value)}
                      className={`cursor-pointer rounded p-1 transition-all relative ${
                        isActive
                          ? isSelected
                            ? "bg-[#004a93] text-white ring-1 ring-[#004a93]"
                            : "bg-[#ccdcf0] text-[#004a93] font-medium"
                          : "bg-gray-100 text-black hover:bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="font-medium text-[0.8rem]">{pkg.label.split(" ")[0]}</div>
                        <div className="text-[0.7rem] opacity-80">x{pkg.factor}</div>
                        <div
                          className={`${isSelected ? "text-white" : isActive ? "text-black" : "text-black"} font-semibold text-[0.8rem] mt-1`}
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

                      {/* Savings indicator */}
                      <AnimatePresence>
                        {isSelected && unitSavings > 0 && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 text-[0.7rem] text-white bg-blue-600/90 rounded-b-sm px-1 text-center"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            Ahorra {formatCurrency(unitSavings)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>

              {/* Savings summary */}
              {calculateTotalSavings() > 0 && (
                <motion.div
                  className="mt-2 text-sm bg-blue-50 text-[#004a93] p-1 rounded flex items-center justify-between shadow-sm"
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
            </div>

            {/* Box 9: Quantity Selector */}
            <div className="col-span-2 col-start-3 row-start-5">
              <div className="space-y-2">
                <Select onValueChange={handlePackageSelect} value={selectedPackage.value}>
                  <SelectTrigger className="w-full h-9 text-sm border-[#004a93] shadow-sm">
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

                {/* Quantity control */}
                <div className="flex items-center">
                  <span className="text-lg font-medium mr-2">Cantidad:</span>
                  <div className="flex border rounded shadow-sm">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none border-r"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                      className="w-12 h-8 text-center border-none text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none border-l"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 10: Total Price and Add to Cart Button */}
            <div className="col-span-3 col-start-3 row-start-6">
              {/* Total price - Now more prominent */}
              <div className="bg-gray-50 p-3 rounded-md mb-2 flex justify-between items-center shadow-md border border-gray-200">
                <span className="font-medium text-xl">Total:</span>
                <span className="font-bold text-[#004a93] text-2xl">{formatCurrency(calculatePrice())}</span>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  className="w-full bg-[#ff8a00] hover:bg-[#e67e00] transition-all h-10 shadow-md text-base"
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
                      <Check className="h-5 w-5 mr-1" />
                      Agregado
                    </motion.div>
                  ) : product.stockStatus === "out_of_stock" ? (
                    "Agotado"
                  ) : (
                    <div className="flex items-center">
                      Agregar <ShoppingCart className="h-5 w-5 ml-1" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </Card>
      ) : (
        <Card
          className={`overflow-hidden transition-all shadow-lg hover:shadow-2xl flex flex-col h-full border border-gray-200 bg-white rounded-lg m-0`}
        >
          {/* Modificar el contenedor de la imagen para el modo lista */}
          <div
            className={`relative ${
              viewMode === "list" ? "w-[200px] h-[200px] min-w-[200px]" : "pt-[100%]"
            } group overflow-hidden`}
          >
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain p-0 hover:scale-105 transition-transform duration-300"
            />

            {/* Badges y botones flotantes */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && <Badge className="bg-[#004a93] hover:bg-[#004a93]">Nuevo</Badge>}
              {product.isSale && <Badge className="bg-[#e30613] hover:bg-[#e30613]">Oferta</Badge>}
            </div>

            <div className="absolute top-2 right-2 z-10">
              <WishlistButton
                productId={product.id}
                productName={product.name}
                productImage={product.image}
                productPrice={product.price}
                variant="icon"
                className="bg-white/80 shadow-sm"
              />
            </div>

            {/* Quick view button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
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
            </div>
          </div>

          {/* Modificar el contenido para el modo lista */}
          <CardContent className={`p-4 flex-grow flex flex-col ${viewMode === "list" ? "justify-between" : ""}`}>
            <div>
              <div className="hover:text-[#004a93] cursor-pointer" onClick={openDetailsModal}>
                <h3 className={`font-medium ${viewMode === "list" ? "text-base" : "text-sm"} line-clamp-2 mb-2`}>
                  {product.name}
                </h3>
              </div>
            </div>

            <div className="flex-grow">
              <div className="flex items-baseline">
                <div className="text-black font-bold text-lg">{formatCurrency(product.price)}</div>
                <span className="text-xs text-gray-500 font-normal ml-1"> / unidad</span>

                {product.originalPrice && (
                  <span className="text-xs text-gray-500 line-through ml-2">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Barras de ahorro - en disposición 4 por fila */}
              <div className="mt-2 grid grid-cols-4 gap-1 text-xs">
                {packageTypes.map((pkg) => {
                  const unitPrice = calculateUnitPrice(pkg)
                  const unitSavings = calculateUnitSavings(pkg)
                  const isActive = activePackages.includes(pkg.value)
                  const isSelected = selectedPackage.value === pkg.value
                  return (
                    <motion.div
                      key={pkg.value}
                      onClick={() => handlePackageSelect(pkg.value)}
                      className={`cursor-pointer rounded p-1 transition-all relative ${
                        isActive
                          ? isSelected
                            ? "bg-[#004a93] text-white ring-1 ring-[#004a93]"
                            : "bg-[#ccdcf0] text-[#004a93] font-medium"
                          : "bg-gray-100 text-black hover:bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="font-medium text-[0.7rem]">{pkg.label.split(" ")[0]}</div>
                        <div className="text-[0.6rem] opacity-80">x{pkg.factor}</div>
                        <div
                          className={`${isSelected ? "text-white" : isActive ? "text-black" : "text-black"} font-semibold text-[0.7rem] mt-1`}
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

                      {/* Mostrar ahorro por unidad para barras activas - mostrar solo en tarjetas seleccionadas */}
                      <AnimatePresence>
                        {isSelected && unitSavings > 0 && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 text-[0.65rem] text-white bg-blue-600/90 rounded-b-sm px-1 text-center"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            Ahorra {formatCurrency(unitSavings)}
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
                  className="mt-2 text-xs bg-blue-50 text-[#004a93] p-1 rounded flex items-center justify-between shadow-sm"
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

              <div className="mt-2 space-y-2">
                <Select onValueChange={handlePackageSelect} value={selectedPackage.value}>
                  <SelectTrigger className="w-full h-8 text-xs border-[#004a93] shadow-sm">
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
                  <span className="text-xs mr-2">Cantidad:</span>
                  <div className="flex border rounded shadow-sm">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-none border-r"
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
                      className="w-10 h-7 text-center border-none text-xs"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-none border-l"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-xs ml-2">
                    Total: <span className="font-bold text-black">{formatCurrency(calculatePrice())}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón fijo en la parte inferior */}
            <div className="mt-3 pt-2 border-t">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="w-full bg-[#004a93] hover:bg-[#0071bc] transition-all h-9 shadow-md text-sm"
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
                      <Check className="h-4 w-4 mr-1" />
                      Agregado
                    </motion.div>
                  ) : product.stockStatus === "out_of_stock" ? (
                    "Agotado"
                  ) : (
                    <div className="flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Agregar al carrito
                    </div>
                  )}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de detalles del producto */}
      <ProductDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} product={product} />
    </>
  )
}
