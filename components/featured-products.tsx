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

const featuredProducts = [
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
    image: "/placeholder.svg?height=300&width=300&query=eco+friendly+water+bottles",
    isNew: true,
    isSale: false,
  },
  {
    id: 5,
    name: "Compostable Food Containers",
    slug: "compostable-food-containers",
    price: 18.99,
    image: "/placeholder.svg?height=300&width=300&query=compostable+food+containers",
    isNew: false,
    isSale: true,
    originalPrice: 24.99,
  },
  {
    id: 6,
    name: "Reusable Shopping Bags",
    slug: "reusable-shopping-bags",
    price: 9.99,
    image: "/placeholder.svg?height=300&width=300&query=reusable+shopping+bags",
    isNew: false,
    isSale: false,
  },
]

export function FeaturedProducts() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { addItem } = useCart()
  const { toast } = useToast()

  const itemsPerPage = {
    sm: 1,
    md: 2,
    lg: 3,
  }

  const totalPages = Math.ceil(featuredProducts.length / itemsPerPage.lg)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0))
  }

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      variant: "Default",
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePrev} aria-label="Previous products">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext} aria-label="Next products">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts
            .slice(currentIndex * itemsPerPage.lg, currentIndex * itemsPerPage.lg + itemsPerPage.lg)
            .map((product) => (
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
                  {product.isNew && <Badge className="absolute top-2 left-2 bg-green-600">New</Badge>}
                  {product.isSale && <Badge className="absolute top-2 right-2 bg-red-600">Sale</Badge>}
                </div>
                <CardContent className="p-4">
                  <Link href={`/products/${product.slug}`} className="hover:underline">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                  </Link>
                  <div className="flex items-center mt-2">
                    <span className="font-medium text-green-600">{formatCurrency(product.price)}</span>
                    {product.isSale && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </section>
  )
}
