import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import type { NestedSubcategory } from "@/lib/categories-data"

interface NestedSubcategoryNavigationProps {
  categorySlug: string
  subcategorySlug: string
  nestedSubcategories: NestedSubcategory[]
}

export function NestedSubcategoryNavigation({
  categorySlug,
  subcategorySlug,
  nestedSubcategories,
}: NestedSubcategoryNavigationProps) {
  if (!nestedSubcategories || nestedSubcategories.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Subcategorías</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {nestedSubcategories.map((nestedSubcategory) => (
          <Link
            key={nestedSubcategory.slug}
            href={`/categories/${categorySlug}/${subcategorySlug}/${nestedSubcategory.slug}`}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center">
                <div className="flex-1">
                  <h3 className="font-medium">{nestedSubcategory.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{nestedSubcategory.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
