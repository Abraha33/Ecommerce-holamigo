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

export function FeaturedProducts() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { addItem } = useCart()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const itemsPerPage = {
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
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
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePrev} aria-label="Previous products">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext} aria-label="Next products">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#20509E] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {featuredProducts
              .slice(currentIndex * itemsPerPage.xl, currentIndex * itemsPerPage.xl + itemsPerPage.xl)
              .map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative pt-[60%]">
                    <Link href={`/shop/${product.slug}`}>
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
                  <CardContent className="p-3">
                    <Link href={`/shop/${product.slug}`} className="hover:underline">
                      <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
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
                  <CardFooter className="p-3 pt-0">
                    <Button size="sm" className="w-full text-xs" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 mx-1 rounded-full ${currentIndex === index ? "bg-[#20509E]" : "bg-gray-300"}`}
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => {
                  setCurrentIndex(index)
                  setIsLoading(false)
                }, 300)
              }}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </section>
  )
}
