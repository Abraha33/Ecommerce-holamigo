"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Building2 } from "lucide-react"

export default function BusinessLoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-10">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-ecoplast-blue" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">Inicio sesión empresas</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessId">NIT de la empresa</Label>
              <Input id="businessId" placeholder="Ingresa el NIT" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="correo@empresa.com" />
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

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta de empresa?{" "}
                <Link href="/register?type=business" className="text-ecoplast-blue hover:underline font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
