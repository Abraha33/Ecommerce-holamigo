import Link from "next/link"
import Image from "next/image"

interface CategoryItem {
  id: string
  name: string
  image: string
  href: string
}

interface CategoryCirclesProps {
  title?: string
  categories: CategoryItem[]
}

export function CategoryCircles({ title = "Compra por categorías", categories }: CategoryCirclesProps) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={category.href} className="flex flex-col items-center group">
              <div className="relative w-32 h-32 rounded-full bg-[#ffff1a] overflow-hidden mb-2 transition-transform group-hover:scale-105">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <span className="text-center font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
