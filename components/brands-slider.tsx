"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

const brands = [
  { id: "econo", name: "ECONO", logo: "/brands/econo-logo.png" },
  { id: "ecomax", name: "EcoMax", logo: "/brands/ecomax-logo.png" },
  { id: "greenlife", name: "GreenLife", logo: "/brands/greenlife-logo.png" },
  { id: "naturaplast", name: "NaturaPlast", logo: "/brands/naturaplast-logo.png" },
  { id: "biopack", name: "BioPack", logo: "/brands/biopack-logo.png" },
  { id: "ecoplast", name: "EcoPlast", logo: "/brands/ecoplast-logo.png" },
  { id: "greenpack", name: "GreenPack", logo: "/brands/greenpack-logo.png" },
  { id: "ecosolutions", name: "EcoSolutions", logo: "/brands/ecosolutions-logo.png" },
  { id: "earthware", name: "EarthWare", logo: "/brands/earthware-logo.png" },
  { id: "biotech", name: "BioTech", logo: "/brands/biotech-logo.png" },
  { id: "envax", name: "Envax", logo: "/envaxlogo.png" },
  { id: "envaxgold", name: "Envax Gold", logo: "/envaxlogo-gold.png" },
]

export function BrandsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % brands.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Nuestras Marcas Aliadas</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trabajamos con las mejores marcas ecológicas para ofrecerte productos de calidad
          </p>
          <div className="h-1 w-20 bg-green-600 mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* Single Row Slider with Testimonial Effect */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex space-x-8"
            animate={{
              x: `-${currentIndex * 200}px`,
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
            style={{
              width: `${brands.length * 200}px`,
            }}
          >
            {brands.concat(brands).map((brand, index) => (
              <motion.div
                key={`${brand.id}-${index}`}
                className="flex-shrink-0 w-48"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  {/* Circular Logo Container */}
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center shadow-md">
                    {brand.logo === "/brands/econo-logo.png" ? (
                      <span className="font-bold text-[#004a93] text-sm">ECONO</span>
                    ) : brand.logo === "/brands/ecomax-logo.png" ? (
                      <span className="font-bold text-green-600 text-sm">EcoMax</span>
                    ) : brand.logo === "/brands/greenlife-logo.png" ? (
                      <span className="font-bold text-green-500 text-sm">GreenLife</span>
                    ) : brand.logo === "/brands/naturaplast-logo.png" ? (
                      <span className="font-bold text-amber-700 text-xs">NaturaPlast</span>
                    ) : brand.logo === "/brands/biopack-logo.png" ? (
                      <span className="font-bold text-teal-600 text-sm">BioPack</span>
                    ) : brand.logo === "/brands/ecoplast-logo.png" ? (
                      <span className="font-bold text-blue-600 text-sm">EcoPlast</span>
                    ) : brand.logo === "/brands/greenpack-logo.png" ? (
                      <span className="font-bold text-green-700 text-sm">GreenPack</span>
                    ) : brand.logo === "/brands/ecosolutions-logo.png" ? (
                      <span className="font-bold text-cyan-600 text-xs">EcoSolutions</span>
                    ) : brand.logo === "/brands/earthware-logo.png" ? (
                      <span className="font-bold text-amber-600 text-sm">EarthWare</span>
                    ) : brand.logo === "/brands/biotech-logo.png" ? (
                      <span className="font-bold text-purple-600 text-sm">BioTech</span>
                    ) : (
                      <Image
                        src={brand.logo || "/placeholder.svg"}
                        alt={brand.name}
                        width={50}
                        height={50}
                        className="object-contain rounded-full"
                      />
                    )}
                  </div>

                  {/* Brand Name */}
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">{brand.name}</h3>
                  <p className="text-sm text-gray-600">Marca certificada</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-4 md:mt-8 space-x-2 md:space-x-2">
          {brands.slice(0, 6).map((_, index) => (
            <button
              key={index}
              className={`h-1.5 w-1.5 md:h-3 md:w-3 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / 2) === index ? "bg-blue-600 scale-125" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index * 2)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
