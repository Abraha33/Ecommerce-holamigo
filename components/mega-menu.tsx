"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { MenuPromo } from "@/components/menu-promo"

interface MegaMenuProps {
  title: string
  category: string
  children?: React.ReactNode
}

export function MegaMenu({ title, category, children }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Datos de promociones destacadas según la categoría
  const promoData: Record<string, { title: string; description: string; image: string; price: string; link: string }> =
    {
      default: {
        title: "OFERTA ESPECIAL",
        description: "Productos Eco-Friendly",
        image: "/sustainable-living-banner.png",
        price: "$29.900",
        link: "/promos/eco-friendly",
      },
      hogar: {
        title: "HOGAR SOSTENIBLE",
        description: "Productos para un hogar eco-amigable",
        image: "/sustainable-living-room.png",
        price: "$45.900",
        link: "/promos/hogar",
      },
      cocina: {
        title: "COCINA VERDE",
        description: "Utensilios biodegradables",
        image: "/sustainable-kitchen-banner.png",
        price: "$35.500",
        link: "/promos/cocina",
      },
      jardin: {
        title: "JARDÍN ECOLÓGICO",
        description: "Todo para tu jardín sostenible",
        image: "/lush-eco-garden-banner.png",
        price: "$27.900",
        link: "/promos/jardin",
      },
      aseo: {
        title: "LIMPIEZA ECOLÓGICA",
        description: "Productos de limpieza biodegradables",
        image: "/sparkling-clean-banner.png",
        price: "$19.900",
        link: "/promos/limpieza",
      },
    }

  // Obtener datos de promoción según la categoría o usar default
  const promo = promoData[category] || promoData.default

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center gap-1 px-3 py-2 hover:text-[#1e3a8a] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => title !== "TIENDA" && setIsOpen(true)}
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full z-50 bg-white shadow-lg rounded-b-lg p-6 w-[1000px] max-w-[calc(100vw-2rem)] grid grid-cols-3 gap-6"
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="col-span-2 grid grid-cols-3 gap-x-8 gap-y-4">
              {/* Primera columna */}
              <div>
                <h3 className="font-bold text-lg mb-3 text-[#1e3a8a]">Categorías Populares</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/categories/eco-friendly" className="text-sm hover:text-[#1e3a8a] transition-colors">
                      Productos Eco-Friendly
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/biodegradables" className="text-sm hover:text-[#1e3a8a] transition-colors">
                      Biodegradables
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/reciclados" className="text-sm hover:text-[#1e3a8a] transition-colors">
                      Materiales Reciclados
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/organicos" className="text-sm hover:text-[#1e3a8a] transition-colors">
                      Productos Orgánicos
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/reutilizables" className="text-sm hover:text-[#1e3a8a] transition-colors">
                      Reutilizables
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Segunda columna */}
              <div>
                <h3 className="font-bold text-lg mb-3 text-[#1e3a8a]">Por Espacio</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/categories/cocina" className="text-sm hover:text-[#1e3a8a] transition-colors">
                      Cocina Sostenible
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/bano" className="text-sm hover:text-[#1e3a8a] transition-colors">
                      Baño Ecológico
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/jardin" className="text-sm hover:text-[#1e3a8a] transition-colors">
                      Jardín y Exterior
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/oficina" className="text-sm hover:text-[#1e3a8a] transition-colors">
                      Oficina Verde
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/dormitorio" className="text-sm hover:text-[#1e3a8a] transition-colors">
                      Dormitorio Natural
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Tercera columna */}
              <div>
                <h3 className="font-bold text-lg mb-3 text-[#1e3a8a]">Marcas Destacadas</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/brands/ecoplast" className="text-sm hover:text-[#1e3a8a] transition-colors">
                      EcoPlast
                    </Link>
                  </li>
                  <li>
                    <Link href="/brands/greenpack" className="text-sm hover:text-[#1e3a8a] transition-colors">
                      GreenPack
                    </Link>
                  </li>
                  <li>
                    <Link href="/brands/naturaplast" className="text-sm hover:text-[#1e3a8a] transition-colors">
                      NaturaPlast
                    </Link>
                  </li>
                  <li>
                    <Link href="/brands/biopack" className="text-sm hover:text-[#1e3a8a] transition-colors">
                      BioPack
                    </Link>
                  </li>
                  <li>
                    <Link href="/brands/earthware" className="text-sm hover:text-[#1e3a8a] transition-colors">
                      EarthWare
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Cuarta columna - Promociones */}
              <div className="col-span-3 mt-4">
                <h3 className="font-bold text-lg mb-3 text-[#1e3a8a]">Promociones Especiales</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Link
                    href="/promos/destacadas"
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-sm mb-1">Ofertas Destacadas</div>
                    <p className="text-xs text-gray-600">Hasta 40% de descuento</p>
                  </Link>
                  <Link
                    href="/promos/outlet"
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-sm mb-1">Outlet Ecológico</div>
                    <p className="text-xs text-gray-600">Últimas unidades</p>
                  </Link>
                  <Link
                    href="/promos/nuevos"
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-sm mb-1">Recién Llegados</div>
                    <p className="text-xs text-gray-600">Descubre lo nuevo</p>
                  </Link>
                </div>
              </div>
            </div>

            {/* Panel derecho - Promoción destacada */}
            <div>
              <MenuPromo
                title={promo.title}
                subtitle={promo.description}
                price={promo.price}
                image={promo.image}
                link={promo.link}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
