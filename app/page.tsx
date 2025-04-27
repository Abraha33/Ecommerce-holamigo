import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { CategoryShowcase } from "@/components/category-showcase"
import { TestimonialSection } from "@/components/testimonial-section"
import { NewsletterSection } from "@/components/newsletter-section"

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-8">
      <HeroSection />
      <FeaturedProducts />
      <CategoryShowcase />
      <TestimonialSection />
      <NewsletterSection />
    </div>
  )
}
