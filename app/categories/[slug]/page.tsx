import { categoriesData } from "@/lib/categories-data"
import CategoryClientPage from "./CategoryClientPage"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return <CategoryClientPage params={params} />
}

// Generar rutas estáticas para todas las categorías disponibles
export function generateStaticParams() {
  return categoriesData.map((category) => ({
    slug: category.slug,
  }))
}
