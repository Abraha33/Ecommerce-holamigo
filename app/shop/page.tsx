"use client"

import { useState } from "react"
import { ProductFilters } from "@/components/product-filters"
import { Breadcrumb } from "@/components/breadcrumb"
import { products } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Grid, List, SlidersHorizontal } from "lucide-react"
import { CategoryBanner } from "@/components/category-banner"
import { BrandCircles } from "@/components/brand-circles"

export default function ProductsPage() {
  const [sortOption, setSortOption] = useState("featured")
  const [viewMode, setViewMode] = useState("grid-6")
  const [showFilters, setShowFilters] = useState(true)

  // Ordenar productos según la opción seleccionada
  const sortedProducts = [...products].sort((a, b) => {
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
        return 0 // featured - mantener orden original
    }
  })

  // Determinar el número de columnas según el modo de vista
  const getGridCols = () => {
    switch (viewMode) {
      case "grid-2":
        return "grid-cols-1 sm:grid-cols-2"
      case "grid-3":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      case "grid-6":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      case "list":
        return "grid-cols-1 gap-y-4" // Asegurar que el modo lista tenga una sola columna
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
    }
  }

  return (
    <div>
      {/* Banner de categoría - altura reducida */}
      <CategoryBanner
        title="Productos Sostenibles"
        description="Soluciones eco-amigables para todas tus necesidades"
        image="/eco-conscious-living.png"
        breadcrumbs={[{ name: "Products", href: "/products" }]}
      />

      <div className="container px-4 py-4 mx-auto">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tienda", href: "/shop", active: true },
          ]}
        />

        {/* Barra de herramientas y filtros en una sola línea */}
        <div className="flex flex-wrap items-center justify-between mt-4 mb-6 gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Productos</h1>

            {/* Filtros horizontales compactos */}
            <div className={`flex-1 flex-wrap flex items-center gap-2 ${showFilters ? "flex" : "hidden md:flex"}`}>
              <ProductFilters compact={true} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Botón de filtros (móvil) */}
            <Button
              variant="outline"
              className="md:hidden flex items-center gap-2 bg-[#004a93] text-white hover:bg-[#003a73]"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </Button>

            {/* Botón de marcas */}
            <BrandCircles />

            {/* Botones de vista - ahora circulares */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="h-9 w-9 rounded-full bg-[#004a93] text-white hover:bg-[#003a73]"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid-2" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid-2")}
                className="h-9 w-9 rounded-full bg-[#004a93] text-white hover:bg-[#003a73]"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid-3" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid-3")}
                className="h-9 w-9 rounded-full bg-[#004a93] text-white hover:bg-[#003a73]"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid-6" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid-6")}
                className="h-9 w-9 rounded-full bg-[#004a93] text-white hover:bg-[#003a73]"
              >
                <div className="grid grid-cols-3 gap-0.5">
                  <div className="w-1 h-1 bg-current rounded-sm"></div>
                  <div className="w-1 h-1 bg-current rounded-sm"></div>
                  <div className="w-1 h-1 bg-current rounded-sm"></div>
                  <div className="w-1 h-1 bg-current rounded-sm"></div>
                  <div className="w-1 h-1 bg-current rounded-sm"></div>
                  <div className="w-1 h-1 bg-current rounded-sm"></div>
                </div>
              </Button>
            </div>

            {/* Selector de ordenamiento */}
            <select
              className="border rounded p-2 text-sm"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name-asc">Nombre: A-Z</option>
              <option value="name-desc">Nombre: Z-A</option>
            </select>

            {/* Selector de cantidad */}
            <select className="border rounded p-2 text-sm">
              <option value="12">Mostrar 12</option>
              <option value="24">Mostrar 24</option>
              <option value="48">Mostrar 48</option>
              <option value="all">Mostrar todos</option>
            </select>
          </div>
        </div>

        {/* Productos - ahora con 5 columnas */}
        <div className="w-full">
          <div className={`grid ${getGridCols()} gap-4`}>
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode === "list" ? "list" : "grid"} />
            ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled>
                &lt;
              </Button>
              <Button variant="default" size="icon">
                1
              </Button>
              <Button variant="outline" size="icon">
                2
              </Button>
              <Button variant="outline" size="icon">
                3
              </Button>
              <span>...</span>
              <Button variant="outline" size="icon">
                10
              </Button>
              <Button variant="outline" size="icon">
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
