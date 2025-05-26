"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import AccountSidebar from "@/components/account-sidebar"
import { Upload, FileText, CheckCircle, Phone, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export default function ElectronicInvoicingPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    nit: "",
    address: "",
    phone: "",
    email: "",
    economicActivity: "",
    observations: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = "La razón social es requerida"
    }
    if (!formData.nit.trim()) {
      newErrors.nit = "El NIT es requerido"
    }
    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido"
    }
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido"
    }
    if (!formData.economicActivity.trim()) {
      newErrors.economicActivity = "La actividad económica es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, corrige los errores antes de continuar",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitted(true)
    setIsLoading(false)

    toast({
      title: "Solicitud enviada exitosamente",
      description: "Tu solicitud de facturación electrónica ha sido enviada para revisión",
      variant: "default",
    })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <AccountSidebar />

            <div className="flex-1">
              <div className="max-w-2xl mx-auto">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-800 mb-4">¡Solicitud Enviada Exitosamente!</h2>
                    <p className="text-green-700 mb-6">
                      Tu solicitud de habilitación para facturación electrónica ha sido enviada para revisión. Nuestro
                      equipo la procesará en un plazo de 3 a 5 días hábiles.
                    </p>

                    <Alert className="border-blue-200 bg-blue-50 mb-6">
                      <AlertDescription className="text-blue-800">
                        <strong>¿Tienes alguna duda?</strong>
                        <br />
                        Comunícate con nosotros al <strong>319 210 2438</strong> para cualquier consulta sobre tu
                        solicitud.
                      </AlertDescription>
                    </Alert>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href="https://wa.me/573192102438?text=Hola,%20tengo%20una%20consulta%20sobre%20mi%20solicitud%20de%20facturación%20electrónica"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp
                      </a>
                      <a
                        href="tel:+573192102438"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Llamar
                      </a>
                      <Link href="/account">
                        <Button variant="outline">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Volver a mi cuenta
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          <div className="lg:w-64 lg:flex-shrink-0">
            <AccountSidebar />
          </div>

          <div className="flex-1 min-w-0">
            <div className="max-w-4xl mx-auto w-full">
              <div className="mb-6">
                <Link href="/account" className="text-blue-600 hover:text-blue-800 flex items-center mb-4">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Volver a mi cuenta
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Facturación Electrónica</h1>
                <p className="text-gray-600 mt-2">
                  Completa la información requerida para habilitar la facturación electrónica en tu cuenta
                </p>
              </div>

              <Alert className="mb-6 border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800">
                  <strong>Información importante:</strong> La habilitación de facturación electrónica es requerida para
                  empresas. Una vez enviada tu solicitud, será revisada en un plazo de 3 a 5 días hábiles.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Información de la Empresa</CardTitle>
                    <CardDescription>
                      Proporciona los datos básicos de tu empresa para la facturación electrónica
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessName">Razón Social *</Label>
                        <Input
                          id="businessName"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          placeholder="Nombre completo de la empresa"
                          required
                          className={errors.businessName ? "border-red-500 focus:border-red-500" : ""}
                        />
                        {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="nit">NIT *</Label>
                        <Input
                          id="nit"
                          name="nit"
                          value={formData.nit}
                          onChange={handleInputChange}
                          placeholder="123456789-0"
                          required
                          className={errors.nit ? "border-red-500 focus:border-red-500" : ""}
                        />
                        {errors.nit && <p className="text-red-500 text-sm mt-1">{errors.nit}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Dirección *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Dirección completa de la empresa"
                        required
                        className={errors.address ? "border-red-500 focus:border-red-500" : ""}
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Teléfono *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="300 123 4567"
                          required
                          className={errors.phone ? "border-red-500 focus:border-red-500" : ""}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                      <div>
                        <Label htmlFor="email">Correo Electrónico *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="empresa@ejemplo.com"
                          required
                          className={errors.email ? "border-red-500 focus:border-red-500" : ""}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="economicActivity">Actividad Económica *</Label>
                      <Input
                        id="economicActivity"
                        name="economicActivity"
                        value={formData.economicActivity}
                        onChange={handleInputChange}
                        placeholder="Descripción de la actividad económica principal"
                        required
                        className={errors.economicActivity ? "border-red-500 focus:border-red-500" : ""}
                      />
                      {errors.economicActivity && (
                        <p className="text-red-500 text-sm mt-1">{errors.economicActivity}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="observations">Observaciones</Label>
                      <Textarea
                        id="observations"
                        name="observations"
                        value={formData.observations}
                        onChange={handleInputChange}
                        placeholder="Información adicional que consideres relevante"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Documentos Requeridos</CardTitle>
                    <CardDescription>Adjunta los documentos necesarios para la habilitación</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Arrastra y suelta tus archivos aquí o</p>
                          <Label htmlFor="file-upload" className="cursor-pointer">
                            <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                              Seleccionar archivos
                            </span>
                            <Input
                              id="file-upload"
                              type="file"
                              multiple
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </Label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Formatos aceptados: PDF, JPG, PNG (máx. 10MB por archivo)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Documentos requeridos:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Cámara de Comercio (vigente)</li>
                          <li>• RUT actualizado</li>
                          <li>• Cédula del representante legal</li>
                          <li>• Certificación bancaria</li>
                        </ul>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Archivos adjuntos:</h4>
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-blue-600 mr-2" />
                                <span className="text-sm">{file.name}</span>
                                <Badge variant="secondary" className="ml-2">
                                  {(file.size / 1024 / 1024).toFixed(1)} MB
                                </Badge>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Eliminar
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-4">
                  <Link href="/account">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.businessName || !formData.nit || !formData.address}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      "Enviar Solicitud"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
