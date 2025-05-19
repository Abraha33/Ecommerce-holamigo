"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { notFound } from "next/navigation"
import { getCategoryBySlug } from "@/lib/categories-data"
import { products } from "@/lib/products"
import { SlidersHorizontal, Grid, List, Tag, X, Check, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { motion } from "framer-motion"
import { Pagination } from "@/components/pagination"
import { formatCurrency } from "@/lib/utils"
import { Breadcrumb } from "@/components/breadcrumb"
import { CategoryNavigation } from "@/components/category-navigation"
import { Slider } from "@/components/ui/slider"

export default function CategoryClientPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug)

  if (!category) {
    notFound()
  }

  // Estados para la funcionalidad similar a shop
  const [viewMode, setViewMode] = useState("grid-6")
  const [sortOption, setSortOption] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [showBrandsModal, setShowBrandsModal] = useState(false)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 100])
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("100000")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [activeAccordion, setActiveAccordion] = useState<string | null>("precio")
  const [currentBrandPage, setCurrentBrandPage] = useState(1)
  const itemsPerPage = 12
  const brandsPerPage = 10

  // Datos de marcas con logos
  const brandData = [
    { id: "econo", name: "ECONO", logo: "/brands/econo-logo.png", count: 42 },
    { id: "ecomax", name: "EcoMax", logo: "/brands/ecomax-logo.png", count: 28 },
    { id: "greenlife", name: "GreenLife", logo: "/brands/greenlife-logo.png", count: 35 },
    { id: "naturaplast", name: "NaturaPlast", logo: "/brands/naturaplast-logo.png", count: 19 },
    { id: "biopack", name: "BioPack", logo: "/brands/biopack-logo.png", count: 23 },
    { id: "ecoplast", name: "EcoPlast", logo: "/brands/ecoplast-logo.png", count: 31 },
    { id: "greenpack", name: "GreenPack", logo: "/brands/greenpack-logo.png", count: 17 },
    { id: "ecosolutions", name: "EcoSolutions", logo: "/brands/ecosolutions-logo.png", count: 14 },
    { id: "earthware", name: "EarthWare", logo: "/brands/earthware-logo.png", count: 9 },
    { id: "biotech", name: "BioTech", logo: "/brands/biotech-logo.png", count: 12 },
  ]

  // Datos de colores
  const colorData = [
    { id: "negro", name: "Negro", hex: "#000000" },
    { id: "blanco", name: "Blanco", hex: "#FFFFFF" },
    { id: "azul", name: "Azul", hex: "#0066CC" },
    { id: "verde", name: "Verde", hex: "#00A651" },
    { id: "rojo", name: "Rojo", hex: "#E31E24" },
  ]

  // Datos de tamaños
  const sizeData = [
    { id: "pequeno", name: "Pequeño" },
    { id: "mediano", name: "Mediano" },
    { id: "grande", name: "Grande" },
    { id: "extra-grande", name: "Extra Grande" },
  ]

  // Datos de modelos
  const modelData = [
    { id: "estandar", name: "Estándar" },
    { id: "premium", name: "Premium" },
    { id: "industrial", name: "Industrial" },
    { id: "domestico", name: "Doméstico" },
  ]

  // Calcular marcas a mostrar en la página actual
  const indexOfLastBrand = currentBrandPage * brandsPerPage
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage
  const currentBrands = brandData.slice(indexOfFirstBrand, indexOfFirstBrand + brandsPerPage)
  const totalBrandPages = Math.ceil(brandData.length / brandsPerPage)

  // Update price inputs when slider changes
  useEffect(() => {
    setMinPrice((priceRange[0] * 1000).toString())
    setMaxPrice((priceRange[1] * 1000).toString())
  }, [priceRange])

  // Update slider when price inputs change
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMinPrice(value)
    if (value && !isNaN(Number(value))) {
      const numValue = Number(value) / 1000
      if (numValue >= 0 && numValue <= priceRange[1]) {
        setPriceRange([numValue, priceRange[1]])
      }
    }
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMaxPrice(value)
    if (value && !isNaN(Number(value))) {
      const numValue = Number(value) / 1000
      if (numValue >= priceRange[0] && numValue <= 100) {
        setPriceRange([priceRange[0], numValue])
      }
    }
  }

  // Filter toggle functions
  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) => (prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]))
  }

  const toggleColor = (colorId: string) => {
    setSelectedColors((prev) => (prev.includes(colorId) ? prev.filter((id) => colorId !== id) : [...prev, colorId]))
  }

  const toggleSize = (sizeId: string) => {
    setSelectedSizes((prev) => (prev.includes(sizeId) ? prev.filter((id) => sizeId !== id) : [...prev, sizeId]))
  }

  const toggleModel = (modelId: string) => {
    setSelectedModels((prev) => (prev.includes(modelId) ? prev.filter((id) => modelId !== id) : [...prev, modelId]))
  }

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id)
  }

  const clearAllFilters = () => {
    setPriceRange([0, 100])
    setMinPrice("0")
    setMaxPrice("100000")
    setSelectedBrands([])
    setSelectedColors([])
    setSelectedSizes([])
    setSelectedModels([])
  }

  // Referencias para los modales
  const filtersModalRef = useRef<HTMLDivElement>(null)

  // Filtrar productos para esta categoría (simulado)
  const categoryProducts = products.slice(0, 24)

  // Número de productos (simulado)
  const productCount = 42

  // Crear círculos de subcategorías para la navegación
  const subcategoryCircles =
    category.subcategories?.map((subcategory) => ({
      id: subcategory.slug,
      name: subcategory.title,
      image: subcategory.image || "/placeholder.svg?key=8fksn",
      href: `/categories/${category.slug}/${subcategory.slug}`,
    })) || []

  // Añadir "Ver todo" al final
  subcategoryCircles.push({
    id: "ver-todo",
    name: "Ver Todo",
    image: "/categories/ver-todo.png",
    href: `/categories/${category.slug}`,
  })

  // Ordenar productos según la opción seleccionada
  const sortedProducts = [...categoryProducts].sort((a, b) => {
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

  // Función para cerrar el modal de filtros al hacer clic fuera
  const handleClickOutsideFilters = (e: React.MouseEvent) => {
    if (filtersModalRef.current && !filtersModalRef.current.contains(e.target as Node)) {
      setShowFiltersModal(false)
    }
  }

  const totalFiltersApplied =
    selectedBrands.length +
    selectedColors.length +
    selectedSizes.length +
    selectedModels.length +
    (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0)

  return (
    <div className="bg-gray-50">
      {/* Banner de categoría AGRANDADO */}
      <div className="w-full bg-gradient-to-r from-[#004a93] to-[#0071bc] py-16">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "Inicio", href: "/" },
              { label: "Categorías", href: "/categories" },
              { label: category.title, href: `/categories/${category.slug}`, active: true },
            ]}
            className="text-white/80 mb-6"
          />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h1 className="text-5xl font-bold text-white mb-4">{category.title}</h1>
              <p className="text-white/90 max-w-2xl text-xl">{category.description}</p>
            </div>
            <Badge variant="outline" className="text-2xl px-6 py-3 bg-white text-[#004a93] font-semibold">
              {productCount} productos
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
                  onClick={() => setShowFiltersModal(true)}
                >
                  <SlidersHorizontal className="h-5 w-5 mr-1" />
                  <span className="font-medium">Filtros</span>
                  {totalFiltersApplied > 0 && (
                    <span className="ml-2 bg-white text-[#004a93] rounded-full text-xs px-2 py-0.5 font-bold">
                      {totalFiltersApplied}
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* Botón de Marcas */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-white border-2 border-[#004a93] text-[#004a93] hover:bg-blue-50 text-base px-6 py-6 h-auto rounded-xl shadow-md"
                  onClick={() => setShowBrandsModal(true)}
                >
                  <Tag className="h-5 w-5 mr-1" />
                  <span className="font-medium">Marcas</span>
                  {selectedBrands.length > 0 && (
                    <span className="ml-2 bg-[#004a93] text-white rounded-full text-xs px-2 py-0.5 font-bold">
                      {selectedBrands.length}
                    </span>
                  )}
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

        {/* Active Filters - Display below filters but above products */}
        {totalFiltersApplied > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {(priceRange[0] > 0 || priceRange[1] < 100) && (
                <Badge
                  variant="secondary"
                  className="pl-3 pr-1 py-2 flex items-center gap-1 bg-blue-50 text-[#004a93] text-base"
                >
                  {formatCurrency(priceRange[0] * 1000)} - {formatCurrency(priceRange[1] * 1000)}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 ml-1"
                    onClick={() => setPriceRange([0, 100])}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {totalFiltersApplied > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm text-[#004a93] border-[#004a93]"
                  onClick={() => {
                    setPriceRange([0, 100])
                    setSelectedBrands([])
                  }}
                >
                  Limpiar todos
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Productos en grid o list view */}
        <div className="w-full">
          <div className={`grid ${getGridCols()} gap-4 sm:gap-4 gap-2`}>
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
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

      {/* Modal de filtros mejorado */}
      {showFiltersModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowFiltersModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado del modal */}
            <div className="bg-[#004a93] text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center">
                <SlidersHorizontal className="mr-2 h-5 w-5" /> Filtros
                {totalFiltersApplied > 0 && (
                  <Badge className="ml-2 bg-white text-[#004a93]">{totalFiltersApplied}</Badge>
                )}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFiltersModal(false)}
                className="text-white hover:bg-blue-800 rounded-full h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Contenido del modal */}
            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              {/* Menú lateral */}
              <div className="w-full md:w-64 bg-gray-50 border-r">
                <div className="p-4">
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left ${
                        activeAccordion === "precio" ? "bg-blue-50 text-[#004a93] font-medium" : ""
                      }`}
                      onClick={() => toggleAccordion("precio")}
                    >
                      {activeAccordion === "precio" ? (
                        <ChevronDown className="h-5 w-5 mr-2" />
                      ) : (
                        <ChevronRight className="h-5 w-5 mr-2" />
                      )}
                      Precio
                    </Button>

                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left ${
                        activeAccordion === "colores" ? "bg-blue-50 text-[#004a93] font-medium" : ""
                      }`}
                      onClick={() => toggleAccordion("colores")}
                    >
                      {activeAccordion === "colores" ? (
                        <ChevronDown className="h-5 w-5 mr-2" />
                      ) : (
                        <ChevronRight className="h-5 w-5 mr-2" />
                      )}
                      Colores
                    </Button>

                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left ${
                        activeAccordion === "tamanos" ? "bg-blue-50 text-[#004a93] font-medium" : ""
                      }`}
                      onClick={() => toggleAccordion("tamanos")}
                    >
                      {activeAccordion === "tamanos" ? (
                        <ChevronDown className="h-5 w-5 mr-2" />
                      ) : (
                        <ChevronRight className="h-5 w-5 mr-2" />
                      )}
                      Tamaños
                    </Button>

                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left ${
                        activeAccordion === "modelos" ? "bg-blue-50 text-[#004a93] font-medium" : ""
                      }`}
                      onClick={() => toggleAccordion("modelos")}
                    >
                      {activeAccordion === "modelos" ? (
                        <ChevronDown className="h-5 w-5 mr-2" />
                      ) : (
                        <ChevronRight className="h-5 w-5 mr-2" />
                      )}
                      Modelos
                    </Button>

                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left ${
                        activeAccordion === "marcas" ? "bg-blue-50 text-[#004a93] font-medium" : ""
                      }`}
                      onClick={() => toggleAccordion("marcas")}
                    >
                      {activeAccordion === "marcas" ? (
                        <ChevronDown className="h-5 w-5 mr-2" />
                      ) : (
                        <ChevronRight className="h-5 w-5 mr-2" />
                      )}
                      Marcas
                    </Button>
                  </div>
                </div>
              </div>

              {/* Contenido del filtro seleccionado */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Filtro de precio mejorado */}
                {activeAccordion === "precio" && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Rango de precio</h3>
                    <div className="space-y-6">
                      {/* Slider con valores visuales */}
                      <div className="relative pt-6 pb-10">
                        <Slider
                          value={priceRange}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={setPriceRange}
                          className="mb-6"
                        />

                        {/* Marcas de valores */}
                        <div className="absolute left-0 right-0 bottom-0 flex justify-between text-xs text-gray-500">
                          <span>$0</span>
                          <span>$25.000</span>
                          <span>$50.000</span>
                          <span>$75.000</span>
                          <span>$100.000</span>
                        </div>
                      </div>

                      {/* Inputs de precio */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <label htmlFor="min-price" className="block text-sm font-medium text-gray-700 mb-1">
                            Precio mínimo
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <input
                              id="min-price"
                              type="number"
                              value={minPrice}
                              onChange={handleMinPriceChange}
                              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <span className="text-gray-500 mx-2">-</span>
                        </div>

                        <div className="flex-1">
                          <label htmlFor="max-price" className="block text-sm font-medium text-gray-700 mb-1">
                            Precio máximo
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <input
                              id="max-price"
                              type="number"
                              value={maxPrice}
                              onChange={handleMaxPriceChange}
                              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Rangos predefinidos */}
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Rangos populares</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            className="justify-start text-left"
                            onClick={() => {
                              setPriceRange([0, 25])
                              setMinPrice("0")
                              setMaxPrice("25000")
                            }}
                          >
                            Hasta $25.000
                          </Button>
                          <Button
                            variant="outline"
                            className="justify-start text-left"
                            onClick={() => {
                              setPriceRange([25, 50])
                              setMinPrice("25000")
                              setMaxPrice("50000")
                            }}
                          >
                            $25.000 - $50.000
                          </Button>
                          <Button
                            variant="outline"
                            className="justify-start text-left"
                            onClick={() => {
                              setPriceRange([50, 75])
                              setMinPrice("50000")
                              setMaxPrice("75000")
                            }}
                          >
                            $50.000 - $75.000
                          </Button>
                          <Button
                            variant="outline"
                            className="justify-start text-left"
                            onClick={() => {
                              setPriceRange([75, 100])
                              setMinPrice("75000")
                              setMaxPrice("100000")
                            }}
                          >
                            Más de $75.000
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Filtro de colores */}
                {activeAccordion === "colores" && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Colores</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {colorData.map((color) => (
                        <div
                          key={color.id}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                            selectedColors.includes(color.id)
                              ? "bg-blue-50 border border-[#004a93]"
                              : "border border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleColor(color.id)}
                        >
                          <div
                            className="h-6 w-6 rounded-full mr-3 flex-shrink-0 border border-gray-200"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <span className="flex-grow">{color.name}</span>
                          {selectedColors.includes(color.id) && <Check className="h-5 w-5 text-[#004a93]" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filtro de tamaños */}
                {activeAccordion === "tamanos" && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Tamaños</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {sizeData.map((size) => (
                        <div
                          key={size.id}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                            selectedSizes.includes(size.id)
                              ? "bg-blue-50 border border-[#004a93]"
                              : "border border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleSize(size.id)}
                        >
                          <span className="flex-grow">{size.name}</span>
                          {selectedSizes.includes(size.id) && <Check className="h-5 w-5 text-[#004a93]" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filtro de modelos */}
                {activeAccordion === "modelos" && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Modelos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {modelData.map((model) => (
                        <div
                          key={model.id}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                            selectedModels.includes(model.id)
                              ? "bg-blue-50 border border-[#004a93]"
                              : "border border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleModel(model.id)}
                        >
                          <span className="flex-grow">{model.name}</span>
                          {selectedModels.includes(model.id) && <Check className="h-5 w-5 text-[#004a93]" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filtro de marcas */}
                {activeAccordion === "marcas" && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Marcas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {brandData.map((brand) => (
                        <div
                          key={brand.id}
                          className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all ${
                            selectedBrands.includes(brand.id)
                              ? "bg-blue-50 border-2 border-[#004a93] shadow-md transform scale-105"
                              : "border border-gray-200 hover:border-gray-300 hover:shadow"
                          }`}
                          onClick={() => toggleBrand(brand.id)}
                        >
                          <div className="relative mb-2 h-16 w-full flex items-center justify-center">
                            <img
                              src={brand.logo || "/placeholder.svg"}
                              alt={brand.name}
                              className="max-h-full max-w-full object-contain"
                            />
                            {selectedBrands.includes(brand.id) && (
                              <div className="absolute top-0 right-0 bg-[#004a93] text-white rounded-full p-1">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <span className="text-center font-medium">{brand.name}</span>
                          <span className="text-xs text-gray-500">({brand.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pie del modal */}
            <div className="border-t p-4 flex justify-between items-center bg-gray-50">
              <Button variant="outline" onClick={clearAllFilters} className="text-[#004a93] border-[#004a93]">
                Limpiar filtros
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowFiltersModal(false)}>
                  Cancelar
                </Button>
                <Button className="bg-[#004a93] hover:bg-[#003a73]" onClick={() => setShowFiltersModal(false)}>
                  Aplicar filtros
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal de marcas mejorado */}
      {showBrandsModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowBrandsModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado del modal */}
            <div className="bg-gradient-to-r from-[#004a93] to-[#0071bc] text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center">
                <Tag className="mr-2 h-5 w-5" /> Nuestras Marcas
                {selectedBrands.length > 0 && (
                  <Badge className="ml-2 bg-white text-[#004a93]">{selectedBrands.length}</Badge>
                )}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBrandsModal(false)}
                className="text-white hover:bg-blue-800/30 rounded-full h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 overflow-y-auto bg-gradient-to-b from-blue-50 to-white">
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar marcas..."
                    className="w-full p-3 pl-10 border rounded-full shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {currentBrands.map((brand) => (
                  <motion.div
                    key={brand.id}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`relative rounded-full cursor-pointer transition-all duration-300 p-1
                        ${
                          selectedBrands.includes(brand.id)
                            ? "bg-gradient-to-r from-[#004a93] to-[#0071bc] shadow-lg"
                            : "bg-white hover:shadow-md border border-gray-200"
                        }`}
                      onClick={() => toggleBrand(brand.id)}
                    >
                      <div
                        className={`
                        relative overflow-hidden rounded-full h-24 w-24 flex items-center justify-center
                        ${selectedBrands.includes(brand.id) ? "border-2 border-white" : ""}
                      `}
                      >
                        <div className="absolute inset-0 bg-white flex items-center justify-center p-3">
                          <img
                            src={brand.logo || "/placeholder.svg"}
                            alt={brand.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {selectedBrands.includes(brand.id) && (
                          <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                            <div className="absolute bottom-0 right-0 bg-[#004a93] text-white rounded-full p-1 m-1 shadow-md">
                              <Check className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <span
                        className={`font-medium text-sm ${selectedBrands.includes(brand.id) ? "text-[#004a93]" : ""}`}
                      >
                        {brand.name}
                      </span>
                      <span className="block text-xs text-gray-500 mt-1">({brand.count} productos)</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Paginación estilo testimonios */}
              <div className="flex justify-center items-center mt-8 mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentBrandPage(Math.max(1, currentBrandPage - 1))}
                  disabled={currentBrandPage === 1}
                  className="h-10 w-10 rounded-full border-gray-300 shadow-sm mr-4"
                >
                  <ChevronLeft className="h-5 w-5 text-[#004a93]" />
                </Button>

                <div className="flex justify-center items-center gap-2">
                  {Array.from({ length: totalBrandPages }).map((_, index) => (
                    <motion.button
                      key={index}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        index === currentBrandPage - 1 ? "bg-[#004a93] w-8" : "bg-gray-300 w-3"
                      }`}
                      onClick={() => setCurrentBrandPage(index + 1)}
                      aria-label={`Ir a la página ${index + 1}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentBrandPage(Math.min(totalBrandPages, currentBrandPage + 1))}
                  disabled={currentBrandPage === totalBrandPages}
                  className="h-10 w-10 rounded-full border-gray-300 shadow-sm ml-4"
                >
                  <ChevronRight className="h-5 w-5 text-[#004a93]" />
                </Button>
              </div>
            </div>

            {/* Pie del modal */}
            <div className="border-t p-4 flex justify-between items-center bg-gray-50">
              <Button
                variant="outline"
                onClick={() => setSelectedBrands([])}
                className="text-[#004a93] border-[#004a93] hover:bg-blue-50"
              >
                Limpiar selección
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowBrandsModal(false)}>
                  Cancelar
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#004a93] to-[#0071bc] hover:from-[#003a73] hover:to-[#005a99] text-white"
                  onClick={() => setShowBrandsModal(false)}
                >
                  Aplicar selección ({selectedBrands.length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
