"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { Tag, CircleSlash, Layers, Palette, ShoppingBag, Star, Filter, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

const categories = [
  { id: "kitchen", label: "Kitchen & Storage", subcategories: ["Containers", "Utensils", "Storage"] },
  { id: "garden", label: "Garden & Outdoor", subcategories: ["Planters", "Furniture", "Tools"] },
  { id: "home", label: "Home Decor", subcategories: ["Accents", "Textiles", "Wall Art"] },
  { id: "office", label: "Office Supplies", subcategories: ["Organization", "Stationery", "Desk Accessories"] },
  { id: "bathroom", label: "Bathroom", subcategories: ["Accessories", "Storage", "Textiles"] },
]

const colors = [
  { id: "green", label: "Green" },
  { id: "blue", label: "Blue" },
  { id: "black", label: "Black" },
  { id: "white", label: "White" },
  { id: "natural", label: "Natural" },
]

const materials = [
  { id: "recycled-plastic", label: "Recycled Plastic" },
  { id: "bioplastic", label: "Bioplastic" },
  { id: "bamboo", label: "Bamboo" },
  { id: "compostable", label: "Compostable" },
]

// Actualizar los atributos de filtro para que coincidan con los solicitados
const attributes = [
  {
    name: "Color",
    icon: <Palette className="h-5 w-5" />,
    options: [
      { id: "negro", label: "Negro" },
      { id: "blanco", label: "Blanco" },
      { id: "azul", label: "Azul" },
      { id: "verde", label: "Verde" },
      { id: "rojo", label: "Rojo" },
    ],
  },
  {
    name: "Material",
    icon: <Tag className="h-5 w-5" />,
    options: [
      { id: "plastico-reciclado", label: "Plástico Reciclado" },
      { id: "bioplastico", label: "Bioplástico" },
      { id: "polietileno", label: "Polietileno" },
      { id: "polipropileno", label: "Polipropileno" },
    ],
  },
  {
    name: "Tamaño",
    icon: <Layers className="h-5 w-5" />,
    options: [
      { id: "pequeno", label: "Pequeño" },
      { id: "mediano", label: "Mediano" },
      { id: "grande", label: "Grande" },
      { id: "extra-grande", label: "Extra Grande" },
    ],
  },
  {
    name: "Modelo",
    icon: <ShoppingBag className="h-5 w-5" />,
    options: [
      { id: "estandar", label: "Estándar" },
      { id: "premium", label: "Premium" },
      { id: "industrial", label: "Industrial" },
      { id: "domestico", label: "Doméstico" },
    ],
  },
]

// Añadir prop para modo compacto
interface ProductFiltersProps {
  compact?: boolean
  onFilterChange?: (filters: any) => void
}

