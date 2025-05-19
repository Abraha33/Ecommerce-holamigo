import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"
import { Filter, SlidersHorizontal, ArrowLeft, Clock } from "lucide-react"

export default function OfertasSemanalesPage() {
  // Filtrar productos con descuento para ofertas semanales
  const saleProducts = products.filter((product) => product.isSale && product.category === "ofertas-semanales")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Link href="/categories/insuperables" className="text-[#004a93] hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Insuperables
          </Link>
          <h1 className="text-3xl font-bold">Ofertas Semanales</h1>
          <p className="text-gray-600">Aprovecha nuestras mejores promociones de la semana</p>
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
        <Image src="/subcategories/ofertas-semanales.png" alt="Ofertas Semanales" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#004a93]/80 to-transparent flex flex-col justify-center p-8">
          <Badge className="bg-[#e30613] mb-2 self-start">OFERTAS LIMITADAS</Badge>
          <h2 className="text-3xl font-bold text-white mb-2">Ofertas Semanales</h2>
          <p className="text-white max-w-md">Descuentos especiales que cambian cada semana</p>
          <div className="flex items-center gap-2 mt-2 text-white">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Termina en: 4 días 12:45:30</span>
          </div>
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

      {/* Características destacadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
          <Clock className="h-12 w-12 text-[#004a93] mb-4" />
          <h3 className="font-bold text-lg mb-2">Ofertas por tiempo limitado</h3>
          <p className="text-gray-600">Aprovecha estos precios especiales antes que terminen</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
          <Image src="/vibrant-sale-burst.png" width={48} height={48} alt="Descuentos" className="mb-4" />
          <h3 className="font-bold text-lg mb-2">Hasta 50% de descuento</h3>
          <p className="text-gray-600">Los mejores precios en productos seleccionados</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
          <Image src="/delivery-icon.png" width={48} height={48} alt="Envío" className="mb-4" />
          <h3 className="font-bold text-lg mb-2">Envío gratis</h3>
          <p className="text-gray-600">En compras superiores a $50.000</p>
        </div>
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
