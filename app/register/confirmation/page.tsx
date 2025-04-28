"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Star, CreditCard, CheckCircle2 } from "lucide-react"

export default function RegisterConfirmationPage() {
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

            <div className="flex-1 h-1 mx-4 bg-ecoplast-blue"></div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-ecoplast-blue text-white">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
              <span className="text-sm font-medium mt-2 text-ecoplast-blue">Contacto</span>
            </div>

            <div className="flex-1 h-1 mx-4 bg-ecoplast-blue"></div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-ecoplast-blue text-white">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
              <span className="text-sm font-medium mt-2 text-ecoplast-blue">Confirmación</span>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2">
              {/* Columna izquierda - Formulario */}
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-2">Confirma tu registro</h2>
                <p className="text-gray-600 mb-6">Estás a un paso de completar tu registro</p>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-ecoplast-blue mt-0.5" />
                    <div>
                      <h3 className="font-medium text-ecoplast-blue">Revisa tu información</h3>
                      <p className="text-sm text-gray-600">
                        Al hacer clic en "Completar registro", aceptas nuestros{" "}
                        <Link href="/terms" className="text-ecoplast-blue hover:underline">
                          Términos y Condiciones
                        </Link>{" "}
                        y{" "}
                        <Link href="/privacy" className="text-ecoplast-blue hover:underline">
                          Política de Privacidad
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm">
                      Acepto los términos y condiciones y la política de privacidad
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox id="newsletter" defaultChecked />
                    <Label htmlFor="newsletter" className="text-sm">
                      Quiero recibir noticias, ofertas y promociones exclusivas
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox id="dataUse" defaultChecked />
                    <Label htmlFor="dataUse" className="text-sm">
                      Autorizo el uso de mis datos para mejorar mi experiencia de compra
                    </Label>
                  </div>

                  <div className="flex justify-between gap-4 mt-6">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href="/register/contact">Anterior</Link>
                    </Button>

                    <Button className="flex-1 bg-ecoplast-blue hover:bg-blue-700">Completar registro</Button>
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
