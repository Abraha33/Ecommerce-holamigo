"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-provider"
import { formatCurrency } from "@/lib/utils"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"

export function FeaturedProducts({ products = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { addItem } = useCart()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Usar productos proporcionados o datos de ejemplo si no hay productos
  const featuredProducts =
    products.length > 0
      ? products
      : [
          {
            id: 1,
            name: "Eco Storage Container",
            slug: "eco-storage-container",
            price: 24.99,
            image: "/sustainable-kitchen-storage.png",
            isNew: true,
            isSale: false,
          },
          {
            id: 2,
            name: "Biodegradable Plant Pots",
            slug: "biodegradable-plant-pots",
            price: 12.99,
            image: "/seedling-nursery.png",
            isNew: false,
            isSale: true,
            originalPrice: 19.99,
          },
          {
            id: 3,
            name: "Recycled Plastic Chairs",
            slug: "recycled-plastic-chairs",
            price: 49.99,
            image: "/colorful-recycled-chairs.png",
            isNew: false,
            isSale: false,
          },
          {
            id: 4,
            name: "Eco-Friendly Water Bottles",
            slug: "eco-friendly-water-bottles",
            price: 14.99,
            image: "/sustainable-hydration.png",
            isNew: true,
            isSale: false,
          },
          {
            id: 5,
            name: "Compostable Food Containers",
            slug: "compostable-food-containers",
            price: 18.99,
            image: "/eco-friendly-food-display.png",
            isNew: false,
            isSale: true,
            originalPrice: 24.99,
          },
          {
            id: 6,
            name: "Reusable Shopping Bags",
            slug: "reusable-shopping-bags",
            price: 9.99,
            image: "/colorful-market-bags.png",
            isNew: false,
            isSale: false,
          },
        ]

  const itemsPerPage = {
    xs: 1, // Pantallas muy pequeñas (< 400px)
    sm: 2, // Pantallas pequeñas
    md: 3, // Pantallas medianas
    lg: 4, // Pantallas grandes
    xl: 5, // Pantallas extra grandes
  }

  const totalPages = Math.ceil(featuredProducts.length / itemsPerPage.xl)

  const handlePrev = () => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1))
      setIsLoading(false)
    }, 300)
  }

  const handleNext = () => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0))
      setIsLoading(false)
    }, 300)
  }

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0]?.url,
      quantity: 1,
      variant: "Default",
    })

    toast({
      title: "Añadido al carrito",
      description: `${product.name} ha sido añadido a tu carrito.`,
    })
  }

  // Determinar cuántos productos mostrar según el ancho de la pantalla
  const getVisibleProducts = () => {
    // Detectar el ancho de la ventana (solo en el cliente)
    const width = typeof window !== "undefined" ? window.innerWidth : 1200

    let itemsToShow
    if (width < 400) {
      itemsToShow = itemsPerPage.xs
    } else if (width < 640) {
      itemsToShow = itemsPerPage.sm
    } else if (width < 768) {
      itemsToShow = itemsPerPage.md
    } else if (width < 1024) {
      itemsToShow = itemsPerPage.lg
    } else {
      itemsToShow = itemsPerPage.xl
    }

    return featuredProducts.slice(currentIndex * itemsToShow, currentIndex * itemsToShow + itemsToShow)
  }

  return (
    <section className="py-3 sm:py-6">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Productos Destacados</h2>
          <div className="flex gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              aria-label="Productos anteriores"
              className="h-7 w-7 sm:h-8 sm:w-8"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              aria-label="Siguientes productos"
              className="h-7 w-7 sm:h-8 sm:w-8"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-3 sm:border-4 border-[#20509E] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
            {getVisibleProducts().map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative pt-[60%]">
                  <Link href={`/shop/${product.slug}`}>
                    <Image
                      src={product.image || product.images?.[0]?.url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </Link>
                  {product.isNew && <Badge className="absolute top-2 left-2 bg-green-600 text-xs">Nuevo</Badge>}
                  {product.isSale && <Badge className="absolute top-2 right-2 bg-red-600 text-xs">Oferta</Badge>}
                </div>
                <CardContent className="p-2 sm:p-3">
                  <Link href={`/shop/${product.slug}`} className="hover:underline">
                    <h3 className="font-semibold text-xs sm:text-sm line-clamp-2">{product.name}</h3>
                  </Link>
                  <div className="flex items-center mt-1 sm:mt-2">
                    <span className="font-medium text-green-600 text-xs sm:text-sm">
                      {formatCurrency(product.price)}
                    </span>
                    {product.isSale && (
                      <span className="ml-1 sm:ml-2 text-xs text-gray-500 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-2 sm:p-3 pt-0">
                  <Button size="sm" className="w-full text-xs h-7 sm:h-8" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Añadir
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-3 sm:mt-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 mx-1 rounded-full ${currentIndex === index ? "bg-[#20509E]" : "bg-gray-300"}`}
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => {
                  setCurrentIndex(index)
                  setIsLoading(false)
                }, 300)
              }}
              aria-label={`Ir a la página ${index + 1}`}
            />
          ))}
        </div>
        <Button variant="outline" className="w-full mt-3 sm:mt-4 text-xs sm:text-sm h-8 sm:h-10" asChild>
          <Link href="/shop">Continuar Comprando</Link>
        </Button>
      </div>
    </section>
  )
}
