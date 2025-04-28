import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"

// Datos de categorías
const categories = [
  {
    id: "beverages",
    name: "Bebidas",
    image: "/categories/bebidas.png",
    items: 11,
  },
  {
    id: "biscuits",
    name: "Galletas & Snacks",
    image: "/categories/snack.png",
    items: 6,
  },
  {
    id: "breads",
    name: "Panes & Panadería",
    image: "/categories/oferta-estrella.png",
    items: 6,
  },
  {
    id: "breakfast",
    name: "Desayuno & Lácteos",
    image: "/categories/lacteos.png",
    items: 8,
  },
  {
    id: "frozen",
    name: "Alimentos Congelados",
    image: "/categories/insuperables.png",
    items: 7,
  },
  {
    id: "fruits",
    name: "Frutas & Verduras",
    image: "/categories/frutas-verduras.png",
    items: 12,
  },
  {
    id: "grocery",
    name: "Abarrotes & Básicos",
    image: "/categories/aseo.png",
    items: 7,
  },
  {
    id: "household",
    name: "Artículos para el Hogar",
    image: "/categories/cosmeticos.png",
    items: 1,
  },
  {
    id: "meats",
    name: "Carnes & Mariscos",
    image: "/categories/carnes.png",
    items: 5,
  },
]

// Datos de productos en oferta
const dealProducts = [
  {
    id: 1,
    name: "Yogurt Griego Completo Vainilla",
    price: 4.49,
    originalPrice: 5.49,
    discount: 19,
    image: "/sustainable-kitchen-storage.png",
    rating: 5,
    stock: true,
    available: 15,
    organic: false,
    recommended: false,
  },
  {
    id: 2,
    name: "Albóndigas de Pollo Estilo Italiano",
    price: 7.25,
    originalPrice: 9.35,
    discount: 23,
    image: "/colorful-recycled-chairs.png",
    rating: 4,
    stock: true,
    organic: false,
    recommended: true,
  },
  {
    id: 3,
    name: "Palomitas de Maíz Dulces y Saladas",
    price: 3.29,
    originalPrice: 4.29,
    discount: 24,
    image: "/sustainable-hydration.png",
    rating: 4,
    stock: true,
    organic: false,
  },
  {
    id: 4,
    name: "Queso Chao Cremoso Original",
    price: 19.5,
    originalPrice: 24.0,
    discount: 19,
    image: "/eco-friendly-food-display.png",
    rating: 5,
    stock: true,
    organic: true,
  },
  {
    id: 5,
    name: "Alitas de Búfalo Crujientes",
    price: 7.25,
    originalPrice: 9.99,
    discount: 28,
    image: "/colorful-market-bags.png",
    rating: 4,
    stock: true,
    organic: false,
  },
  {
    id: 6,
    name: "Almendras Blue Diamond Ligeramente Saladas",
    price: 10.58,
    originalPrice: 11.68,
    discount: 10,
    image: "/seedling-nursery.png",
    rating: 5,
    stock: true,
    organic: true,
  },
  {
    id: 7,
    name: "Arándanos - Paquete de 1 Pinta",
    price: 3.99,
    originalPrice: 4.49,
    discount: 12,
    image: "/garden-biodegradable-pots.png",
    rating: 3,
    stock: true,
    organic: false,
  },
  {
    id: 8,
    name: "Limonada de Fresa Zero Calorías",
    price: 5.95,
    originalPrice: 7.95,
    discount: 26,
    image: "/sustainable-living-banner.png",
    rating: 5,
    stock: true,
    organic: false,
  },
  {
    id: 9,
    name: "Galletas Wheat Thins Original",
    price: 3.0,
    originalPrice: 5.0,
    discount: 40,
    image: "/eco-conscious-living.png",
    rating: 5,
    stock: true,
    organic: false,
  },
  {
    id: 10,
    name: "Caramelos Duros Werther's Original",
    price: 14.97,
    originalPrice: 20.0,
    discount: 26,
    image: "/sustainable-pantry-organization.png",
    rating: 5,
    stock: true,
    organic: false,
  },
]

// Componente para mostrar estrellas de calificación
const RatingStars = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
      ))}
    </div>
  )
}

