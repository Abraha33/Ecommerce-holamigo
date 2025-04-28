import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { UserPlus, Mail, Lock, ArrowRight } from "lucide-react"

export default function CreateAccountPage() {
  return (
    <div className="container py-10 flex flex-col items-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-full bg-blue-50 mb-4">
            <UserPlus className="h-8 w-8 text-ecoplast-blue" />
          </div>
          <h1 className="text-2xl font-bold">Crear una cuenta</h1>
          <p className="text-gray-500 mt-2">Únete a nuestra comunidad en segundos</p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <div className="relative">
                <Input id="name" placeholder="Ingresa tu nombre completo" className="pl-10" />
                <UserPlus className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Input id="email" type="email" placeholder="correo@ejemplo.com" className="pl-10" />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input id="password" type="password" placeholder="Crea una contraseña segura" className="pl-10" />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500">Mínimo 8 caracteres con letras y números</p>
            </div>

            <Button className="w-full bg-ecoplast-blue hover:bg-blue-700">
              Crear cuenta
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="relative my-4">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
                O continúa con
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <Image src="/google-logo.png" alt="Google" width={20} height={20} className="mr-2" />
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <Image src="/facebook-logo.png" alt="Facebook" width={20} height={20} className="mr-2" />
                Facebook
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-ecoplast-blue hover:underline font-medium">
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="text-center mt-6 text-xs text-gray-500">
          Al crear una cuenta, aceptas nuestros{" "}
          <Link href="/terms" className="text-ecoplast-blue hover:underline">
            Términos y Condiciones
          </Link>{" "}
          y{" "}
          <Link href="/privacy" className="text-ecoplast-blue hover:underline">
            Política de Privacidad
          </Link>
        </div>
      </div>
    </div>
  )
}