export function ProductFilters({ compact = false, onFilterChange }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  // Añadir el estado para los atributos seleccionados
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({
    Color: [],
    Material: [],
    Tamaño: [],
    Modelo: [],
  })

  const handleCategoryChange = (id: string) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleColorChange = (id: string) => {
    setSelectedColors((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleMaterialChange = (id: string) => {
    setSelectedMaterials((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands)
  }

  // Añadir funciones para manejar los cambios de atributos
  const handleAttributeChange = (attributeName: string, optionId: string) => {
    setSelectedAttributes((prev) => {
      const current = prev[attributeName] || []
      const updated = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId]

      return {
        ...prev,
        [attributeName]: updated,
      }
    })
  }

  const handleClearAttribute = (attributeName: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: [],
    }))
  }

  const handleReset = () => {
    setPriceRange([0, 100])
    setSelectedCategories([])
    setSelectedColors([])
    setSelectedMaterials([])
    setSelectedBrands([])
    setSelectedAttributes({
      Color: [],
      Material: [],
      Tamaño: [],
      Modelo: [],
    })
  }

  const totalFiltersApplied =
    selectedCategories.length +
    selectedColors.length +
    selectedMaterials.length +
    selectedBrands.length +
    (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0) +
    Object.values(selectedAttributes).reduce((acc, curr) => acc + curr.length, 0)

  return (
    <div className={compact ? "flex flex-wrap gap-2 items-center" : "mb-8"}>
      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtros
            {totalFiltersApplied > 0 && <Badge className="ml-2 bg-[#004a93]">{totalFiltersApplied}</Badge>}
          </h2>
          {totalFiltersApplied > 0 && (
            <Button variant="outline" size="sm" onClick={handleReset} className="flex items-center">
              <CircleSlash className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      )}

      {/* Filtros horizontales con botones circulares - versión mejorada */}
      <div className={`flex flex-wrap gap-2 ${compact ? "" : "mb-4"}`}>
        {attributes.map((attribute, index) => (
          <Popover
            key={index}
            open={activeFilter === attribute.name}
            onOpenChange={(open) => setActiveFilter(open ? attribute.name : null)}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`${compact ? "h-10 px-3 py-1" : "rounded-full h-14 w-14 p-0 flex flex-col"} items-center justify-center transition-all transform active:scale-95 ${
                  selectedAttributes?.[attribute.name]?.length > 0
                    ? "border-[#004a93] bg-[#004a93] text-white"
                    : "border-[#004a93] text-[#004a93] hover:bg-blue-50"
                }`}
              >
                {compact ? (
                  <div className="flex items-center gap-1">
                    {attribute.icon}
                    <span>{attribute.name}</span>
                    {selectedAttributes?.[attribute.name]?.length > 0 && (
                      <span className="bg-white text-[#004a93] rounded-full w-5 h-5 flex items-center justify-center text-xs ml-1">
                        {selectedAttributes[attribute.name].length}
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    {attribute.icon}
                    <span className="text-xs mt-1">{attribute.name}</span>
                    {selectedAttributes?.[attribute.name]?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-white text-[#004a93] border border-[#004a93] rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {selectedAttributes[attribute.name].length}
                      </span>
                    )}
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-4 border-b">
                <h3 className="font-medium">{attribute.name}</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {attribute.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${attribute.name.toLowerCase()}-${option.id}`}
                        checked={selectedAttributes?.[attribute.name]?.includes(option.id) || false}
                        onCheckedChange={() => handleAttributeChange(attribute.name, option.id)}
                      />
                      <Label
                        htmlFor={`${attribute.name.toLowerCase()}-${option.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleClearAttribute(attribute.name)}>
                  Limpiar
                </Button>
                <Button size="sm" onClick={() => setActiveFilter(null)}>
                  Aplicar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ))}

        {/* Filtro de Precio */}
        <Popover open={activeFilter === "price"} onOpenChange={(open) => setActiveFilter(open ? "price" : null)}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`${compact ? "h-10 px-3 py-1" : "rounded-full h-14 w-14 p-0 flex flex-col"} items-center justify-center transition-all transform active:scale-95 ${
                priceRange[0] > 0 || priceRange[1] < 100
                  ? "border-[#004a93] bg-[#004a93] text-white"
                  : "border-[#004a93] text-[#004a93] hover:bg-blue-50"
              }`}
            >
              {compact ? (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>Precio</span>
                  {(priceRange[0] > 0 || priceRange[1] < 100) && (
                    <span className="bg-white text-[#004a93] rounded-full w-5 h-5 flex items-center justify-center text-xs ml-1">
                      1
                    </span>
                  )}
                </div>
              ) : (
                <>
                  <Star className="h-5 w-5" />
                  <span className="text-xs mt-1">Precio</span>
                  {(priceRange[0] > 0 || priceRange[1] < 100) && (
                    <span className="absolute -top-1 -right-1 bg-white text-[#004a93] border border-[#004a93] rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      1
                    </span>
                  )}
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-4 border-b">
              <h3 className="font-medium">Rango de precio</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <Slider value={priceRange} min={0} max={100} step={1} onValueChange={setPriceRange} />
                <div className="flex items-center justify-between">
                  <span>{formatCurrency(priceRange[0])}</span>
                  <span>{formatCurrency(priceRange[1])}</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setPriceRange([0, 100])}>
                Limpiar
              </Button>
              <Button size="sm" onClick={() => setActiveFilter(null)}>
                Aplicar
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {!compact && (
        <div className="mt-6">
          <Button className="w-full bg-[#004a93] hover:bg-[#0071bc]">Aplicar filtros</Button>
        </div>
      )}
    </div>
  )
}

// Componente separado para los filtros activos
export function ActiveFilters({
  selectedCategories = [],
  selectedColors = [],
  selectedMaterials = [],
  selectedAttributes = {},
  priceRange = [0, 100],
  handleCategoryChange = () => {},
  handleColorChange = () => {},
  handleMaterialChange = () => {},
  handleAttributeChange = () => {},
  setPriceRange = () => {},
}) {
  const totalFiltersApplied =
    selectedCategories.length +
    selectedColors.length +
    selectedMaterials.length +
    Object.values(selectedAttributes).reduce((acc, curr) => acc + curr.length, 0) +
    (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0)

  if (totalFiltersApplied === 0) return null

  return (
    <div className="w-full bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Filtros aplicados:</h3>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-7"
          onClick={() => {
            setPriceRange([0, 100])
            selectedCategories.forEach((id) => handleCategoryChange(id))
            selectedColors.forEach((id) => handleColorChange(id))
            selectedMaterials.forEach((id) => handleMaterialChange(id))
            Object.entries(selectedAttributes).forEach(([attrName, options]) => {
              options.forEach((optId) => handleAttributeChange(attrName, optId))
            })
          }}
        >
          <CircleSlash className="h-3 w-3 mr-1" />
          Limpiar todos
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedCategories.map((catId) => {
          const category = categories.find((c) => c.id === catId)
          return category ? (
            <Badge
              key={catId}
              variant="secondary"
              className="pl-2 pr-1 py-1 flex items-center gap-1 bg-blue-50 text-[#004a93]"
            >
              {category.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => handleCategoryChange(catId)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ) : null
        })}

        {selectedColors.map((colorId) => {
          const color = colors.find((c) => c.id === colorId)
          return color ? (
            <Badge
              key={colorId}
              variant="secondary"
              className="pl-2 pr-1 py-1 flex items-center gap-1 bg-blue-50 text-[#004a93]"
            >
              {color.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => handleColorChange(colorId)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ) : null
        })}

        {selectedMaterials.map((materialId) => {
          const material = materials.find((m) => m.id === materialId)
          return material ? (
            <Badge
              key={materialId}
              variant="secondary"
              className="pl-2 pr-1 py-1 flex items-center gap-1 bg-blue-50 text-[#004a93]"
            >
              {material.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => handleMaterialChange(materialId)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ) : null
        })}

        {(priceRange[0] > 0 || priceRange[1] < 100) && (
          <Badge variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1 bg-blue-50 text-[#004a93]">
            {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
            <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => setPriceRange([0, 100])}>
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {Object.entries(selectedAttributes).map(([attributeName, selectedOptions]) =>
          selectedOptions.map((optionId) => {
            const attribute = attributes.find((attr) => attr.name === attributeName)
            const option = attribute?.options.find((opt) => opt.id === optionId)

            return option ? (
              <Badge
                key={`${attributeName}-${optionId}`}
                variant="secondary"
                className="pl-2 pr-1 py-1 flex items-center gap-1 bg-blue-50 text-[#004a93]"
              >
                {option.label}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleAttributeChange(attributeName, optionId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ) : null
          }),
        )}
      </div>
    </div>
  )
}
