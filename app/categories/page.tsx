import { CategoryBanner } from "@/components/category-banner"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    id: 1,
    name: "Kitchen & Storage",
    description: "Eco-friendly containers and kitchen essentials",
    image: "/sustainable-pantry-organization.png",
    href: "/categories/kitchen-storage",
    productCount: 24,
  },
  {
    id: 2,
    name: "Garden & Outdoor",
    description: "Sustainable solutions for your garden",
    image: "/thriving-eco-garden.png",
    href: "/categories/garden-outdoor",
    productCount: 18,
  },
  {
    id: 3,
    name: "Home Decor",
    description: "Beautiful and sustainable home accessories",
    image: "/sustainable-living-room.png",
    href: "/categories/home-decor",
    productCount: 32,
  },
  {
    id: 4,
    name: "Office Supplies",
    description: "Eco-conscious products for your workspace",
    image: "/placeholder.svg?height=400&width=600&query=eco+office+supplies",
    href: "/categories/office-supplies",
    productCount: 15,
  },
  {
    id: 5,
    name: "Bathroom",
    description: "Sustainable bathroom essentials",
    image: "/placeholder.svg?height=400&width=600&query=eco+bathroom+products",
    href: "/categories/bathroom",
    productCount: 21,
  },
  {
    id: 6,
    name: "Kids & Toys",
    description: "Safe and sustainable products for children",
    image: "/placeholder.svg?height=400&width=600&query=eco+kids+toys",
    href: "/categories/kids-toys",
    productCount: 19,
  },
]

export default function CategoriesPage() {
  return (
    <div>
      <CategoryBanner
        title="Product Categories"
        description="Browse our complete collection of sustainable products by category"
        image="/placeholder.svg?height=400&width=1200&query=eco+friendly+products+categories+banner"
        breadcrumbs={[{ name: "Categories", href: "/categories" }]}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={category.href}>
              <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                  <div className="mt-2 text-sm text-gray-500">{category.productCount} products</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
