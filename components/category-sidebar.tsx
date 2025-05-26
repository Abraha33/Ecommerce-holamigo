import type React from "react"
;('"use client')

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
  ShoppingBag,
  Coffee,
  Milk,
  Droplets,
  Wine,
  Apple,
  Beef,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { categoriesData } from "@/lib/categories-data"

// Estructura de datos para categorías con 3 niveles e iconos
type NestedSubcategory = {
  name: string
  href: string
  slug: string
}

type Subcategory = {
  name: string
  href: string
  slug: string
  nestedSubcategories?: NestedSubcategory[]
}

type Category = {
  name: string
  href: string
  slug: string
  icon: React.ReactNode // Componente de icono de Lucide
  subcategories: Subcategory[]
}

// Mapeo de iconos para categorías
const categoryIcons: Record<string, React.ReactNode> = {
  insuperables: <Sparkles className="h-6 w-6" />,
  "oferta-estrella": <Sparkles className="h-6 w-6" />,
  lacteos: <Milk className="h-6 w-6" />,
  aseo: <Droplets className="h-6 w-6" />,
  licores: <Wine className="h-6 w-6" />,
  cosmeticos: <Droplets className="h-6 w-6" />,
  bebidas: <Coffee className="h-6 w-6" />,
  "frutas-verduras": <Apple className="h-6 w-6" />,
  carnes: <Beef className="h-6 w-6" />,
  delicatessen: <ShoppingBag className="h-6 w-6" />,
  snack: <ShoppingBag className="h-6 w-6" />,
  "bebidas-hidratantes": <Coffee className="h-6 w-6" />,
}

// Transformar los datos de categorías al formato requerido
const transformCategories = (): Category[] => {
  return categoriesData.map((category) => ({
    name: category.title,
    href: `/categories/${category.slug}`,
    slug: category.slug,
    icon: categoryIcons[category.slug] || <ShoppingBag className="h-6 w-6" />,
    subcategories:
      category.subcategories?.map((subcategory) => ({
        name: subcategory.title,
        href: `/categories/${category.slug}/${subcategory.slug}`,
        slug: subcategory.slug,
        nestedSubcategories:
          subcategory.nestedSubcategories?.map((nestedSubcategory) => ({
            name: nestedSubcategory.title,
            href: `/categories/${category.slug}/${subcategory.slug}/${nestedSubcategory.slug}`,
            slug: nestedSubcategory.slug,
          })) || [],
      })) || [],
  }))
}

