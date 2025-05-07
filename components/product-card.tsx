"use client"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

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
  // Simple add to cart handler
  const handleAddToCart = () => {
    console.log("Adding to cart:", product)
  }

  return (
    <Card
      className={`overflow-hidden border border-gray-200 bg-white rounded-lg ${
        viewMode === "list" ? "flex flex-row" : "flex flex-col"
      }`}
    >
      {/* Image container */}
      <div className={`relative ${viewMode === "list" ? "w-[120px] h-[120px]" : "pt-[100%]"} overflow-hidden`}>
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain p-2" />
      </div>

      {/* Content */}
      <CardContent className="p-4 flex-grow">
        <h3 className="font-medium text-sm mb-2">{product.name}</h3>

        <div className="flex items-baseline mb-3">
          <div className="text-black font-bold text-lg">{formatCurrency(product.price)}</div>
          {product.originalPrice && (
            <span className="text-xs text-gray-500 line-through ml-2">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-1" />
          Agregar al carrito
        </Button>
      </CardContent>
    </Card>
  )
}
