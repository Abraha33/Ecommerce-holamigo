import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"
import { WishlistButton } from "@/components/wishlist-button"

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
        <Card
          key={product.id}
          className="overflow-hidden border border-gray-200 hover:border-[#004a93] transition-colors"
        >
          <div className="flex flex-col h-full">
            <div className="relative pt-[80%]">
              <Link href={`/shop/${product.slug}`}>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                />
              </Link>
              {product.isNew && <Badge className="absolute top-2 left-2 bg-[#004a93]">Nuevo</Badge>}
              {product.isSale && <Badge className="absolute top-2 right-2 bg-[#e30613]">Oferta</Badge>}

              {/* Add wishlist button */}
              <div className="absolute top-2 right-2">
                <WishlistButton productId={product.id} productName={product.name} />
              </div>
            </div>

            <CardContent className="p-3 flex-grow">
              <Link href={`/shop/${product.slug}`} className="hover:text-[#004a93]">
                <h3 className="font-medium text-sm">{product.name}</h3>
              </Link>

              <div className="mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#e30613] font-bold">{formatCurrency(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-3 pt-0">
              <div className="w-full space-y-2">
                <div className="flex gap-2 w-full">
                  <select className="flex-1 border rounded px-2 py-1 text-sm bg-white">
                    <option value="unit">Por unidad</option>
                    <option value="pack">Paquete (10)</option>
                    <option value="box">Caja (25)</option>
                  </select>
                  <div className="flex border rounded">
                    <button className="px-2 py-1 border-r text-gray-600 hover:bg-gray-100">-</button>
                    <input type="text" value="1" className="w-10 text-center text-sm" readOnly />
                    <button className="px-2 py-1 border-l text-gray-600 hover:bg-gray-100">+</button>
                  </div>
                </div>

                <div className="text-xs text-[#004a93] bg-blue-50 p-1 rounded text-center">
                  Ahorro: {formatCurrency(product.price * 0.1)} por unidad al comprar en cantidad
                </div>

                <Button className="w-full text-xs py-1 h-8 bg-[#004a93] hover:bg-[#0071bc]" size="sm">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Agregar
                </Button>
              </div>
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  )
}
