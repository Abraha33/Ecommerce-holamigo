"use client"

import { memo, useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

interface Product {
  id: number | string
  name: string
  slug: string
  price: number
  image: string
  isNew?: boolean
  isSale?: boolean
  originalPrice?: number
  salePrice?: number | null
  stockStatus?: string
  description?: string
  images?: any[]
}

interface OptimizedFeaturedProductsProps {
  products: Product[]
  title?: string
  viewAll?: boolean
  viewAllLink?: string
  viewAllText?: string
}

function OptimizedFeaturedProductsComponent({
  products,
  title = "Productos Destacados",
  viewAll = true,
  viewAllLink = "/shop",
  viewAllText = "Ver todos",
}: OptimizedFeaturedProductsProps) {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])
  const [isVisible, ref] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "200px",
    freezeOnceVisible: true,
  })

  // Cargar productos gradualmente para mejorar el rendimiento
  useEffect(() => {
    if (!isVisible) return

    // Mostrar los primeros 4 productos inmediatamente
    setVisibleProducts(products.slice(0, 4))

    // Cargar el resto de productos después de un breve retraso
    const timer = setTimeout(() => {
      setVisibleProducts(products)
    }, 300)

    return () => clearTimeout(timer)
  }, [isVisible, products])

  // Placeholder para productos
  const productPlaceholders = Array(4)
    .fill(0)
    .map((_, i) => (
      <div key={`placeholder-${i}`} className="animate-pulse">
        <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
        <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
        <div className="bg-gray-200 h-4 rounded w-1/2"></div>
      </div>
    ))

  return (
    <div ref={ref} className="w-full">
      {isVisible ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {productPlaceholders}
        </div>
      )}
    </div>
  )
}

// Memoizar el componente para evitar re-renders innecesarios
export const OptimizedFeaturedProducts = memo(OptimizedFeaturedProductsComponent)
