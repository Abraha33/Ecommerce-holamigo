"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Breadcrumb } from "@/components/breadcrumb"
import { SearchBar } from "@/components/search-bar"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"
import { Button } from "@/components/ui/button"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortOption, setSortOption] = useState("relevance")

  useEffect(() => {
    if (query) {
      // Filtrar productos basados en la consulta
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(query.toLowerCase())),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts([])
    }
  }, [query])

  // Ordenar productos según la opción seleccionada
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      default:
        return 0 // relevance - mantener orden original
    }
  })

  return (
    <div className="container px-4 py-8 mx-auto">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Búsqueda", href: "/search", active: true },
        ]}
      />

      <div className="my-6">
        <h1 className="text-2xl font-bold mb-4">Resultados de búsqueda</h1>
        <SearchBar placeholder="Buscar en envax.com" className="max-w-2xl" />
      </div>

      {query ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {sortedProducts.length} resultados para "{query}"
            </p>

            <div className="flex items-center gap-4">
              {/* Solo mantener el selector de ordenamiento */}
              <select
                className="border rounded p-2 text-sm"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="relevance">Relevancia</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name-asc">Nombre: A-Z</option>
                <option value="name-desc">Nombre: Z-A</option>
              </select>
            </div>
          </div>

          {sortedProducts.length > 0 ? (
            <div className="product-grid">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No se encontraron resultados</h2>
              <p className="text-gray-600 mb-6">
                No encontramos productos que coincidan con "{query}". Intenta con otra búsqueda o explora nuestras
                categorías.
              </p>
              <Button asChild>
                <a href="/categories">Ver categorías</a>
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Busca productos</h2>
          <p className="text-gray-600 mb-6">Escribe en la barra de búsqueda para encontrar productos</p>
        </div>
      )}
      {/* Add styles for product grid */}
      <style jsx global>{`
        .product-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.5rem;
        }
        
        @media (min-width: 640px) {
          .product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1rem;
          }
        }
        
        @media (min-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 1280px) {
          .product-grid {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 1536px) {
          .product-grid {
            grid-template-columns: repeat(6, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  )
}
