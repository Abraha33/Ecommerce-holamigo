import { HomeHero } from "@/components/home-hero"
import { AboutUsSection } from "@/components/about-us-section"
import { MissionVisionSection } from "@/components/mission-vision-section"
import { CommunitySection } from "@/components/community-section"
import { BenefitsSection } from "@/components/benefits-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { BrandsSlider } from "@/components/brands-slider"
import { NewsletterSection } from "@/components/newsletter-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

// Hero slides data
const heroSlides = [
  {
    image: "/hero-slide-delivery.png",
    title: "Bienvenido a Nuestra Tienda Ecológica",
    description: "Descubre productos sostenibles y biodegradables para un futuro más verde. Entrega rápida y segura.",
    cta: "Explorar Tienda",
    ctaLink: "/tienda",
  },
  {
    image: "/hero-slide-organic.png",
    title: "100% Productos Orgánicos",
    description: "Cuida el planeta con nuestros productos ecológicos certificados. Calidad garantizada.",
    cta: "Ver Productos",
    ctaLink: "/shop",
  },
  {
    image: "/hero-slide-seasonal.png",
    title: "Ofertas de Temporada",
    description: "Aprovecha nuestras promociones especiales en productos ecológicos seleccionados.",
    cta: "Ver Ofertas",
    ctaLink: "/promos",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HomeHero slides={heroSlides} />

      {/* Discover Products Section - Enhanced */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 border border-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Descubre Nuestros Productos de Calidad
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto px-2 leading-relaxed">
              Explora nuestra amplia selección de productos de alta calidad a los mejores precios del mercado. Calidad
              garantizada y entrega rápida.
            </p>

            {/* Product Features Image */}
            <div className="mb-6 sm:mb-8 max-w-2xl mx-auto">
              <div className="relative h-32 sm:h-40 md:h-48 w-full rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/colorful-supermarket.png"
                  alt="Productos de calidad - Miles de productos, calidad premium y envío rápido"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="text-sm sm:text-base md:text-lg font-semibold">
                      Miles de Productos • Calidad Premium • Envío Rápido
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/shop">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg md:text-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                Ver Productos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <AboutUsSection />

      {/* Mission & Vision Section */}
      <MissionVisionSection />

      {/* Community Section */}
      <CommunitySection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Brands Slider */}
      <BrandsSlider />

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  )
}
