"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus, Check, Eye, ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-provider"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/components/wishlist-provider"
import { ProductDetailsModal } from "@/components/product-details-modal"

// Types
interface PackageType {
  value: string
  label: string
  factor: number
}

interface Product {
  id: number
  name: string
  slug: string
  price: number
  image: string
  images?: string[]
  isNew?: boolean
  isSale?: boolean
  originalPrice?: number
  stockStatus?: string
}

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

interface UnitOption {
  id: string
  name: string
  unitPrice: number
  factor: number
}

// Constants
const PACKAGE_TYPES: PackageType[] = [
  { value: "unit", label: "Unidad", factor: 1 },
  { value: "pack", label: "Paquete (10)", factor: 10 },
  { value: "box", label: "Caja (100)", factor: 100 },
  { value: "bulk", label: "Bulto (500)", factor: 500 },
]

const DISCOUNT_FACTORS = {
  UNIT: 1,
  SMALL: 0.95,
  MEDIUM: 0.9,
  LARGE: 0.85,
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [selectedPackage, setSelectedPackage] = useState<PackageType>(PACKAGE_TYPES[0])
  const [quantity, setQuantity] = useState(1)
  const [activePackages, setActivePackages] = useState<string[]>([PACKAGE_TYPES[0].value])
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()
  const { addItem } = useCart()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const [isInList, setIsInList] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  
  // Estado para el slider de imágenes
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = product.images || [product.image]

  // Verificar si el producto está en la lista de deseos
  useEffect(() => {
    const checkWishlistStatus = () => {
      const inList = isInWishlist(product.id)
      setIsInList(inList)
    }
    checkWishlistStatus()
  }, [isInWishlist, product.id])

  // Manejar la adición/eliminación de la lista de deseos
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (isInList) {
      removeFromWishlist(product.id)
      toast({
        title: "Producto eliminado",
        description: `${product.name} ha sido eliminado de tu lista de deseos`,
      })
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
      })
      toast({
        title: "Producto añadido",
        description: `${product.name} ha sido añadido a tu lista de deseos`,
      })
    }
    setIsInList(!isInList)
  }

  // Manejar navegación del slider
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Dentro del componente ProductCard, añadir estas opciones de unidades
  const unitOptions: UnitOption[] = [
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
  const calculatePrice = (): number => {
    const packageType = PACKAGE_TYPES.find((p) => p.value === selectedPackage.value) || PACKAGE_TYPES[0]
    const discountFactor = getDiscountFactor(packageType.factor)
    return product.price * packageType.factor * discountFactor * (quantity / packageType.factor)
  }

  // Obtener el factor de descuento según la cantidad
  const getDiscountFactor = (factor: number): number => {
    if (factor === 1) return DISCOUNT_FACTORS.UNIT
    if (factor <= 10) return DISCOUNT_FACTORS.SMALL
    if (factor <= 100) return DISCOUNT_FACTORS.MEDIUM
    return DISCOUNT_FACTORS.LARGE
  }

  // Calcular el precio por unidad para cada tipo de empaque
  const calculateUnitPrice = (packageType: PackageType): number => {
    const discountFactor = getDiscountFactor(packageType.factor)
    return (product.price * packageType.factor * discountFactor) / packageType.factor
  }

  // Calcular el ahorro por unidad para un tipo de empaque
  const calculateUnitSavings = (packageType: PackageType): number => {
    const unitPrice = calculateUnitPrice(packageType)
    return baseUnitPrice - unitPrice
  }

  // Calcular el ahorro total
  const calculateTotalSavings = (): number => {
    const regularPrice = baseUnitPrice * quantity
    const discountedPrice = calculatePrice()
    return regularPrice - discountedPrice
  }

  // Determinar las unidades de empaque óptimas basadas en la cantidad
  useEffect(() => {
    const active: string[] = []
    let remainingQuantity = quantity

    // Ordenar los tipos de empaque de mayor a menor factor
    const sortedPackages = [...PACKAGE_TYPES].sort((a, b) => b.factor - a.factor)

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
      const newSelectedPackage = PACKAGE_TYPES.find((p) => p.value === active[0])
      if (newSelectedPackage) {
        setSelectedPackage(newSelectedPackage)
      }
    }
  }, [quantity, selectedPackage.value])

  // Manejar cambio de cantidad
  const handleQuantityChange = (newQuantity: number): void => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  // Manejar selección de paquete desde el dropdown o barras
  const handlePackageSelect = (value: string): void => {
    const selected = PACKAGE_TYPES.find((p) => p.value === value)
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
  const handleAddToCart = (): void => {
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
      title: "Producto agregado al carrito",
      description: `${product.name} ha sido agregado a tu carrito`,
      duration: 2000,
    })

    setTimeout(() => {
      setIsAdding(false)
    }, 2000)
  }

  // Calcular el porcentaje de ahorro total
  const savingsPercentage = (): number => {
    const regularPrice = baseUnitPrice * quantity
    const discountedPrice = calculatePrice()
    return Math.round(((regularPrice - discountedPrice) / regularPrice) * 100)
  }

  // Función para abrir el modal de detalles
  const openDetailsModal = (e: React.MouseEvent): void => {
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
          className={`relative ${viewMode === "list" ? "w-[45%] min-w-[45%]" : "pt-[100%]"} group m-2 overflow-hidden rounded-lg`}
        >
          <Image 
            src={images[currentImageIndex] || "/placeholder.svg"} 
            alt={product.name} 
            fill 
            className="object-contain p-1 transition-transform duration-300 group-hover:scale-105" 
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-[#004a93] hover:bg-[#004a93] transition-colors">
                Nuevo
              </Badge>
            )}
            {product.isSale && (
              <Badge className="bg-[#e30613] hover:bg-[#e30613] transition-colors">
                Oferta
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full transition-colors ${
                isInList 
                  ? "text-red-500 hover:text-red-600" 
                  : "text-gray-500 hover:text-gray-700"
              } bg-white/80 shadow-sm hover:bg-white`}
              onClick={handleToggleWishlist}
              aria-label={isInList ? "Eliminar de lista de deseos" : "Añadir a lista de deseos"}
            >
              <Heart className={`h-5 w-5 ${isInList ? "fill-current" : ""}`} />
            </Button>
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex-1 flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/80 backdrop-blur-sm shadow-md rounded-full flex items-center gap-1 hover:bg-white"
                onClick={openDetailsModal}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Ver detalles</span>
              </Button>
            </div>

            {/* Gallery Navigation */}
            {images.length > 1 && (
              <div className="flex justify-between px-2 pb-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/70 hover:bg-white/90 shadow-sm transition-colors"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/70 hover:bg-white/90 shadow-sm transition-colors"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Image Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    currentImageIndex === index ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setCurrentImageIndex(index)
                  }}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Content */}
        <CardContent className={`p-4 flex-grow flex flex-col ${viewMode === "list" ? "flex-1" : ""}`}>
          {/* Product Name */}
          <div 
            className="hover:text-[#004a93] cursor-pointer transition-colors" 
            onClick={openDetailsModal}
          >
            <h3 className="font-medium text-sm line-clamp-2 h-10">{product.name}</h3>
          </div>

          {/* Price Section */}
          <div className="mt-2 flex-grow">
            <div className="flex items-baseline">
              <div className="text-black font-bold text-lg">
                {formatCurrency(product.price)}
              </div>
              <span className="text-xs text-gray-500 font-normal ml-1">
                / unidad
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through ml-2">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Package Selection */}
            <div className="mt-3 space-y-3">
              <Select 
                onValueChange={handlePackageSelect} 
                value={selectedPackage.value}
              >
                <SelectTrigger className="w-full border-[#004a93] shadow-sm">
                  <SelectValue placeholder="Seleccionar empaque" />
                </SelectTrigger>
                <SelectContent>
                  {PACKAGE_TYPES.map((pkg) => (
                    <SelectItem key={pkg.value} value={pkg.value}>
                      {pkg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Quantity Control */}
              <div className="flex items-center">
                <span className="text-sm mr-2">Cantidad:</span>
                <div className="flex border rounded shadow-sm">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none border-r hover:bg-gray-100"
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
                    className="h-8 w-8 rounded-none border-l hover:bg-gray-100"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Total Price */}
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  Total: <span className="font-bold text-black">
                    {formatCurrency(calculatePrice())}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
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

      {/* Product Details Modal */}
      <ProductDetailsModal 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
        product={product} 
      />
    </>
  )
}
