import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"
import { Filter, SlidersHorizontal, ArrowLeft, TrendingDown, Truck, Clock } from "lucide-react"

export default function OutletPage() {
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
          <h1 className="text-3xl font-bold">Outlet</h1>
          <p className="text-gray-600">Últimas unidades a precios increíbles</p>
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
        <Image src="/outlet-banner-large.png" alt="Outlet" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8">
          <Badge className="bg-[#e30613] mb-2 self-start">OUTLET</Badge>
          <h2 className="text-3xl font-bold text-white mb-2">Grandes descuentos</h2>
          <p className="text-white max-w-md">Hasta 70% de descuento en productos de temporadas anteriores</p>
        </div>
      </div>

      {/* Beneficios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="bg-[#e6f2ff] p-3 rounded-full">
            <TrendingDown className="h-6 w-6 text-[#e30613]" />
          </div>
          <div>
            <h3 className="font-medium">Hasta 70% de descuento</h3>
            <p className="text-sm text-gray-500">Los mejores precios del año</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="bg-[#e6f2ff] p-3 rounded-full">
            <Truck className="h-6 w-6 text-[#004a93]" />
          </div>
          <div>
            <h3 className="font-medium">Envío gratis</h3>
            <p className="text-sm text-gray-500">En compras superiores a $100.000</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="bg-[#e6f2ff] p-3 rounded-full">
            <Clock className="h-6 w-6 text-[#004a93]" />
          </div>
          <div>
            <h3 className="font-medium">Últimas unidades</h3>
            <p className="text-sm text-gray-500">¡Aprovecha antes de que se agoten!</p>
          </div>
        </div>
      </div>

      {/* Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
        {saleProducts.map((product) => (
          <div key={product.id} className="relative">
            <Badge className="absolute top-2 left-2 z-10 bg-[#e30613]">OUTLET</Badge>
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
