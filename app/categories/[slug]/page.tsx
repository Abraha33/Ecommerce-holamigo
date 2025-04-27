import { CategoryBanner } from "@/components/category-banner"
import { ProductGrid } from "@/components/product-grid"
import { products } from "@/lib/products"
import { notFound } from "next/navigation"

// Datos de ejemplo para las categorías
const categories = [
  {
    slug: "kitchen-storage",
    title: "Kitchen & Storage",
    description: "Eco-friendly containers and kitchen essentials for a sustainable home",
    image: "/sustainable-kitchen-banner.png",
  },
  {
    slug: "garden-outdoor",
    title: "Garden & Outdoor",
    description: "Sustainable solutions for your garden and outdoor spaces",
    image: "/lush-eco-garden-banner.png",
  },
  {
    slug: "home-decor",
    title: "Home Decor",
    description: "Beautiful and sustainable home accessories to enhance your living space",
    image: "/placeholder.svg?height=400&width=1200&query=eco+home+decor+banner",
  },
]

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((cat) => cat.slug === params.slug)

  if (!category) {
    notFound()
  }

  // Filtrar productos para esta categoría (simulado)
  const categoryProducts = products.slice(0, 8)

  return (
    <div>
      <CategoryBanner
        title={category.title}
        description={category.description}
        image={category.image}
        breadcrumbs={[
          { name: "Categories", href: "/categories" },
          { name: category.title, href: `/categories/${category.slug}` },
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Filter Products</h2>
          <div className="flex flex-wrap gap-2">
            <div className="border rounded-full px-4 py-1 text-sm bg-white">All Products</div>
            <div className="border rounded-full px-4 py-1 text-sm">New Arrivals</div>
            <div className="border rounded-full px-4 py-1 text-sm">Best Sellers</div>
            <div className="border rounded-full px-4 py-1 text-sm">On Sale</div>
          </div>
        </div>

        <ProductGrid products={categoryProducts} />
      </div>
    </div>
  )
}
