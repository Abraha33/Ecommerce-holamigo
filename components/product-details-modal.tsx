"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, Heart, Star, Check, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-provider"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

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

// Imágenes adicionales simuladas para la galería
const getAdditionalImages = (mainImage) => {
  // Extraer el nombre base de la imagen
  const parts = mainImage.split(".")
  const ext = parts.pop()
  const baseName = parts.join(".")

  // Generar variantes de la imagen
  return [
    mainImage,
    `${baseName}-alt1.${ext}`.replace(".png", ".png"),
    `${baseName}-alt2.${ext}`.replace(".png", ".png"),
    `${baseName}-alt3.${ext}`.replace(".png", ".png"),
  ]
}

export function ProductDetailsModal({ isOpen, onClose, product }: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState("default")
  const [selectedTab, setSelectedTab] = useState("details")
  const [isAdding, setIsAdding] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(packageTypes[0])
  const { toast } = useToast()
  const { addItem } = useCart()
  const [selectedUnit, setSelectedUnit] = useState(product?.units ? product.units[0] : null)

  // Estado para la galería de imágenes
  const productImages = getAdditionalImages(product?.image || "/placeholder.svg")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Colores disponibles (simulados)
  const availableColors = [
    { id: "default", name: "Estándar", hex: "#e2e2e2" },
    { id: "blue", name: "Azul", hex: "#3b82f6" },
    { id: "green", name: "Verde", hex: "#22c55e" },
  ]

  // Calcular el precio base por unidad (sin descuentos)
  const baseUnitPrice = product?.price || 0

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
    const regularPrice = baseUnitPrice * quantity * selectedPackage.factor
    const discountedPrice = calculatePrice()
    return regularPrice - discountedPrice
  }

  // Calcular el porcentaje de ahorro total
  const savingsPercentage = () => {
    const regularPrice = baseUnitPrice * quantity * selectedPackage.factor
    const discountedPrice = calculatePrice()
    return Math.round(((regularPrice - discountedPrice) / regularPrice) * 100)
  }

  // Manejar selección de paquete
  const handlePackageSelect = (value) => {
    const selected = packageTypes.find((p) => p.value === value)
    if (selected) {
      setSelectedPackage(selected)

      // Ajustar la cantidad para que sea un múltiplo del factor del paquete
      if (quantity < 1) {
        setQuantity(1)
      }
    }
  }

  const handleAddToCart = () => {
    setIsAdding(true)

    addItem({
      id: product.id,
      name: product.name,
      price: calculateUnitPrice(selectedPackage),
      image: product.image,
      quantity: quantity * selectedPackage.factor,
      variant:
        selectedColor !== "default"
          ? `${availableColors.find((c) => c.id === selectedColor)?.name} - ${selectedPackage.label}`
          : selectedPackage.label,
    })

    toast({
      title: "Producto agregado",
      description: `${quantity} ${selectedPackage.label}(s) de ${product.name} agregado al carrito.`,
      className: "max-w-xs",
    })

    setTimeout(() => {
      setIsAdding(false)
    }, 1500)
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  // Navegación de la galería
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  const selectImage = (index) => {
    setCurrentImageIndex(index)
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 sm:p-6 border-b">
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Galería de imágenes */}
          <div className="p-4 space-y-4">
            {/* Imagen principal */}
            <div className="relative h-[250px] md:h-[300px] bg-gray-50 rounded-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={productImages[currentImageIndex] || "/placeholder.svg"}
                    alt={`${product.name} - Vista ${currentImageIndex + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                {product.isNew && <Badge className="bg-[#004a93] hover:bg-[#004a93]">Nuevo</Badge>}
                {product.isSale && <Badge className="bg-[#e30613] hover:bg-[#e30613]">Oferta</Badge>}
              </div>

              {/* Controles de navegación */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/70 hover:bg-white/90 shadow-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/70 hover:bg-white/90 shadow-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Miniaturas */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <div
                  key={index}
                  className={`relative h-16 w-16 flex-shrink-0 cursor-pointer rounded-md border-2 ${
                    currentImageIndex === index ? "border-[#004a93]" : "border-transparent"
                  } overflow-hidden`}
                  onClick={() => selectImage(index)}
                >
                  <Image src={img || "/placeholder.svg"} alt={`Miniatura ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Información del producto */}
          <div className="p-4 sm:p-6 flex flex-col h-full">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-grow">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="specs">Especificaciones</TabsTrigger>
                <TabsTrigger value="reviews">Reseñas</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="flex-grow">
                <div className="space-y-4">
                  <div className="flex items-baseline">
                    <div className="text-[#e30613] font-bold text-2xl">{formatCurrency(product.price)}</div>
                    <span className="text-sm text-gray-500 font-normal ml-1"> / unidad</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Indicador de stock */}
                  <div>
                    {product.stockStatus === "in_stock" ? (
                      <span className="text-sm text-green-600 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-600 mr-1"></div>
                        En stock
                      </span>
                    ) : product.stockStatus === "low_stock" ? (
                      <span className="text-sm text-amber-600 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-600 mr-1"></div>
                        Pocas unidades
                      </span>
                    ) : product.stockStatus === "out_of_stock" ? (
                      <span className="text-sm text-red-600 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-red-600 mr-1"></div>
                        Agotado
                      </span>
                    ) : null}
                  </div>

                  <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                  </p>

                  {/* Selector de unidades */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Presentación:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {packageTypes.map((pkg) => {
                        const unitPrice = calculateUnitPrice(pkg)
                        const unitSavings = calculateUnitSavings(pkg)
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
                                <div className="text-xs opacity-80">x{pkg.factor}</div>
                              </div>
                              <div className={`${isSelected ? "text-white" : "text-[#e30613]"} font-semibold`}>
                                {formatCurrency(unitPrice)}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                <Check className="h-3 w-3 text-[#004a93]" />
                              </div>
                            )}

                            {/* Mostrar ahorro por unidad */}
                            {unitSavings > 0 && (
                              <div
                                className={`mt-1 text-xs ${
                                  isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-[#004a93]"
                                } rounded-sm px-1`}
                              >
                                Ahorra {formatCurrency(unitSavings)} por unidad
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Selector de color */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Color:</h4>
                    <div className="flex gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color.id)}
                          className={`w-8 h-8 rounded-full relative ${
                            selectedColor === color.id ? "ring-2 ring-offset-2 ring-[#004a93]" : ""
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {selectedColor === color.id && (
                            <Check className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Control de cantidad */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Cantidad ({selectedPackage.label}):</h4>
                    <div className="flex items-center">
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
                  </div>

                  {/* Resumen de ahorro total */}
                  {calculateTotalSavings() > 0 && (
                    <div className="mt-2 text-sm bg-blue-50 text-[#004a93] p-2 rounded flex items-center justify-between shadow-sm">
                      <span>Ahorro total:</span>
                      <span className="font-bold">
                        {formatCurrency(calculateTotalSavings())} ({savingsPercentage()}%)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      Total: <span className="font-bold text-[#e30613]">{formatCurrency(calculatePrice())}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specs" className="flex-grow">
                <div className="space-y-4">
                  <h3 className="font-medium">Especificaciones técnicas</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-2">Material</div>
                    <div className="p-2">Plástico reciclado</div>

                    <div className="bg-gray-50 p-2">Dimensiones</div>
                    <div className="p-2">10 x 15 x 5 cm</div>

                    <div className="bg-gray-50 p-2">Peso</div>
                    <div className="p-2">250g</div>

                    <div className="bg-gray-50 p-2">Origen</div>
                    <div className="p-2">Colombia</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="flex-grow">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-medium">5.0</span>
                    <span className="text-sm text-gray-500">(12 reseñas)</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">Juan Pérez</div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Excelente producto, muy buena calidad y entrega rápida.
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">María López</div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Muy satisfecha con mi compra, lo recomiendo.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Botones de acción */}
            <div className="mt-6 grid grid-cols-2 gap-3 pt-4 border-t">
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <Heart className="h-4 w-4" />
                Favorito
              </Button>
              <Button
                className="bg-[#004a93] hover:bg-[#0071bc] flex items-center justify-center gap-2"
                onClick={handleAddToCart}
                disabled={isAdding}
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
