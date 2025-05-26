import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { FeaturedProducts } from "@/components/featured-products"
import { TestimonialSection } from "@/components/testimonial-section"
import { CategoryShowcase } from "@/components/category-showcase"

// Modificar la función para incluir optimizaciones de rendimiento
export const dynamic = "force-dynamic"
export const revalidate = 3600 // Revalidar cada hora

export default async function HomePage() {
  const supabase = createServerSupabaseClient()

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      brand:brands(*),
      images:product_images(*)
    `)
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8)

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .is("parent_id", null)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(8)

  // Fetch brands
  const { data: brands } = await supabase.from("brands").select("*").eq("is_active", true).limit(8)

  // Prefetch de datos críticos para mejorar la experiencia de usuario
  const prefetchLinks = ["/shop", "/categories", "/about"]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Principal */}
      <section className="bg-blue-800 py-6 md:py-12">
        <div className="container mx-auto px-3 md:px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
              Bienvenido a Nuestra Tienda
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white mb-4 md:mb-6 max-w-3xl px-2">
              Descubre nuestra amplia selección de productos de alta calidad a los mejores precios
            </p>
            <Link href="/shop">
              <button className="bg-white text-blue-800 hover:bg-blue-50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg font-bold transition-all shadow-lg">
                Visitar Tienda
              </button>
            </Link>
          </div>
        </div>
      </section>

      <main className="flex-1">
        {/* Productos Destacados */}
        <section className="bg-white py-6 md:py-12">
          <div className="container mx-auto px-3 md:px-4">
            <div className="flex justify-between items-center mb-3 md:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Productos Destacados</h2>
              <Link
                href="/shop"
                className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm md:text-base"
              >
                Ver todos →
              </Link>
            </div>

            <Suspense fallback={<div className="text-center py-4 md:py-8">Cargando productos...</div>}>
              <FeaturedProducts products={featuredProducts || []} />
            </Suspense>
          </div>
        </section>

        {/* Productos Destacados con Enlace a Shop */}
        <section className="bg-blue-50 py-6 sm:py-10 md:py-16">
          <div className="container mx-auto px-3 md:px-4">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-4">
                Productos Destacados
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
                Descubre nuestra selección de productos más populares y mejor valorados por nuestros clientes
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {(featuredProducts || []).slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  href={`/shop?featured=true#product-${product.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative h-40 sm:h-48">
                    <Image
                      src={product.images?.[0]?.url || `/placeholder.svg?height=200&width=200&query=${product.name}`}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.is_sale && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        OFERTA
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm sm:text-base">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <div>
                        {product.sale_price ? (
                          <>
                            <span className="text-red-600 font-bold text-sm sm:text-base">
                              ${product.sale_price.toFixed(2)}
                            </span>
                            <span className="text-gray-400 line-through text-xs sm:text-sm ml-1 sm:ml-2">
                              ${product.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-800 font-bold text-sm sm:text-base">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-blue-600 text-xs sm:text-sm">Ver detalles</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link href="/shop?featured=true">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base">
                  Ver Todos los Destacados
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Categorías Populares en Grid */}
        <section className="bg-gray-50 py-6 md:py-12">
          <div className="container mx-auto px-3 md:px-4">
            <div className="flex justify-between items-center mb-3 md:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Categorías Populares</h2>
              <Link
                href="/categories"
                className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm md:text-base"
              >
                Ver todas →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {(categories || []).slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative pt-[100%]">
                    <Image
                      src={category.image_url || `/placeholder.svg?height=200&width=200&query=${category.name}`}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <h3 className="font-medium text-gray-800 text-xs sm:text-sm md:text-base truncate">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Nuestras Marcas */}
        <section className="bg-gray-50 py-6 md:py-12">
          <div className="container mx-auto px-3 md:px-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-8 text-center">
              Nuestras Marcas
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6">
              {(brands || []).map((brand) => (
                <div key={brand.id} className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white shadow-md flex items-center justify-center p-2 border-2 border-gray-200 hover:border-blue-500 transition-all">
                    {brand.logo_url ? (
                      <Image
                        src={brand.logo_url || "/placeholder.svg"}
                        alt={brand.name}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    ) : (
                      <span className="font-bold text-blue-800 text-xs sm:text-sm">{brand.name}</span>
                    )}
                  </div>
                  <span className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-center truncate max-w-full px-1">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categorías Especiales */}
        <section className="bg-white py-6 md:py-12">
          <div className="container mx-auto px-3 md:px-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-8 text-center">
              Explora Nuestras Categorías
            </h2>
            <CategoryShowcase />
          </div>
        </section>

        {/* Testimonios */}
        <section className="bg-gray-50 py-6 md:py-12">
          <div className="container mx-auto px-3 md:px-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-8 text-center">
              Lo Que Dicen Nuestros Clientes
            </h2>
            <TestimonialSection />
          </div>
        </section>

        {/* Banner de Información */}
        <section className="bg-blue-900 text-white py-6 sm:py-10 md:py-16">
          <div className="container mx-auto px-3 md:px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
              <div className="md:w-1/2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-center md:text-left">
                  ¿Por qué elegirnos?
                </h2>
                <ul className="space-y-2 md:space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm md:text-base">Productos de alta calidad garantizada</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm md:text-base">Envío rápido a todo el país</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm md:text-base">Atención al cliente personalizada</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm md:text-base">Los mejores precios del mercado</span>
                  </li>
                </ul>
                <div className="mt-4 md:mt-6 text-center md:text-left">
                  <Link
                    href="/about"
                    className="inline-block bg-white text-blue-900 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-md font-medium hover:bg-gray-100 transition-colors text-xs sm:text-sm md:text-base"
                  >
                    Conoce más sobre nosotros
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 mt-4 md:mt-0 w-full px-4 md:px-0">
                <div className="relative h-48 sm:h-60 md:h-80 w-full rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src="/colorful-supermarket.png"
                    alt="Nuestro compromiso"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
