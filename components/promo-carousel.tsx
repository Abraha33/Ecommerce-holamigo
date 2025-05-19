"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

// Datos de promociones destacadas
const promoData = [
  {
    id: 1,
    title: "Ofertas Especiales",
    description: "Hasta 50% de descuento en productos seleccionados",
    image: "/abstract-blue-white-waves.png",
    badge: "OFERTA LIMITADA",
    discount: "50% OFF",
    link: "/promos/destacadas",
    color: "from-[#004a93]/90 to-[#004a93]/70",
  },
  {
    id: 2,
    title: "Outlet",
    description: "Últimas unidades con descuentos increíbles",
    image: "/outlet-banner.png",
    badge: "OUTLET",
    discount: "70% OFF",
    link: "/promos/outlet",
    color: "from-[#e63946]/90 to-[#e63946]/70",
  },
  {
    id: 3,
    title: "Flash Sale",
    description: "Solo por 24 horas, aprovecha ahora",
    image: "/flash-sale-banner.png",
    badge: "FLASH SALE",
    discount: "40% OFF",
    link: "/promos/flash-sale",
    color: "from-[#1d3557]/90 to-[#1d3557]/70",
  },
]

export function PromoCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const next = useCallback(() => {
    setCurrent((current) => (current === promoData.length - 1 ? 0 : current + 1))
  }, [])

  const prev = useCallback(() => {
    setCurrent((current) => (current === 0 ? promoData.length - 1 : current - 1))
  }, [])

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [autoplay, next])

  return (
    <section className="relative w-full overflow-hidden bg-white rounded-lg shadow-md">
      <div className="relative h-[300px] w-full">
        <AnimatePresence mode="wait">
          {promoData.map(
            (promo, index) =>
              current === index && (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={promo.image || "/placeholder.svg"}
                      alt={promo.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${promo.color}`}>
                      <div className="container mx-auto px-4 h-full flex flex-col justify-center">
                        <div className="max-w-2xl space-y-6">
                          <div className="flex gap-3">
                            <Badge className="bg-white text-[#004a93] px-4 py-1.5 text-sm font-bold rounded-full shadow-md">
                              {promo.badge}
                            </Badge>
                            <Badge className="bg-[#ff3b30] text-white px-4 py-1.5 text-sm font-bold rounded-full shadow-md animate-pulse">
                              {promo.discount}
                            </Badge>
                          </div>
                          <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">{promo.title}</h2>
                          <p className="text-xl text-white/90 max-w-lg">{promo.description}</p>
                          <Link href={promo.link}>
                            <Button className="bg-white text-[#004a93] hover:bg-gray-100 font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl">
                              Ver ofertas
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </div>

      {/* Controles de navegación */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border-white text-[#004a93] hover:bg-white"
          onClick={() => {
            setAutoplay(false)
            prev()
          }}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border-white text-[#004a93] hover:bg-white"
          onClick={() => {
            setAutoplay(false)
            next()
          }}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex items-center justify-center gap-2">
          {promoData.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${current === index ? "w-8 bg-white" : "w-2 bg-white/50"}`}
              onClick={() => {
                setAutoplay(false)
                setCurrent(index)
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
