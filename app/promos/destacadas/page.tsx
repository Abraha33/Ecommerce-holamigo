import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"
import { Filter, SlidersHorizontal, ArrowLeft } from "lucide-react"

export default function OfertasDestacadasPage() {
  // Filtrar productos con descuento
  const saleProducts = products.filter((product) => product.isSale)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Link href="/promos" className="text-[#004a93] hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a promociones
          </Link>
          <h1 className="text-3xl font-bold">Ofertas Destacadas</h1>
          <p className="text-gray-600">Descubre nuestras mejores promociones seleccionadas para ti</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Ordenar
          </Button>
        </div>
      </div>

      {/* Banner */}
      <div className="relative w-full h-[200px] rounded-xl overflow-hidden mb-8">
        <Image src="/destacadas-banner.png" alt="Ofertas Destacadas" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#004a93]/80 to-transparent flex flex-col justify-center p-8">
          <Badge className="bg-[#e30613] mb-2 self-start">TOP OFERTAS</Badge>
          <h2 className="text-3xl font-bold text-white mb-2">Ofertas Destacadas</h2>
          <p className="text-white max-w-md">Las mejores promociones seleccionadas por nuestro equipo</p>
        </div>
      </div>

      {/* Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
        {saleProducts.map((product) => (
          <div key={product.id} className="relative">
            <Badge className="absolute top-2 left-2 z-10 bg-[#e30613]">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </Badge>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center gap-2 mt-12">
        <Button variant="outline" className="w-10 h-10 p-0" disabled>
          &lt;
        </Button>
        <Button variant="outline" className="w-10 h-10 p-0 bg-[#004a93] text-white">
          1
        </Button>
        <Button variant="outline" className="w-10 h-10 p-0">
          2
        </Button>
        <Button variant="outline" className="w-10 h-10 p-0">
          3
        </Button>
        <Button variant="outline" className="w-10 h-10 p-0">
          &gt;
        </Button>
      </div>
    </div>
  )
}
