import type { Metadata } from "next"
import { CategoryNavigation } from "@/components/category-navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductGrid } from "@/components/product-grid"

export const metadata: Metadata = {
  title: "Outlet Digital | Insuperables | Holamigo",
  description: "Descubre nuestras ofertas digitales exclusivas con los mejores precios en productos tecnológicos.",
}

export default function OutletDigitalPage() {
  // Productos de ejemplo para la página
  const products = [
    {
      id: 1,
      name: "Smartphone XYZ Pro",
      slug: "smartphone-xyz-pro",
      price: 899000,
      originalPrice: 1299000,
      image: "/placeholder.svg?key=npzbo",
      isNew: false,
      isSale: true
    },
    {
      id: 2,
      name: "Tablet Ultra Slim",
      slug: "tablet-ultra-slim",
      price: 599000,
      originalPrice: 799000,
      image: "/placeholder.svg?key=ey4r3",
      isNew: false,
      isSale: true
    },
    {
      id: 3,
      name: "Smartwatch Fitness",
      slug: "smartwatch-fitness",
      price: 249000,
      originalPrice: 349000,
      image: "/placeholder.svg?key=03qpm",
      isNew: false,
      isSale: true
    },
    {
      id: 4,
      name: "Auriculares Bluetooth",
      slug: "auriculares-bluetooth",
      price: 89000,
      originalPrice: 129000,
      image: "/placeholder.svg?key=h4e5w",
      isNew: false,
      isSale: true
    },
    {
      id: 5,
      name: "Cámara Digital 4K",
      slug: "camara-digital-4k",
      price: 499000,
      originalPrice: 699000,
      image: "/placeholder.svg?key=2ub6s",
      isNew: false,
      isSale: true
    },
    {
      id: 6,
      name: "Altavoz Inteligente",
      slug: "altavoz-inteligente",
      price: 129000,
      originalPrice: 179000,
      image: "/placeholder.svg?key=p4pyu",
      isNew: false,
      isSale: true
    }
  ];

  // Subcategorías para la navegación
  const subcategories = [
    {
      id: "1",
      name: "Ofertas Semanales",
      href: "/categories/insuperables/ofertas-semanales",
      image: "/subcategories/ofertas-semanales.png",
    },
    {
      id: "2",
      name: "Liquidación",
      href: "/categories/insuperables/liquidacion",
      image: "/subcategories/liquidacion.png",
    },
    {
      id: "3",
      name: "Ofertas del Día",
      href: "/categories/insuperables/ofertas-del-dia",
      image: "/subcategories/ofertas-del-dia.png",
    },
    {
      id: "4",
      name: "Outlet Digital",
      href: "/categories/insuperables/outlet-digital",
      image: "/subcategories/liquidacion.png", // Reutilizando imagen existente
    },
    {
      id: "5",
      name: "Últimas Unidades",
      href: "/categories/insuperables/ultimas-unidades",
      image: "/subcategories/ultimas-unidades.png",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de categoría */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Outlet Digital</h1>
          <p className="text-xl">Descuentos exclusivos en productos tecnológicos y digitales</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <Breadcrumb
            items={[
              { label: "Inicio", href: "/" },
              { label: "Categorías", href: "/categories" },
              { label: "Insuperables", href: "/categories/insuperables" },
              { label: "Outlet Digital", href: "/categories/insuperables/outlet-digital", active: true },
            ]}
          />
        </div>
      </div>

      {/* Navegación de subcategorías con círculos - Similar a shop */}
      <div className="container mx-auto px-4 py-8">
        <div className="my-6 overflow-hidden">
          <div className="w-full max-w-[1600px] mx-auto">
            <CategoryNavigation categories={subcategories} />
          </div>
        </div>
      </div>

      {/* Productos */}
      <div className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold mb-6">Productos en Outlet Digital</h2>
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
