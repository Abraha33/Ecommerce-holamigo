import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"
import { products } from "@/lib/products"

interface RelatedProductsProps {
  currentProductId: number
}

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  // Filter out current product and get 3 random products
  const relatedProducts = products
    .filter((product) => product.id !== currentProductId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative pt-[100%]">
              <Link href={`/products/${product.slug}`}>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </Link>
            </div>
            <CardContent className="p-4">
              <Link href={`/products/${product.slug}`} className="hover:underline">
                <h3 className="font-semibold">{product.name}</h3>
              </Link>
              <div className="mt-2 font-medium text-green-600">{formatCurrency(product.price)}</div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
