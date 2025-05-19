"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductImageUploader } from "@/components/product-image-uploader"
import { getProductImages, type ProductImageUploadResult } from "@/lib/product-image-service"
import { ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProductImagesPage() {
  const params = useParams()
  const productId = params.id as string

  const [images, setImages] = useState<{
    main?: string
    thumbnail?: string
    gallery: string[]
  }>({
    gallery: [],
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProductImages()
  }, [productId])

  const loadProductImages = async () => {
    setIsLoading(true)
    try {
      const productImages = await getProductImages(productId)
      setImages(productImages)
    } catch (error) {
      console.error("Error al cargar imágenes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUploaded = (result: ProductImageUploadResult) => {
    if (result.success) {
      // Actualizar el estado local con la nueva imagen
      if (result.type === "main") {
        setImages((prev) => ({ ...prev, main: result.url }))
      } else if (result.type === "thumbnail") {
        setImages((prev) => ({ ...prev, thumbnail: result.url }))
      } else if (result.type === "gallery") {
        setImages((prev) => ({
          ...prev,
          gallery: [...prev.gallery, result.url],
        }))
      }
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/admin/products/${productId}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Imágenes del Producto</h1>
        <Button variant="outline" size="sm" onClick={loadProductImages} className="ml-auto">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subir Imágenes</CardTitle>
            <CardDescription>Sube imágenes para la portada, miniatura y galería del producto</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductImageUploader productId={productId} existingImages={images} onImageUploaded={handleImageUploaded} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen de Imágenes</CardTitle>
            <CardDescription>Vista previa de todas las imágenes del producto</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Imagen Principal</h3>
                  {images.main ? (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video relative">
                        <Image
                          src={images.main || "/placeholder.svg"}
                          alt="Imagen principal"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-lg p-4 text-center text-gray-500">
                      No hay imagen principal
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Miniatura</h3>
                  {images.thumbnail ? (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-square relative w-32">
                        <Image
                          src={images.thumbnail || "/placeholder.svg"}
                          alt="Miniatura"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-lg p-4 text-center text-gray-500">
                      No hay miniatura
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Galería ({images.gallery.length})</h3>
                  {images.gallery.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {images.gallery.map((url, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div className="aspect-square relative">
                            <Image
                              src={url || "/placeholder.svg"}
                              alt={`Galería ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-lg p-4 text-center text-gray-500">
                      No hay imágenes en la galería
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
