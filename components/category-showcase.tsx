import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const categories = [
  {
    id: 1,
    name: "Kitchen & Storage",
    description: "Eco-friendly containers and kitchen essentials",
    image: "/sustainable-pantry-organization.png",
    href: "/categories/kitchen-storage",
  },
  {
    id: 2,
    name: "Garden & Outdoor",
    description: "Sustainable solutions for your garden",
    image: "/thriving-eco-garden.png",
    href: "/categories/garden-outdoor",
  },
  {
    id: 3,
    name: "Home Decor",
    description: "Beautiful and sustainable home accessories",
    image: "/sustainable-living-room.png",
    href: "/categories/home-decor",
  },
]

export function CategoryShowcase() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Shop by Category</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="group relative overflow-hidden rounded-lg">
              {/* Reducimos la altura de 80 a 60 */}
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-semibold text-white mb-1">{category.name}</h3>
                <p className="text-white/80 mb-3 text-sm">{category.description}</p>
                <Button asChild size="sm">
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
