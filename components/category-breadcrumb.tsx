import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  name: string
  href: string
  active?: boolean
}

interface CategoryBreadcrumbProps {
  items: BreadcrumbItem[]
}

export function CategoryBreadcrumb({ items }: CategoryBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link href="/" className="text-gray-500 hover:text-[#20509E]">
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            {item.active ? (
              <span className="text-[#20509E] font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link href={item.href} className="text-gray-500 hover:text-[#20509E]">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
