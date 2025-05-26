"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Grid,
  List,
  ChevronDown,
  Tag,
  TrendingUp,
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  Check,
  X,
} from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { Breadcrumb } from "@/components/breadcrumb"
import { motion, AnimatePresence } from "framer-motion"

// Datos de productos en oferta
const dealProducts = [
  {
    id: 1,
    name: "Yogurt Griego Completo Vainilla",
    price: 4.49,
    originalPrice: 5.49,
    image: "/sustainable-kitchen-storage.png",
    slug: "yogurt-griego-vainilla",
    isNew: false,
    isSale: true,
    stockStatus: "in_stock",
  },
  {
    id: 2,
    name: "Albóndigas de Pollo Estilo Italiano",
    price: 7.25,
    originalPrice: 9.35,
    image: "/colorful-recycled-chairs.png",
    slug: "albondigas-pollo-italiano",
    isNew: false,
    isSale: true,
    stockStatus: "in_stock",
  },
  {
    id: 3,
    name: "Palomitas de Maíz Dulces y Saladas",
    price: 3.29,
    originalPrice: 4.29,
    image: "/sustainable-hydration.png",
    slug: "palomitas-maiz-dulces-saladas",
    isNew: false,
    isSale: true,
    stockStatus: "in_stock",
  },
  {
    id: 4,
    name: "Queso Chao Cremoso Original",
    price: 19.5,
    originalPrice: 24.0,
    image: "/eco-friendly-food-display.png",
    slug: "queso-chao-cremoso",
    isNew: false,
    isSale: true,
    stockStatus: "in_stock",
  },
  {
    id: 5,
    name: "Alitas de Búfalo Crujientes",
    price: 7.25,
    originalPrice: 9.99,
    image: "/colorful-market-bags.png",
    slug: "alitas-bufalo-crujientes",
    isNew: false,
    isSale: true,
    stockStatus: "in_stock",
  },
  {
    id: 6,
    name: "Almendras Blue Diamond Ligeramente Saladas",
    price: 10.58,
    originalPrice: 11.68,
    image: "/seedling-nursery.png",
    slug: "almendras-blue-diamond",
    isNew: false,
    isSale: true,
    stockStatus: "in_stock",
  },
  {
    id: 7,
    name: "Arándanos - Paquete de 1 Pinta",
    price: 3.99,
    originalPrice: 4.49,
    image: "/garden-biodegradable-pots.png",
    slug: "arandanos-pinta",
    isNew: false,
    isSale: true,
    stockStatus: "in_stock",
  },
  {
    id: 8,
    name: "Limonada de Fresa Zero Calorías",
    price: 5.95,
    originalPrice: 7.95,
    image: "/sustainable-living-banner.png",
    slug: "limonada-fresa-zero",
    isNew: false,
    isSale: true,
    stockStatus: "in_stock",
  },
  {
    id: 9,
    name: "Galletas Wheat Thins Original",
    price: 3.0,
    originalPrice: 5.0,
    image: "/eco-conscious-living.png",
    slug: "galletas-wheat-thins",
    isNew: false,
    isSale: true,
    stockStatus: "in_stock",
  },
  {
    id: 10,
    name: "Caramelos Duros Werther's Original",
    price: 14.97,
    originalPrice: 20.0,
    image: "/sustainable-pantry-organization.png",
    slug: "caramelos-werthers",
    isNew: false,
    isSale: true,
    stockStatus: "in_stock",
  },
  {
    id: 11,
    name: "Café Colombiano Premium Molido",
    price: 8.99,
    originalPrice: 12.99,
    image: "/sustainable-living-room.png",
    slug: "cafe-colombiano-premium",
    isNew: false,
    isSale: true,
    stockStatus: "in_stock",
  },
  {
    id: 12,
    name: "Aceite de Oliva Extra Virgen",
    price: 15.49,
    originalPrice: 19.99,
    image: "/thriving-eco-garden.png",
    slug: "aceite-oliva-extra-virgen",
    isNew: false,
    isSale: true,
    stockStatus: "in_stock",
  },
]

