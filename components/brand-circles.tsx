"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"

interface BrandCirclesProps {
  selectedBrands?: string[]
  onBrandSelect?: (brandId: string) => void
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

export function BrandCircles({ selectedBrands = [], onBrandSelect }: BrandCirclesProps) {
  const [open, setOpen] = useState(false)

  const handleBrandClick = (brandId: string) => {
    if (onBrandSelect) {
      onBrandSelect(brandId)
    }
  }

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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-[#004a93]">Nuestras Marcas</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-4">
            {brands.map((brand) => {
              const isSelected = selectedBrands.includes(brand.id)
              return (
                <div
                  key={brand.id}
                  className={`flex flex-col items-center justify-center gap-2 transition-all cursor-pointer
                    ${isSelected ? "transform scale-105" : "hover:scale-105"}`}
                  onClick={() => handleBrandClick(brand.id)}
                >
                  <div
                    className={`relative w-20 h-20 rounded-full overflow-hidden 
                    ${
                      isSelected
                        ? "border-4 border-[#004a93] shadow-lg"
                        : "border-2 border-[#004a93] shadow-md hover:shadow-lg"
                    } 
                    flex items-center justify-center bg-white p-2`}
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
                  </div>
                  <span className={`text-sm font-medium text-center ${isSelected ? "text-[#004a93] font-bold" : ""}`}>
                    {brand.name}
                  </span>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
