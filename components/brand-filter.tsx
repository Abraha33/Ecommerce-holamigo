"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Brand {
  id: string
  name: string
  count: number
}

interface BrandFilterProps {
  onFilterChange?: (brands: string[]) => void
}

export function BrandFilter({ onFilterChange }: BrandFilterProps) {
  const [open, setOpen] = useState(false)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  // Mock brands data
  const brands: Brand[] = [
    { id: "econo", name: "ECONO", count: 42 },
    { id: "ecomax", name: "EcoMax", count: 28 },
    { id: "greenlife", name: "GreenLife", count: 35 },
    { id: "naturaplast", name: "NaturaPlast", count: 19 },
    { id: "biopack", name: "BioPack", count: 23 },
    { id: "ecoplast", name: "EcoPlast", count: 31 },
    { id: "greenpack", name: "GreenPack", count: 17 },
    { id: "ecosolutions", name: "EcoSolutions", count: 14 },
    { id: "earthware", name: "EarthWare", count: 9 },
    { id: "biotech", name: "BioTech", count: 12 },
  ]

  const toggleBrand = (brandId: string) => {
    setSelectedBrands((current) => {
      const updated = current.includes(brandId) ? current.filter((id) => id !== brandId) : [...current, brandId]

      if (onFilterChange) {
        onFilterChange(updated)
      }

      return updated
    })
  }

  const clearFilters = () => {
    setSelectedBrands([])
    if (onFilterChange) {
      onFilterChange([])
    }
  }

  const selectedBrandNames = selectedBrands.map((id) => brands.find((brand) => brand.id === id)?.name)

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-[#004a93]">Filtrar por marca</h3>
        {selectedBrands.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs text-[#004a93]">
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {selectedBrands.length > 0 ? (
          selectedBrandNames.map((name, index) => (
            <Badge key={index} variant="secondary" className="px-2 py-1 bg-[#f2f2f2] text-[#004a93]">
              {name}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">Ninguna marca seleccionada</span>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-[#004a93] text-[#004a93]"
          >
            Seleccionar marcas
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar marca..." className="border-b border-[#f2f2f2]" />
            <CommandList>
              <CommandEmpty>No se encontraron marcas.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-64">
                  {brands.map((brand) => (
                    <CommandItem key={brand.id} value={brand.name} onSelect={() => toggleBrand(brand.id)}>
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                            selectedBrands.includes(brand.id) ? "bg-[#004a93] border-[#004a93]" : "border-input"
                          }`}
                        >
                          {selectedBrands.includes(brand.id) && <Check className="h-3 w-3 text-primary-foreground" />}
                        </div>
                        <span>{brand.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">({brand.count})</span>
                      </div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
