import Link from "next/link"
import Image from "next/image"
import { categoriesData } from "@/lib/categories-data"

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Categorías</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoriesData.map((category) => (
          <Link key={category.slug} href={`/categories/${category.slug}`} className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-200">
              <div className="relative h-48 w-full">
                <Image
                  src={category.image || `/placeholder.svg?height=300&width=500&query=${category.title}`}
                  alt={category.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-[#004a93] group-hover:underline">{category.title}</h2>
                <p className="text-gray-600 mt-2">{category.description}</p>

                {category.subcategories && (
                  <div className="mt-2 text-sm text-[#004a93]">{category.subcategories.length} subcategorías</div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
