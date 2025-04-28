"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TruckIcon, TagIcon, PercentIcon, ShieldCheck, Clock, Gift } from "lucide-react"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState("personal")

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="container py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ecoplast-blue">Únete a Holamigo</h1>
          <p className="text-gray-600 mt-2">Completa tu registro para acceder a beneficios exclusivos</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className={`text-sm font-medium ${step >= 1 ? "text-ecoplast-blue" : "text-gray-400"}`}>
              Información personal
            </span>
            <span className={`text-sm font-medium ${step >= 2 ? "text-ecoplast-blue" : "text-gray-400"}`}>
              Detalles de cuenta
            </span>
            <span className={`text-sm font-medium ${step >= 3 ? "text-ecoplast-blue" : "text-gray-400"}`}>
              Preferencias
            </span>
            <span className={`text-sm font-medium ${step >= 4 ? "text-ecoplast-blue" : "text-gray-400"}`}>
              Confirmación
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-ecoplast-blue h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Formulario de registro */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>
                {step === 1 && "Información personal"}
                {step === 2 && "Detalles de cuenta"}
                {step === 3 && "Preferencias"}
                {step === 4 && "Confirmación"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Cuéntanos un poco sobre ti"}
                {step === 2 && "Configura tu cuenta"}
                {step === 3 && "Personaliza tu experiencia"}
                {step === 4 && "Revisa tu información y completa el registro"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label>Tipo de cuenta</Label>
                      <RadioGroup
                        defaultValue="personal"
                        className="grid grid-cols-2 gap-4 pt-2"
                        onValueChange={setAccountType}
                      >
                        <div>
                          <RadioGroupItem
                            value="personal"
                            id="personal"
                            className="peer sr-only"
                            aria-label="Personal"
                          />
                          <Label
                            htmlFor="personal"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-ecoplast-blue [&:has([data-state=checked])]:border-ecoplast-blue"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mb-3 h-6 w-6"
                            >
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            <div className="text-center">
                              <p className="font-medium">Personal</p>
                              <p className="text-xs text-gray-500">Para uso individual</p>
                            </div>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem
                            value="business"
                            id="business"
                            className="peer sr-only"
                            aria-label="Negocio"
                          />
                          <Label
                            htmlFor="business"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-ecoplast-blue [&:has([data-state=checked])]:border-ecoplast-blue"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mb-3 h-6 w-6"
                            >
                              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                              <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                              <path d="M13 13h4" />
                              <path d="M13 17h4" />
                              <path d="M8 13h.01" />
                              <path d="M8 17h.01" />
                            </svg>
                            <div className="text-center">
                              <p className="font-medium">Negocio</p>
                              <p className="text-xs text-gray-500">Para empresas</p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input id="firstName" placeholder="Tu nombre" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input id="lastName" placeholder="Tu apellido" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input id="email" type="email" placeholder="correo@ejemplo.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" type="tel" placeholder="300 123 4567" />
                    </div>

                    {accountType === "business" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Nombre de la empresa</Label>
                          <Input id="businessName" placeholder="Nombre de tu empresa" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nit">NIT</Label>
                          <Input id="nit" placeholder="NIT de la empresa" />
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input id="password" type="password" />
                      <p className="text-xs text-gray-500">Mínimo 8 caracteres con letras y números</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input id="address" placeholder="Tu dirección completa" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ciudad</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu ciudad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bogota">Bogotá</SelectItem>
                            <SelectItem value="medellin">Medellín</SelectItem>
                            <SelectItem value="cali">Cali</SelectItem>
                            <SelectItem value="barranquilla">Barranquilla</SelectItem>
                            <SelectItem value="cartagena">Cartagena</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Código postal</Label>
                        <Input id="zipCode" placeholder="Código postal" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base">Preferencias de comunicación</Label>
                      <div className="mt-3 space-y-3">
                        <div className="flex items-start space-x-3">
                          <Checkbox id="emailNotifications" defaultChecked />
                          <div>
                            <Label htmlFor="emailNotifications" className="font-medium">
                              Notificaciones por correo
                            </Label>
                            <p className="text-sm text-gray-500">
                              Recibe actualizaciones sobre promociones y nuevos productos
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Checkbox id="smsNotifications" />
                          <div>
                            <Label htmlFor="smsNotifications" className="font-medium">
                              Notificaciones por SMS
                            </Label>
                            <p className="text-sm text-gray-500">Recibe alertas sobre tus pedidos y entregas</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Checkbox id="whatsappNotifications" defaultChecked />
                          <div>
                            <Label htmlFor="whatsappNotifications" className="font-medium">
                              Notificaciones por WhatsApp
                            </Label>
                            <p className="text-sm text-gray-500">Recibe mensajes sobre el estado de tus pedidos</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base">Categorías de interés</Label>
                      <p className="text-sm text-gray-500 mb-3">
                        Selecciona las categorías que más te interesan para recibir ofertas personalizadas
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="cat1" />
                          <Label htmlFor="cat1">Lácteos</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="cat2" />
                          <Label htmlFor="cat2">Aseo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="cat3" />
                          <Label htmlFor="cat3">Licores</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="cat4" />
                          <Label htmlFor="cat4">Cosméticos</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="cat5" />
                          <Label htmlFor="cat5">Bebidas</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="cat6" />
                          <Label htmlFor="cat6">Frutas y Verduras</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-3 mb-3">
                        <ShieldCheck className="h-6 w-6 text-ecoplast-blue" />
                        <h3 className="font-medium text-ecoplast-blue">Estás a un paso de completar tu registro</h3>
                      </div>
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

                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <Checkbox id="terms" required />
                        <Label htmlFor="terms" className="text-sm">
                          Acepto los términos y condiciones y la política de privacidad
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <Checkbox id="newsletter" defaultChecked />
                        <Label htmlFor="newsletter" className="text-sm">
                          Quiero recibir noticias, ofertas y promociones exclusivas
                        </Label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Anterior
                </Button>
              )}
              {step < 4 ? (
                <Button
                  className={`${step > 1 ? "ml-auto" : ""} bg-ecoplast-blue hover:bg-blue-700`}
                  onClick={nextStep}
                >
                  Siguiente
                </Button>
              ) : (
                <Button className="ml-auto bg-ecoplast-blue hover:bg-blue-700">Completar registro</Button>
              )}
            </CardFooter>
          </Card>

          {/* Beneficios */}
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-ecoplast-blue">Beneficios exclusivos</CardTitle>
                <CardDescription>Al registrarte obtienes acceso a:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <TruckIcon className="h-5 w-5 text-ecoplast-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium">Envío gratuito por ruta</h3>
                    <p className="text-sm text-gray-600">Sin costos adicionales en tu ruta de distribución</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <TagIcon className="h-5 w-5 text-ecoplast-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium">Actualización de promociones</h3>
                    <p className="text-sm text-gray-600">Sé el primero en conocer nuestras ofertas</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <PercentIcon className="h-5 w-5 text-ecoplast-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium">Descuentos y outlets</h3>
                    <p className="text-sm text-gray-600">Acceso a productos con precios especiales</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-ecoplast-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium">Historial de pedidos</h3>
                    <p className="text-sm text-gray-600">Accede a tu historial completo de compras</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Gift className="h-5 w-5 text-ecoplast-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium">Programa de fidelidad</h3>
                    <p className="text-sm text-gray-600">Acumula puntos y canjéalos por productos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>¿Ya tienes una cuenta?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Si ya tienes una cuenta con nosotros, puedes iniciar sesión para acceder a todos tus beneficios.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
