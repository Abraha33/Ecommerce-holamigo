import { CategoryBanner } from "@/components/category-banner"
import { CategoryCircles } from "@/components/category-circles"

const categories = [
  {
    id: "insuperables",
    name: "Insuperables",
    image: "/categories/insuperables.png",
    href: "/categories/insuperables",
  },
  {
    id: "oferta-estrella",
    name: "Oferta Estrella",
    image: "/categories/oferta-estrella.png",
    href: "/categories/oferta-estrella",
  },
  {
    id: "lacteos",
    name: "Lácteos",
    image: "/categories/lacteos.png",
    href: "/categories/lacteos",
  },
  {
    id: "aseo",
    name: "Aseo",
    image: "/categories/aseo.png",
    href: "/categories/aseo",
  },
  {
    id: "licores",
    name: "Licores",
    image: "/categories/licores.png",
    href: "/categories/licores",
  },
  {
    id: "cosmeticos",
    name: "Cosméticos",
    image: "/categories/cosmeticos.png",
    href: "/categories/cosmeticos",
  },
  {
    id: "bebidas",
    name: "Bebidas",
    image: "/categories/bebidas.png",
    href: "/categories/bebidas",
  },
  {
    id: "frutas-verduras",
    name: "Frutas y Verduras",
    image: "/categories/frutas-verduras.png",
    href: "/categories/frutas-verduras",
  },
  {
    id: "carnes",
    name: "Carnes",
    image: "/categories/carnes.png",
    href: "/categories/carnes",
  },
  {
    id: "delicatessen",
    name: "Delicatessen",
    image: "/categories/delicatessen.png",
    href: "/categories/delicatessen",
  },
  {
    id: "snack",
    name: "Snack",
    image: "/categories/snack.png",
    href: "/categories/snack",
  },
  {
    id: "bebidas-hidratantes",
    name: "Bebidas Hidratantes",
    image: "/categories/bebidas-hidratantes.png",
    href: "/categories/bebidas-hidratantes",
  },
]

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
        <CategoryCircles categories={categories} />
      </div>
    </div>
  )
}
