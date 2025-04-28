import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getCategoryBySlug } from "@/lib/categories-data"
import { ProductGrid } from "@/components/product-grid"
import { products } from "@/lib/products"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug)

  if (!category) {
    notFound()
  }

  // Filtrar productos para esta categoría (simulado)
  const categoryProducts = products.slice(0, 8)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner de categoría */}
      <div className="relative w-full h-[200px] mb-8 rounded-lg overflow-hidden">
        <Image src={category.image || "/placeholder.svg"} alt={category.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="px-8">
            <h1 className="text-3xl font-bold text-white mb-2">{category.title}</h1>
            <p className="text-white/80 max-w-md">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Navegación de migas de pan */}
      <div className="flex items-center text-sm mb-6">
        <Link href="/" className="text-gray-500 hover:text-gray-700">
          Inicio
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link href="/categories" className="text-gray-500 hover:text-gray-700">
          Categorías
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-gray-900">{category.title}</span>
      </div>

      {/* Subcategorías con el mismo estilo de círculos */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">Subcategorías de {category.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {category.subcategories.map((subcategory) => (
              <Link
                key={subcategory.slug}
                href={`/categories/${category.slug}/${subcategory.slug}`}
                className="flex flex-col items-center group"
              >
                <div className="relative w-28 h-28 rounded-full bg-yellow-400 overflow-hidden mb-2 transition-transform group-hover:scale-105">
                  <Image
                    src={subcategory.image || `/placeholder.svg?height=200&width=200&query=${subcategory.title}`}
                    alt={subcategory.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <span className="text-center font-medium">{subcategory.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Productos de la categoría */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Productos destacados</h2>
        <ProductGrid products={categoryProducts} />
      </div>
    </div>
  )
}
