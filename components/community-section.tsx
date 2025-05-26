"use client"

import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import Image from "next/image"

export function CommunitySection() {
  return (
    <section className="py-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 border-2 border-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Conoce Nuestro Catálogo</h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Mantente al día con nuestros productos y ofertas especiales
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center max-w-4xl mx-auto">
          {/* Left Content */}
          <div className="text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-4">
              <div className="bg-white/20 p-4 rounded-full">
                <BookOpen className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3">Catálogo Completo</h3>
            <p className="text-blue-100 mb-6 text-lg">
              Explora más de 1,000 productos organizados por categorías. Encuentra todo lo que necesitas en un solo
              lugar.
            </p>
            <Button
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full text-lg font-semibold"
              size="lg"
            >
              Explorar Catálogo
            </Button>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/colorful-supermarket.png"
                alt="Nuestro catálogo de productos"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-blue-600 text-sm font-semibold">
                +1000 Productos
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
