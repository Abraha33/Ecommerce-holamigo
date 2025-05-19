"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"
import { Filter, Grid, List } from "lucide-react"
import { CategoryNavigation } from "@/components/category-navigation"
import { useState } from "react"
import { Pagination } from "@/components/pagination"
import { Breadcrumb } from "@/components/breadcrumb"
import { motion } from "framer-motion"

export default function OfertasDestacadasPage() {
  // Filtrar productos con descuento
  const saleProducts = products.filter((product) => product.isSale)

  // Estados para la funcionalidad similar a CategoryClientPage
  const [viewMode, setViewMode] = useState("grid-6")
  const [sortOption, setSortOption] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Subcategorías para la navegación con círculos
  const subcategoryCircles = [
    {
      id: "super-ahorro",
      name: "Super Ahorro",
      image: "/super-ahorro.png",
      href: "/promos/super-ahorro",
    },
    {
      id: "combos-especiales",
      name: "Combos Especiales",
      image: "/special-combos.png",
      href: "/promos/combos-especiales",
    },
    {
      id: "descuentos-flash",
      name: "Descuentos Flash",
      image: "/descuentos-flash.png",
      href: "/promos/descuentos-flash",
    },
    {
      id: "ultimas-unidades",
      name: "Últimas Unidades",
      image: "/subcategories/ultimas-unidades.png",
      href: "/promos/ultimas-unidades",
    },
    {
      id: "outlet",
      name: "Outlet",
      image: "/outlet-banner.png",
      href: "/promos/outlet",
    },
    {
      id: "ver-todo",
      name: "Ver Todo",
      image: "/categories/ver-todo.png",
      href: "/promos",
    },
  ]

  // Ordenar productos según la opción seleccionada
  const sortedProducts = [...saleProducts].sort((a, b) => {
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

  // Calcular los productos a mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem)

  // Determinar el número de columnas según el modo de vista
  const getGridCols = () => {
    switch (viewMode) {
      case "grid-6":
        return "grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      case "list":
        return "grid-cols-1 md:grid-cols-2 gap-y-8"
      default:
        return "grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
    }
  }

  return (
    <div className="bg-gray-50">
      {/* Banner de categoría AGRANDADO */}
      <div className="w-full bg-gradient-to-r from-[#004a93] to-[#0071bc] py-16">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "Inicio", href: "/" },
              { label: "Promociones", href: "/promos" },
              { label: "Ofertas Destacadas", href: "/promos/destacadas", active: true },
            ]}
            className="text-white/80 mb-6"
          />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h1 className="text-5xl font-bold text-white mb-4">Ofertas Destacadas</h1>
              <p className="text-white/90 max-w-2xl text-xl">
                Descubre nuestras mejores promociones seleccionadas para ti
              </p>
            </div>
            <Badge variant="outline" className="text-2xl px-6 py-3 bg-white text-[#004a93] font-semibold">
              {saleProducts.length} productos
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navegación de subcategorías con círculos - Similar a shop */}
        <div className="my-6 overflow-hidden">
          <div className="w-full max-w-[1600px] mx-auto">
            <CategoryNavigation categories={subcategoryCircles} />
          </div>
        </div>

        {/* Barra de herramientas simplificada */}
        <div className="flex flex-wrap items-center justify-between mt-6 mb-8 gap-2 border-b pb-6">
          <div className="flex items-center gap-4 w-full justify-between">
            {/* Botones de filtro vertical */}
            <div className="flex items-center gap-4">
              {/* Botón de Filtros */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-gradient-to-r from-[#004a93] to-[#0071bc] text-white hover:from-[#003a73] hover:to-[#005a99] text-base px-6 py-6 h-auto rounded-xl shadow-md border-0"
                >
                  <Filter className="h-5 w-5 mr-1" />
                  <span className="font-medium">Filtros</span>
                </Button>
              </motion.div>
            </div>

            {/* Ordenar por y vista */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <span className="text-base font-medium">Ordenar por:</span>
                <select
                  className="border rounded p-2 text-base"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="featured">Relevancia</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name-asc">Nombre: A-Z</option>
                  <option value="name-desc">Nombre: Z-A</option>
                </select>
              </div>

              <div className="flex items-center gap-3 border-l pl-8">
                <span className="text-base font-medium">Vista:</span>
                <div className="flex items-center bg-gray-100 p-1.5 rounded-lg">
                  <Button
                    variant={viewMode === "grid-6" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid-6")}
                    className={`h-10 w-10 rounded-lg mx-1 ${
                      viewMode === "grid-6" ? "bg-[#004a93] text-white" : "text-gray-600"
                    } hover:bg-[#003a73] hover:text-white`}
                    title="Vista de cuadrícula"
                  >
                    <Grid className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={`h-10 w-10 rounded-lg mx-1 ${
                      viewMode === "list" ? "bg-[#004a93] text-white" : "text-gray-600"
                    } hover:bg-[#003a73] hover:text-white`}
                    title="Vista de lista"
                  >
                    <List className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="relative w-full h-[200px] rounded-xl overflow-hidden mb-8">
          <Image src="/destacadas-banner.png" alt="Ofertas Destacadas" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004a93]/80 to-transparent flex flex-col justify-center p-8">
            <Badge className="bg-[#e30613] mb-2 self-start">TOP OFERTAS</Badge>
            <h2 className="text-3xl font-bold text-white mb-2">Ofertas Destacadas</h2>
            <p className="text-white max-w-md">Las mejores promociones seleccionadas por nuestro equipo</p>
          </div>
        </div>

        {/* Productos en grid o list view */}
        <div className="w-full">
          <div className={`grid ${getGridCols()} gap-4 sm:gap-4 gap-2`}>
            {currentProducts.map((product) => (
              <div key={product.id} className="relative">
                <Badge className="absolute top-2 left-2 z-10 bg-[#e30613]">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
                <ProductCard product={product} viewMode={viewMode} />
              </div>
            ))}
          </div>

          {/* Paginación mejorada */}
          <Pagination
            totalItems={sortedProducts.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}
