import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getCategoryBySlug, getSubcategoryBySlug, getNestedSubcategoryBySlug } from "@/lib/categories-data"
import { ProductGrid } from "@/components/product-grid"
import { products } from "@/lib/products"

export default function NestedSubcategoryPage({
  params,
}: {
  params: { slug: string; subcategory: string; nestedSubcategory: string }
}) {
  const category = getCategoryBySlug(params.slug)
  const subcategory = category ? getSubcategoryBySlug(params.slug, params.subcategory) : undefined
  const nestedSubcategory = subcategory
    ? getNestedSubcategoryBySlug(params.slug, params.subcategory, params.nestedSubcategory)
    : undefined

  if (!category || !subcategory || !nestedSubcategory) {
    notFound()
  }

  // Filtrar productos para esta subcategoría anidada (simulado)
  const nestedSubcategoryProducts = products.slice(0, 16)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner de subcategoría anidada */}
      <div className="relative w-full h-[160px] mb-8 rounded-lg overflow-hidden">
        <Image
          src={nestedSubcategory.image || `/placeholder.svg?height=160&width=1200&query=${nestedSubcategory.title}`}
          alt={nestedSubcategory.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="px-8">
            <h1 className="text-3xl font-bold text-white mb-2">{nestedSubcategory.title}</h1>
            <p className="text-white/80 max-w-md">{nestedSubcategory.description}</p>
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
        <Link href={`/categories/${category.slug}/${subcategory.slug}`} className="text-gray-500 hover:text-gray-700">
          {subcategory.title}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium text-gray-900">{nestedSubcategory.title}</span>
      </div>

      {/* Productos de la subcategoría anidada */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Productos de {nestedSubcategory.title}</h2>
        <ProductGrid products={nestedSubcategoryProducts} />
      </div>
    </div>
  )
}
