import { CategoryBanner } from "@/components/category-banner"
import { categoriesData } from "@/lib/categories-data"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { CategoryBreadcrumb } from "@/components/category-breadcrumb"

export default function CategoriesPage() {
  return (
    <div>
      <CategoryBanner
        title="Categorías de Productos"
        description="Explora nuestra colección completa de productos por categoría"
        image="/placeholder.svg?height=400&width=1200&query=eco+friendly+products+categories+banner"
        breadcrumbs={[{ name: "Categorías", href: "/categories" }]}
      />

      <div className="container mx-auto px-4 py-8">
        <CategoryBreadcrumb items={[{ name: "Categorías", href: "/categories", active: true }]} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {categoriesData.map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h2 className="text-xl font-bold text-white">{category.title}</h2>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-gray-600 mb-4 line-clamp-2">{category.description}</p>

                  {category.subcategories && category.subcategories.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Subcategorías:</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {category.subcategories.slice(0, 3).map((subcategory) => (
                          <li key={subcategory.slug} className="flex items-center">
                            <ChevronRight className="h-3 w-3 mr-1 text-gray-400" />
                            {subcategory.title}
                          </li>
                        ))}
                        {category.subcategories.length > 3 && (
                          <li className="text-[#20509E] font-medium">+ {category.subcategories.length - 3} más...</li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
