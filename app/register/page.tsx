"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, CreditCard } from "lucide-react"

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const [accountType, setAccountType] = useState("personal")
  const [step, setStep] = useState(1)

  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "business" || type === "personal") {
      setAccountType(type)
    }
  }, [searchParams])

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-ecoplast-blue text-white" : "bg-gray-200 text-gray-500"}`}
              >
                <div className={`w-3 h-3 rounded-full ${step >= 1 ? "bg-white" : "bg-gray-400"}`}></div>
              </div>
              <span className={`text-sm font-medium mt-2 ${step >= 1 ? "text-ecoplast-blue" : "text-gray-500"}`}>
                Identificación
              </span>
            </div>

            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div
                className="h-1 bg-ecoplast-blue transition-all duration-300"
                style={{ width: step >= 2 ? "100%" : "0%" }}
              ></div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-ecoplast-blue text-white" : "bg-gray-200 text-gray-500"}`}
              >
                <div className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-white" : "bg-gray-400"}`}></div>
              </div>
              <span className={`text-sm font-medium mt-2 ${step >= 2 ? "text-ecoplast-blue" : "text-gray-500"}`}>
                Contacto
              </span>
            </div>

            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div
                className="h-1 bg-ecoplast-blue transition-all duration-300"
                style={{ width: step >= 3 ? "100%" : "0%" }}
              ></div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-ecoplast-blue text-white" : "bg-gray-200 text-gray-500"}`}
              >
                <div className={`w-3 h-3 rounded-full ${step >= 3 ? "bg-white" : "bg-gray-400"}`}></div>
              </div>
              <span className={`text-sm font-medium mt-2 ${step >= 3 ? "text-ecoplast-blue" : "text-gray-500"}`}>
                Confirmación
              </span>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2">
              {/* Columna izquierda - Formulario */}
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-2">
                  {accountType === "personal"
                    ? "Ingresa tus datos personales"
                    : "Ingresa los datos para crear tu cuenta"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {accountType === "personal"
                    ? "Completa tu información personal para crear tu cuenta"
                    : "Nos encanta que te quieras unir, pronto accederás a los beneficios."}
                </p>

                {accountType === "personal" ? (
                  // Formulario para personas
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input id="nombre" placeholder="Ej: Juan" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apellidos">Apellidos</Label>
                      <Input id="apellidos" placeholder="Ej: Rodríguez" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipoDocumento">Tipo de documento</Label>
                      <Select defaultValue="cedula">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipo de documento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cedula">Cédula de Ciudadanía</SelectItem>
                          <SelectItem value="extranjeria">Cédula de Extranjería</SelectItem>
                          <SelectItem value="pasaporte">Pasaporte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numeroDocumento">N° Cédula de ciudadanía</Label>
                      <Input id="numeroDocumento" placeholder="Ej: 6789251" />
                    </div>

                    <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 mt-4" onClick={nextStep}>
                      Continuar
                    </Button>
                  </div>
                ) : (
                  // Formulario para empresas
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nitEmpresa">NIT empresa</Label>
                      <Input id="nitEmpresa" placeholder="Ej: 123452124" />
                    </div>

                    <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 mt-4">Validar NIT</Button>
                  </div>
                )}
              </div>

              {/* Columna derecha - Beneficios */}
              <div className="p-8 bg-gray-50">
                <h2 className="text-2xl font-bold mb-6">Beneficios de tener tu cuenta</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-200">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500">
                        <span className="text-xs font-bold text-white">CMR Puntos</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Ser parte de CMR Puntos,</p>
                      <p className="text-gray-600">el mejor programa de beneficios.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-200">
                      <Star className="h-6 w-6 text-ecoplast-blue" />
                    </div>
                    <div>
                      <p className="font-medium">Guardar</p>
                      <p className="text-gray-600">medios de pago y direcciones favoritas.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-200">
                      <CreditCard className="h-6 w-6 text-ecoplast-blue" />
                    </div>
                    <div>
                      <p className="font-medium">Canjear</p>
                      <p className="text-gray-600">productos, experiencias, viajes y Gift Cards.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
