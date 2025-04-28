"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Star, CreditCard } from "lucide-react"

export default function RegisterContactPage() {
  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-ecoplast-blue text-white">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
              <span className="text-sm font-medium mt-2 text-ecoplast-blue">Identificación</span>
            </div>

            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className="h-1 bg-ecoplast-blue w-full"></div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-ecoplast-blue text-white">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
              <span className="text-sm font-medium mt-2 text-ecoplast-blue">Contacto</span>
            </div>

            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className="h-1 bg-gray-200"></div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-500">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              </div>
              <span className="text-sm font-medium mt-2 text-gray-500">Confirmación</span>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2">
              {/* Columna izquierda - Formulario */}
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-2">Información de contacto</h2>
                <p className="text-gray-600 mb-6">Ingresa tus datos de contacto para continuar</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" placeholder="correo@ejemplo.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmEmail">Confirmar correo electrónico</Label>
                    <Input id="confirmEmail" type="email" placeholder="correo@ejemplo.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono celular</Label>
                    <Input id="phone" placeholder="300 123 4567" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" type="password" />
                    <p className="text-xs text-gray-500">Mínimo 8 caracteres con letras y números</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>

                  <div className="flex justify-between gap-4 mt-6">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href="/register">Anterior</Link>
                    </Button>

                    <Button className="flex-1 bg-ecoplast-blue hover:bg-blue-700" asChild>
                      <Link href="/register/confirmation">Continuar</Link>
                    </Button>
                  </div>
                </div>
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
