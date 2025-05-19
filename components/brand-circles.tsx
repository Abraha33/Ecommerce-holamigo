"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tag, X } from "lucide-react"

interface BrandCirclesProps {
  selectedBrands?: string[]
  onBrandSelect?: (brandId: string) => void
  onClose?: () => void
  isModal?: boolean
}

// Datos de marcas
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

export function BrandCircles({ selectedBrands = [], onBrandSelect, onClose, isModal = false }: BrandCirclesProps) {
  const [open, setOpen] = useState(false)

  const handleBrandClick = (brandId: string) => {
    if (onBrandSelect) {
      onBrandSelect(brandId)
    }
  }

  // Si es un modal, no necesitamos el botón para abrir
  if (isModal) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#004a93]">Nuestras Marcas</h2>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-4"
        >
          {brands.map((brand) => {
            const isSelected = selectedBrands.includes(brand.id)
            return (
              <motion.div
                key={brand.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center gap-2 transition-all cursor-pointer`}
                onClick={() => handleBrandClick(brand.id)}
              >
                <motion.div
                  className={`relative w-24 h-24 rounded-full overflow-hidden 
                  ${
                    isSelected
                      ? "border-4 border-[#004a93] shadow-lg"
                      : "border-2 border-[#004a93] shadow-md hover:shadow-lg"
                  } 
                  flex items-center justify-center bg-white p-2`}
                  animate={{
                    boxShadow: isSelected ? "0 10px 25px rgba(0, 74, 147, 0.3)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
                    borderColor: isSelected ? "#004a93" : "#e5e7eb",
                    y: isSelected ? -5 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {brand.logo === "/brands/econo-logo.png" ? (
                    <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                      <span
                        className={`font-bold ${isSelected ? "text-[#004a93] text-base" : "text-[#004a93] text-sm"}`}
                      >
                        ECONO
                      </span>
                    </div>
                  ) : brand.logo === "/brands/ecomax-logo.png" ? (
                    <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                      <span
                        className={`font-bold ${isSelected ? "text-green-600 text-base" : "text-green-600 text-sm"}`}
                      >
                        EcoMax
                      </span>
                    </div>
                  ) : brand.logo === "/brands/greenlife-logo.png" ? (
                    <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                      <span
                        className={`font-bold ${isSelected ? "text-green-500 text-base" : "text-green-500 text-sm"}`}
                      >
                        GreenLife
                      </span>
                    </div>
                  ) : brand.logo === "/brands/naturaplast-logo.png" ? (
                    <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                      <span className={`font-bold ${isSelected ? "text-amber-700 text-sm" : "text-amber-700 text-xs"}`}>
                        NaturaPlast
                      </span>
                    </div>
                  ) : brand.logo === "/brands/biopack-logo.png" ? (
                    <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                      <span className={`font-bold ${isSelected ? "text-teal-600 text-base" : "text-teal-600 text-sm"}`}>
                        BioPack
                      </span>
                    </div>
                  ) : brand.logo === "/brands/ecoplast-logo.png" ? (
                    <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                      <span className={`font-bold ${isSelected ? "text-blue-600 text-base" : "text-blue-600 text-sm"}`}>
                        EcoPlast
                      </span>
                    </div>
                  ) : brand.logo === "/brands/greenpack-logo.png" ? (
                    <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                      <span
                        className={`font-bold ${isSelected ? "text-green-700 text-base" : "text-green-700 text-sm"}`}
                      >
                        GreenPack
                      </span>
                    </div>
                  ) : brand.logo === "/brands/ecosolutions-logo.png" ? (
                    <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                      <span className={`font-bold ${isSelected ? "text-cyan-600 text-sm" : "text-cyan-600 text-xs"}`}>
                        EcoSolutions
                      </span>
                    </div>
                  ) : brand.logo === "/brands/earthware-logo.png" ? (
                    <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                      <span
                        className={`font-bold ${isSelected ? "text-brown-600 text-base" : "text-brown-600 text-sm"}`}
                      >
                        EarthWare
                      </span>
                    </div>
                  ) : brand.logo === "/brands/biotech-logo.png" ? (
                    <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                      <span
                        className={`font-bold ${isSelected ? "text-purple-600 text-base" : "text-purple-600 text-sm"}`}
                      >
                        BioTech
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={brand.logo || "/placeholder.svg"}
                      alt={brand.name}
                      width={80}
                      height={80}
                      className={`object-contain ${isSelected ? "brightness-110" : ""}`}
                    />
                  )}

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute bottom-0 right-0 bg-[#004a93] text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.div>
                <span className={`text-sm font-medium text-center ${isSelected ? "text-[#004a93] font-bold" : ""}`}>
                  {brand.name}
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    )
  }

  // Versión con botón para abrir modal
  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#20509E] text-white hover:bg-white hover:text-black border-[#20509E] shadow-md"
      >
        <Tag className="h-4 w-4" />
        Marcas
        {selectedBrands.length > 0 && (
          <span className="ml-1 bg-white text-[#20509E] rounded-full text-xs px-2 py-0.5">{selectedBrands.length}</span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-[800px] max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#004a93]">Nuestras Marcas</h2>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full">
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-4">
                  {brands.map((brand) => {
                    const isSelected = selectedBrands.includes(brand.id)
                    return (
                      <motion.div
                        key={brand.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex flex-col items-center justify-center gap-2 transition-all cursor-pointer`}
                        onClick={() => handleBrandClick(brand.id)}
                      >
                        <motion.div
                          className={`relative w-20 h-20 rounded-full overflow-hidden 
                          ${
                            isSelected
                              ? "border-4 border-[#004a93] shadow-lg"
                              : "border-2 border-[#004a93] shadow-md hover:shadow-lg"
                          } 
                          flex items-center justify-center bg-white p-2`}
                          animate={{
                            boxShadow: isSelected
                              ? "0 10px 25px rgba(0, 74, 147, 0.3)"
                              : "0 4px 6px rgba(0, 0, 0, 0.1)",
                            borderColor: isSelected ? "#004a93" : "#e5e7eb",
                            y: isSelected ? -5 : 0,
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {brand.logo === "/brands/econo-logo.png" ? (
                            <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                              <span
                                className={`font-bold ${isSelected ? "text-[#004a93] text-base" : "text-[#004a93] text-sm"}`}
                              >
                                ECONO
                              </span>
                            </div>
                          ) : brand.logo === "/brands/ecomax-logo.png" ? (
                            <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                              <span
                                className={`font-bold ${isSelected ? "text-green-600 text-base" : "text-green-600 text-sm"}`}
                              >
                                EcoMax
                              </span>
                            </div>
                          ) : brand.logo === "/brands/greenlife-logo.png" ? (
                            <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                              <span
                                className={`font-bold ${isSelected ? "text-green-500 text-base" : "text-green-500 text-sm"}`}
                              >
                                GreenLife
                              </span>
                            </div>
                          ) : brand.logo === "/brands/naturaplast-logo.png" ? (
                            <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                              <span
                                className={`font-bold ${isSelected ? "text-amber-700 text-sm" : "text-amber-700 text-xs"}`}
                              >
                                NaturaPlast
                              </span>
                            </div>
                          ) : brand.logo === "/brands/biopack-logo.png" ? (
                            <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                              <span
                                className={`font-bold ${isSelected ? "text-teal-600 text-base" : "text-teal-600 text-sm"}`}
                              >
                                BioPack
                              </span>
                            </div>
                          ) : brand.logo === "/brands/ecoplast-logo.png" ? (
                            <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                              <span
                                className={`font-bold ${isSelected ? "text-blue-600 text-base" : "text-blue-600 text-sm"}`}
                              >
                                EcoPlast
                              </span>
                            </div>
                          ) : brand.logo === "/brands/greenpack-logo.png" ? (
                            <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                              <span
                                className={`font-bold ${isSelected ? "text-green-700 text-base" : "text-green-700 text-sm"}`}
                              >
                                GreenPack
                              </span>
                            </div>
                          ) : brand.logo === "/brands/ecosolutions-logo.png" ? (
                            <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                              <span
                                className={`font-bold ${isSelected ? "text-cyan-600 text-sm" : "text-cyan-600 text-xs"}`}
                              >
                                EcoSolutions
                              </span>
                            </div>
                          ) : brand.logo === "/brands/earthware-logo.png" ? (
                            <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                              <span
                                className={`font-bold ${isSelected ? "text-brown-600 text-base" : "text-brown-600 text-sm"}`}
                              >
                                EarthWare
                              </span>
                            </div>
                          ) : brand.logo === "/brands/biotech-logo.png" ? (
                            <div className="w-full h-full flex items-center justify-center bg-white rounded-full">
                              <span
                                className={`font-bold ${isSelected ? "text-purple-600 text-base" : "text-purple-600 text-sm"}`}
                              >
                                BioTech
                              </span>
                            </div>
                          ) : (
                            <Image
                              src={brand.logo || "/placeholder.svg"}
                              alt={brand.name}
                              width={80}
                              height={80}
                              className={`object-contain ${isSelected ? "brightness-110" : ""}`}
                            />
                          )}

                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute bottom-0 right-0 bg-[#004a93] text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              ✓
                            </motion.div>
                          )}
                        </motion.div>
                        <span
                          className={`text-sm font-medium text-center ${isSelected ? "text-[#004a93] font-bold" : ""}`}
                        >
                          {brand.name}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              <div className="p-4 border-t flex justify-end">
                <Button className="bg-[#004a93] hover:bg-[#003a73]" onClick={() => setOpen(false)}>
                  Aplicar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
