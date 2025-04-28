import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"
import { Clock, Percent, Tag, Truck } from "lucide-react"

export default function PromosPage() {
  // Filtrar productos con descuento
  const saleProducts = products.filter((product) => product.isSale)

  // Productos destacados (primeros 4)
  const featuredPromos = saleProducts.slice(0, 4)

  // Resto de productos en oferta
  const otherPromos = saleProducts.slice(4)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden mb-8">
        <Image src="/promo-hero-banner.png" alt="Promociones especiales" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#004a93]/80 to-transparent flex flex-col justify-center p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Promociones <span className="text-[#ffff1a]">Especiales</span>
          </h1>
          <p className="text-white text-lg md:text-xl max-w-md mb-6">
            Descubre nuestras mejores ofertas y aprovecha descuentos exclusivos en productos seleccionados.
          </p>
          <div className="flex gap-4">
            <Button className="bg-[#e30613] hover:bg-[#c00] text-white">Ver todas las ofertas</Button>
            <Button variant="outline" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
              Outlet
            </Button>
          </div>
        </div>
      </div>

      {/* Beneficios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="bg-[#e6f2ff] p-3 rounded-full">
            <Percent className="h-6 w-6 text-[#004a93]" />
          </div>
          <div>
            <h3 className="font-medium">Hasta 50% de descuento</h3>
            <p className="text-sm text-gray-500">En productos seleccionados</p>
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
            <h3 className="font-medium">Ofertas por tiempo limitado</h3>
            <p className="text-sm text-gray-500">¡No te las pierdas!</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="bg-[#e6f2ff] p-3 rounded-full">
            <Tag className="h-6 w-6 text-[#004a93]" />
          </div>
          <div>
            <h3 className="font-medium">Cupones exclusivos</h3>
            <p className="text-sm text-gray-500">Descuentos adicionales</p>
          </div>
        </div>
      </div>

      {/* Ofertas destacadas */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Ofertas Destacadas</h2>
          <Link href="/promos/destacadas" className="text-[#004a93] hover:underline">
            Ver todas
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {featuredPromos.map((product) => (
            <div key={product.id} className="relative">
              <Badge className="absolute top-2 left-2 z-10 bg-[#e30613]">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </Badge>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Banners promocionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="relative h-[200px] rounded-xl overflow-hidden group">
          <Image
            src="/outlet-banner.png"
            alt="Outlet"
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-center p-6">
            <Badge className="bg-[#e30613] mb-2 self-start">OUTLET</Badge>
            <h3 className="text-2xl font-bold text-white mb-2">Últimas unidades</h3>
            <p className="text-white mb-4">Hasta 70% de descuento en productos de temporadas anteriores</p>
            <Button className="self-start bg-white text-[#004a93] hover:bg-gray-100">Ver productos</Button>
          </div>
        </div>

        <div className="relative h-[200px] rounded-xl overflow-hidden group">
          <Image
            src="/clearance-banner.png"
            alt="Liquidación"
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-center p-6">
            <Badge className="bg-[#004a93] mb-2 self-start">LIQUIDACIÓN</Badge>
            <h3 className="text-2xl font-bold text-white mb-2">Liquidación total</h3>
            <p className="text-white mb-4">Aprovecha los mejores precios antes de que se agoten</p>
            <Button className="self-start bg-white text-[#004a93] hover:bg-gray-100">Ver productos</Button>
          </div>
        </div>
      </div>

      {/* Pestañas de categorías de promociones */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Explora nuestras promociones</h2>

        <Tabs defaultValue="todas" className="w-full">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            <TabsTrigger value="todas">Todas las ofertas</TabsTrigger>
            <TabsTrigger value="outlet">Outlet</TabsTrigger>
            <TabsTrigger value="liquidacion">Liquidación</TabsTrigger>
            <TabsTrigger value="2x1">2x1</TabsTrigger>
            <TabsTrigger value="packs">Packs ahorro</TabsTrigger>
          </TabsList>

          <TabsContent value="todas" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {otherPromos.map((product) => (
                <div key={product.id} className="relative">
                  <Badge className="absolute top-2 left-2 z-10 bg-[#e30613]">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="outlet" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {otherPromos.slice(0, 4).map((product) => (
                <div key={product.id} className="relative">
                  <Badge className="absolute top-2 left-2 z-10 bg-[#e30613]">OUTLET</Badge>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="liquidacion" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {otherPromos.slice(1, 5).map((product) => (
                <div key={product.id} className="relative">
                  <Badge className="absolute top-2 left-2 z-10 bg-[#004a93]">LIQUIDACIÓN</Badge>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="2x1" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {otherPromos.slice(2, 6).map((product) => (
                <div key={product.id} className="relative">
                  <Badge className="absolute top-2 left-2 z-10 bg-[#ffff1a] text-black">2x1</Badge>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="packs" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {otherPromos.slice(0, 2).map((product) => (
                <div key={product.id} className="relative">
                  <Badge className="absolute top-2 left-2 z-10 bg-[#004a93]">PACK AHORRO</Badge>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Banner de suscripción */}
      <div className="bg-[#f5f5f5] rounded-xl p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">¿Quieres recibir nuestras promociones?</h2>
          <p className="text-gray-600 mb-6">
            Suscríbete a nuestro boletín y recibe cupones exclusivos y alertas de ofertas especiales.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#004a93]"
            />
            <Button className="bg-[#004a93] hover:bg-[#003a74]">Suscribirme</Button>
          </div>
        </div>
      </div>

      {/* Contador de ofertas flash */}
      <div className="relative w-full h-[250px] rounded-xl overflow-hidden mb-12">
        <Image src="/flash-sale-banner.png" alt="Ofertas Flash" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-6 text-center">
          <Badge className="bg-[#e30613] mb-4">OFERTAS FLASH</Badge>
          <h2 className="text-3xl font-bold text-white mb-6">¡Solo por 24 horas!</h2>

          <div className="flex gap-4 mb-6">
            <div className="bg-white/90 backdrop-blur-sm w-16 h-16 rounded-lg flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#004a93]">12</span>
              <span className="text-xs text-gray-600">Horas</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm w-16 h-16 rounded-lg flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#004a93]">45</span>
              <span className="text-xs text-gray-600">Minutos</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm w-16 h-16 rounded-lg flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#004a93]">30</span>
              <span className="text-xs text-gray-600">Segundos</span>
            </div>
          </div>

          <Button className="bg-[#e30613] hover:bg-[#c00]">Ver ofertas flash</Button>
        </div>
      </div>

      {/* Categorías en promoción */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Categorías en promoción</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link href="/categories/insuperables" className="group">
            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 shadow-sm transition-all group-hover:shadow-md group-hover:border-[#004a93]/20">
              <div className="relative w-full h-32 mb-3">
                <Image src="/categories/insuperables.png" alt="Insuperables" fill className="object-contain" />
              </div>
              <h3 className="font-medium group-hover:text-[#004a93]">Insuperables</h3>
              <p className="text-sm text-gray-500">Hasta 30% off</p>
            </div>
          </Link>

          <Link href="/categories/oferta-estrella" className="group">
            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 shadow-sm transition-all group-hover:shadow-md group-hover:border-[#004a93]/20">
              <div className="relative w-full h-32 mb-3">
                <Image src="/categories/oferta-estrella.png" alt="Oferta Estrella" fill className="object-contain" />
              </div>
              <h3 className="font-medium group-hover:text-[#004a93]">Oferta Estrella</h3>
              <p className="text-sm text-gray-500">Hasta 40% off</p>
            </div>
          </Link>

          <Link href="/categories/lacteos" className="group">
            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 shadow-sm transition-all group-hover:shadow-md group-hover:border-[#004a93]/20">
              <div className="relative w-full h-32 mb-3">
                <Image src="/categories/lacteos.png" alt="Lácteos" fill className="object-contain" />
              </div>
              <h3 className="font-medium group-hover:text-[#004a93]">Lácteos</h3>
              <p className="text-sm text-gray-500">Hasta 25% off</p>
            </div>
          </Link>

          <Link href="/categories/aseo" className="group">
            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 shadow-sm transition-all group-hover:shadow-md group-hover:border-[#004a93]/20">
              <div className="relative w-full h-32 mb-3">
                <Image src="/categories/aseo.png" alt="Aseo" fill className="object-contain" />
              </div>
              <h3 className="font-medium group-hover:text-[#004a93]">Aseo</h3>
              <p className="text-sm text-gray-500">Hasta 35% off</p>
            </div>
          </Link>

          <Link href="/categories/bebidas" className="group">
            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 shadow-sm transition-all group-hover:shadow-md group-hover:border-[#004a93]/20">
              <div className="relative w-full h-32 mb-3">
                <Image src="/categories/bebidas.png" alt="Bebidas" fill className="object-contain" />
              </div>
              <h3 className="font-medium group-hover:text-[#004a93]">Bebidas</h3>
              <p className="text-sm text-gray-500">Hasta 20% off</p>
            </div>
          </Link>

          <Link href="/categories/snack" className="group">
            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 shadow-sm transition-all group-hover:shadow-md group-hover:border-[#004a93]/20">
              <div className="relative w-full h-32 mb-3">
                <Image src="/categories/snack.png" alt="Snacks" fill className="object-contain" />
              </div>
              <h3 className="font-medium group-hover:text-[#004a93]">Snacks</h3>
              <p className="text-sm text-gray-500">Hasta 15% off</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
