import Link from "next/link"
import Image from "next/image"
import { categoriesData } from "@/lib/categories-data"

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner promocional */}
      <div className="relative w-full h-[300px] mb-10 rounded-lg overflow-hidden">
        <Image src="/butcher-shop-sale.png" alt="Promoción especial" fill className="object-cover" />
        <div className="absolute inset-0 flex flex-col justify-center items-end pr-12">
          <h2 className="text-4xl font-bold text-gray-800 max-w-md mb-4">Precio especial en carne rojas y pollo</h2>
          <Link
            href="/categories/carnes"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-full text-lg"
          >
            ¡Compra ahora!
          </Link>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-8">Compra por categorías</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categoriesData.map((category) => (
          <Link key={category.slug} href={`/categories/${category.slug}`} className="flex flex-col items-center group">
            <div className="relative w-32 h-32 rounded-full bg-yellow-400 overflow-hidden mb-2 transition-transform group-hover:scale-105">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                fill
                className="object-contain p-2"
              />
            </div>
            <span className="text-center font-medium">{category.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
