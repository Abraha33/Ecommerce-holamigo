import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { CategoryNavigation } from "@/components/category-navigation"
import { ProductGrid } from "@/components/product-grid"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Descuentos Flash | Insuperables | Holamigo",
  description:
    "Aprovecha nuestros descuentos flash por tiempo limitado con ofertas increíbles que no puedes dejar pasar.",
}

export default function DescuentosFlashPage() {
  // Productos de ejemplo para esta subcategoría
  const subcategoryProducts = [
    {
      id: 1,
      name: "Café Premium Descafeinado",
      slug: "cafe-premium-descafeinado",
      price: 12900,
      originalPrice: 18900,
      image: "/placeholder-5g856.png",
      isNew: false,
      isSale: true,
    },
    {
      id: 2,
      name: "Aceite de Oliva Extra Virgen",
      slug: "aceite-oliva-extra-virgen",
      price: 24900,
      originalPrice: 32900,
      image: "/olive-oil-bottle.png",
      isNew: false,
      isSale: true,
    },
    {
      id: 3,
      name: "Chocolate Orgánico 70%",
      slug: "chocolate-organico-70",
      price: 8900,
      originalPrice: 12900,
      image: "/dark-chocolate-bar.png",
      isNew: false,
      isSale: true,
    },
    {
      id: 4,
      name: "Vino Tinto Reserva",
      slug: "vino-tinto-reserva",
      price: 29900,
      originalPrice: 45900,
      image: "/red-wine-bottle.png",
      isNew: false,
      isSale: true,
    },
    {
      id: 5,
      name: "Galletas Artesanales",
      slug: "galletas-artesanales",
      price: 7900,
      originalPrice: 10900,
      image: "/artisan-cookies.png",
      isNew: false,
      isSale: true,
    },
    {
      id: 6,
      name: "Mermelada de Frutos Rojos",
      slug: "mermelada-frutos-rojos",
      price: 9900,
      originalPrice: 14900,
      image: "/berry-jam-jar.png",
      isNew: false,
      isSale: true,
    },
  ]

  // Crear círculos de subcategorías para la navegación
  const subcategoryCircles = [
    {
      id: "ofertas-semanales",
      name: "Ofertas Semanales",
      image: "/subcategories/ofertas-semanales.png",
      href: "/categories/insuperables/ofertas-semanales",
    },
    {
      id: "liquidacion",
      name: "Liquidación",
      image: "/subcategories/liquidacion.png",
      href: "/categories/insuperables/liquidacion",
    },
    {
      id: "ofertas-del-dia",
      name: "Ofertas del Día",
      image: "/subcategories/ofertas-del-dia.png",
      href: "/categories/insuperables/ofertas-del-dia",
    },
    {
      id: "descuentos-flash",
      name: "Descuentos Flash",
      image: "/subcategories/liquidacion.png", // Reutilizando imagen existente
      href: "/categories/insuperables/descuentos-flash",
    },
    {
      id: "ultimas-unidades",
      name: "Últimas Unidades",
      image: "/subcategories/ultimas-unidades.png",
      href: "/categories/insuperables/ultimas-unidades",
    },
    {
      id: "ver-todo",
      name: "Ver Todo",
      image: "/categories/ver-todo.png",
      href: "/categories/insuperables",
    },
  ]

  return (
    <div className="bg-gray-50">
      {/* Banner de categoría AGRANDADO */}
      <div className="w-full bg-gradient-to-r from-[#004a93] to-[#0071bc] py-16">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "Inicio", href: "/" },
              { label: "Categorías", href: "/categories" },
              { label: "Insuperables", href: "/categories/insuperables" },
              { label: "Descuentos Flash", href: "/categories/insuperables/descuentos-flash", active: true },
            ]}
            className="text-white/80 mb-6"
          />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h1 className="text-5xl font-bold text-white mb-4">Descuentos Flash</h1>
              <p className="text-white/90 max-w-2xl text-xl">
                Aprovecha nuestras ofertas relámpago por tiempo limitado. ¡Date prisa antes de que se acaben!
              </p>
            </div>
            <Badge variant="outline" className="text-2xl px-6 py-3 bg-white text-[#004a93] font-semibold">
              {subcategoryProducts.length} productos
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navegación de subcategorías con círculos - Similar a shop */}
        <div className="my-6 overflow-hidden">
          <div className="w-full max-w-[1600px] mx-auto">
            <CategoryNavigation categories={subcategoryCircles} />
          </div>
        </div>

        {/* Contador regresivo para ofertas flash */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl p-6 mb-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">¡Ofertas por tiempo limitado!</h2>
          <p className="mb-4">Estas ofertas terminan en:</p>
          <div className="flex justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 w-20">
              <div className="text-3xl font-bold">12</div>
              <div className="text-xs">HORAS</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 w-20">
              <div className="text-3xl font-bold">45</div>
              <div className="text-xs">MINUTOS</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 w-20">
              <div className="text-3xl font-bold">22</div>
              <div className="text-xs">SEGUNDOS</div>
            </div>
          </div>
        </div>

        {/* Productos en grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Productos con Descuentos Flash</h2>
          <ProductGrid products={subcategoryProducts} />
        </div>
      </div>
    </div>
  )
}
