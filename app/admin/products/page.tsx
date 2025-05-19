"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Save } from "lucide-react"
import Image from "next/image"

interface ProductFormData {
  name: string
  description: string
  price: string
  imageUrl: string
}

export default function AdminProductsPage() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUploaded = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.imageUrl) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Aquí iría la lógica para guardar el producto en tu base de datos
    // Por ahora solo simulamos una respuesta exitosa

    setTimeout(() => {
      toast({
        title: "Producto guardado",
        description: "El producto se ha guardado correctamente",
      })

      // Resetear el formulario
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
      })

      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Administrar Productos</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Añadir Nuevo Producto</CardTitle>
          <CardDescription>Completa el formulario para añadir un nuevo producto a la tienda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del producto *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Botella Ecológica 500ml"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Precio (COP) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Ej: 25000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe el producto..."
                    rows={5}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <ImageUploader onImageUploaded={handleImageUploaded} folder="products" />

                {formData.imageUrl && (
                  <div className="mt-4">
                    <Label>Imagen seleccionada:</Label>
                    <div className="mt-2 border rounded-md overflow-hidden">
                      <div className="aspect-square relative">
                        <Image
                          src={formData.imageUrl || "/placeholder.svg"}
                          alt="Imagen del producto"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Producto
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
