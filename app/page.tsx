import { Suspense } from "react"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { FeaturedProducts } from "@/components/featured-products"
import { PromoCarousel } from "@/components/promo-carousel"
import { BrandCircles } from "@/components/brand-circles"
import { TestimonialSection } from "@/components/testimonial-section"
import { CategoryShowcase } from "@/components/category-showcase"
import CategorySlider from "@/components/category-slider"

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
      <PromoCarousel />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Categorías Populares</h2>
          <CategorySlider categories={categories || []} />
        </section>

        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Productos Destacados</h2>
            <Suspense fallback={<div>Cargando productos...</div>}>
              <FeaturedProducts products={featuredProducts || []} />
            </Suspense>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Nuestras Marcas</h2>
          <BrandCircles brands={brands || []} />
        </section>

        <CategoryShowcase />

        <TestimonialSection />
      </main>
    </div>
  )
}
