import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getCategoryBySlug } from "@/lib/categories-data"
import { ChevronRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AllSubcategoriesPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug)

  if (!category || !category.subcategories) {
    notFound()
  }

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
        <span className="font-medium text-gray-900">Todas las subcategorías</span>
      </div>

      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Subcategorías de {category.title}</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/categories/${category.slug}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a {category.title}
          </Link>
        </Button>
      </div>

      {/* Grid de todas las subcategorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.subcategories.map((subcategory) => (
          <Link key={subcategory.slug} href={`/categories/${category.slug}/${subcategory.slug}`} className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-200">
              <div className="relative h-48 w-full">
                <Image
                  src={subcategory.image || `/placeholder.svg?height=300&width=500&query=${subcategory.title}`}
                  alt={subcategory.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-[#004a93] group-hover:underline">{subcategory.title}</h3>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#004a93] transition-colors" />
                </div>
                <p className="text-sm text-gray-600 mt-1">{subcategory.description}</p>

                {/* Mostrar conteo de subcategorías anidadas si existen */}
                {subcategory.nestedSubcategories && subcategory.nestedSubcategories.length > 0 && (
                  <div className="mt-2 text-sm text-[#004a93]">
                    {subcategory.nestedSubcategories.length} subcategorías
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
