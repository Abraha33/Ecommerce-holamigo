"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AboutUsSection() {
  return (
    <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/jplast-about-inspiration.jpeg"
          alt="Sobre Nosotros"
          fill
          className="object-cover brightness-[0.7]"
          priority
        />
        <div className="absolute inset-0 h-full bg-gradient-to-b from-blue-900/40 via-white/10 to-blue-800/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">Sobre Nosotros</h2>
        <p className="text-lg md:text-xl mb-8 leading-relaxed">
          En Envax, nos dedicamos a ofrecer soluciones ecológicas innovadoras que contribuyen a un futuro más
          sostenible. Nuestro compromiso con la calidad y el medio ambiente nos impulsa a crear productos que marcan la
          diferencia.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/about">Conoce Más</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-blue-900"
          >
            <Link href="/contact">Contáctanos</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
