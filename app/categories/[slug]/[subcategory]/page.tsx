import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getCategoryBySlug, getSubcategoryBySlug } from "@/lib/categories-data"
import { ProductGrid } from "@/components/product-grid"
import { products } from "@/lib/products"

export default function SubcategoryPage({ params }: { params: { slug: string; subcategory: string } }) {
  const category = getCategoryBySlug(params.slug)
  const subcategory = category ? getSubcategoryBySlug(params.slug, params.subcategory) : undefined

  if (!category || !subcategory) {
    notFound()
  }

  // Filtrar productos para esta subcategoría (simulado)
  const subcategoryProducts = products.slice(0, 12)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner de subcategoría */}
      <div className="relative w-full h-[180px] mb-8 rounded-lg overflow-hidden">
        <Image
          src={subcategory.image || `/placeholder.svg?height=180&width=1200&query=${subcategory.title}`}
          alt={subcategory.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="px-8">
            <h1 className="text-3xl font-bold text-white mb-2">{subcategory.title}</h1>
            <p className="text-white/80 max-w-md">{subcategory.description}</p>
          </div>
        </div>
      </div>

      {/* Navegación de migas de pan */}
      <div className="flex items-center text-sm mb-6 flex-wrap">
        <Link href="/" className="text-gray-500 hover:text-gray-700">
          Inicio
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link href="/categories" className="text-gray-500 hover:text-gray-700">
          Categorías
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link href={`/categories/${category.slug}`} className="text-gray-500 hover:text-gray-700">
          {category.title}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-gray-900">{subcategory.title}</span>
      </div>

      {/* Subcategorías anidadas con el mismo estilo de círculos */}
      {subcategory.nestedSubcategories && subcategory.nestedSubcategories.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">Tipos de {subcategory.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {subcategory.nestedSubcategories.map((nestedSubcategory) => (
              <Link
                key={nestedSubcategory.slug}
                href={`/categories/${category.slug}/${subcategory.slug}/${nestedSubcategory.slug}`}
                className="flex flex-col items-center group"
              >
                <div className="relative w-24 h-24 rounded-full bg-yellow-400 overflow-hidden mb-2 transition-transform group-hover:scale-105">
                  <Image
                    src={
                      nestedSubcategory.image ||
                      `/placeholder.svg?height=150&width=150&query=${nestedSubcategory.title}`
                    }
                    alt={nestedSubcategory.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <span className="text-center font-medium">{nestedSubcategory.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Productos de la subcategoría */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Productos de {subcategory.title}</h2>
        <ProductGrid products={subcategoryProducts} />
      </div>
    </div>
  )
}
