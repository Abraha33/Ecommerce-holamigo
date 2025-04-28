"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, CheckCircle2 } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-10">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            {/* Columna izquierda - Login */}
            <div className="p-8 border-r border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Inicia sesión con tu cuenta Holamigo</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Ingresa tu correo</Label>
                  <Input id="email" type="email" placeholder="Ej: nombre@correo.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="************" />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/forgot-password" className="text-sm text-ecoplast-blue hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button className="w-full bg-ecoplast-blue hover:bg-blue-700">Iniciar sesión</Button>
              </div>

              <div className="mt-8">
                <h3 className="font-medium mb-3">Otras opciones</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/orders/tracking" className="text-ecoplast-blue hover:underline">
                      Seguimiento de compras
                    </Link>
                  </li>
                  <li>
                    <Link href="/login/business" className="text-ecoplast-blue hover:underline">
                      Inicio sesión empresa
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Columna derecha - Crear cuenta */}
            <div className="p-8 bg-gray-50">
              <h2 className="text-2xl font-bold mb-6">Crea tu cuenta, si aún no la tienes</h2>
              <p className="mb-4">Vive una experiencia completa de compra:</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Haz seguimiento en línea.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Revisa tus boletas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Guardar tus direcciones de envío.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Gestiona tu post venta.</span>
                </li>
              </ul>

              <div className="space-y-3">
                <Button
                  className="w-full border-2 border-ecoplast-blue text-ecoplast-blue bg-white hover:bg-blue-50"
                  variant="outline"
                  asChild
                >
                  <Link href="/register?type=personal">Crear cuenta persona</Link>
                </Button>

                <Button
                  className="w-full border-2 border-ecoplast-blue text-ecoplast-blue bg-white hover:bg-blue-50"
                  variant="outline"
                  asChild
                >
                  <Link href="/register?type=business">Crear cuenta empresa</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
