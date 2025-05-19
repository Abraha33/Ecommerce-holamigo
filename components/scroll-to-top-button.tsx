"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  // Controla la visibilidad del botón basado en la posición de desplazamiento
  useEffect(() => {
    const toggleVisibility = () => {
      // Mostrar el botón cuando el usuario ha desplazado más de 300px
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Añadir el evento de escucha
    window.addEventListener("scroll", toggleVisibility)

    // Verificar la posición inicial
    toggleVisibility()

    // Limpiar el evento al desmontar
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  // Función para desplazarse suavemente hacia arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed right-6 p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg z-[90] transition-all duration-300 transform hover:scale-110 active:scale-95",
        isVisible ? "bottom-24 opacity-100" : "bottom-0 opacity-0 pointer-events-none",
      )}
      aria-label="Volver arriba"
    >
      <ChevronUp className="h-6 w-6" />
      <span className="sr-only">Volver arriba</span>
    </button>
  )
}
