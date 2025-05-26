"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { List, SlidersHorizontal, Grid, Tag, X, Check, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"
import { Pagination } from "@/components/pagination"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/product-service"
import CategorySlider from "@/components/category-slider"

// Datos de categorías para la navegación
const categoryItems = [
  {
    id: "muebles-exterior",
    name: "Muebles para Exterior",
    image: "/categories/muebles-exterior.png",
    href: "/shop?category=muebles-exterior",
  },
  {
    id: "asadores-bbq",
    name: "Asadores y BBQ",
    image: "/categories/asadores-bbq.png",
    href: "/shop?category=asadores-bbq",
  },
  {
    id: "camping-piscinas",
    name: "Camping y Piscinas",
    image: "/categories/camping-piscinas.png",
    href: "/shop?category=camping-piscinas",
  },
  {
    id: "mascotas",
    name: "Mascotas",
    image: "/categories/mascotas.png",
    href: "/shop?category=mascotas",
  },
  {
    id: "materas-plantas",
    name: "Materas y Plantas",
    image: "/categories/materas-plantas.png",
    href: "/shop?category=materas-plantas",
  },
  {
    id: "herramientas-jardin",
    name: "Herramientas para Jardín",
    image: "/categories/herramientas-jardin.png",
    href: "/shop?category=herramientas-jardin",
  },
  {
    id: "deportes-recreacion",
    name: "Deportes y Recreación",
    image: "/categories/deportes-recreacion.png",
    href: "/shop?category=deportes-recreacion",
  },
  {
    id: "decoracion-jardin",
    name: "Decoración de Jardín",
    image: "/categories/decoracion-jardin.png",
    href: "/shop?category=decoracion-jardin",
  },
  {
    id: "ver-todo",
    name: "Ver Todo",
    image: "/categories/ver-todo.png",
    href: "/shop",
  },
]

// Actualizar las categorías con imágenes específicas
const updatedCategoryItems = [
  {
    id: "insuperables",
    name: "Insuperables",
    image: "/categories/insuperables.png",
    href: "/shop?category=insuperables",
  },
  {
    id: "oferta-estrella",
    name: "Oferta Estrella",
    image: "/categories/oferta-estrella.png",
    href: "/shop?category=oferta-estrella",
  },
  {
    id: "lacteos",
    name: "Lácteos",
    image: "/categories/lacteos.png",
    href: "/shop?category=lacteos",
  },
  {
    id: "aseo",
    name: "Aseo",
    image: "/categories/aseo.png",
    href: "/shop?category=aseo",
  },
  {
    id: "licores",
    name: "Licores",
    image: "/categories/licores.png",
    href: "/shop?category=licores",
  },
  {
    id: "cosmeticos",
    name: "Cosméticos",
    image: "/categories/cosmeticos.png",
    href: "/shop?category=cosmeticos",
  },
  {
    id: "bebidas",
    name: "Bebidas",
    image: "/categories/bebidas.png",
    href: "/shop?category=bebidas",
  },
  {
    id: "frutas-verduras",
    name: "Frutas y Verduras",
    image: "/categories/frutas-verduras.png",
    href: "/shop?category=frutas-verduras",
  },
  {
    id: "carnes",
    name: "Carnes",
    image: "/categories/carnes.png",
    href: "/shop?category=carnes",
  },
  {
    id: "delicatessen",
    name: "Delicatessen",
    image: "/categories/delicatessen.png",
    href: "/shop?category=delicatessen",
  },
  {
    id: "snack",
    name: "Snacks",
    image: "/categories/snack.png",
    href: "/shop?category=snack",
  },
  {
    id: "bebidas-hidratantes",
    name: "Bebidas Hidratantes",
    image: "/categories/bebidas-hidratantes.png",
    href: "/shop?category=bebidas-hidratantes",
  },
  ...categoryItems,
]