export function CategorySidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const categories = transformCategories()

  // Estados para controlar el menú
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuAnimation, setMenuAnimation] = useState<"opening" | "closing" | "idle">("idle")
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Estados para la navegación multinivel
  const [currentLevel, setCurrentLevel] = useState<"main" | "subcategory" | "nested">("main")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null)
  const [levelTransition, setLevelTransition] = useState<"none" | "forward" | "backward">("none")
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  // Ruta de navegación (breadcrumb)
  const [navigationPath, setNavigationPath] = useState<
    Array<{ name: string; level: "main" | "subcategory" | "nested" }>
  >([{ name: "Categorías", level: "main" }])

  // Abrir el menú
  const openMenu = () => {
    document.body.style.overflow = "hidden" // Prevenir scroll del body
    setMenuAnimation("opening")
    setIsMenuOpen(true)
    resetMenuState()
  }

  // Cerrar el menú
  const closeMenu = () => {
    setMenuAnimation("closing")
    setTimeout(() => {
      setIsMenuOpen(false)
      resetMenuState()
      setMenuAnimation("idle")
      document.body.style.overflow = "" // Restaurar scroll del body
    }, 400)
  }

  // Alternar entre abrir y cerrar
  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  // Resetear el estado del menú
  const resetMenuState = () => {
    setLevelTransition("none")
    setCurrentLevel("main")
    setSelectedCategory(null)
    setSelectedSubcategory(null)
    setNavigationPath([{ name: "Categorías", level: "main" }])
  }

  // Mostrar subcategorías (nivel 2)
  const showSubcategories = (category: Category) => {
    setLevelTransition("forward")
    setTimeout(() => {
      setSelectedCategory(category)
      setCurrentLevel("subcategory")
      setNavigationPath([
        { name: "Categorías", level: "main" },
        { name: category.name, level: "subcategory" },
      ])
      setLevelTransition("none")
    }, 400)
  }

  // Mostrar subcategorías anidadas (nivel 3)
  const showNestedSubcategories = (subcategory: Subcategory) => {
    setLevelTransition("forward")
    setTimeout(() => {
      setSelectedSubcategory(subcategory)
      setCurrentLevel("nested")
      setNavigationPath([
        { name: "Categorías", level: "main" },
        { name: selectedCategory?.name || "", level: "subcategory" },
        { name: subcategory.name, level: "nested" },
      ])
      setLevelTransition("none")
    }, 400)
  }

  // Volver al nivel principal
  const goBackToMain = () => {
    setLevelTransition("backward")
    setTimeout(() => {
      setCurrentLevel("main")
      setSelectedCategory(null)
      setSelectedSubcategory(null)
      setNavigationPath([{ name: "Categorías", level: "main" }])
      setLevelTransition("none")
    }, 400)
  }

  // Volver al nivel de subcategorías
  const goBackToSubcategory = () => {
    setLevelTransition("backward")
    setTimeout(() => {
      setCurrentLevel("subcategory")
      setSelectedSubcategory(null)
      setNavigationPath(navigationPath.slice(0, 2))
      setLevelTransition("none")
    }, 400)
  }

  // Navegar usando el breadcrumb
  const navigateToPath = (level: "main" | "subcategory" | "nested", index: number) => {
    if (level === "main") {
      goBackToMain()
    } else if (level === "subcategory" && selectedCategory) {
      setLevelTransition("backward")
      setTimeout(() => {
        setCurrentLevel("subcategory")
        setSelectedSubcategory(null)
        setNavigationPath(navigationPath.slice(0, 2))
        setLevelTransition("none")
      }, 400)
    }
  }

  // Cerrar el menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false)
    resetMenuState()
  }, [pathname])

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isMenuOpen) {
        closeMenu()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  const logoSrc = "/envaxlogo.png"

  return (
    <>
      {/* Botón de hamburguesa */}
      <Button
        variant="ghost"
        size="icon"
        className="md:mr-2 relative overflow-hidden group md:h-10 md:w-10 h-12 w-12 flex items-center justify-center md:text-gray-700 text-[#0A3D91]"
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-label="Menú principal"
      >
        {isMenuOpen ? (
          <X className="h-6 w-6 md:h-6 md:w-6 h-8 w-8 transition-transform duration-300 group-hover:scale-110 md:drop-shadow-none drop-shadow-md" />
        ) : (
          <Menu className="h-6 w-6 md:h-6 md:w-6 h-8 w-8 transition-transform duration-300 group-hover:scale-110 md:drop-shadow-none drop-shadow-md" />
        )}
        <span className="absolute inset-0 bg-blue-100 transform scale-0 rounded-full transition-transform duration-300 group-hover:scale-100"></span>
      </Button>

      {/* Overlay para el fondo cuando el menú está abierto */}
      {isMenuOpen && (
        <div
          className={`fixed inset-0 bg-black/20 z-50 transition-opacity duration-300 ${
            menuAnimation === "opening"
              ? "opacity-0 animate-fade-in"
              : menuAnimation === "closing"
                ? "opacity-100 animate-fade-out"
                : "opacity-100"
          }`}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar del menú */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-[380px] max-w-[90vw] bg-white shadow-xl z-50 transform transition-transform duration-500 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-hidden flex flex-col`}
      >
        {/* Encabezado del sidebar */}
        <div className="bg-gradient-to-r from-[#0A3D91] to-[#1E65C8] text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative h-10 w-10 mr-2 animate-pulse-subtle">
              <Image src={logoSrc || "/placeholder.svg"} alt="Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold menu-title">
              {currentLevel === "main"
                ? "Categorías"
                : currentLevel === "subcategory" && selectedCategory
                  ? selectedCategory.name
                  : currentLevel === "nested" && selectedSubcategory
                    ? selectedSubcategory.name
                    : "Categorías"}
            </span>
          </div>
          <button
            onClick={closeMenu}
            className="text-white hover:text-gray-200 transition-transform duration-300 hover:rotate-90"
            aria-label="Cerrar menú"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Ruta de navegación (breadcrumb) */}
        <div className="bg-gray-50 px-4 py-2 border-b flex items-center overflow-x-auto scrollbar-hide">
          {navigationPath.map((item, index) => (
            <div key={index} className="flex items-center whitespace-nowrap">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />}
              <button
                onClick={() => navigateToPath(item.level, index)}
                className={`text-sm ${
                  index === navigationPath.length - 1
                    ? "font-semibold text-[#0A3D91]"
                    : "text-gray-600 hover:text-[#0A3D91]"
                }`}
              >
                {item.name}
              </button>
            </div>
          ))}
        </div>

        {/* Contenido del sidebar - Navegación multinivel con animaciones */}
        <div className="flex-1 overflow-hidden relative">
          {/* Nivel 1: Categorías principales */}
          <div
            className={`absolute inset-0 overflow-y-auto transition-transform duration-500 ease-in-out ${
              currentLevel === "main" ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-4">
              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div key={category.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 30}ms` }}>
                    <div
                      className={`flex items-center p-4 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 ${
                        hoveredCategory === category.name ? "bg-blue-50" : ""
                      }`}
                      onMouseEnter={() => setHoveredCategory(category.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      onClick={() => showSubcategories(category)}
                    >
                      <div
                        className={`w-12 h-12 rounded-full bg-[#E6F0FF] flex items-center justify-center mr-4 text-[#0A3D91] transition-all duration-300 ${
                          hoveredCategory === category.name ? "scale-110 shadow-md" : ""
                        }`}
                      >
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-lg">{category.name}</span>
                        <p className="text-xs text-gray-500 mt-1">
                          {category.subcategories.length} subcategorías disponibles
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nivel 2: Subcategorías */}
          <div
            className={`absolute inset-0 overflow-y-auto transition-transform duration-500 ease-in-out ${
              currentLevel === "subcategory" ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {selectedCategory && (
              <div className="p-4">
                <div className="sticky top-0 bg-white z-10 mb-6">
                  <button
                    onClick={goBackToMain}
                    className="flex items-center text-[#0A3D91] font-medium hover:bg-blue-50 p-2 rounded-md transition-all duration-200 group"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                    <span>Volver a Categorías</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedCategory.subcategories.map((subcategory, index) => (
                    <div
                      key={subcategory.name}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 30 + 200}ms` }}
                    >
                      <div
                        className={`p-4 border rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer ${
                          selectedSubcategory?.name === subcategory.name ? "border-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => {
                          if (subcategory.nestedSubcategories && subcategory.nestedSubcategories.length > 0) {
                            showNestedSubcategories(subcategory)
                          } else {
                            router.push(subcategory.href)
                            closeMenu()
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-lg text-[#0A3D91]">{subcategory.name}</h3>
                          {subcategory.nestedSubcategories && subcategory.nestedSubcategories.length > 0 && (
                            <div className="flex items-center">
                              <span className="text-sm text-blue-600 mr-2">
                                {subcategory.nestedSubcategories.length} opciones
                              </span>
                              <ChevronRight className="h-5 w-5 text-[#0A3D91]" />
                            </div>
                          )}
                        </div>

                        {subcategory.nestedSubcategories && subcategory.nestedSubcategories.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Incluye: </span>
                            {subcategory.nestedSubcategories.slice(0, 2).map((nested, i) => (
                              <span key={i}>
                                {nested.name}
                                {i < Math.min(1, subcategory.nestedSubcategories!.length - 1) && ", "}
                              </span>
                            ))}
                            {subcategory.nestedSubcategories.length > 2 && (
                              <span className="text-blue-500"> y más...</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nivel 3: Subcategorías anidadas */}
          <div
            className={`absolute inset-0 overflow-y-auto transition-transform duration-500 ease-in-out ${
              currentLevel === "nested" ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {selectedCategory && selectedSubcategory && selectedSubcategory.nestedSubcategories && (
              <div className="p-4">
                <div className="sticky top-0 bg-white z-10 mb-6">
                  <button
                    onClick={goBackToSubcategory}
                    className="flex items-center text-[#0A3D91] font-medium hover:bg-blue-50 p-2 rounded-md transition-all duration-200 group"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                    <span>Volver a {selectedCategory.name}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedSubcategory.nestedSubcategories.map((nestedSubcategory, index) => (
                    <div
                      key={nestedSubcategory.name}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 30 + 200}ms` }}
                    >
                      <Link
                        href={nestedSubcategory.href}
                        className="block p-4 border rounded-lg hover:border-blue-300 hover:shadow-md text-gray-800 transition-all duration-200 hover:bg-blue-50"
                        onClick={closeMenu}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{nestedSubcategory.name}</span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer del menú con decoración */}
        <div className="p-4 bg-[#F0F7FF] border-t text-center text-sm text-gray-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-blue-500 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-blue-500 translate-x-1/2 translate-y-1/2"></div>
          </div>
          <p className="relative z-10">Explora nuestras categorías y encuentra lo que necesitas</p>
        </div>
      </div>
    </>
  )
}
