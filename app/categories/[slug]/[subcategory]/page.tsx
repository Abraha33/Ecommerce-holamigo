import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getCategoryBySlug, getSubcategoryBySlug } from "@/lib/categories-data"
import { ProductGrid } from "@/components/product-grid"
import { products } from "@/lib/products"
import { ChevronRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
        <Link href={`/categories/${category.slug}`} className="text-gray-500 hover:text-gray-700">
          {category.title}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-gray-900">{subcategory.title}</span>
      </div>

      {/* Banner de subcategoría */}
      <div className="relative w-full h-[200px] mb-8 rounded-lg overflow-hidden">
        <Image
          src={subcategory.image || `/placeholder.svg?height=400&width=1200&query=${subcategory.title}`}
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

      {/* Botón para volver a la categoría */}
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/categories/${category.slug}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a {category.title}
          </Link>
        </Button>
      </div>

      {/* Subcategorías anidadas si existen */}
      {subcategory.nestedSubcategories && subcategory.nestedSubcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Subcategorías de {subcategory.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {subcategory.nestedSubcategories.map((nestedSubcategory) => (
              <Link
                key={nestedSubcategory.slug}
                href={`/categories/${category.slug}/${subcategory.slug}/${nestedSubcategory.slug}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium group-hover:text-[#004a93]">{nestedSubcategory.title}</h3>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#004a93]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Productos de la subcategoría */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Productos</h2>
          <Badge variant="outline" className="px-3 py-1">
            {subcategoryProducts.length} productos
          </Badge>
        </div>
        <ProductGrid products={subcategoryProducts} />
      </div>
    </div>
  )
}
