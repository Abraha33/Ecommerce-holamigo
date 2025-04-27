import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const categories = [
  {
    id: 1,
    name: "Kitchen & Storage",
    description: "Eco-friendly containers and kitchen essentials",
    image: "/placeholder.svg?height=400&width=600&query=eco+kitchen+storage",
    href: "/categories/kitchen-storage",
  },
  {
    id: 2,
    name: "Garden & Outdoor",
    description: "Sustainable solutions for your garden",
    image: "/placeholder.svg?height=400&width=600&query=eco+garden+products",
    href: "/categories/garden-outdoor",
  },
  {
    id: 3,
    name: "Home Decor",
    description: "Beautiful and sustainable home accessories",
    image: "/placeholder.svg?height=400&width=600&query=eco+home+decor",
    href: "/categories/home-decor",
  },
]

export function CategoryShowcase() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group relative overflow-hidden rounded-lg">
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-white/80 mb-4">{category.description}</p>
                <Button asChild>
                  <Link href={category.href}>Explore</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
