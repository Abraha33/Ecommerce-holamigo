import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import type { Subcategory } from "@/lib/categories-data"

interface SubcategoryNavigationProps {
  categorySlug: string
  subcategories: Subcategory[]
}

export function SubcategoryNavigation({ categorySlug, subcategories }: SubcategoryNavigationProps) {
  if (!subcategories || subcategories.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Subcategorías</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {subcategories.map((subcategory) => (
          <Link key={subcategory.slug} href={`/categories/${categorySlug}/${subcategory.slug}`}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center">
                {subcategory.image && (
                  <div className="relative w-16 h-16 mr-4 rounded-md overflow-hidden">
                    <Image
                      src={subcategory.image || "/placeholder.svg"}
                      alt={subcategory.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{subcategory.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{subcategory.description}</p>
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
