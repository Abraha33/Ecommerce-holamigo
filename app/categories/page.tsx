import Link from "next/link"
import Image from "next/image"
import { categoriesData } from "@/lib/categories-data"

export default function CategoriesPage() {
  // Crear un array de categorías con suficientes elementos, usando placeholders si es necesario
  const extendedCategories = [...categoriesData]

  // Asegurarse de que hay suficientes categorías para el layout
  while (extendedCategories.length < 17) {
    const index = extendedCategories.length
    extendedCategories.push({
      slug: `placeholder-${index}`,
      title: `Categoría ${index + 1}`,
      description: "Categoría placeholder",
      image: "/abstract-categories.png",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Compra por categorías</h1>

      <div className="grid grid-cols-5 grid-rows-6 gap-3">
        {/* Primera fila - elemento que ocupa todo el ancho */}
        <div className="col-span-5">
          <Link href={`/categories/${extendedCategories[0].slug}`} className="flex flex-col items-center group">
            <div className="relative w-full h-40 bg-yellow-400 overflow-hidden rounded-lg transition-transform group-hover:scale-105">
              <Image
                src={extendedCategories[0].image || "/placeholder.svg?height=400&width=1200&query=category"}
                alt={extendedCategories[0].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{extendedCategories[0].title}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Segunda fila - 5 elementos */}
        {extendedCategories.slice(1, 6).map((category, index) => (
          <div key={category.slug} className="row-start-2">
            <Link href={`/categories/${category.slug}`} className="flex flex-col items-center group">
              <div className="relative w-full aspect-square bg-yellow-400 overflow-hidden rounded-lg transition-transform group-hover:scale-105">
                <Image
                  src={category.image || "/placeholder.svg?height=200&width=200&query=category"}
                  alt={category.title}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <span className="text-center font-medium mt-2">{category.title}</span>
            </Link>
          </div>
        ))}

        {/* Tercera fila - primer elemento sin posición específica */}
        <div>
          <Link href={`/categories/${extendedCategories[6].slug}`} className="flex flex-col items-center group">
            <div className="relative w-full aspect-square bg-yellow-400 overflow-hidden rounded-lg transition-transform group-hover:scale-105">
              <Image
                src={extendedCategories[6].image || "/placeholder.svg?height=200&width=200&query=category"}
                alt={extendedCategories[6].title}
                fill
                className="object-contain p-2"
              />
            </div>
            <span className="text-center font-medium mt-2">{extendedCategories[6].title}</span>
          </Link>
        </div>

        {/* Tercera fila - 4 elementos más */}
        {extendedCategories.slice(7, 11).map((category, index) => (
          <div key={category.slug} className="row-start-3">
            <Link href={`/categories/${category.slug}`} className="flex flex-col items-center group">
              <div className="relative w-full aspect-square bg-yellow-400 overflow-hidden rounded-lg transition-transform group-hover:scale-105">
                <Image
                  src={category.image || "/placeholder.svg?height=200&width=200&query=category"}
                  alt={category.title}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <span className="text-center font-medium mt-2">{category.title}</span>
            </Link>
          </div>
        ))}

        {/* Cuarta fila - elemento que ocupa 2 columnas */}
        <div className="col-span-2">
          <Link href={`/categories/${extendedCategories[11].slug}`} className="flex flex-col items-center group">
            <div className="relative w-full h-32 bg-yellow-400 overflow-hidden rounded-lg transition-transform group-hover:scale-105">
              <Image
                src={extendedCategories[11].image || "/placeholder.svg?height=200&width=400&query=category"}
                alt={extendedCategories[11].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <span className="text-white text-xl font-bold">{extendedCategories[11].title}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Cuarta fila - elemento que ocupa 2 columnas empezando en la columna 4 */}
        <div className="col-span-2 col-start-4 row-start-4">
          <Link href={`/categories/${extendedCategories[12].slug}`} className="flex flex-col items-center group">
            <div className="relative w-full h-32 bg-yellow-400 overflow-hidden rounded-lg transition-transform group-hover:scale-105">
              <Image
                src={extendedCategories[12].image || "/placeholder.svg?height=200&width=400&query=category"}
                alt={extendedCategories[12].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <span className="text-white text-xl font-bold">{extendedCategories[12].title}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quinta y sexta filas - elementos que ocupan 2 filas */}
        <div className="col-span-2 row-span-2 row-start-5">
          <Link href={`/categories/${extendedCategories[13].slug}`} className="flex flex-col items-center group h-full">
            <div className="relative w-full h-full bg-yellow-400 overflow-hidden rounded-lg transition-transform group-hover:scale-105">
              <Image
                src={extendedCategories[13].image || "/placeholder.svg?height=400&width=400&query=category"}
                alt={extendedCategories[13].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <span className="text-white text-xl font-bold">{extendedCategories[13].title}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Elementos individuales que ocupan 2 filas cada uno */}
        {[14, 15, 16].map((index) => {
          const category = extendedCategories[index]
          return (
            <div key={category.slug} className={`row-span-2 col-start-${index - 11} row-start-5`}>
              <Link href={`/categories/${category.slug}`} className="flex flex-col items-center group h-full">
                <div className="relative w-full h-full bg-yellow-400 overflow-hidden rounded-lg transition-transform group-hover:scale-105">
                  <Image
                    src={category.image || "/placeholder.svg?height=400&width=200&query=category"}
                    alt={category.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">{category.title}</span>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
