"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadCloud, X, ImageIcon, ImagePlus } from "lucide-react"
import Image from "next/image"
import { uploadProductImage, type ImageType, type ProductImageUploadResult } from "@/lib/product-image-service"
import { useToast } from "@/hooks/use-toast"

interface ProductImageUploaderProps {
  productId: string | number
  onImageUploaded?: (result: ProductImageUploadResult) => void
  existingImages?: {
    main?: string
    thumbnail?: string
    gallery: string[]
  }
  className?: string
}

export function ProductImageUploader({
  productId,
  onImageUploaded,
  existingImages = { gallery: [] },
  className = "",
}: ProductImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<ImageType>("main")
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Archivo demasiado grande",
        description: "El tamaño máximo permitido es 5MB",
        variant: "destructive",
      })
      return
    }

    // Crear preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Simular progreso de carga
    simulateProgress()
  }

  const simulateProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + 10
      })
    }, 200)
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      toast({
        title: "No hay archivo seleccionado",
        description: "Por favor selecciona una imagen para subir",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      // Para imágenes de galería, usar el siguiente índice disponible
      const galleryIndex = activeTab === "gallery" ? existingImages.gallery.length + 1 : undefined

      const result = await uploadProductImage(file, productId, activeTab, galleryIndex)
      setUploadProgress(100)

      if (result.success) {
        toast({
          title: "Imagen subida correctamente",
          description: `La imagen ${getImageTypeLabel(activeTab)} se ha subido con éxito`,
          variant: "default",
        })

        if (onImageUploaded) {
          onImageUploaded(result)
        }

        // Limpiar después de subir
        resetUploader()
      } else {
        toast({
          title: "Error al subir la imagen",
          description: result.error || "Ha ocurrido un error al subir la imagen",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error al subir la imagen",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const resetUploader = () => {
    setPreview(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getImageTypeLabel = (type: ImageType): string => {
    switch (type) {
      case "main":
        return "principal"
      case "thumbnail":
        return "miniatura"
      case "gallery":
        return "de galería"
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ImageType)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="main" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Principal</span>
          </TabsTrigger>
          <TabsTrigger value="thumbnail" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Miniatura</span>
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <ImagePlus className="h-4 w-4" />
            <span>Galería</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="main-image-upload">Imagen Principal (Portada)</Label>
            {existingImages.main && (
              <div className="mb-4 border rounded-lg overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={existingImages.main || "/placeholder.svg"}
                    alt="Imagen principal actual"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="bg-gray-100 p-2 text-xs text-gray-500">Imagen principal actual</div>
              </div>
            )}
            {renderUploader("main-image-upload")}
          </div>
        </TabsContent>

        <TabsContent value="thumbnail" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="thumbnail-image-upload">Imagen Miniatura (Listados)</Label>
            {existingImages.thumbnail && (
              <div className="mb-4 border rounded-lg overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={existingImages.thumbnail || "/placeholder.svg"}
                    alt="Miniatura actual"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="bg-gray-100 p-2 text-xs text-gray-500">Miniatura actual</div>
              </div>
            )}
            {renderUploader("thumbnail-image-upload")}
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gallery-image-upload">Imágenes de Galería</Label>

            {existingImages.gallery.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-3 gap-2">
                  {existingImages.gallery.map((url, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="aspect-square relative">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Galería ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="bg-gray-100 p-1 text-xs text-gray-500 text-center">Imagen {index + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {renderUploader("gallery-image-upload")}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  function renderUploader(inputId: string) {
    return (
      <>
        {!preview ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Haz clic para seleccionar o arrastra una imagen aquí</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG o WEBP (máx. 5MB)</p>
          </div>
        ) : (
          <div className="relative border rounded-lg overflow-hidden">
            <div className="aspect-video relative">
              <Image src={preview || "/placeholder.svg"} alt="Vista previa" fill className="object-contain" />
            </div>
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              onClick={resetUploader}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <Input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {preview && (
          <>
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-blue-500" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}

            <Button onClick={handleUpload} disabled={isUploading} className="w-full">
              {isUploading ? "Subiendo..." : `Subir imagen ${getImageTypeLabel(activeTab)}`}
            </Button>
          </>
        )}
      </>
    )
  }
}
