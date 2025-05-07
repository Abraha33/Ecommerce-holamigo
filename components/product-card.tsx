"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus, Check, Eye, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-provider"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/components/wishlist-provider"
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
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const [isInList, setIsInList] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Verificar si el producto está en la lista de deseos
  useEffect(() => {
    setIsInList(isInWishlist(product.id))
  }, [isInWishlist, product.id])

  // Manejar la adición/eliminación de la lista de deseos
  const handleToggleWishlist = (e) => {
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
      name: "Bulto x 20 paq de 10 uds.",
      unitPrice: product.price * 0.85,
      factor: 20,
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
        className={`overflow-hidden transition-all shadow-lg hover:shadow-xl flex ${
          viewMode === "list" ? "flex-row h-auto" : "flex-col h-full"
        } border border-gray-200 bg-white rounded-lg m-0`}
      >
        {/* Modificar el contenedor de la imagen para el modo lista */}
        <div
          className={`relative ${
            viewMode === "list" ? "w-[120px] h-[120px] min-w-[120px]" : "pt-[100%]"
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

          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${
                isInList ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-700"
              } bg-white/80 shadow-sm`}
              onClick={handleToggleWishlist}
              aria-label={isInList ? "Eliminar de lista de deseos" : "Añadir a lista de deseos"}
            >
              <Heart className={`h-5 w-5 ${isInList ? "fill-current" : ""}`} />
            </Button>
          </div>

          {/* Quick view button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
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
          <div className={viewMode === "list" ? "flex flex-col h-full" : ""}>
            <div className="hover:text-[#004a93] cursor-pointer" onClick={openDetailsModal}>
              <h3 className={`font-medium ${viewMode === "list" ? "text-base" : "text-sm"} line-clamp-2 mb-1`}>
                {product.name}
              </h3>
              {viewMode === "list" && <p className="text-xs text-gray-500">Cod.{product.id}</p>}
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

            {viewMode === "list" ? (
              <div className="mt-2">
                <div className="text-sm mb-2">
                  Cantidad:
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                    className="w-16 h-7 text-center border ml-2 text-xs inline-block"
                  />
                </div>
                <table className="w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-1 text-left text-xs">Nombre UM</th>
                      <th className="p-1 text-right text-xs">Val. UN</th>
                      <th className="p-1 text-right text-xs">Val. UM</th>
                      <th className="p-1 text-right text-xs">Factor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unitOptions.map((option) => (
                      <tr key={option.id} className="border-t border-gray-200">
                        <td className="p-1">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`option-${product.id}-${option.id}`}
                              name={`unitOption-${product.id}`}
                              value={option.id}
                              checked={selectedPackage.value === packageTypes[Number.parseInt(option.id) - 1]?.value}
                              onChange={() => handlePackageSelect(packageTypes[Number.parseInt(option.id) - 1]?.value)}
                              className="mr-1"
                            />
                            <label htmlFor={`option-${product.id}-${option.id}`} className="cursor-pointer text-xs">
                              {option.name}
                            </label>
                          </div>
                        </td>
                        <td className="p-1 text-right text-xs">{formatCurrency(option.unitPrice)}</td>
                        <td className="p-1 text-right text-xs">{formatCurrency(option.unitPrice * option.factor)}</td>
                        <td className="p-1 text-right text-xs">{option.factor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Keep the existing barras de ahorro for grid mode
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
            )}

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

            {!viewMode || viewMode === "grid" ? (
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
            ) : null}
          </div>

          {/* Botón fijo en la parte inferior */}
          <div className={`${viewMode === "list" ? "mt-2" : "mt-3 pt-2 border-t"}`}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className={`w-full bg-[#004a93] hover:bg-[#0071bc] transition-all h-9 shadow-md text-sm ${
                  viewMode === "list" ? "text-xs" : ""
                }`}
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
                  <div className="flex items-center justify-center">
                    {viewMode === "list" ? (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        AGREGAR
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Agregar al carrito
                      </>
                    )}
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
