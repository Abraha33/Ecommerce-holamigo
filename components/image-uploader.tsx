"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud, X, Check } from "lucide-react"
import Image from "next/image"
import { uploadImage, type UploadResult } from "@/lib/blob-service"
import { useToast } from "@/hooks/use-toast"

interface ImageUploaderProps {
  onImageUploaded?: (url: string) => void
  folder?: string
  maxSizeMB?: number
  acceptedTypes?: string
  className?: string
}

export function ImageUploader({
  onImageUploaded,
  folder = "products",
  maxSizeMB = 5,
  acceptedTypes = "image/jpeg, image/png, image/webp",
  className = "",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamaño
    if (file.size > maxSizeBytes) {
      toast({
        title: "Archivo demasiado grande",
        description: `El tamaño máximo permitido es ${maxSizeMB}MB`,
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
      const result = await uploadImage(file, folder)
      setUploadResult(result)
      setUploadProgress(100)

      if (result.success) {
        toast({
          title: "Imagen subida correctamente",
          description: "La imagen se ha subido con éxito",
          variant: "default",
        })
        if (onImageUploaded) {
          onImageUploaded(result.url)
        }
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
    setUploadResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="image-upload">Subir imagen</Label>

        {!preview ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Haz clic para seleccionar o arrastra una imagen aquí</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG o WEBP (máx. {maxSizeMB}MB)</p>
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
          id="image-upload"
          type="file"
          accept={acceptedTypes}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {preview && (
        <>
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${uploadResult?.success ? "bg-green-500" : uploadResult ? "bg-red-500" : "bg-blue-500"}`}
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {!uploadResult && (
            <Button onClick={handleUpload} disabled={isUploading} className="w-full">
              {isUploading ? "Subiendo..." : "Subir imagen"}
            </Button>
          )}

          {uploadResult && (
            <div
              className={`flex items-center gap-2 p-2 rounded ${uploadResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              {uploadResult.success ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>Imagen subida correctamente</span>
                </>
              ) : (
                <>
                  <X className="h-5 w-5" />
                  <span>{uploadResult.error || "Error al subir la imagen"}</span>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
