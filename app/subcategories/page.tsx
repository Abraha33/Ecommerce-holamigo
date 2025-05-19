import { Suspense } from "react"
import { createServerComponentClient } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"

export default async function SubcategoriesPage() {
  const supabase = createServerComponentClient()

  // Fetch all subcategories
  const { data: subcategories } = await supabase
    .from("subcategories")
    .select("*, category:categories(name, slug)")
    .order("display_order", { ascending: true })
    .eq("is_active", true)

  // Group subcategories by parent category
  const groupedSubcategories: Record<string, any[]> = {}

  subcategories?.forEach((subcategory) => {
    const categoryName = subcategory.category?.name || "Otras"
    const categorySlug = subcategory.category?.slug || "otras"

    if (!groupedSubcategories[categorySlug]) {
      groupedSubcategories[categorySlug] = {
        name: categoryName,
        slug: categorySlug,
        subcategories: [],
      }
    }

    groupedSubcategories[categorySlug].subcategories.push(subcategory)
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Subcategorías", href: "/subcategories" },
        ]}
      />

      <h1 className="text-3xl font-bold mb-8 mt-4">Todas las Subcategorías</h1>

      <Suspense fallback={<div>Cargando subcategorías...</div>}>
        <div className="space-y-12">
          {Object.values(groupedSubcategories).map((group: any) => (
            <div key={group.slug} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{group.name}</h2>
                <Link
                  href={`/categories/${group.slug}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Ver categoría completa
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {group.subcategories.map((subcategory: any) => (
                  <Link
                    key={subcategory.id}
                    href={`/categories/${group.slug}/${subcategory.slug}`}
                    className="transition-transform duration-200 hover:scale-105"
                  >
                    <Card className="overflow-hidden h-full border-none shadow-md hover:shadow-lg">
                      <div className="relative h-40 bg-gray-100">
                        <Image
                          src={subcategory.image_url || `/subcategories/${subcategory.slug}.png`}
                          alt={subcategory.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image doesn't exist
                            ;(e.target as HTMLImageElement).src =
                              `/placeholder.svg?height=160&width=320&query=${subcategory.name}`
                          }}
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-center">{subcategory.name}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Suspense>
    </div>
  )
}
