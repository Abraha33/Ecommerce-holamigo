"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, FileText, Volume2, Youtube } from "lucide-react"

interface UnitOption {
  id: string
  name: string
  unitPrice: number
  factor: number
  totalPrice?: number
}

interface ProductUnitSelectorProps {
  productName: string
  productImage: string
  productCode: string
  unitOptions: UnitOption[]
  onAddToCart: (quantity: number, selectedOption: UnitOption) => void
}

export function ProductUnitSelector({
  productName,
  productImage,
  productCode,
  unitOptions,
  onAddToCart,
}: ProductUnitSelectorProps) {
  const [selectedOption, setSelectedOption] = useState<string>(unitOptions[0]?.id || "")
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    const option = unitOptions.find((opt) => opt.id === selectedOption)
    if (option) {
      onAddToCart(quantity, option)
    }
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden max-w-md">
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 flex-shrink-0">
            <img src={productImage || "/placeholder.svg"} alt={productName} className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="font-medium text-sm">{productName}</h3>
            <p className="text-xs text-gray-500">Cod: {productCode}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="quantity" className="text-sm">
              Cantidad:
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
              className="w-20 h-8 text-sm"
            />
          </div>
        </div>

        <div className="border border-gray-300 rounded mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Nombre UM</th>
                <th className="p-2 text-right">Val. UN</th>
                <th className="p-2 text-right">Val. UM</th>
                <th className="p-2 text-right">Factor</th>
              </tr>
            </thead>
            <tbody>
              {unitOptions.map((option) => (
                <tr key={option.id} className="border-t border-gray-300">
                  <td className="p-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`option-${option.id}`}
                        name="unitOption"
                        value={option.id}
                        checked={selectedOption === option.id}
                        onChange={() => setSelectedOption(option.id)}
                        className="mr-2"
                      />
                      <Label htmlFor={`option-${option.id}`} className="cursor-pointer">
                        {option.name}
                      </Label>
                    </div>
                  </td>
                  <td className="p-2 text-right">{formatCurrency(option.unitPrice)}</td>
                  <td className="p-2 text-right">{formatCurrency(option.unitPrice * option.factor)}</td>
                  <td className="p-2 text-right">{option.factor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
          >
            <Youtube className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button className="w-full rounded-none bg-[#004a93] hover:bg-[#003a73] h-12" onClick={handleAddToCart}>
        <ShoppingCart className="h-5 w-5 mr-2" />
        AGREGAR
      </Button>
    </div>
  )
}
