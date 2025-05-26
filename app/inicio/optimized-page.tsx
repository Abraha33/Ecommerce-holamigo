import { Suspense } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { OptimizedFeaturedProducts } from "@/components/optimized-featured-products"
import { TestimonialSection } from "@/components/testimonial-section"
import { CategoryShowcase } from "@/components/category-showcase"
import { OptimizedImage } from "@/components/optimized-image"
import { LazySection } from "@/components/lazy-section"

// Configurar revalidación y comportamiento dinámico
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Principal - Optimizado para LCP */}
      <section className="bg-blue-800 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Bienvenido a Nuestra Tienda</h1>
            <p className="text-lg md:text-xl text-white mb-6 max-w-3xl">
              Descubre nuestra amplia selección de productos de alta calidad a los mejores precios
            </p>
            <Link href="/shop">
              <button className="bg-white text-blue-800 hover:bg-blue-50 px-6 py-3 rounded-lg text-base md:text-lg font-bold transition-all shadow-lg">
                Visitar Tienda
              </button>
            </Link>
          </div>
        </div>
      </section>

      <main className="flex-1">
        {/* Productos Destacados - Con carga optimizada */}
        <section className="bg-white py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Productos Destacados</h2>
              <Link href="/shop" className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base">
                Ver todos →
              </Link>
            </div>

            <Suspense fallback={<div className="text-center py-6 md:py-8">Cargando productos...</div>}>
              <OptimizedFeaturedProducts products={featuredProducts || []} />
            </Suspense>
          </div>
        </section>

        {/* Productos Destacados con Enlace a Shop - Con carga lazy */}
        <LazySection
          className="bg-blue-50 py-10 md:py-16"
          placeholder={
            <div className="bg-blue-50 py-10 md:py-16">
              <div className="container mx-auto px-4">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white rounded-lg h-64"></div>
                    ))}
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-48 mx-auto"></div>
                </div>
              </div>
            </div>
          }
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Productos Destacados</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Descubre nuestra selección de productos más populares y mejor valorados por nuestros clientes
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {(featuredProducts || []).slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  href={`/shop?featured=true#product-${product.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative h-48">
                    <OptimizedImage
                      src={product.images?.[0]?.url || `/placeholder.svg?height=200&width=200&query=${product.name}`}
                      alt={product.name}
                      fill
                      className="object-cover"
                      containerWidth="quarter"
                    />
                    {product.is_sale && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        OFERTA
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        {product.sale_price ? (
                          <>
                            <span className="text-red-600 font-bold">${product.sale_price.toFixed(2)}</span>
                            <span className="text-gray-400 line-through text-sm ml-2">${product.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="text-gray-800 font-bold">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                      <span className="text-blue-600 text-sm">Ver detalles</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link href="/shop?featured=true">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Ver Todos los Destacados
                </button>
              </Link>
            </div>
          </div>
        </LazySection>

        {/* Categorías Populares en Grid - Con carga lazy */}
        <LazySection className="bg-gray-50 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Categorías Populares</h2>
              <Link href="/categories" className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base">
                Ver todas →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {(categories || []).slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative pt-[100%]">
                    <OptimizedImage
                      src={category.image_url || `/placeholder.svg?height=200&width=200&query=${category.name}`}
                      alt={category.name}
                      fill
                      className="object-cover"
                      containerWidth="quarter"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    />
                  </div>
                  <div className="p-2 md:p-3 text-center">
                    <h3 className="font-medium text-gray-800 text-sm md:text-base">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </LazySection>

        {/* Nuestras Marcas - Con carga lazy */}
        <LazySection className="bg-gray-50 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8 text-center">Nuestras Marcas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {(brands || []).map((brand) => (
                <div key={brand.id} className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center p-2 border-2 border-gray-200 hover:border-blue-500 transition-all">
                    {brand.logo_url ? (
                      <OptimizedImage
                        src={brand.logo_url || "/placeholder.svg"}
                        alt={brand.name}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    ) : (
                      <span className="font-bold text-blue-800">{brand.name}</span>
                    )}
                  </div>
                  <span className="mt-2 text-sm font-medium text-center">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </LazySection>

        {/* Categorías Especiales - Con carga lazy */}
        <LazySection className="bg-white py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8 text-center">
              Explora Nuestras Categorías
            </h2>
            <CategoryShowcase />
          </div>
        </LazySection>

        {/* Testimonios - Con carga lazy */}
        <LazySection className="bg-gray-50 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8 text-center">
              Lo Que Dicen Nuestros Clientes
            </h2>
            <TestimonialSection />
          </div>
        </LazySection>

        {/* Banner de Información - Con carga lazy */}
        <LazySection className="bg-blue-900 text-white py-10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              <div className="md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Por qué elegirnos?</h2>
                <ul className="space-y-2 md:space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Productos de alta calidad garantizada</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Envío rápido a todo el país</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Atención al cliente personalizada</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">Los mejores precios del mercado</span>
                  </li>
                </ul>
                <div className="mt-5 md:mt-6">
                  <Link
                    href="/about"
                    className="inline-block bg-white text-blue-900 px-4 py-2 md:px-6 md:py-3 rounded-md font-medium hover:bg-gray-100 transition-colors text-sm md:text-base"
                  >
                    Conoce más sobre nosotros
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="relative h-60 md:h-80 w-full rounded-lg overflow-hidden shadow-xl">
                  <OptimizedImage
                    src="/colorful-supermarket.png"
                    alt="Nuestro compromiso"
                    fill
                    className="object-cover"
                    containerWidth="half"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </LazySection>
      </main>
    </div>
  )
}
