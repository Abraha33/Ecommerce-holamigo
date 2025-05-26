"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()

      // Cargar búsquedas recientes del localStorage
      const savedSearches = localStorage.getItem("recentSearches")
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches))
      }
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    // Guardar en búsquedas recientes
    const updatedSearches = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5)
    setRecentSearches(updatedSearches)
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))

    // Navegar a resultados de búsqueda
    router.push(`/search?q=${encodeURIComponent(query)}`)
    onClose()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="p-4 border-b">
        <form onSubmit={handleSearch} className="flex items-center">
          <button type="button" onClick={onClose} className="mr-3">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full py-3 px-4 pr-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-colors"
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {recentSearches.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">Búsquedas recientes</h3>
              <button onClick={clearRecentSearches} className="text-xs text-blue-600">
                Borrar todo
              </button>
            </div>
            <ul className="space-y-2">
              {recentSearches.map((search, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      setQuery(search)
                      router.push(`/search?q=${encodeURIComponent(search)}`)
                      onClose()
                    }}
                    className="flex items-center text-gray-700 hover:text-blue-600 w-full text-left py-2"
                  >
                    <Search className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{search}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Aquí podrían ir categorías populares o sugerencias */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Categorías populares</h3>
          <div className="grid grid-cols-2 gap-2">
            {["Ofertas", "Lácteos", "Frutas", "Bebidas", "Limpieza", "Snacks"].map((category) => (
              <button
                key={category}
                onClick={() => {
                  router.push(`/categories/${category.toLowerCase()}`)
                  onClose()
                }}
                className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700 hover:bg-gray-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
