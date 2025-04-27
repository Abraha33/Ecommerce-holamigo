import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface CategoryBannerProps {
  title: string
  description?: string
  image: string
  breadcrumbs?: Array<{
    name: string
    href: string
  }>
}

export function CategoryBanner({ title, description, image, breadcrumbs }: CategoryBannerProps) {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Altura reducida a 120px */}
      <div className="relative h-[120px] w-full">
        <Image src={image || "/placeholder.svg"} alt={title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-center">
        <div className="container mx-auto px-4">
          {breadcrumbs && (
            <div className="flex items-center text-white/80 text-sm mb-1">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  <ChevronRight className="h-4 w-4 mx-1" />
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-white">{crumb.name}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-white">
                      {crumb.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
          {description && <p className="text-white/90 text-sm md:text-base mt-1 max-w-2xl">{description}</p>}
        </div>
      </div>
    </div>
  )
}
