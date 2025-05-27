"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Testimonial data
const testimonials = [
  {
    name: "María González",
    role: "Cliente frecuente",
    content:
      "Excelente servicio y productos de calidad. Siempre encuentro todo lo que necesito y a precios muy competitivos.",
    rating: 5,
    avatar: "/diverse-woman-avatar.png",
    location: "Bogotá, Colombia",
  },
  {
    name: "Carlos Rodríguez",
    role: "Comprador habitual",
    content: "Me encanta la variedad de productos y las ofertas semanales. La aplicación es muy fácil de usar.",
    rating: 4,
    avatar: "/man-avatar.png",
    location: "Medellín, Colombia",
  },
  {
    name: "Laura Martínez",
    role: "Madre de familia",
    content: "Como madre ocupada, valoro mucho la conveniencia y rapidez. Los productos siempre llegan frescos.",
    rating: 5,
    avatar: "/woman-avatar-2.png",
    location: "Cali, Colombia",
  },
  {
    name: "Javier Morales",
    role: "Chef profesional",
    content:
      "La calidad de los productos frescos es incomparable. Como chef, aprecio poder encontrar ingredientes premium.",
    rating: 5,
    avatar: "/chef-avatar.png",
    location: "Cartagena, Colombia",
  },
]

export function TestimonialSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [startX, setStartX] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] bg-gradient-to-br from-green-400 via-green-500 to-green-600 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/eco-friendly-food-display.png"
          alt="Productos ecológicos"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-600/80 via-green-500/60 to-green-400/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-3 md:px-6 py-8 md:py-16 flex flex-col justify-center min-h-[450px] md:min-h-[550px]">
        <div className="text-center text-white mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6">
            100% Satisfacción
            <br />
            ¡Clientes Felices!
          </h2>
          <p className="text-base md:text-lg lg:text-xl opacity-90 mb-4 md:mb-8">
            Testimonios reales de nuestros clientes satisfechos
          </p>
        </div>

        {/* Horizontal Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Carousel Container */}
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            onTouchStart={(e) => {
              setStartX(e.touches[0].clientX)
              setIsDragging(true)
            }}
            onTouchMove={(e) => {
              if (!isDragging) return
              const currentX = e.touches[0].clientX
              const diff = startX - currentX
              setCurrentTranslate(-currentTestimonial * window.innerWidth - diff)
            }}
            onTouchEnd={() => {
              setIsDragging(false)
              const moved = startX - currentTranslate
              if (moved > 50 && currentTestimonial < testimonials.length - 1) {
                setCurrentTestimonial((prev) => prev + 1)
              } else if (moved < -50 && currentTestimonial > 0) {
                setCurrentTestimonial((prev) => prev - 1)
              }
              setCurrentTranslate(-currentTestimonial * window.innerWidth)
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4 md:px-8">
                {/* Testimonial Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 md:p-8 mx-auto max-w-xs md:max-w-2xl shadow-xl">
                  <div className="flex items-center mb-4 md:mb-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden mr-3 md:mr-6 border-3 border-green-500">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-base md:text-xl">{testimonial.name}</h3>
                      <p className="text-green-600 text-xs md:text-sm font-medium">{testimonial.role}</p>
                      <p className="text-gray-500 text-xs md:text-sm">{testimonial.location}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3 md:mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 md:h-6 md:w-6 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 italic text-xs md:text-base lg:text-lg leading-relaxed mb-3 md:mb-6">
                    "{testimonial.content}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            className="absolute left-1 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg z-10"
            onClick={prevTestimonial}
            disabled={currentTestimonial === 0}
          >
            <ChevronLeft
              className={`h-5 w-5 md:h-6 md:w-6 ${currentTestimonial === 0 ? "text-gray-400" : "text-green-600"}`}
            />
          </button>

          <button
            className="absolute right-1 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg z-10"
            onClick={nextTestimonial}
            disabled={currentTestimonial === testimonials.length - 1}
          >
            <ChevronRight
              className={`h-5 w-5 md:h-6 md:w-6 ${currentTestimonial === testimonials.length - 1 ? "text-gray-400" : "text-green-600"}`}
            />
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-1 md:space-x-2 mt-4 md:mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial ? "bg-white w-6 md:w-8" : "bg-white/50"
              }`}
              onClick={() => setCurrentTestimonial(index)}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8 md:mt-12">
          <Button
            className="bg-white text-green-600 hover:bg-green-50 px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold shadow-lg text-sm md:text-base"
            onClick={() => (window.location.href = "/testimonios")}
          >
            Ver más testimonios
          </Button>
        </div>
      </div>
    </section>
  )
}
