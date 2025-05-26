"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Settings, MenuIcon, Phone, Wrench, Home } from "lucide-react"
import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"

// Definir las categorías principales con sus iconos
const mainCategories = [
  { name: "Inicio", href: "/inicio", icon: <Home className="w-5 h-5" /> },
  // { name: "Nosotros", href: "/about", icon: <FileText className="w-5 h-5" /> },
  { name: "Tienda", href: "/shop", icon: <ShoppingCart className="w-5 h-5" /> },
  { name: "Promos", href: "/promos", icon: <Settings className="w-5 h-5" /> },
  { name: "Categorías", href: "/categories", icon: <MenuIcon className="w-5 h-5" /> },
  { name: "Contacto", href: "/contact", icon: <Phone className="w-5 h-5" /> },
  { name: "Mi pedido", href: "/orders", icon: <Wrench className="w-5 h-5" /> },
]

export function MainNavigation() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Verificar al cargar
    checkIfMobile()

    // Verificar al cambiar el tamaño de la ventana
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Estilos personalizados para Swiper
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
      .nav-swiper .swiper-wrapper {
        transition-timing-function: ease-out;
      }
      .nav-swiper .swiper-slide {
        width: auto;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <nav className="bg-[#f8f9fa] border-b shadow-sm">
      <div className="container mx-auto">
        {isMobile ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView="auto"
            spaceBetween={0}
            freeMode={true}
            grabCursor={true}
            className="nav-swiper"
          >
            {mainCategories.map((category) => (
              <SwiperSlide key={category.name}>
                <Link
                  href={category.href}
                  className={`flex items-center px-2 md:px-3 py-2 text-xs md:text-sm font-medium transition-colors duration-200 hover:text-[#1e3a8a] ${
                    pathname === category.href ? "text-[#1e3a8a] font-bold" : "text-gray-700"
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name.toUpperCase()}
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex overflow-x-auto whitespace-nowrap justify-start py-1 hide-scrollbar">
            {mainCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`flex items-center px-2 md:px-3 py-2 text-xs md:text-sm font-medium transition-colors duration-200 hover:text-[#1e3a8a] ${
                  pathname === category.href ? "text-[#1e3a8a] font-bold" : "text-gray-700"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name.toUpperCase()}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

// Mantener los estilos para ocultar la barra de desplazamiento
const scrollbarHideStyle = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

// Añadir el estilo al documento
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = scrollbarHideStyle
  document.head.appendChild(style)
}
