import { CategoryNavigation } from "@/components/category-navigation"

// Define subcategoryCircles (replace with your actual data)
const subcategoryCircles = [
  { name: "Subcategory 1", href: "/subcategory1" },
  { name: "Subcategory 2", href: "/subcategory2" },
  { name: "Subcategory 3", href: "/subcategory3" },
]

const UltimasUnidadesPage = () => {
  return (
    <div>
      {/* Banner principal (replace with your actual banner component) */}
      <div className="bg-gray-100 py-20 text-center">
        <h1 className="text-4xl font-bold">Últimas Unidades</h1>
        <p className="mt-4">No te pierdas estas ofertas exclusivas.</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navegación de subcategorías con círculos - Similar a shop */}
        <div className="my-6 overflow-hidden">
          <div className="w-full max-w-[1600px] mx-auto">
            <CategoryNavigation categories={subcategoryCircles} />
          </div>
        </div>

        {/* Resto del contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Example product cards (replace with your actual product data) */}
          <div className="border p-4">
            <h3>Product 1</h3>
            <p>Description of product 1.</p>
          </div>
          <div className="border p-4">
            <h3>Product 2</h3>
            <p>Description of product 2.</p>
          </div>
          <div className="border p-4">
            <h3>Product 3</h3>
            <p>Description of product 3.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UltimasUnidadesPage
