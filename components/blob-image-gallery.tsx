"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { listImages } from "@/lib/blob-service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"

interface BlobImageGalleryProps {
  folder?: string
  title?: string
  onSelectImage?: (url: string) => void
  className?: string
}

export function BlobImageGallery({
  folder = "products",
  title = "Galería de imágenes",
  onSelectImage,
  className = "",
}: BlobImageGalleryProps) {
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const loadImages = async () => {
    setIsLoading(true)
    try {
      const imageUrls = await listImages(`${folder}/`)
      setImages(imageUrls)
    } catch (error) {
      console.error("Error al cargar imágenes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadImages()
  }, [folder])

  const handleImageClick = (url: string) => {
    setSelectedImage(url)
    if (onSelectImage) {
      onSelectImage(url)
    }
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <Button variant="outline" size="sm" onClick={loadImages} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span className="ml-2">Actualizar</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-gray-500">No hay imágenes disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <Card
              key={index}
              className={`overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 ${selectedImage === url ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
              onClick={() => handleImageClick(url)}
            >
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <Image src={url || "/placeholder.svg"} alt={`Imagen ${index + 1}`} fill className="object-cover" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
