"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCircle, Building2, Globe, Star, UserPlus } from "lucide-react"
import type { UserProfile } from "@/lib/create-test-user"

export function TestUserCreator() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [selectedProfile, setSelectedProfile] = useState<UserProfile>("regular")

  const profileInfo = {
    regular: {
      title: "Cliente Regular",
      description: "Usuario estándar con dirección guardada y algunos pedidos previos",
      icon: <UserCircle className="h-8 w-8 text-blue-500" />,
      color: "bg-blue-50 border-blue-200",
    },
    vip: {
      title: "Cliente VIP",
      description: "Cliente frecuente con historial de compras de alto valor",
      icon: <Star className="h-8 w-8 text-amber-500" />,
      color: "bg-amber-50 border-amber-200",
    },
    new: {
      title: "Cliente Nuevo",
      description: "Usuario recién registrado sin direcciones ni historial",
      icon: <UserPlus className="h-8 w-8 text-green-500" />,
      color: "bg-green-50 border-green-200",
    },
    business: {
      title: "Cliente Empresarial",
      description: "Cuenta de empresa con NIT y compras de gran volumen",
      icon: <Building2 className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-50 border-purple-200",
    },
    international: {
      title: "Cliente Internacional",
      description: "Usuario con dirección en el extranjero",
      icon: <Globe className="h-8 w-8 text-teal-500" />,
      color: "bg-teal-50 border-teal-200",
    },
  }

  const createUser = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/create-test-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileType: selectedProfile }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Crear Usuario de Prueba</CardTitle>
          <CardDescription>
            Selecciona un tipo de perfil para crear un usuario de prueba con características específicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="regular" onValueChange={(value) => setSelectedProfile(value as UserProfile)}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
              <TabsTrigger value="regular">Regular</TabsTrigger>
              <TabsTrigger value="vip">VIP</TabsTrigger>
              <TabsTrigger value="new">Nuevo</TabsTrigger>
              <TabsTrigger value="business">Empresarial</TabsTrigger>
              <TabsTrigger value="international">Internacional</TabsTrigger>
            </TabsList>

            {Object.entries(profileInfo).map(([key, profile]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <div className={`p-4 rounded-lg border-2 ${profile.color}`}>
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-white shadow-sm">{profile.icon}</div>
                    <div>
                      <h3 className="text-lg font-medium">{profile.title}</h3>
                      <p className="text-sm text-gray-600">{profile.description}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-6">
            <Button onClick={createUser} disabled={isLoading} className="w-full">
              {isLoading ? "Creando usuario..." : `Crear Usuario ${profileInfo[selectedProfile].title}`}
            </Button>
          </div>

          {result && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              <h3 className={`font-medium ${result.success ? "text-green-700" : "text-red-700"}`}>
                {result.success ? "¡Usuario creado con éxito!" : "Error al crear usuario"}
              </h3>
              <p className="text-sm mt-1">{result.message}</p>

              {result.success && (
                <div className="mt-4 bg-white p-3 rounded border">
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <span className="text-xs text-gray-500">Email:</span>
                      <p className="font-mono text-sm">{result.email}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Contraseña:</span>
                      <p className="font-mono text-sm">{result.password}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Tipo de perfil:</span>
                      <p className="text-sm">{profileInfo[result.profileType]?.title || result.profileType}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <h4 className="text-sm font-medium mb-2">Instrucciones:</h4>
          <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1">
            <li>Selecciona el tipo de perfil que deseas probar</li>
            <li>Haz clic en "Crear Usuario" y espera a que se generen las credenciales</li>
            <li>Utiliza el email y contraseña generados para iniciar sesión</li>
            <li>Navega por la tienda y realiza una compra para probar el flujo completo</li>
          </ol>
        </CardFooter>
      </Card>
    </div>
  )
}
