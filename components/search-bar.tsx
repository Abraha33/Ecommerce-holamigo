"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"

// Datos de ejemplo para las sugerencias de búsqueda
const searchSuggestions = [
  {
    id: 1,
    name: "Eco Storage Container",
    category: "Kitchen & Storage",
    image: "/sustainable-kitchen-storage.png",
    url: "/products/eco-storage-container",
  },
  {
    id: 2,
    name: "Biodegradable Plant Pots",
    category: "Garden & Outdoor",
    image: "/seedling-nursery.png",
    url: "/products/biodegradable-plant-pots",
  },
  {
    id: 3,
    name: "Recycled Plastic Chairs",
    category: "Home Decor",
    image: "/colorful-recycled-chairs.png",
    url: "/products/recycled-plastic-chairs",
  },
  {
    id: 4,
    name: "Eco-Friendly Water Bottles",
    category: "Kitchen & Storage",
    image: "/sustainable-hydration.png",
    url: "/products/eco-friendly-water-bottles",
  },
  {
    id: 5,
    name: "Compostable Food Containers",
    category: "Kitchen & Storage",
    image: "/eco-friendly-food-display.png",
    url: "/products/compostable-food-containers",
  },
  {
    id: 6,
    name: "Reusable Shopping Bags",
    category: "Home Decor",
    image: "/search-suggestions/shopping-bags.png",
    url: "/products/reusable-shopping-bags",
  },
  {
    id: 7,
    name: "Bamboo Cutlery Set",
    category: "Kitchen & Storage",
    image: "/eco-friendly-bamboo-cutlery.png",
    url: "/products/bamboo-cutlery-set",
  },
  {
    id: 8,
    name: "Recycled Paper Notebooks",
    category: "Office Supplies",
    image: "/stack-of-recycled-notebooks.png",
    url: "/products/recycled-paper-notebooks",
  },
]

// Categorías populares para mostrar en las sugerencias
const popularCategories = [
  { name: "Insuperables", url: "/categories/insuperables" },
  { name: "Oferta Estrella", url: "/categories/oferta-estrella" },
  { name: "Lácteos", url: "/categories/lacteos" },
  { name: "Aseo", url: "/categories/aseo" },
]

interface SearchBarProps {
  placeholder?: string
  className?: string
  darkMode?: boolean
  onSearch?: (query: string) => void
}

export function SearchBar({
  placeholder = "¿Qué estás buscando?",
  className = "",
  darkMode = false,
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Filtrar sugerencias basadas en la consulta
  const filteredSuggestions = query
    ? searchSuggestions.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()),
      )
    : []

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches))
      } catch (e) {
        console.error("Error parsing recent searches:", e)
      }
    }
  }, [])

  // Manejar clics fuera del componente para cerrar las sugerencias
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Guardar búsqueda en el historial
  const saveSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return

    const updatedSearches = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5) // Mantener solo las 5 búsquedas más recientes

    setRecentSearches(updatedSearches)
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
  }

  // Manejar la búsqueda
  const handleSearch = () => {
    if (!query.trim()) return

    saveSearch(query)
    setShowSuggestions(false)

    if (onSearch) {
      onSearch(query)
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  // Manejar la selección de una sugerencia
  const handleSuggestionClick = (suggestion: (typeof searchSuggestions)[0]) => {
    saveSearch(suggestion.name)
    setShowSuggestions(false)
    router.push(suggestion.url)
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className={`w-full pr-10 ${
            darkMode
              ? "border-0 dark:bg-gray-800 dark:text-white"
              : "border-[#20509E] dark:border-gray-700 dark:bg-gray-800"
          } ${darkMode ? "rounded-md h-10" : "rounded-full"}`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch()
            }
          }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setShowSuggestions(false)
            }}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <Button
          onClick={handleSearch}
          className={`absolute right-0 top-0 h-full ${
            darkMode
              ? "bg-gray-300 hover:bg-gray-400 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-l-none rounded-r-md"
              : "bg-[#20509E] hover:bg-[#184589] text-white rounded-l-none rounded-full"
          }`}
          size="icon"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Panel de sugerencias */}
      {showSuggestions && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto">
          {/* Búsquedas recientes */}
          {recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Búsquedas recientes</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => {
                      setQuery(search)
                      handleSearch()
                    }}
                  >
                    <span>{search}</span>
                    <X
                      className="h-3 w-3 ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        const updatedSearches = recentSearches.filter((_, i) => i !== index)
                        setRecentSearches(updatedSearches)
                        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorías populares */}
          {!query && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Categorías populares</h3>
              <div className="grid grid-cols-2 gap-2">
                {popularCategories.map((category, index) => (
                  <Link
                    key={index}
                    href={category.url}
                    className="text-[#20509E] dark:text-blue-400 hover:underline text-sm"
                    onClick={() => setShowSuggestions(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Resultados de búsqueda */}
          {query && (
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {filteredSuggestions.length > 0
                  ? `Resultados para "${query}"`
                  : `No se encontraron resultados para "${query}"`}
              </h3>

              {filteredSuggestions.length > 0 ? (
                <div className="space-y-2">
                  {filteredSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600 flex-shrink-0">
                        <Image
                          src={suggestion.image || "/placeholder.svg"}
                          alt={suggestion.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{suggestion.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{suggestion.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-2 text-sm text-gray-500 dark:text-gray-400">
                  Prueba con otra búsqueda o explora nuestras categorías.
                </div>
              )}
            </div>
          )}

          {/* Ver todos los resultados */}
          {query && filteredSuggestions.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" className="w-full" onClick={handleSearch}>
                Ver todos los resultados
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
