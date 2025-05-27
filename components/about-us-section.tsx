"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function AboutUsSection() {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/forest-mountains-background.png"
          alt="Montañas y bosque"
          fill
          className="object-cover brightness-[0.7]"
          priority
        />
        <div className="absolute inset-0 h-full bg-gradient-to-b from-blue-900/40 to-blue-800/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <h2 className="text-2xl sm:text-3xl md:text-6xl font-bold mb-3 sm:mb-4 md:mb-8">¿Quiénes somos?</h2>
          <p className="text-sm sm:text-base md:text-xl leading-relaxed mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto">
            Somos una empresa comprometida con el medio ambiente que se dedica a la fabricación y distribución de
            productos ecológicos y biodegradables. Ofrecemos soluciones innovadoras y de alta calidad para
            supermercados, tiendas y hogares conscientes del cuidado del planeta.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2 md:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold"
              size="lg"
            >
              Conoce más sobre nosotros
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
