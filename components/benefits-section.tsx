"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Truck, Shield, Leaf, Clock, Star, Recycle, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const benefits = [
  {
    icon: Truck,
    title: "Envío Gratis",
    description:
      "En compras superiores a $50.000. Disfruta de envío gratuito en toda Colombia para pedidos que superen este monto. Entrega rápida y segura.",
    color: "bg-blue-500",
  },
  {
    icon: Shield,
    title: "Garantía de Calidad",
    description:
      "Productos certificados y seguros. Todos nuestros productos pasan por rigurosos controles de calidad para garantizar tu satisfacción.",
    color: "bg-green-500",
  },
  {
    icon: Leaf,
    title: "100% Ecológico",
    description:
      "Productos biodegradables y sostenibles. Comprometidos con el medio ambiente, ofrecemos alternativas ecológicas para un futuro mejor.",
    color: "bg-emerald-500",
  },
  {
    icon: Clock,
    title: "Entrega Rápida",
    description:
      "Recibe tus productos en 24-48 horas. Sistema de logística optimizado para entregas rápidas en las principales ciudades del país.",
    color: "bg-orange-500",
  },
  {
    icon: Star,
    title: "Atención Premium",
    description:
      "Soporte personalizado 24/7. Nuestro equipo de atención al cliente está disponible para ayudarte en cualquier momento que lo necesites.",
    color: "bg-purple-500",
  },
  {
    icon: Recycle,
    title: "Programa de Reciclaje",
    description:
      "Devuelve tus envases y gana puntos. Participa en nuestro programa de reciclaje y obtén descuentos en futuras compras.",
    color: "bg-teal-500",
  },
]

export function BenefitsSection() {
  const [selectedBenefit, setSelectedBenefit] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % benefits.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const nextBenefit = () => {
    setCurrentIndex((prev) => (prev + 1) % benefits.length)
  }

  const prevBenefit = () => {
    setCurrentIndex((prev) => (prev - 1 + benefits.length) % benefits.length)
  }

  const goToBenefit = (index) => {
    setCurrentIndex(index)
  }

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextBenefit()
    }
    if (isRightSwipe) {
      prevBenefit()
    }
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">Nuestros Beneficios</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre todas las ventajas de ser parte de nuestra comunidad
          </p>
          <div className="h-1 w-20 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* Mobile: Horizontal Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="w-full flex-shrink-0 px-4" onClick={() => setSelectedBenefit(benefit)}>
                    <div className="bg-white rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all mx-auto max-w-sm">
                      <div
                        className={`${benefit.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{benefit.title}</h3>
                      <p className="text-sm text-gray-600 text-center line-clamp-3">{benefit.description}</p>
                      <div className="mt-4 text-blue-600 text-sm font-medium text-center">Toca para ver más</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevBenefit}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={nextBenefit}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
            disabled={currentIndex === benefits.length - 1}
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-1 mt-4">
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => goToBenefit(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index ? "bg-blue-600 w-6" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div
                  className={`${benefit.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{benefit.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Modal for Mobile */}
        {selectedBenefit && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:hidden">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative">
              <button
                onClick={() => setSelectedBenefit(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
              <div className={`${selectedBenefit.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                <selectedBenefit.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{selectedBenefit.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{selectedBenefit.description}</p>
              <Button onClick={() => setSelectedBenefit(null)} className="w-full bg-blue-600 hover:bg-blue-700">
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
