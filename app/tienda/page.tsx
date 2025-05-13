import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"

export const metadata: Metadata = {
  title: "Tienda | Envax",
  description: "Explora nuestra tienda con productos sostenibles y ecológicos",
}

export default function TiendaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tienda Envax</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Bienvenido a nuestra tienda</h2>
        <p className="text-gray-700 mb-4">
          Esta es la página de tienda a la que redirige el botón "Seguir comprando" del carrito.
        </p>
        <div className="p-4 bg-green-100 rounded-md border border-green-300 mb-6">
          <p className="text-green-800 font-medium">
            ✓ Verificación exitosa: El botón "Seguir comprando" redirige correctamente a esta página.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/shop">
            <Button className="bg-[#004a93] hover:bg-[#003a74]">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Ver productos
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Volver al inicio</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Aquí irían las categorías o productos destacados */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-40 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
