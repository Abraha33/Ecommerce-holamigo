"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Eye, LogIn, Check, Minus, Plus, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ProductDetailsModal } from "@/components/product-details-modal"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useCart } from "@/components/cart-provider"
import Link from "next/link"

interface ProductCardProps {
  product: {
    id: string | number
    name: string
    slug: string
    price: number
    image: string
    secondaryImage?: string
    isNew?: boolean
    isSale?: boolean
    originalPrice?: number
    salePrice?: number | null
    stockStatus?: string
    description?: string
  }
  viewMode?: "grid" | "list" | string
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isWishlistHovered, setIsWishlistHovered] = useState(false)
  const [isDetailsHovered, setIsDetailsHovered] = useState(false)
  const [isLoginHovered, setIsLoginHovered] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { addItem, items, updateQuantity, removeItem } = useCart()

  // Función para verificar si el producto ya está en el carrito
  const cartItem = items.find(
    (item) => item.product_id === product.id.toString() || (item.name === product.name && item.price === product.price),
  )
  const isInCart = !!cartItem

  // Función para abrir el modal de detalles
  const openDetailsModal = (e) => {
    e.preventDefault()
    setIsDetailsModalOpen(true)
  }

  // Función para agregar al carrito
  const handleAddClick = (e) => {
    e.preventDefault()
    // En lugar de agregar directamente, abrimos el modal de detalles
    setIsDetailsModalOpen(true)
  }

  // Función para agregar a la lista de deseos
  const handleWishlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast({
        title: "Inicia sesión para continuar",
        description: "Necesitas iniciar sesión para agregar productos a tu lista de deseos",
        variant: "default",
      })
      router.push("/login?redirectTo=" + encodeURIComponent(window.location.pathname))
      return
    }
    toast({
      title: "Producto guardado",
      description: `${product.name} ha sido agregado a tu lista de deseos`,
      variant: "default",
    })
  }

  // Función para ir a la página de login
  const handleLoginClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    router.push("/login?redirectTo=" + encodeURIComponent(window.location.pathname))
  }

  // Calcular el porcentaje de descuento si hay precio original
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  if (viewMode === "list") {
    // Vista de lista horizontal mejorada según la referencia
    return (
      <Card
        className="overflow-hidden transition-all duration-300 border border-gray-200 bg-white rounded-lg m-0 relative flex flex-col md:flex-row h-auto hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10">
          {discountPercentage > 0 && (
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-md shadow-sm border border-red-400 flex items-center gap-1 transform -rotate-2">
              -{discountPercentage}%
            </Badge>
          )}
          {product.isNew && !discountPercentage && (
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-md shadow-sm border border-blue-400 flex items-center gap-1 transform rotate-2">
              <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-white animate-pulse"></span>
              NUEVO
            </Badge>
          )}
          {product.isSale && !discountPercentage && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-md shadow-sm border border-orange-400 flex items-center gap-1 transform -rotate-2">
              HOT
              <span className="relative flex h-1 w-1 sm:h-1.5 sm:w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1 w-1 sm:h-1.5 sm:w-1.5 bg-white"></span>
              </span>
            </Badge>
          )}
        </div>

        {/* Botón de cantidad en la esquina superior derecha - SIEMPRE VISIBLE si está en el carrito */}
        {isInCart && (
          <div className="absolute top-2 right-2 z-20">
            <div className="flex flex-col items-end">
              <span className="text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full mb-1">
                {cartItem.variant || "Unidad"}
              </span>
              <div className="flex items-center border-2 border-[#004a93] rounded-md bg-white shadow-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-8 sm:w-8 rounded-none hover:bg-gray-100 touch-target"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (cartItem.quantity > 1) {
                      // Disminuir cantidad
                      updateQuantity(cartItem.id, cartItem.quantity - 1)
                    } else {
                      // Eliminar del carrito si llega a 0
                      removeItem(cartItem.id)
                    }
                  }}
                >
                  <Minus className="h-3 w-3 text-[#004a93]" />
                </Button>

                <div className="font-bold text-xs sm:text-sm text-[#004a93] px-1.5 sm:px-2">{cartItem.quantity}</div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-8 sm:w-8 rounded-none hover:bg-gray-100 touch-target"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Aumentar cantidad
                    updateQuantity(cartItem.id, cartItem.quantity + 1)
                  }}
                >
                  <Plus className="h-3 w-3 text-[#004a93]" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Sección de imagen (izquierda) */}
        <div className="relative w-full md:w-[200px] lg:w-[300px] h-[150px] sm:h-[200px] md:h-full flex-shrink-0 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100">
          {/* Imagen del producto */}
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 200px, 300px"
              className="object-contain p-2 transition-transform duration-500"
              style={{ transform: isHovered ? "scale(1.08)" : "scale(1)" }}
              loading="lazy"
            />
          </div>
        </div>

        {/* Sección de información (centro) */}
        <div className="flex-grow p-3 sm:p-4 md:p-6 flex flex-col justify-between">
          {/* Categoría y SKU */}
          <div className="flex flex-wrap items-center text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-2 gap-1 sm:gap-2">
            <span className="bg-gray-100 px-1 py-0.5 rounded">SKU: {product.id.toString().padStart(6, "0")}</span>
            <span className="bg-gray-100 px-1 py-0.5 rounded">Productos Sostenibles</span>
          </div>

          {/* Nombre del producto */}
          <h3
            className="font-bold text-sm sm:text-base md:text-xl mb-1 sm:mb-2 hover:text-[#004a93] cursor-pointer"
            onClick={openDetailsModal}
          >
            {product.name}
          </h3>

          {/* Descripción corta */}
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4 line-clamp-2">
            {product.description ||
              "Producto sostenible y eco-amigable, diseñado para reducir el impacto ambiental mientras ofrece la mejor calidad y durabilidad."}
          </p>

          {/* Características clave - Ocultas en móvil */}
          <ul className="mb-2 sm:mb-3 md:mb-4 space-y-1 hidden sm:block">
            {["Producto eco-amigable", "Material reciclado", "Fabricación sostenible"].map((feature, index) => (
              <li key={index} className="text-xs sm:text-sm text-gray-600 flex items-start">
                <span className="inline-block w-1 h-1 bg-[#004a93] rounded-full mt-1.5 mr-1.5 flex-shrink-0"></span>
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Precio */}
          <div className="flex items-baseline mb-2 sm:mb-3 md:mb-4">
            <div className="text-black font-bold text-base sm:text-lg md:text-2xl">{formatCurrency(product.price)}</div>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-red-500 line-through ml-1 sm:ml-2">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-3">
            {/* Botón de agregar al carrito (solo visible si no está en el carrito) */}
            {!isInCart && (
              <Button
                className="h-8 sm:h-10 md:h-12 px-2 sm:px-4 md:px-6 bg-[#004a93] hover:bg-[#003a73] text-white font-medium text-xs sm:text-sm md:text-base touch-target"
                onClick={handleAddClick}
                disabled={product.stockStatus === "out_of_stock"}
              >
                {product.stockStatus === "out_of_stock" ? (
                  "Agotado"
                ) : (
                  <span className="flex items-center">
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2" />
                    Agregar
                  </span>
                )}
              </Button>
            )}

            {/* Botón de wishlist */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-md border-2 border-gray-300 hover:border-[#004a93] hover:bg-gray-50 touch-target"
              onClick={handleWishlistClick}
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-700" />
            </Button>

            {/* Botón de ver detalles */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-md border-2 border-gray-300 hover:border-[#004a93] hover:bg-gray-50 touch-target"
              onClick={openDetailsModal}
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-700" />
            </Button>

            {/* Botón de ver más */}
            <Link href={`/products/${product.slug}`} className="ml-auto">
              <Button
                variant="ghost"
                className="h-8 sm:h-10 md:h-12 px-2 sm:px-3 md:px-4 text-[#004a93] hover:bg-blue-50 font-medium text-xs sm:text-sm md:text-base"
              >
                Ver más
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Modal de detalles del producto */}
        <ProductDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          product={product}
        />
      </Card>
    )
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 border ${
        isInCart ? "border-green-500 border-2" : "border-gray-300"
      } bg-white rounded-lg m-0 relative h-full`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered
          ? "0 15px 30px -5px rgba(0, 0, 0, 0.15), 0 10px 15px -6px rgba(0, 0, 0, 0.1)"
          : isInCart
            ? "0 0 0 2px rgba(34, 197, 94, 0.3), 0 4px 8px rgba(34, 197, 94, 0.2)"
            : "0 4px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)",
        backgroundColor: isHovered ? "#f8f9fa" : "#ffffff",
      }}
    >
      {/* Indicador de producto en carrito */}
      {isInCart && (
        <div className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10 bg-green-500 text-white rounded-full p-0.5 sm:p-1 shadow-md">
          <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
        </div>
      )}
      {/* Badges de descuento/nuevo/oferta */}
      <div className="absolute top-1 sm:top-2 md:top-3 left-1 sm:left-2 md:left-3 z-10">
        {discountPercentage > 0 && (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-md shadow-md border border-red-400 flex items-center gap-1 transform -rotate-2">
            <span className="font-bold">-{discountPercentage}%</span>
          </Badge>
        )}
        {product.isNew && !discountPercentage && (
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-md shadow-md border border-blue-400 flex items-center gap-1 transform rotate-2">
            <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-white animate-pulse"></span>
            <span className="font-bold">NUEVO</span>
          </Badge>
        )}
        {product.isSale && !discountPercentage && (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-1.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-md shadow-md border border-orange-400 flex items-center gap-1 transform -rotate-2">
            <span className="font-bold">HOT</span>
            <span className="relative flex h-1 w-1 sm:h-1.5 sm:w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1 w-1 sm:h-1.5 sm:w-1.5 bg-white"></span>
            </span>
          </Badge>
        )}
      </div>

      {/* Botones de acción que aparecen al hacer hover o touch en mobile */}
      <AnimatePresence>
        {(isHovered || (typeof window !== "undefined" && window.innerWidth < 768)) && (
          <motion.div
            className="absolute top-1 sm:top-2 md:top-3 right-1 sm:right-2 md:right-3 z-20 flex flex-col gap-1 sm:gap-2 md:gap-3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {!user && (
              <TooltipProvider>
                <Tooltip open={isLoginHovered} delayDuration={700}>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-white shadow-md hover:bg-gray-100"
                      onClick={handleLoginClick}
                      onMouseEnter={() => setIsLoginHovered(true)}
                      onMouseLeave={() => setIsLoginHovered(false)}
                    >
                      <LogIn className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-blue-600 border-blue-600 text-white font-medium">
                    <p>Iniciar sesión</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <TooltipProvider>
              <Tooltip open={isWishlistHovered} delayDuration={700}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-white shadow-md hover:bg-gray-100 touch-target"
                    onClick={handleWishlistClick}
                    onMouseEnter={() => setIsWishlistHovered(true)}
                    onMouseLeave={() => setIsWishlistHovered(false)}
                  >
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-700" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-amber-400 border-amber-400 text-black font-medium">
                  <p>Wishlist</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip open={isDetailsHovered} delayDuration={700}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-white shadow-md hover:bg-gray-100 touch-target"
                    onClick={openDetailsModal}
                    onMouseEnter={() => setIsDetailsHovered(true)}
                    onMouseLeave={() => setIsDetailsHovered(false)}
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-700" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-amber-400 border-amber-400 text-black font-medium">
                  <p>Ver detalles</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Imagen del producto - Optimized */}
      <div className="relative pt-[100%] overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className="object-contain p-2 sm:p-3 md:p-5 transition-transform duration-500"
          style={{ transform: isHovered ? "scale(1.08)" : "scale(1)" }}
          loading="lazy"
        />
      </div>

      {/* Información del producto */}
      <div className="p-2 sm:p-3 md:p-5">
        {/* Nombre del producto */}
        <h3
          className="font-medium text-xs sm:text-sm md:text-base line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3rem] hover:text-[#004a93] cursor-pointer"
          onClick={openDetailsModal}
        >
          {product.name}
        </h3>

        {/* Precio e indicadores de descuento */}
        <div className="flex items-baseline mt-1 sm:mt-2 md:mt-3">
          <div className="text-black font-bold text-sm sm:text-base md:text-xl">{formatCurrency(product.price)}</div>
          {product.originalPrice && (
            <span className="text-[10px] sm:text-xs md:text-sm text-red-500 line-through ml-1 sm:ml-2">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Indicador de carrito temporal */}
        {!user && isHovered && (
          <div className="mt-1 text-[10px] sm:text-xs text-blue-600 flex items-center">
            <LogIn className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
            <span>Se guardará en carrito temporal</span>
          </div>
        )}

        {/* Botón de agregar al carrito (siempre visible en móvil, visible al hover en desktop) */}
        <motion.div className="mt-2 sm:mt-3 md:mt-4" initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
          <Button
            className={`w-full ${
              isInCart ? "bg-green-600 hover:bg-green-700" : "bg-[#004a93] hover:bg-[#003366]"
            } text-white font-medium shadow-md py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base relative overflow-hidden touch-target`}
            onClick={handleAddClick}
            disabled={product.stockStatus === "out_of_stock"}
          >
            {isInCart ? (
              <>
                <Check className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2" />
                <span>EN CARRITO</span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                />
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2" />
                {product.stockStatus === "out_of_stock" ? "Agotado" : "Agregar"}
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Modal de detalles del producto */}
      <ProductDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} product={product} />
    </Card>
  )
}
