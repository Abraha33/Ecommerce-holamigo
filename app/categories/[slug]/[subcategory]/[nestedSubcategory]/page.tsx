import { CategoryBanner } from "@/components/category-banner"
import { ProductGrid } from "@/components/product-grid"
import { products } from "@/lib/products"
import { notFound } from "next/navigation"
import { CategoryBreadcrumb } from "@/components/category-breadcrumb"
import { ProductFilters } from "@/components/product-filters"
import { getCategoryBySlug, getSubcategoryBySlug, getNestedSubcategoryBySlug } from "@/lib/categories-data"

export default function NestedSubcategoryPage({
  params,
}: {
  params: {
    slug: string
    subcategory: string
    nestedSubcategory: string
  }
}) {
  const category = getCategoryBySlug(params.slug)
  const subcategory = getSubcategoryBySlug(params.slug, params.subcategory)
  const nestedSubcategory = getNestedSubcategoryBySlug(params.slug, params.subcategory, params.nestedSubcategory)

  if (!category || !subcategory || !nestedSubcategory) {
    notFound()
  }

  // Filtrar productos para esta subcategoría anidada (simulado)
  // En una aplicación real, esto vendría de una API o base de datos
  const nestedSubcategoryProducts = products.slice(0, 4)

  return (
    <div>
      <CategoryBanner
        title={nestedSubcategory.title}
        description={nestedSubcategory.description}
        image={nestedSubcategory.image || subcategory.image || category.image}
        breadcrumbs={[
          { name: "Inicio", href: "/" },
          { name: "Categorías", href: "/categories" },
          { name: category.title, href: `/categories/${category.slug}` },
          { name: subcategory.title, href: `/categories/${category.slug}/${subcategory.slug}` },
          {
            name: nestedSubcategory.title,
            href: `/categories/${category.slug}/${subcategory.slug}/${nestedSubcategory.slug}`,
          },
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        <CategoryBreadcrumb
          items={[
            { name: "Categorías", href: "/categories" },
            { name: category.title, href: `/categories/${category.slug}` },
            { name: subcategory.title, href: `/categories/${category.slug}/${subcategory.slug}` },
            {
              name: nestedSubcategory.title,
              href: `/categories/${category.slug}/${subcategory.slug}/${nestedSubcategory.slug}`,
              active: true,
            },
          ]}
        />

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <ProductFilters />
          </div>

          <div className="w-full md:w-3/4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{nestedSubcategory.title}</h1>
              <p className="text-gray-600">{nestedSubcategory.description}</p>
            </div>

            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">Mostrando {nestedSubcategoryProducts.length} productos</div>
              <select className="border rounded p-2 text-sm">
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name-asc">Nombre: A-Z</option>
                <option value="name-desc">Nombre: Z-A</option>
              </select>
            </div>

            <ProductGrid products={nestedSubcategoryProducts} />
          </div>
        </div>
      </div>
    </div>
  )
}
