"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

export function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange, siblingCount = 1 }: PaginationProps) {
  // Calcular el número total de páginas
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Función para cambiar de página
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange(page)
  }

  return (
    <div className="flex flex-col items-center space-y-6 mt-12 mb-8">
      {/* Controles de navegación */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-10 w-10 rounded-full border-gray-300 shadow-sm"
          title="Página anterior"
        >
          <ChevronLeft className="h-5 w-5 text-[#004a93]" />
        </Button>

        {/* Indicadores de página estilo testimonios */}
        <div className="flex justify-center items-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <motion.button
              key={index}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentPage - 1 ? "bg-[#004a93] w-8" : "bg-gray-300 w-3"
              }`}
              onClick={() => onPageChange(index + 1)}
              aria-label={`Ir a la página ${index + 1}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-10 w-10 rounded-full border-gray-300 shadow-sm"
          title="Página siguiente"
        >
          <ChevronRight className="h-5 w-5 text-[#004a93]" />
        </Button>
      </div>

      {/* Información de productos mostrados */}
      <div className="text-base text-gray-700 font-medium bg-gray-50 px-6 py-3 rounded-lg shadow-sm border border-gray-200">
        Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} -{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} productos
      </div>
    </div>
  )
}
