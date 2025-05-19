"use client"

import { useState } from "react"
import Image from "next/image"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, Heart, Share2, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import type { Product, ProductImage } from "@/lib/product-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(
    product.images.find((img) => img.is_primary) || product.images[0] || null,
  )
  const [quantity, setQuantity] = useState(1)
  const { toast } = useToast()
  const { addItem, items } = useCart()
  const { user } = useAuth()

  // Check if product is already in cart
  const isInCart = items.some((item) => item.product_id === product.id.toString())

  // Calculate discount percentage if there's a sale price
  const discountPercentage =
    product.sale_price && product.price ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      await addItem({
        product_id: product.id.toString(),
        name: product.name,
        price: product.sale_price || product.price,
        image: selectedImage?.url || product.images[0]?.url || "",
        quantity,
        variant: "Unidad",
      })

      toast({
        title: "Producto agregado",
        description: `${product.name} ha sido agregado al carrito`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error al agregar al carrito:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito",
        variant: "destructive",
      })
    }
  }

  // Handle wishlist
  const handleAddToWishlist = () => {
    if (!user) {
      toast({
        title: "Inicia sesión para continuar",
        description: "Necesitas iniciar sesión para agregar productos a tu lista de deseos",
        variant: "default",
      })
      return
    }

    toast({
      title: "Producto guardado",
      description: `${product.name} ha sido agregado a tu lista de deseos`,
      variant: "default",
    })
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Tienda", href: "/shop" },
          { label: product.name, href: `/products/${product.slug}`, active: true },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden border bg-white">
            {selectedImage && (
              <Image
                src={selectedImage.url || "/placeholder.svg"}
                alt={selectedImage.alt_text || product.name}
                fill
                className="object-contain p-4"
              />
            )}

            {/* Sale Badge */}
            {product.is_sale && discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                -{discountPercentage}%
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                    selectedImage?.id === image.id ? "border-blue-500" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt_text || ""}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatCurrency(product.sale_price || product.price)}</span>

            {product.sale_price && (
              <span className="text-lg text-gray-500 line-through">{formatCurrency(product.price)}</span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-gray-600">{product.description}</p>

          {/* SKU */}
          {product.sku && <p className="text-sm text-gray-500">SKU: {product.sku}</p>}

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-sm font-medium">{product.stock > 0 ? "En stock" : "Agotado"}</span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="font-medium">Cantidad:</span>
            <div className="flex border rounded-md">
              <button
                className="px-3 py-1 border-r"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                className="px-3 py-1 border-l"
                onClick={() => setQuantity((prev) => prev + 1)}
                disabled={product.stock !== null && quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="flex gap-4">
            <Button
              className={`flex-1 py-6 ${
                isInCart ? "bg-green-600 hover:bg-green-700" : "bg-[#004a93] hover:bg-[#003366]"
              }`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {isInCart ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  EN CARRITO
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  AGREGAR AL CARRITO
                </>
              )}
            </Button>

            <Button variant="outline" className="p-3" onClick={handleAddToWishlist}>
              <Heart className="h-5 w-5" />
            </Button>

            <Button variant="outline" className="p-3">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full border-b justify-start">
            <TabsTrigger value="description" className="text-lg py-3">
              Descripción
            </TabsTrigger>
            <TabsTrigger value="specifications" className="text-lg py-3">
              Especificaciones
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-lg py-3">
              Reseñas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="py-6">
            <div className="prose max-w-none">
              <p>{product.description || "No hay descripción disponible para este producto."}</p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="py-6">
            <div className="prose max-w-none">
              <p>Especificaciones del producto no disponibles.</p>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="py-6">
            <div className="prose max-w-none">
              <p>No hay reseñas disponibles para este producto.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
