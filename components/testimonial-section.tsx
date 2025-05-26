"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Testimonial data
const testimonials = [
  {
    name: "María González",
    role: "Cliente frecuente",
    content:
      "Excelente servicio y productos de calidad. Siempre encuentro todo lo que necesito y a precios muy competitivos. Las entregas son rápidas y el servicio al cliente es excepcional.",
    rating: 5,
    avatar: "/diverse-woman-avatar.png",
  },
  {
    name: "Carlos Rodríguez",
    role: "Comprador habitual",
    content:
      "Me encanta la variedad de productos y las ofertas semanales. La aplicación es muy fácil de usar y el proceso de compra es rápido. Definitivamente mi tienda favorita para hacer mercado.",
    rating: 4,
    avatar: "/man-avatar.png",
  },
  {
    name: "Laura Martínez",
    role: "Madre de familia",
    content:
      "Como madre ocupada, valoro mucho la conveniencia y rapidez. Los productos siempre llegan frescos y bien empacados. El servicio al cliente ha sido excelente cuando he necesitado ayuda.",
    rating: 5,
    avatar: "/woman-avatar-2.png",
  },
  {
    name: "Javier Morales",
    role: "Chef profesional",
    content:
      "La calidad de los productos frescos es incomparable. Como chef, aprecio poder encontrar ingredientes premium que satisfacen mis estándares profesionales. El servicio de entrega es puntual.",
    rating: 5,
    avatar: "/chef-avatar.png",
  },
  {
    name: "Ana Sánchez",
    role: "Estudiante universitaria",
    content:
      "Los precios son muy accesibles y tienen muchas promociones. La app es súper intuitiva y me encanta que pueda programar mis entregas para cuando estoy en casa. ¡Totalmente recomendado!",
    rating: 4,
    avatar: "/diverse-woman-avatar.png",
  },
  {
    name: "Roberto Gómez",
    role: "Empresario",
    content:
      "Uso este servicio para abastecer mi oficina y ha sido una experiencia excelente. Puntualidad, calidad y buen precio. El proceso de pedido es muy eficiente y el seguimiento es preciso.",
    rating: 5,
    avatar: "/man-avatar.png",
  },
]

export function TestimonialSection() {
  // State for testimonial carousel
  const [currentPage, setCurrentPage] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Effect to update translation position when page changes
  useEffect(() => {
    setCurrentTranslate(-currentPage * window.innerWidth)
  }, [currentPage])

  // Effect for smooth autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentPage((prev) => (prev + 1) % Math.ceil(testimonials.length / (isMobile ? 1 : 3)))
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [isDragging, isMobile])

  // Calculate testimonials per page
  const testimonialsPerPage = isMobile ? 1 : 3
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage)

  // Get testimonials for current page
  const getCurrentPageTestimonials = useCallback(() => {
    const start = currentPage * testimonialsPerPage
    return testimonials.slice(start, start + testimonialsPerPage)
  }, [currentPage, testimonialsPerPage])

  return (
    <section className="py-6 sm:py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6 md:mb-10">
          Lo que dicen nuestros clientes
        </h2>

        <div
          className="relative overflow-hidden"
          style={{
            touchAction: "pan-y",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
            {getCurrentPageTestimonials().map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px] h-full"
              >
                <div className="p-3 sm:p-6 flex flex-col h-full">
                  <div className="flex items-center mb-2 sm:mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 sm:h-5 sm:w-5 ${i < testimonial.rating ? "text-[#004a93] fill-[#004a93]" : "text-gray-300"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-3 sm:mb-6 italic flex-grow text-xs sm:text-sm">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center mt-auto">
                    <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full overflow-hidden mr-2 sm:mr-4">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#004a93] text-xs sm:text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation controls */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 sm:p-2 shadow-md z-10 hidden md:block"
            onClick={() => {
              const newPage = currentPage === 0 ? totalPages - 1 : currentPage - 1
              setCurrentPage(newPage)
            }}
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-[#004a93]" />
          </button>

          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 sm:p-2 shadow-md z-10 hidden md:block"
            onClick={() => {
              const newPage = (currentPage + 1) % totalPages
              setCurrentPage(newPage)
            }}
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-[#004a93]" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-3 sm:mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 sm:h-3 sm:w-3 mx-1 rounded-full transition-all duration-300 ${
                index === currentPage ? "bg-[#004a93] w-6 sm:w-8" : "bg-gray-300"
              }`}
              onClick={() => setCurrentPage(index)}
              aria-label={`Ir al testimonio ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
