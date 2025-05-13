"use client"

import { useState } from "react"
import { ProductFilters, ActiveFilters } from "@/components/product-filters"
import { Breadcrumb } from "@/components/breadcrumb"
import { products } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import {
  List,
  SlidersHorizontal,
  Grid,
  ChevronDown,
  ChevronUp,
  Tag,
  Palette,
  Layers,
  ShoppingBag,
  Star,
  X,
} from "lucide-react"
import { CategoryBanner } from "@/components/category-banner"
import { BrandCircles } from "@/components/brand-circles"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/utils"

export default function ProductsPage() {
  const [sortOption, setSortOption] = useState("featured")
  const [viewMode, setViewMode] = useState("grid-6")
  const [showFilters, setShowFilters] = useState(true)
  const [expandedFilterSections, setExpandedFilterSections] = useState({
    category: true,
    subcategory: true,
    brand: true,
    price: true,
    color: true,
    material: true,
    size: true,
    model: true,
  })
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleAttributeChange = (attributeId: string) => {
    setSelectedAttributes((prev) =>
      prev.includes(attributeId) ? prev.filter((id) => id !== attributeId) : [...prev, attributeId],
    )
  }

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
      case "grid-6":
        return "grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      case "list":
        return "grid-cols-1 gap-y-6" // Increased gap for list view
      default:
        return "grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
    }
  }

  const toggleFilterSection = (section) => {
    setExpandedFilterSections({
      ...expandedFilterSections,
      [section]: !expandedFilterSections[section],
    })
  }

  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) => (prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]))
  }

  const toggleColor = (colorId: string) => {
    setSelectedColors((prev) => (prev.includes(colorId) ? prev.filter((id) => id !== colorId) : [...prev, colorId]))
  }

  const toggleMaterial = (materialId: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId) ? prev.filter((id) => id !== materialId) : [...prev, materialId],
    )
  }

  const toggleSize = (sizeId: string) => {
    setSelectedSizes((prev) => (prev.includes(sizeId) ? prev.filter((id) => id !== sizeId) : [...prev, sizeId]))
  }

  const toggleModel = (modelId: string) => {
    setSelectedModels((prev) => (prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]))
  }

  const clearAllFilters = () => {
    setPriceRange([0, 100])
    setSelectedBrands([])
    setSelectedColors([])
    setSelectedMaterials([])
    setSelectedSizes([])
    setSelectedModels([])
    setSelectedCategories([])
    setSelectedAttributes([])
  }

  // Filter categories for the vertical filter
  const filterCategories = [
    {
      id: "category",
      name: "Categoría",
      icon: <Tag className="h-5 w-5 mr-2 text-[#004a93]" />,
      options: [
        { id: "cat1", name: "Envases", count: 45 },
        { id: "cat2", name: "Bolsas", count: 32 },
        { id: "cat3", name: "Cubiertos", count: 18 },
        { id: "cat4", name: "Vasos", count: 24 },
      ],
    },
    {
      id: "color",
      name: "Color",
      icon: <Palette className="h-5 w-5 mr-2 text-[#004a93]" />,
      options: [
        { id: "negro", name: "Negro", count: 28 },
        { id: "blanco", name: "Blanco", count: 35 },
        { id: "azul", name: "Azul", count: 22 },
        { id: "verde", name: "Verde", count: 19 },
        { id: "rojo", name: "Rojo", count: 15 },
      ],
    },
    {
      id: "material",
      name: "Material",
      icon: <Tag className="h-5 w-5 mr-2 text-[#004a93]" />,
      options: [
        { id: "plastico-reciclado", name: "Plástico Reciclado", count: 32 },
        { id: "bioplastico", name: "Bioplástico", count: 28 },
        { id: "polietileno", name: "Polietileno", count: 24 },
        { id: "polipropileno", name: "Polipropileno", count: 18 },
      ],
    },
    {
      id: "size",
      name: "Tamaño",
      icon: <Layers className="h-5 w-5 mr-2 text-[#004a93]" />,
      options: [
        { id: "pequeno", name: "Pequeño", count: 25 },
        { id: "mediano", name: "Mediano", count: 30 },
        { id: "grande", name: "Grande", count: 22 },
        { id: "extra-grande", name: "Extra Grande", count: 15 },
      ],
    },
    {
      id: "model",
      name: "Modelo",
      icon: <ShoppingBag className="h-5 w-5 mr-2 text-[#004a93]" />,
      options: [
        { id: "estandar", name: "Estándar", count: 35 },
        { id: "premium", name: "Premium", count: 25 },
        { id: "industrial", name: "Industrial", count: 18 },
        { id: "domestico", name: "Doméstico", count: 22 },
      ],
    },
  ]

  // Brand options for reference
  const brandOptions = [
    { id: "econo", name: "ECONO", count: 42 },
    { id: "ecomax", name: "EcoMax", count: 28 },
    { id: "greenlife", name: "GreenLife", count: 35 },
    { id: "naturaplast", name: "NaturaPlast", count: 19 },
    { id: "biopack", name: "BioPack", count: 23 },
    { id: "ecoplast", name: "EcoPlast", count: 31 },
    { id: "greenpack", name: "GreenPack", count: 17 },
    { id: "ecosolutions", name: "EcoSolutions", count: 14 },
  ]

  const totalFiltersApplied =
    selectedBrands.length +
    selectedColors.length +
    selectedMaterials.length +
    selectedSizes.length +
    selectedModels.length +
    (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0)

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

        {viewMode !== "list" && (
          /* Barra de herramientas y filtros en una sola línea - Solo para modo grid */
          <div className="flex flex-wrap items-center justify-between mt-4 mb-6 gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold px-4 py-2 bg-[#004a93] text-white rounded">Filtro</h1>

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
              <BrandCircles selectedBrands={selectedBrands} onBrandSelect={toggleBrand} />

              {/* Botones de vista - ahora solo dos opciones */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={`h-9 w-9 rounded-full ${
                    viewMode === "list" ? "bg-[#004a93] text-white" : "border-[#004a93] text-[#004a93]"
                  } hover:bg-[#003a73] hover:text-white`}
                  title="Vista de lista"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid-6" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid-6")}
                  className={`h-9 w-9 rounded-full ${
                    viewMode === "grid-6" ? "bg-[#004a93] text-white" : "border-[#004a93] text-[#004a93]"
                  } hover:bg-[#003a73] hover:text-white`}
                  title="Vista de cuadrícula"
                >
                  <Grid className="h-4 w-4" />
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
        )}

        {/* Active Filters - Display below filters but above products */}
        {viewMode !== "list" && (
          <ActiveFilters
            selectedCategories={selectedCategories}
            selectedColors={selectedColors}
            selectedMaterials={selectedMaterials}
            selectedAttributes={selectedAttributes}
            priceRange={priceRange}
            handleCategoryChange={handleCategoryChange}
            handleColorChange={toggleColor}
            handleMaterialChange={toggleMaterial}
            handleAttributeChange={handleAttributeChange}
            setPriceRange={setPriceRange}
          />
        )}

        {/* Layout diferente para list view */}
        {viewMode === "list" ? (
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            {/* Sidebar con filtros verticales - Solo para list view */}
            <div className="md:w-1/4 lg:w-1/5">
              <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold px-3 py-1 bg-[#004a93] text-white rounded">Filtros</h2>
                  {totalFiltersApplied > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-[#004a93] border-[#004a93]"
                      onClick={clearAllFilters}
                    >
                      Limpiar ({totalFiltersApplied})
                    </Button>
                  )}
                </div>

                {showFilters && (
                  <div className="space-y-4">
                    {/* Filtro de precio */}
                    <div className="border-b pb-4">
                      <div
                        className="flex justify-between items-center cursor-pointer mb-3"
                        onClick={() => toggleFilterSection("price")}
                      >
                        <div className="flex items-center">
                          <Star className="h-5 w-5 mr-2 text-[#004a93]" />
                          <h3 className="font-medium">Precio</h3>
                        </div>
                        {expandedFilterSections.price ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </div>

                      {expandedFilterSections.price && (
                        <div className="space-y-4 px-2">
                          <Slider value={priceRange} min={0} max={100} step={1} onValueChange={setPriceRange} />
                          <div className="flex items-center justify-between text-sm">
                            <span>{formatCurrency(priceRange[0] * 1000)}</span>
                            <span>{formatCurrency(priceRange[1] * 1000)}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Filtros de categorías - Excluyendo marcas */}
                    {filterCategories.map((category) => (
                      <div key={category.id} className="border-b pb-4">
                        <div
                          className="flex justify-between items-center cursor-pointer mb-3"
                          onClick={() => toggleFilterSection(category.id)}
                        >
                          <div className="flex items-center">
                            {category.icon}
                            <h3 className="font-medium">{category.name}</h3>
                          </div>
                          {expandedFilterSections[category.id] ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </div>

                        {expandedFilterSections[category.id] && (
                          <div className="space-y-2 px-2">
                            {category.options.map((option) => {
                              // Determine if this option is selected based on the category
                              let isSelected = false
                              switch (category.id) {
                                case "category":
                                  isSelected = selectedCategories.includes(option.id)
                                  break
                                case "color":
                                  isSelected = selectedColors.includes(option.id)
                                  break
                                case "material":
                                  isSelected = selectedMaterials.includes(option.id)
                                  break
                                case "size":
                                  isSelected = selectedSizes.includes(option.id)
                                  break
                                case "model":
                                  isSelected = selectedModels.includes(option.id)
                                  break
                                default:
                                  break
                              }

                              // Toggle function based on category
                              const toggleFunction = () => {
                                switch (category.id) {
                                  case "category":
                                    handleCategoryChange(option.id)
                                    break
                                  case "color":
                                    toggleColor(option.id)
                                    break
                                  case "material":
                                    toggleMaterial(option.id)
                                    break
                                  case "size":
                                    toggleSize(option.id)
                                    break
                                  case "model":
                                    toggleModel(option.id)
                                    break
                                  default:
                                    break
                                }
                              }

                              return (
                                <div
                                  key={option.id}
                                  className={`flex items-center p-1.5 rounded-md transition-colors ${
                                    isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                                  }`}
                                  onClick={toggleFunction}
                                >
                                  <Checkbox
                                    id={`${category.id}-${option.id}`}
                                    checked={isSelected}
                                    className="mr-2 data-[state=checked]:bg-[#004a93] data-[state=checked]:border-[#004a93]"
                                  />
                                  <Label
                                    htmlFor={`${category.id}-${option.id}`}
                                    className={`text-sm flex-grow cursor-pointer ${
                                      isSelected ? "font-medium text-[#004a93]" : "font-normal"
                                    }`}
                                  >
                                    {option.name}
                                  </Label>
                                  <span className="text-xs text-gray-500">({option.count})</span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Chips de filtros activos */}
                    {totalFiltersApplied > 0 && (
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Filtros activos:</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedBrands.map((brandId) => {
                            const brand = brandOptions.find((opt) => opt.id === brandId)
                            return brand ? (
                              <Badge
                                key={brandId}
                                variant="secondary"
                                className="pl-2 pr-1 py-1 flex items-center gap-1 bg-blue-50 text-[#004a93]"
                              >
                                {brand.name}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 ml-1"
                                  onClick={() => toggleBrand(brandId)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ) : null
                          })}

                          {selectedColors.map((colorId) => {
                            const color = filterCategories
                              .find((cat) => cat.id === "color")
                              ?.options.find((opt) => opt.id === colorId)
                            return color ? (
                              <Badge
                                key={colorId}
                                variant="secondary"
                                className="pl-2 pr-1 py-1 flex items-center gap-1 bg-blue-50 text-[#004a93]"
                              >
                                {color.name}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 ml-1"
                                  onClick={() => toggleColor(colorId)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ) : null
                          })}

                          {selectedMaterials.map((materialId) => {
                            const material = filterCategories
                              .find((cat) => cat.id === "material")
                              ?.options.find((opt) => opt.id === materialId)
                            return material ? (
                              <Badge
                                key={materialId}
                                variant="secondary"
                                className="pl-2 pr-1 py-1 flex items-center gap-1 bg-blue-50 text-[#004a93]"
                              >
                                {material.name}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 ml-1"
                                  onClick={() => toggleMaterial(materialId)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ) : null
                          })}

                          {selectedSizes.map((sizeId) => {
                            const size = filterCategories
                              .find((cat) => cat.id === "size")
                              ?.options.find((opt) => opt.id === sizeId)
                            return size ? (
                              <Badge
                                key={sizeId}
                                variant="secondary"
                                className="pl-2 pr-1 py-1 flex items-center gap-1 bg-blue-50 text-[#004a93]"
                              >
                                {size.name}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 ml-1"
                                  onClick={() => toggleSize(sizeId)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ) : null
                          })}

                          {selectedModels.map((modelId) => {
                            const model = filterCategories
                              .find((cat) => cat.id === "model")
                              ?.options.find((opt) => opt.id === modelId)
                            return model ? (
                              <Badge
                                key={modelId}
                                variant="secondary"
                                className="pl-2 pr-1 py-1 flex items-center gap-1 bg-blue-50 text-[#004a93]"
                              >
                                {model.name}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 ml-1"
                                  onClick={() => toggleModel(modelId)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ) : null
                          })}

                          {(priceRange[0] > 0 || priceRange[1] < 100) && (
                            <Badge
                              variant="secondary"
                              className="pl-2 pr-1 py-1 flex items-center gap-1 bg-blue-50 text-[#004a93]"
                            >
                              {formatCurrency(priceRange[0] * 1000)} - {formatCurrency(priceRange[1] * 1000)}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => setPriceRange([0, 100])}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <Button className="w-full bg-[#004a93] hover:bg-[#003a73] mt-4">Aplicar filtros</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Contenido principal - Productos en list view */}
            <div className="md:w-3/4 lg:w-4/5">
              {/* Barra de herramientas para list view */}
              <div className="flex flex-wrap items-center justify-between mb-6 gap-2 bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Vista:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className={`h-8 w-8 rounded-full ${
                        viewMode === "list" ? "bg-[#004a93] text-white" : "border-[#004a93] text-[#004a93]"
                      } hover:bg-[#003a73] hover:text-white`}
                      title="Vista de lista"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "grid-6" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("grid-6")}
                      className={`h-8 w-8 rounded-full ${
                        viewMode === "grid-6" ? "bg-[#004a93] text-white" : "border-[#004a93] text-[#004a93]"
                      } hover:bg-[#003a73] hover:text-white`}
                      title="Vista de cuadrícula"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Botón de marcas para list view */}
                  <BrandCircles selectedBrands={selectedBrands} onBrandSelect={toggleBrand} />

                  <span className="text-sm font-medium ml-2">Ordenar por:</span>
                  <select
                    className="border rounded p-1.5 text-sm"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="featured">Destacados</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                    <option value="name-asc">Nombre: A-Z</option>
                    <option value="name-desc">Nombre: Z-A</option>
                  </select>

                  <span className="text-sm font-medium ml-2">Mostrar:</span>
                  <select className="border rounded p-1.5 text-sm">
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                    <option value="all">Todos</option>
                  </select>
                </div>
              </div>

              {/* Active Filters for list view */}
              <ActiveFilters
                selectedCategories={selectedCategories}
                selectedColors={selectedColors}
                selectedMaterials={selectedMaterials}
                selectedAttributes={selectedAttributes}
                priceRange={priceRange}
                handleCategoryChange={handleCategoryChange}
                handleColorChange={toggleColor}
                handleMaterialChange={toggleMaterial}
                handleAttributeChange={handleAttributeChange}
                setPriceRange={setPriceRange}
              />

              {/* Productos en list view */}
              <div className="grid grid-cols-1 gap-y-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode="list" />
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
        ) : (
          /* Productos en grid view - layout original */
          <div className="w-full">
            <div className={`grid ${getGridCols()} gap-4 sm:gap-4 gap-2`}>
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
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
        )}
      </div>
    </div>
  )
}