// Componente para mostrar un contador de tiempo mejorado
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 45,
    seconds: 30,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds -= 1
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes -= 1
          } else {
            minutes = 59
            if (hours > 0) {
              hours -= 1
            } else {
              hours = 23
              if (days > 0) {
                days -= 1
              }
            }
          }
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const timeUnits = [
    { value: timeLeft.days, label: "DÍAS" },
    { value: timeLeft.hours, label: "HORAS" },
    { value: timeLeft.minutes, label: "MIN" },
    { value: timeLeft.seconds, label: "SEG" },
  ]

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {timeUnits.map((unit, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="bg-gradient-to-b from-[#004a93] to-[#0071bc] text-white rounded-lg px-3 py-3 text-2xl md:text-3xl font-bold shadow-lg min-w-[70px] md:min-w-[80px] text-center border-2 border-white">
            {unit.value.toString().padStart(2, "0")}
          </div>
          <span className="text-xs md:text-sm font-semibold text-[#004a93] mt-2">{unit.label}</span>
          {index < timeUnits.length - 1 && (
            <span className="hidden md:block text-[#004a93] font-bold mx-1 -mt-10 text-2xl">:</span>
          )}
        </div>
      ))}
    </div>
  )
}

// Componente para mostrar un banner promocional
const PromoBanner = ({ image, title, subtitle, discount, buttonText, position = "left" }) => {
  return (
    <div className="relative h-[250px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
      <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
      <div
        className={`absolute inset-0 bg-gradient-to-r ${
          position === "left" ? "from-[#004a93]/80 to-transparent" : "from-transparent to-[#004a93]/80"
        } p-8 flex flex-col justify-center ${position === "left" ? "items-start" : "items-end text-right"}`}
      >
        <span className="text-white text-sm font-bold mb-2 bg-[#004a93] px-3 py-1 rounded-full inline-block shadow-md">
          {discount}% DESCUENTO
        </span>
        <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-md">{title}</h3>
        <p className="text-white text-lg mb-4 max-w-xs drop-shadow-md">{subtitle}</p>
        <Button className="bg-white hover:bg-gray-100 text-[#004a93] font-medium shadow-md hover:shadow-lg transition-all">
          {buttonText}
        </Button>
      </div>
    </div>
  )
}