// Convertir los datos de categorías al formato esperado por CategorySlider
const categorySliderItems = updatedCategoryItems.map((item) => ({
  id: item.id,
  name: item.name,
  slug: item.id,
  image_url: item.image,
  is_active: true,
  display_order: 0,
}))

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
  { id: "amarillo", name: "Amarillo", hex: "#FFC107" },
  { id: "naranja", name: "Naranja", hex: "#FF6600" },
  { id: "morado", name: "Morado", hex: "#9C27B0" },
  { id: "gris", name: "Gris", hex: "#9E9E9E" },
  { id: "marron", name: "Marrón", hex: "#795548" },
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

// Convert database products to the format expected by ProductCard
const mapProductForCard = (product: Product) => {
  const primaryImage = product.images?.find((img) => img.is_primary)?.url || "/placeholder.svg"

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    image: primaryImage,
    isNew: product.is_new,
    isSale: product.is_sale,
    originalPrice: product.is_sale ? product.price : undefined,
    salePrice: product.sale_price,
    stockStatus: product.stock > 0 ? "in_stock" : "out_of_stock",
    description: product.description || "",
  }
}

interface ShopClientProps {
  initialProducts: Product[]
}

export function ShopClient({ initialProducts }: ShopClientProps) {
  const [sortOption, setSortOption] = useState("featured")
  const [viewMode, setViewMode] = useState("grid-6")
  const [activeFilterTab, setActiveFilterTab] = useState("precio")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("100000")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [currentBrandPage, setCurrentBrandPage] = useState(1)
  const itemsPerPage = 12
  const brandsPerPage = 10
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [showBrandsModal, setShowBrandsModal] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState<string | null>("precio")
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)
  const [isMobile, setIsMobile] = useState(false)
  const shopContainerRef = useRef<HTMLDivElement>(null)

  // Map database products to the format expected by ProductCard
  const mappedProducts = initialProducts.map(mapProductForCard)

  // Sort products based on selected option
  const sortedProducts = [...mappedProducts].sort((a, b) => {
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
        return 0 // featured - maintain original order
    }
  })

  // Calculate products to show on current page
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem)

  // Calculate brands to show on current page
  const indexOfLastBrand = currentBrandPage * brandsPerPage
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage
  const currentBrands = brandData.slice(indexOfFirstBrand, indexOfFirstBrand + brandsPerPage)
  const totalBrandPages = Math.ceil(brandData.length / brandsPerPage)

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 640)
    }

    // Initial check
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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

  const toggleMaterial = (materialId: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId) ? prev.filter((id) => materialId !== id) : [...prev, materialId],
    )
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
    setSelectedMaterials([])
    setSelectedSizes([])
    setSelectedModels([])
    setSelectedCategories([])
    setSelectedAttributes([])
  }

  // Calculate total filters applied
  const totalFiltersApplied =
    selectedBrands.length +
    selectedColors.length +
    selectedMaterials.length +
    selectedSizes.length +
    selectedModels.length +
    (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0)

  // Estilos personalizados para el contenedor de categorías
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
    .category-container .swiper-wrapper {
      align-items: center;
    }
    .category-container .swiper-slide {
      display: flex;
      justify-content: center;
      padding: 0 1px; /* Reducido de 2px a 1px */
    }
    .category-container .category-image {
      border: 2px solid #0071bc; /* Borde azul para los círculos */
      transition: all 0.3s ease;
      background-color: #f8f9fa; /* Add background color in case image fails to load */
    }
    .category-container .category-image:hover {
      border-color: #004a93;
      box-shadow: 0 0 0 2px rgba(0, 113, 188, 0.3);
    }
    .category-container img {
      object-fit: cover;
    }
    
    /* Fix for mobile overflow */
    body {
      overflow-x: hidden;
      width: 100%;
    }
    
    /* Ensure container doesn't cause horizontal scroll */
    .container {
      width: 100%;
      max-width: 100%;
      padding-left: 1rem;
      padding-right: 1rem;
      margin-left: auto;
      margin-right: auto;
    }
    
    @media (min-width: 640px) {
      .container {
        max-width: 640px;
      }
    }
    
    @media (min-width: 768px) {
      .container {
        max-width: 768px;
      }
    }
    
    @media (min-width: 1024px) {
      .container {
        max-width: 1024px;
      }
    }
    
    @media (min-width: 1280px) {
      .container {
        max-width: 1280px;
      }
    }
    
    /* Ensure product grid doesn't overflow */
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
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="bg-gray-50 w-full overflow-x-hidden" ref={shopContainerRef}>
      {/* Banner de categoría AGRANDADO */}
      <div className="w-full bg-gradient-to-r from-[#004a93] to-[#0071bc] py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <Breadcrumb
            items={[
              { label: "Inicio", href: "/" },
              { label: "Tienda", href: "/shop", active: true },
            ]}
            className="text-white/80 mb-3 sm:mb-4 md:mb-6 text-sm"
          />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-3 md:mb-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
                Productos Sostenibles
              </h1>
              <p className="text-white/90 max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl">
                Soluciones eco-amigables para todas tus necesidades
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-base sm:text-lg md:text-2xl px-3 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 bg-white text-[#004a93] font-semibold mt-2 md:mt-0"
            >
              {sortedProducts.length} productos
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="hidden sm:block">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Tienda", href: "/shop", active: true },
            ]}
          />
        </div>

        {/* Slider de categorías - Mobile Optimized */}
        <div className="mb-4 sm:mb-6 md:mb-8 -mx-3 sm:mx-0 overflow-hidden">
          <CategorySlider categories={categorySliderItems} className="category-slider-container" />
        </div>

        {/* Barra de herramientas simplificada - Mobile First */}
        <div className="flex flex-wrap items-center justify-between mt-2 sm:mt-4 mb-4 sm:mb-6 gap-2 sm:gap-3 border-b pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-3 sm:items-center sm:justify-between">
            {/* Botones de filtro - Stack en móvil, horizontal en desktop */}
            <div className="flex gap-2 w-full sm:w-auto">
              {/* Botón de Filtros */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#004a93] to-[#0071bc] text-white hover:from-[#003a73] hover:to-[#005a99] text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 h-auto rounded-lg sm:rounded-xl shadow-md border-0 w-full"
                  onClick={() => setShowFiltersModal(true)}
                >
                  <SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1" />
                  <span className="font-medium">Filtros</span>
                  {totalFiltersApplied > 0 && (
                    <span className="ml-1 sm:ml-2 bg-white text-[#004a93] rounded-full text-xs px-1.5 py-0.5 font-bold">
                      {totalFiltersApplied}
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* Botón de Marcas */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 bg-white border-2 border-[#004a93] text-[#004a93] hover:bg-blue-50 text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 h-auto rounded-lg sm:rounded-xl shadow-md w-full"
                  onClick={() => setShowBrandsModal(true)}
                >
                  <Tag className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1" />
                  <span className="font-medium">Marcas</span>
                  {selectedBrands.length > 0 && (
                    <span className="ml-1 sm:ml-2 bg-[#004a93] text-white rounded-full text-xs px-1.5 py-0.5 font-bold">
                      {selectedBrands.length}
                    </span>
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Ordenar por y vista - Responsive stackable */}
            <div className="flex flex-row w-full sm:w-auto gap-2 sm:gap-3 md:gap-8 mt-2 sm:mt-0 justify-between">
              <div className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-auto">
                <span className="text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">Ordenar:</span>
                <select
                  className="border rounded p-1 sm:p-2 text-xs sm:text-sm flex-1 sm:flex-auto"
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

              <div className="flex items-center justify-end sm:justify-center gap-1 sm:gap-2 sm:border-l sm:pl-2 md:pl-4">
                <span className="text-xs sm:text-sm md:text-base font-medium hidden xs:inline">Vista:</span>
                <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                  <Button
                    variant={viewMode === "grid-6" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid-6")}
                    className={`h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-lg mx-0.5 sm:mx-1 ${
                      viewMode === "grid-6" ? "bg-[#004a93] text-white" : "text-gray-600"
                    } hover:bg-[#003a73] hover:text-white touch-target`}
                    title="Vista de cuadrícula"
                  >
                    <Grid className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={`h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-lg mx-0.5 sm:mx-1 ${
                      viewMode === "list" ? "bg-[#004a93] text-white" : "text-gray-600"
                    } hover:bg-[#003a73] hover:text-white touch-target`}
                    title="Vista de lista"
                  >
                    <List className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos en grid o list view - Mobile Optimized */}
        <div className="w-full">
          {viewMode === "list" ? (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="list" />
              ))}
            </div>
          ) : (
            <div className="product-grid">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
          )}

          {/* Mejorar espacio en móvil para paginación */}
          <div className="py-4 sm:py-6 md:py-8">
            <Pagination
              totalItems={sortedProducts.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Modal de filtros optimizado para móvil */}
      {showFiltersModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto"
          onClick={() => setShowFiltersModal(false)}
        >
          <div
            className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full sm:max-w-sm h-[70vh] sm:max-h-[70vh] overflow-hidden flex flex-col mt-[15vh] sm:mt-[10vh]"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: isMobile ? "100%" : "320px" }}
          >
            {/* Encabezado del modal */}
            <div className="sticky top-0 z-10 bg-[#004a93] text-white p-2 sm:p-3 flex justify-between items-center">
              <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center">
                <SlidersHorizontal className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Filtros
                {totalFiltersApplied > 0 && (
                  <Badge className="ml-2 bg-white text-[#004a93]">{totalFiltersApplied}</Badge>
                )}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFiltersModal(false)}
                className="text-white hover:bg-blue-800 rounded-full h-7 w-7 sm:h-8 sm:w-8"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            {/* Contenido del modal */}
            <div className="flex flex-col sm:flex-row h-full overflow-hidden">
              {/* Menú lateral - En móvil se convierte en tabs horizontales */}
              <div className="w-full sm:w-64 bg-gray-50 border-r overflow-x-auto sm:overflow-x-visible">
                <div className="p-2 sm:p-3">
                  <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-1 overflow-x-auto sm:overflow-x-visible pb-1 sm:pb-0">
                    <Button
                      variant="ghost"
                      className={`whitespace-nowrap sm:whitespace-normal sm:w-full justify-start text-left text-xs sm:text-sm ${
                        activeAccordion === "precio" ? "bg-blue-50 text-[#004a93] font-medium" : ""
                      }`}
                      onClick={() => toggleAccordion("precio")}
                    >
                      {activeAccordion === "precio" ? (
                        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      )}
                      Precio
                    </Button>

                    <Button
                      variant="ghost"
                      className={`whitespace-nowrap sm:whitespace-normal sm:w-full justify-start text-left text-xs sm:text-sm ${
                        activeAccordion === "colores" ? "bg-blue-50 text-[#004a93] font-medium" : ""
                      }`}
                      onClick={() => toggleAccordion("colores")}
                    >
                      {activeAccordion === "colores" ? (
                        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      )}
                      Colores
                    </Button>

                    <Button
                      variant="ghost"
                      className={`whitespace-nowrap sm:whitespace-normal sm:w-full justify-start text-left text-xs sm:text-sm ${
                        activeAccordion === "tamanos" ? "bg-blue-50 text-[#004a93] font-medium" : ""
                      }`}
                      onClick={() => toggleAccordion("tamanos")}
                    >
                      {activeAccordion === "tamanos" ? (
                        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      )}
                      Tamaños
                    </Button>

                    <Button
                      variant="ghost"
                      className={`whitespace-nowrap sm:whitespace-normal sm:w-full justify-start text-left text-xs sm:text-sm ${
                        activeAccordion === "modelos" ? "bg-blue-50 text-[#004a93] font-medium" : ""
                      }`}
                      onClick={() => toggleAccordion("modelos")}
                    >
                      {activeAccordion === "modelos" ? (
                        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      )}
                      Modelos
                    </Button>

                    <Button
                      variant="ghost"
                      className={`whitespace-nowrap sm:whitespace-normal sm:w-full justify-start text-left text-xs sm:text-sm ${
                        activeAccordion === "marcas" ? "bg-blue-50 text-[#004a93] font-medium" : ""
                      }`}
                      onClick={() => toggleAccordion("marcas")}
                    >
                      {activeAccordion === "marcas" ? (
                        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                      )}
                      Marcas
                    </Button>
                  </div>
                </div>
              </div>

              {/* Contenido del filtro seleccionado */}
              <div className="flex-1 p-2 overflow-y-auto">
                {/* Filtro de precio mejorado */}
                {activeAccordion === "precio" && (
                  <div>
                    <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Rango de precio</h3>
                    <div className="space-y-4 sm:space-y-6">
                      {/* Slider con valores visuales */}
                      <div className="relative pt-4 sm:pt-6 pb-8 sm:pb-10">
                        <Slider
                          value={priceRange}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={setPriceRange}
                          className="mb-4 sm:mb-6"
                        />

                        {/* Marcas de valores */}
                        <div className="absolute left-0 right-0 bottom-0 flex justify-between text-xs text-gray-500">
                          <span>$0</span>
                          <span className="hidden xs:inline">$25.000</span>
                          <span>$50.000</span>
                          <span className="hidden xs:inline">$75.000</span>
                          <span>$100.000</span>
                        </div>
                      </div>

                      {/* Inputs de precio */}
                      <div className="flex items-center justify-between gap-2 sm:gap-4">
                        <div className="flex-1">
                          <label
                            htmlFor="min-price"
                            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                          >
                            Precio mínimo
                          </label>
                          <div className="relative">
                            <span className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              $
                            </span>
                            <input
                              id="min-price"
                              type="number"
                              value={minPrice}
                              onChange={handleMinPriceChange}
                              className="w-full pl-5 sm:pl-7 pr-2 sm:pr-3 py-1 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <span className="text-gray-500 mx-1 sm:mx-2">-</span>
                        </div>

                        <div className="flex-1">
                          <label
                            htmlFor="max-price"
                            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                          >
                            Precio máximo
                          </label>
                          <div className="relative">
                            <span className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              $
                            </span>
                            <input
                              id="max-price"
                              type="number"
                              value={maxPrice}
                              onChange={handleMaxPriceChange}
                              className="w-full pl-5 sm:pl-7 pr-2 sm:pr-3 py-1 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Rangos predefinidos */}
                      <div className="mt-4 sm:mt-6">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Rangos populares</h4>
                        <div className="grid grid-cols-2 gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            className="justify-start text-left text-xs sm:text-sm py-1 sm:py-2 h-auto"
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
                            className="justify-start text-left text-xs sm:text-sm py-1 sm:py-2 h-auto"
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
                            className="justify-start text-left text-xs sm:text-sm py-1 sm:py-2 h-auto"
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
                            className="justify-start text-left text-xs sm:text-sm py-1 sm:py-2 h-auto"
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
                    <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Colores</h3>
                    <div className="grid grid-cols-2 gap-1 sm:gap-2">
                      {colorData.map((color) => (
                        <div
                          key={color.id}
                          className={`flex items-center p-2 sm:p-3 rounded-lg cursor-pointer transition-all ${
                            selectedColors.includes(color.id)
                              ? "bg-blue-50 border border-[#004a93]"
                              : "border border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleColor(color.id)}
                        >
                          <div
                            className="h-4 w-4 sm:h-6 sm:w-6 rounded-full mr-2 sm:mr-3 flex-shrink-0 border border-gray-200"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <span className="flex-grow text-xs sm:text-sm">{color.name}</span>
                          {selectedColors.includes(color.id) && (
                            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[#004a93]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filtro de tamaños */}
                {activeAccordion === "tamanos" && (
                  <div>
                    <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Tamaños</h3>
                    <div className="grid grid-cols-2 gap-1 sm:gap-2">
                      {sizeData.map((size) => (
                        <div
                          key={size.id}
                          className={`flex items-center p-2 sm:p-3 rounded-lg cursor-pointer transition-all ${
                            selectedSizes.includes(size.id)
                              ? "bg-blue-50 border border-[#004a93]"
                              : "border border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleSize(size.id)}
                        >
                          <span className="flex-grow text-xs sm:text-sm">{size.name}</span>
                          {selectedSizes.includes(size.id) && (
                            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[#004a93]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filtro de modelos */}
                {activeAccordion === "modelos" && (
                  <div>
                    <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Modelos</h3>
                    <div className="grid grid-cols-2 gap-1 sm:gap-2">
                      {modelData.map((model) => (
                        <div
                          key={model.id}
                          className={`flex items-center p-2 sm:p-3 rounded-lg cursor-pointer transition-all ${
                            selectedModels.includes(model.id)
                              ? "bg-blue-50 border border-[#004a93]"
                              : "border border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleModel(model.id)}
                        >
                          <span className="flex-grow text-xs sm:text-sm">{model.name}</span>
                          {selectedModels.includes(model.id) && (
                            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[#004a93]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filtro de marcas */}
                {activeAccordion === "marcas" && (
                  <div>
                    <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Marcas</h3>
                    <div className="grid grid-cols-2 gap-1 sm:gap-2">
                      {brandData.map((brand) => (
                        <div
                          key={brand.id}
                          className={`flex flex-col items-center p-2 sm:p-4 rounded-lg cursor-pointer transition-all ${
                            selectedBrands.includes(brand.id)
                              ? "bg-blue-50 border-2 border-[#004a93] shadow-md transform scale-105"
                              : "border border-gray-200 hover:border-gray-300 hover:shadow"
                          }`}
                          onClick={() => toggleBrand(brand.id)}
                        >
                          <div className="relative mb-1 sm:mb-2 h-10 sm:h-16 w-full flex items-center justify-center">
                            <img
                              src={brand.logo || "/placeholder.svg"}
                              alt={brand.name}
                              className="max-h-full max-w-full object-contain"
                              loading="lazy"
                            />
                            {selectedBrands.includes(brand.id) && (
                              <div className="absolute top-0 right-0 bg-[#004a93] text-white rounded-full p-0.5 sm:p-1">
                                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                              </div>
                            )}
                          </div>
                          <span className="text-center font-medium text-xs sm:text-sm">{brand.name}</span>
                          <span className="text-xs text-gray-500 mt-0.5 sm:mt-1">({brand.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pie del modal - sticky para mejor acceso en mobile */}
            <div className="sticky bottom-0 border-t p-3 sm:p-4 flex justify-between items-center bg-gray-50 shadow-inner">
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="text-[#004a93] border-[#004a93] text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 h-auto"
              >
                Limpiar filtros
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFiltersModal(false)}
                  className="text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 h-auto"
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-[#004a93] hover:bg-[#003a73] text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 h-auto"
                  onClick={() => setShowFiltersModal(false)}
                >
                  Aplicar filtros
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de marcas optimizado para móvil */}
      {showBrandsModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto"
          onClick={() => setShowBrandsModal(false)}
        >
          <div
            className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full sm:max-w-sm h-[70vh] sm:max-h-[70vh] overflow-hidden flex flex-col mt-[15vh] sm:mt-[10vh]"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: isMobile ? "100%" : "320px" }}
          >
            {/* Encabezado del modal */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#004a93] to-[#0071bc] text-white p-3 sm:p-4 flex justify-between items-center">
              <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center">
                <Tag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Nuestras Marcas
                {selectedBrands.length > 0 && (
                  <Badge className="ml-2 bg-white text-[#004a93]">{selectedBrands.length}</Badge>
                )}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBrandsModal(false)}
                className="text-white hover:bg-blue-800/30 rounded-full h-7 w-7 sm:h-8 sm:w-8"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            {/* Contenido del modal */}
            <div className="p-2 overflow-y-auto bg-gradient-to-b from-blue-50 to-white">
              <div className="mb-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar marcas..."
                    className="w-full p-2 sm:p-2 md:p-3 pl-8 sm:pl-10 border rounded-full shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all text-xs sm:text-sm"
                  />
                  <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="sm:w-[18px] sm:h-[18px]"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3">
                {currentBrands.map((brand) => (
                  <motion.div
                    key={brand.id}
                    whileHover={{ y: -3 }}
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
                          relative overflow-hidden rounded-full h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center
                          ${selectedBrands.includes(brand.id) ? "border-2 border-white" : ""}
                        `}
                      >
                        <div className="absolute inset-0 bg-white flex items-center justify-center p-2 sm:p-3">
                          <img
                            src={brand.logo || "/placeholder.svg"}
                            alt={brand.name}
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                          />
                        </div>

                        {selectedBrands.includes(brand.id) && (
                          <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                            <div className="absolute bottom-0 right-0 bg-[#004a93] text-white rounded-full p-0.5 sm:p-1 m-0.5 sm:m-1 shadow-md">
                              <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-1 sm:mt-2 md:mt-3 text-center">
                      <span
                        className={`font-medium text-xs sm:text-sm ${selectedBrands.includes(brand.id) ? "text-[#004a93]" : ""}`}
                      >
                        {brand.name}
                      </span>
                      <span className="block text-[10px] sm:text-xs text-gray-500 mt-0.5">({brand.count})</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Paginación estilo testimonios */}
              <div className="flex justify-center items-center mt-4 sm:mt-6 md:mt-8 mb-1 sm:mb-2 md:mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentBrandPage(Math.max(1, currentBrandPage - 1))}
                  disabled={currentBrandPage === 1}
                  className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full border-gray-300 shadow-sm mr-1 sm:mr-2 md:mr-4"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-[#004a93]" />
                </Button>

                <div className="flex justify-center items-center gap-1 sm:gap-2">
                  {Array.from({ length: totalBrandPages }).map((_, index) => (
                    <motion.button
                      key={index}
                      className={`h-1.5 sm:h-2 md:h-3 rounded-full transition-all duration-300 ${
                        index === currentBrandPage - 1
                          ? "bg-[#004a93] w-4 sm:w-6 md:w-8"
                          : "bg-gray-300 w-1.5 sm:w-2 md:w-3"
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
                  className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full border-gray-300 shadow-sm ml-1 sm:ml-2 md:ml-4"
                >
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-[#004a93]" />
                </Button>
              </div>
            </div>

            {/* Pie del modal - sticky para mejor acceso en mobile */}
            <div className="sticky bottom-0 border-t p-3 sm:p-4 flex justify-between items-center bg-gray-50 shadow-inner">
              <Button
                variant="outline"
                onClick={() => setSelectedBrands([])}
                className="text-[#004a93] border-[#004a93] hover:bg-blue-50 text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 h-auto"
              >
                Limpiar
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowBrandsModal(false)}
                  className="text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 h-auto"
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#004a93] to-[#0071bc] hover:from-[#003a73] hover:to-[#005a99] text-white text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3 h-auto"
                  onClick={() => setShowBrandsModal(false)}
                >
                  Aplicar ({selectedBrands.length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
