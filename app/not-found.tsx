import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-[#20509E]">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Página no encontrada</h2>
      <p className="mt-2 text-gray-600 max-w-md">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/categories">Ver categorías</Link>
        </Button>
      </div>
    </div>
  )
}
