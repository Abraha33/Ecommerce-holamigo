"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle2, Mail } from "lucide-react"

export default function MagicLinkPage() {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")
  const redirectTo = searchParams.get("redirectTo") || "/"

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setStatus("error")
        return
      }

      // Simulación de verificación del token - en un caso real, aquí iría la llamada a la API
      setTimeout(() => {
        setStatus("success")

        // Redirigir después de un breve retraso para mostrar el mensaje de éxito
        setTimeout(() => {
          toast({
            title: "Inicio de sesión exitoso",
            description: "Has iniciado sesión correctamente",
          })
          router.push(redirectTo)
        }, 2000)
      }, 2000)
    }

    verifyToken()
  }, [token, email, redirectTo, router])

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-10">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 flex flex-col items-center text-center">
          {status === "verifying" && (
            <>
              <Loader2 className="h-16 w-16 text-ecoplast-blue animate-spin mb-4" />
              <h2 className="text-2xl font-bold mb-2">Verificando enlace</h2>
              <p className="text-gray-600 mb-4">
                Estamos verificando tu enlace de acceso. Por favor espera un momento...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">¡Inicio de sesión exitoso!</h2>
              <p className="text-gray-600 mb-4">
                Has iniciado sesión correctamente. Serás redirigido en unos segundos...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="rounded-full bg-red-100 p-4 mb-4">
                <Mail className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Enlace inválido o expirado</h2>
              <p className="text-gray-600 mb-6">
                El enlace que has utilizado no es válido o ha expirado. Por favor solicita un nuevo enlace de acceso.
              </p>
              <Button onClick={() => router.push("/login")} className="w-full bg-ecoplast-blue hover:bg-blue-700">
                Volver al inicio de sesión
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