export default function PromosPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [sortOption, setSortOption] = useState("featured")
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [showBrandsModal, setShowBrandsModal] = useState(false)

  // Añade estos estados y datos al inicio del componente
  const [activeAccordion, setActiveAccordion] = useState<string | null>("discount")

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

  // Actualiza las opciones de filtro para que tengan la estructura correcta
  const filterOptions = [
    {
      id: "discount",
      label: "Descuentos",
      options: [
        { id: "discount-30", label: "Descuento > 30%" },
        { id: "discount-20", label: "Descuento > 20%" },
        { id: "discount-10", label: "Descuento > 10%" },
      ],
    },
    {
      id: "offers",
      label: "Ofertas",
      options: [
        { id: "flash-sale", label: "Oferta Relámpago" },
        { id: "weekend", label: "Oferta de Fin de Semana" },
        { id: "clearance", label: "Liquidación" },
      ],
    },
  ]

  // Opciones de ordenamiento
  const sortOptions = [
    { value: "featured", label: "Destacados" },
    { value: "discount-high", label: "Mayor descuento" },
    { value: "price-low", label: "Precio: menor a mayor" },
    { value: "price-high", label: "Precio: mayor a menor" },
    { value: "newest", label: "Más recientes" },
  ]

  // Función para alternar filtros
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter))
    } else {
      setActiveFilters([...activeFilters, filter])
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Breadcrumb - Oculto en móviles */}
      <div className="bg-white border-b hidden sm:block">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 md:py-4">
          <Breadcrumb
            items={[
              { label: "Inicio", href: "/" },
              { label: "Promociones", href: "/promos", active: true },
            ]}
          />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-[250px] sm:h-[300px] md:h-[350px] w-full mb-4 sm:mb-6 md:mb-8">
        <Image
          src="/abstract-blue-white-waves.png"
          alt="Promociones especiales"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#004a93]/90 to-[#004a93]/80">
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 h-full flex flex-col justify-center">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 mb-3"
              >
                <Badge className="bg-white text-[#004a93] px-3 py-1 text-xs font-bold">OFERTAS ESPECIALES</Badge>
                <Badge className="bg-red-600 text-white px-3 py-1 text-xs font-bold animate-pulse">
                  HASTA 50% DESCUENTO
                </Badge>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
              >
                Promociones y Ofertas Exclusivas
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-white/90 text-base md:text-lg mb-6 max-w-2xl"
              >
                Descubre nuestras mejores ofertas en productos seleccionados. Precios especiales por tiempo limitado.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <Button className="bg-white hover:bg-gray-100 text-[#004a93] font-medium">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Ver todas las ofertas
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Contador de tiempo MEJORADO Y MÁS PROMINENTE */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 -mt-4 mb-8 sm:mb-12 relative z-10">
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-xl p-6 md:p-8 border border-blue-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5">
              <div className="bg-gradient-to-r from-[#004a93] to-[#0071bc] p-4 rounded-full shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Ofertas por Tiempo Limitado</h2>
                <p className="text-gray-600 text-base md:text-lg">¡Aprovecha antes que se acaben!</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 mt-2 md:mt-0">
              <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                TERMINA PRONTO
              </div>
              <CountdownTimer />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y controles */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-4"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Botón de Filtros - Igual que en shop */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-gradient-to-r from-[#004a93] to-[#0071bc] text-white hover:from-[#003a73] hover:to-[#005a99] text-base px-6 py-6 h-auto rounded-xl shadow-md border-0"
                  onClick={() => setShowFiltersModal(true)}
                >
                  <SlidersHorizontal className="h-5 w-5 mr-1" />
                  <span className="font-medium">Filtros</span>
                  {activeFilters.length > 0 && (
                    <span className="ml-2 bg-white text-[#004a93] rounded-full text-xs px-2 py-0.5 font-bold">
                      {activeFilters.length}
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* Botón de Marcas - Igual que en shop */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-white border-2 border-[#004a93] text-[#004a93] hover:bg-blue-50 text-base px-6 py-6 h-auto rounded-xl shadow-md"
                  onClick={() => setShowBrandsModal(true)}
                >
                  <Tag className="h-5 w-5 mr-1" />
                  <span className="font-medium">Marcas</span>
                  {activeFilters.filter((f) => f.startsWith("brand-")).length > 0 && (
                    <span className="ml-2 bg-[#004a93] text-white rounded-full text-xs px-2 py-0.5 font-bold">
                      {activeFilters.filter((f) => f.startsWith("brand-")).length}
                    </span>
                  )}
                </Button>
              </motion.div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex-grow md:flex-grow-0">
                <select
                  className="w-full md:w-auto border border-gray-300 rounded-md px-3 py-2 bg-white"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  className={`px-3 py-2 ${viewMode === "grid" ? "bg-[#004a93] text-white" : "bg-white text-gray-700"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  className={`px-3 py-2 ${viewMode === "list" ? "bg-[#004a93] text-white" : "bg-white text-gray-700"}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Panel de filtros */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t mt-4 pt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {filterOptions.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={option.id}
                        checked={activeFilters.includes(option.id)}
                        onChange={() => toggleFilter(option.id)}
                        className="mr-2 h-4 w-4 text-[#004a93]"
                      />
                      <label htmlFor={option.id} className="text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" className="mr-2 text-sm" onClick={() => setActiveFilters([])}>
                    Limpiar filtros
                  </Button>
                  <Button
                    className="bg-[#004a93] hover:bg-[#003366] text-white text-sm"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Aplicar filtros
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filtros activos en móvil */}
          <div className="md:hidden mt-4 flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="px-3 py-1.5 bg-blue-100 text-[#004a93] hover:bg-blue-200"
              >
                {filterOptions.find((f) => f.id === filter)?.label}
                <button className="ml-2 hover:text-red-500" onClick={() => toggleFilter(filter)}>
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Productos en oferta */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 mb-6 sm:mb-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          {viewMode === "list" ? (
            <div className="space-y-4">
              {dealProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} viewMode="list" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {dealProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} viewMode="grid" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Banners promocionales */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <PromoBanner
            image="/colorful-market-bags.png"
            title="Descuentos de Fin de Semana"
            subtitle="Hasta 40% de descuento en productos seleccionados"
            discount={40}
            buttonText="Comprar ahora"
            position="left"
          />
          <PromoBanner
            image="/sustainable-living-banner.png"
            title="Ofertas Relámpago"
            subtitle="¡Solo por 24 horas! Aprovecha ya"
            discount={30}
            buttonText="Ver ofertas"
            position="right"
          />
        </motion.div>
      </div>

      {/* Sección de ahorro */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-[#004a93] to-[#0071bc] rounded-xl p-8 md:p-10 text-center shadow-xl"
        >
          <div className="max-w-3xl mx-auto">
            <Badge className="bg-white text-[#004a93] px-4 py-1.5 text-sm font-bold rounded-full shadow-md mb-6">
              PROGRAMA DE FIDELIDAD
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              AHORRA UN 5-10% EXTRA EN CADA PEDIDO AUTOMÁTICO
            </h2>
            <p className="text-white/90 text-base md:text-lg mb-8">
              Suscríbete a nuestro programa de pedidos recurrentes y ahorra en cada compra. Además, recibe beneficios
              exclusivos y promociones anticipadas.
            </p>
            <Button className="bg-white hover:bg-gray-100 text-[#004a93] font-bold px-6 py-2 shadow-lg hover:shadow-xl transition-all">
              Suscribirse ahora
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Modales de filtros y marcas (como en shop) */}
      {showFiltersModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowFiltersModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado del modal */}
            <div className="bg-[#004a93] text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center">
                <SlidersHorizontal className="mr-2 h-5 w-5" /> Filtros
                {activeFilters.length > 0 && (
                  <Badge className="ml-2 bg-white text-[#004a93]">{activeFilters.length}</Badge>
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
                    {filterOptions.map((category, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className={`w-full justify-start text-left ${
                          activeAccordion === category.id ? "bg-blue-50 text-[#004a93] font-medium" : ""
                        }`}
                        onClick={() => setActiveAccordion(activeAccordion === category.id ? null : category.id)}
                      >
                        {activeAccordion === category.id ? (
                          <ChevronDown className="h-5 w-5 mr-2" />
                        ) : (
                          <ChevronRight className="h-5 w-5 mr-2" />
                        )}
                        {category.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contenido del filtro seleccionado */}
              <div className="flex-1 p-6 overflow-y-auto">
                {activeAccordion && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      {filterOptions.find((f) => f.id === activeAccordion)?.label || "Filtros"}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {filterOptions
                        .find((f) => f.id === activeAccordion)
                        ?.options?.map((option) => (
                          <div
                            key={option.id}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                              activeFilters.includes(option.id)
                                ? "bg-blue-50 border border-[#004a93]"
                                : "border border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => toggleFilter(option.id)}
                          >
                            <span className="flex-grow">{option.label}</span>
                            {activeFilters.includes(option.id) && <Check className="h-5 w-5 text-[#004a93]" />}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pie del modal */}
            <div className="border-t p-4 flex justify-between items-center bg-gray-50">
              <Button
                variant="outline"
                onClick={() => setActiveFilters([])}
                className="text-[#004a93] border-[#004a93]"
              >
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
        </div>
      )}

      {showBrandsModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowBrandsModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado del modal */}
            <div className="bg-gradient-to-r from-[#004a93] to-[#0071bc] text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center">
                <Tag className="mr-2 h-5 w-5" /> Nuestras Marcas
                {activeFilters.filter((f) => f.startsWith("brand-")).length > 0 && (
                  <Badge className="ml-2 bg-white text-[#004a93]">
                    {activeFilters.filter((f) => f.startsWith("brand-")).length}
                  </Badge>
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
                {brandData.map((brand) => (
                  <motion.div
                    key={brand.id}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`relative rounded-full cursor-pointer transition-all duration-300 p-1
                  ${
                    activeFilters.includes(`brand-${brand.id}`)
                      ? "bg-gradient-to-r from-[#004a93] to-[#0071bc] shadow-lg"
                      : "bg-white hover:shadow-md border border-gray-200"
                  }`}
                      onClick={() => toggleFilter(`brand-${brand.id}`)}
                    >
                      <div
                        className={`
                  relative overflow-hidden rounded-full h-24 w-24 flex items-center justify-center
                  ${activeFilters.includes(`brand-${brand.id}`) ? "border-2 border-white" : ""}
                `}
                      >
                        <div className="absolute inset-0 bg-white flex items-center justify-center p-3">
                          <img
                            src={brand.logo || "/placeholder.svg"}
                            alt={brand.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {activeFilters.includes(`brand-${brand.id}`) && (
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
                        className={`font-medium text-sm ${activeFilters.includes(`brand-${brand.id}`) ? "text-[#004a93]" : ""}`}
                      >
                        {brand.name}
                      </span>
                      <span className="block text-xs text-gray-500 mt-1">({brand.count} productos)</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pie del modal */}
            <div className="border-t p-4 flex justify-between items-center bg-gray-50">
              <Button
                variant="outline"
                onClick={() => setActiveFilters(activeFilters.filter((f) => !f.startsWith("brand-")))}
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
                  Aplicar selección ({activeFilters.filter((f) => f.startsWith("brand-")).length})
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
