"use client"

import Link from "next/link"
import { categoriesData } from "@/lib/categories-data"
import { OptimizedImage } from "@/components/optimized-image"
import { useState, useEffect } from "react"

export default function CategoriesPage() {
  // Estado para implementar carga progresiva de categorías
  const [visibleCategories, setVisibleCategories] = useState(8)
  const [isLoading, setIsLoading] = useState(true)

  // Simular tiempo de carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Función para cargar más categorías cuando se hace scroll
  const loadMoreCategories = () => {
    setVisibleCategories((prev) => Math.min(prev + 8, categoriesData.length))
  }

  // Detectar scroll para cargar más categorías
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMoreCategories()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Categorías</h1>

      {isLoading ? (
        // Skeleton loader mientras se carga
        <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 bg-white rounded-lg sm:rounded-xl shadow-sm py-4 sm:py-6 px-3 sm:px-4 overflow-hidden my-4 sm:my-6 md:my-8">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="relative h-20 sm:h-32 md:h-40 lg:h-48 w-full bg-gray-200"></div>
                <div className="p-2 sm:p-3 md:p-4">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 bg-white rounded-lg sm:rounded-xl shadow-sm py-4 sm:py-6 px-3 sm:px-4 overflow-hidden my-4 sm:my-6 md:my-8">
          {categoriesData.slice(0, visibleCategories).map((category, index) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: "fadeIn 0.5s ease forwards",
              }}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-200">
                <div className="relative h-20 sm:h-32 md:h-40 lg:h-48 w-full">
                  <OptimizedImage
                    src={category.image || `/placeholder.svg?height=300&width=500&query=${category.title}`}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    containerWidth="quarter"
                    lowQualityPlaceholder={true}
                    fadeIn={true}
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 33vw, 25vw"
                    priority={index < 4} // Cargar con prioridad solo las primeras 4 imágenes
                  />
                </div>
                <div className="p-2 sm:p-3 md:p-4">
                  <h2 className="text-xs sm:text-sm md:text-lg lg:text-xl font-semibold tracking-tight truncate text-[#004a93] group-hover:underline">
                    {category.title}
                  </h2>
                  <p className="hidden sm:block text-gray-600 mt-2 text-sm line-clamp-2">{category.description}</p>

                  {category.subcategories && (
                    <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs md:text-sm text-[#004a93] flex items-center">
                      <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#004a93] mr-1"></span>
                      {category.subcategories.length} subcategorías
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Indicador de carga para más categorías */}
      {!isLoading && visibleCategories < categoriesData.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreCategories}
            className="px-4 py-2 bg-[#004a93] text-white rounded-md hover:bg-[#003a73] transition-colors"
          >
            Cargar más categorías
          </button>
        </div>
      )}

      {/* Estilos para la animación de fade-in */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