// Componente para mostrar un producto en oferta
const DealProduct = ({ product }) => {
  return (
    <div className="relative border rounded-lg overflow-hidden bg-white">
      {/* Badge de descuento */}
      <div className="absolute top-2 left-2 z-10">
        <Badge className="bg-[#00bbf0] text-white">{product.discount}%</Badge>
      </div>

      {/* Badge de recomendado */}
      {product.recommended && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-gray-700 text-white">RECOMENDADO</Badge>
        </div>
      )}

      {/* Badge de orgánico */}
      {product.organic && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-green-600 text-white">ORGÁNICO</Badge>
        </div>
      )}

      <div className="p-4">
        <div className="relative h-40 mb-3">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <RatingStars rating={product.rating} />
            <span className="text-xs text-gray-500 ml-1">1</span>
          </div>

          <h3 className="font-medium text-sm line-clamp-2 h-10">{product.name}</h3>

          <div className="flex items-center">
            {product.stock ? (
              <span className="text-xs text-green-600 flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-600 mr-1"></div>
                EN STOCK
              </span>
            ) : (
              <span className="text-xs text-red-600 flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-600 mr-1"></div>
                AGOTADO
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 line-through text-sm">${product.originalPrice.toFixed(2)}</span>
            <span className="text-[#e30613] font-bold">${product.price.toFixed(2)}</span>
          </div>

          <Button className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Añadir al carrito
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PromosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Categorías en cuadrícula */}
      <div className="border rounded-lg overflow-hidden mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 divide-x divide-y">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className={`flex p-4 hover:bg-gray-50 transition-colors ${
                index < 5 ? "border-b" : ""
              } ${index % 5 === 0 ? "" : "border-l"}`}
            >
              <div className="relative w-20 h-20 mr-3">
                <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-contain" />
              </div>
              <div>
                <h3 className="font-medium text-sm">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.items} productos</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Ofertas de la semana */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Contador de ofertas */}
        <div className="md:col-span-1 border border-[#e30613] rounded-lg p-4 bg-white">
          <h2 className="text-xl font-bold mb-4">
            Ofertas de la <span className="text-[#004a93]">semana!</span>
          </h2>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-[#e30613] text-white rounded p-2 text-center">
              <span className="text-xl font-bold">44</span>
              <span className="text-xs block">Días</span>
            </div>
            <div className="bg-[#e30613] text-white rounded p-2 text-center">
              <span className="text-xl font-bold">13</span>
              <span className="text-xs block">Horas</span>
            </div>
            <div className="bg-[#e30613] text-white rounded p-2 text-center">
              <span className="text-xl font-bold">15</span>
              <span className="text-xs block">Min</span>
            </div>
            <div className="bg-[#e30613] text-white rounded p-2 text-center">
              <span className="text-xl font-bold">34</span>
              <span className="text-xs block">Seg</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-4">Tiempo restante hasta el fin de la oferta</p>

          {/* Producto destacado */}
          <div className="relative">
            <Badge className="absolute top-2 left-2 z-10 bg-[#e30613]">19%</Badge>
            <div className="relative h-48 mb-3">
              <Image
                src="/sustainable-kitchen-storage.png"
                alt="Yogurt Griego Completo Vainilla"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="font-medium mb-2">Yogurt Griego Completo Vainilla</h3>
            <div className="flex items-center mb-2">
              <RatingStars rating={5} />
              <span className="text-xs text-gray-500 ml-1">1</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-400 line-through">$5.49</span>
              <span className="text-[#e30613] font-bold">$4.49</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
              <span>1 kg</span>
              <span className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-600 mr-1"></div>
                EN STOCK
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">DISPONIBLE: 15</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
              <div className="bg-[#e30613] h-1.5 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Productos en oferta (3 columnas) */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dealProducts.slice(1, 7).map((product) => (
            <DealProduct key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Banner de ahorro */}
      <div className="bg-[#fff8e6] rounded-lg p-4 text-center mb-8">
        <h2 className="text-lg font-bold">AHORRA UN 5-10% EXTRA EN CADA PEDIDO AUTOMÁTICO</h2>
      </div>

      {/* Más productos en oferta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {dealProducts.slice(7).map((product) => (
          <DealProduct key={product.id} product={product} />
        ))}
      </div>

      {/* Banners promocionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="relative h-[200px] rounded-lg overflow-hidden">
          <Image src="/colorful-market-bags.png" alt="Descuento de fin de semana 40%" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004a93]/70 to-transparent p-6 flex flex-col justify-center">
            <span className="text-white text-sm font-medium mb-1">DESCUENTO DE FIN DE SEMANA 40%</span>
            <h3 className="text-2xl font-bold text-white mb-2">Galletas y Helados</h3>
            <p className="text-white text-sm mb-4">Descuento especial de fin de semana</p>
            <Button className="self-start bg-[#004a93] hover:bg-[#003a74] text-white">Comprar ahora</Button>
          </div>
        </div>

        <div className="relative h-[200px] rounded-lg overflow-hidden">
          <Image
            src="/sustainable-living-banner.png"
            alt="Descuento de fin de semana 30%"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#e30613]/70 to-transparent p-6 flex flex-col justify-center">
            <span className="text-white text-sm font-medium mb-1">DESCUENTO DE FIN DE SEMANA 30%</span>
            <h3 className="text-2xl font-bold text-white mb-2">Galletas y Helados</h3>
            <p className="text-white text-sm mb-4">Descuento especial de fin de semana</p>
            <Button className="self-start bg-[#e30613] hover:bg-[#c00] text-white">Comprar ahora</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
