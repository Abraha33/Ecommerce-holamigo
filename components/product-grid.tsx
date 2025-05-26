import { ProductCard } from "@/components/product-card"

interface Product {
  id: number
  name: string
  slug: string
  price: number
  image: string
  isNew?: boolean
  isSale?: boolean
  originalPrice?: number
}

interface ProductGridProps {
  products: Product[]
  viewMode?: "grid" | "list"
  className?: string
}

export function ProductGrid({ products, viewMode = "grid", className }: ProductGridProps) {
  // Calculate savings percentage
  const calculateSavings = (originalPrice: number, discountedPrice: number) => {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 ${
        className || ""
      }`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  )
}
