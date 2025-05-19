"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ProfileService } from "@/lib/profile-service"
import { useToast } from "@/hooks/use-toast"
import { Camera, Loader2, Upload, X } from "lucide-react"

type ProfilePictureUploaderProps = {
  currentUrl: string
  onUploadComplete: (url: string | null) => void
}

export default function ProfilePictureUploader({ currentUrl, onUploadComplete }: ProfilePictureUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Tipo de archivo no válido",
        description: "Por favor, selecciona una imagen (JPG, PNG, GIF).",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Archivo demasiado grande",
        description: "La imagen no debe superar los 5MB.",
        variant: "destructive",
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setIsUploading(true)
    try {
      const { url, error } = await ProfileService.uploadAvatar(file)

      if (error || !url) {
        toast({
          title: "Error al subir imagen",
          description: error || "No se pudo subir la imagen de perfil",
          variant: "destructive",
        })
        setPreviewUrl(null)
      } else {
        toast({
          title: "Imagen subida",
          description: "Tu imagen de perfil ha sido actualizada.",
        })
        onUploadComplete(url)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al subir la imagen",
        variant: "destructive",
      })
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const cancelPreview = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : previewUrl ? (
          <>
            <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
            <button
              onClick={cancelPreview}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              aria-label="Cancel preview"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : currentUrl ? (
          <Image src={currentUrl || "/placeholder.svg"} alt="Profile picture" fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={triggerFileInput}
        disabled={isUploading}
        className="flex items-center"
      >
        <Upload className="h-4 w-4 mr-2" />
        Cambiar foto
      </Button>
    </div>
  )
}
