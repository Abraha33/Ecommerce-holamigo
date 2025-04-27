"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ShoppingCart, TrendingDown, Check } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { WishlistButton } from "@/components/wishlist-button"
import { motion } from "framer-motion"

interface PricingOption {
  id: string
  name: string
  unitPrice: number
  totalPrice: number
  factor: number
  inStock: boolean
  originalPrice?: number
}

export function ProductPricing({ product }) {
  const [selectedOption, setSelectedOption] = useState("0")
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  // Generate pricing options based on the product
  const pricingOptions: PricingOption[] = [
    {
      id: "0",
      name: `Rollo (s)`,
      unitPrice: product.price,
      totalPrice: product.price,
      factor: 1,
      inStock: true,
      originalPrice: product.price * 1.2, // 20% higher original price
    },
    {
      id: "1",
      name: `A partir de 3`,
      unitPrice: product.price * 0.9,
      totalPrice: product.price * 0.9 * 3,
      factor: 3,
      inStock: true,
      originalPrice: product.price * 1.2 * 3,
    },
    {
      id: "2",
      name: `Caja x 6 rollos`,
      unitPrice: product.price * 0.8,
      totalPrice: product.price * 0.8 * 6,
      factor: 6,
      inStock: product.id % 2 === 0, // Simulate some out of stock items
      originalPrice: product.price * 1.2 * 6,
    },
  ]

  // Calculate savings
  const calculateSavings = (originalPrice: number, discountedPrice: number) => {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
  }

  const handleAddToCart = () => {
    const option = pricingOptions.find((opt) => opt.id === selectedOption)

    if (!option || !option.inStock) return

    setIsAdding(true)

    addItem({
      id: product.id,
      name: product.name,
      price: option.unitPrice,
      image: product.image,
      quantity: quantity,
      variant: option.name,
    })

    toast({
      title: "Agregado al carrito",
      description: `${product.name} ha sido agregado a tu carrito.`,
    })

    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  const selectedPricingOption = pricingOptions.find((opt) => opt.id === selectedOption) || pricingOptions[0]

  return (
    <div className="space-y-6">
      <div className="border rounded-lg overflow-hidden border-[#f2f2f2]">
        <div className="bg-[#f2f2f2] px-4 py-3 font-medium text-[#004a93]">Opciones de precio</div>

        <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="p-4 space-y-4">
          {pricingOptions.map((option) => {
            const savings = option.originalPrice ? calculateSavings(option.originalPrice, option.totalPrice) : 0

            return (
              <div
                key={option.id}
                className={`border rounded-lg p-3 transition-all ${
                  selectedOption === option.id ? "border-[#004a93] bg-blue-50" : "border-gray-200 hover:border-gray-300"
                } ${!option.inStock ? "opacity-60" : ""}`}
              >
                <div className="flex items-start">
                  <RadioGroupItem
                    value={option.id}
                    id={`option-${option.id}`}
                    disabled={!option.inStock}
                    className="mt-1 text-[#004a93]"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <Label htmlFor={`option-${option.id}`} className="font-medium cursor-pointer">
                        {option.name}
                      </Label>
                      {!option.inStock && (
                        <Badge variant="outline" className="text-[#e30613] border-[#e30613] bg-red-50">
                          Agotado
                        </Badge>
                      )}
                      {option.originalPrice && savings > 0 && (
                        <Badge className="bg-[#e30613]">{savings}% DESCUENTO</Badge>
                      )}
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Precio por unidad</div>
                        <div className="flex items-center mt-1">
                          <span className="text-[#e30613] font-bold text-lg">{formatCurrency(option.unitPrice)}</span>
                          {option.originalPrice && (
                            <span className="text-xs text-gray-500 line-through ml-2">
                              {formatCurrency(option.originalPrice / option.factor)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Precio total</div>
                        <div className="flex items-center mt-1">
                          <span className="text-[#e30613] font-bold text-lg">{formatCurrency(option.totalPrice)}</span>
                          {option.originalPrice && (
                            <span className="text-xs text-gray-500 line-through ml-2">
                              {formatCurrency(option.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {option.factor > 1 && option.originalPrice && (
                      <div className="mt-2 bg-blue-50 p-2 rounded-md">
                        <div className="flex items-center text-[#004a93]">
                          <TrendingDown className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">
                            Ahorras {formatCurrency(option.originalPrice - option.totalPrice)} al comprar{" "}
                            {option.factor} unidades
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </RadioGroup>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="w-32">
          <Label htmlFor="quantity" className="text-sm text-gray-500 mb-1 block">
            Cantidad
          </Label>
          <Input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
            className="w-full border-[#004a93]"
          />
        </div>
        <div className="flex-1">
          <Label className="text-sm text-gray-500 mb-1 block">Precio total</Label>
          <div className="text-xl font-bold text-[#e30613]">
            {formatCurrency(selectedPricingOption.unitPrice * quantity)}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <motion.div className="flex-1" whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            className="w-full bg-[#004a93] hover:bg-[#0071bc] h-12 text-base"
            onClick={handleAddToCart}
            disabled={!pricingOptions.find((opt) => opt.id === selectedOption)?.inStock || isAdding}
          >
            {isAdding ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center">
                <Check className="h-5 w-5 mr-2" />
                ¡Agregado!
              </motion.div>
            ) : (
              <motion.div className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Agregar al carrito
              </motion.div>
            )}
          </Button>
        </motion.div>
        <WishlistButton productId={product.id} productName={product.name} variant="full" />
      </div>

      <div className="mt-4 border-t pt-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Color:</span>
          <span>negro, blanco (Black And White Marble)</span>
        </div>
        <div className="flex gap-2 mt-2">
          <button className="w-12 h-12 border rounded-md overflow-hidden border-[#004a93]">
            <img src="/black-marble-texture.png" alt="Negro" className="w-full h-full object-cover" />
          </button>
          <button className="w-12 h-12 border rounded-md overflow-hidden">
            <img src="/white-marble-texture.png" alt="Blanco" className="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <h3 className="font-medium mb-2 text-[#004a93]">Manejar variaciones de colores, tamaños, medidas</h3>
        <p className="text-sm text-muted-foreground mb-2">Unidades de medida por factor</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="px-3 py-1 border-[#004a93] text-[#004a93]">
            300-mt
          </Badge>
          <Badge variant="outline" className="px-3 py-1 border-[#004a93] text-[#004a93]">
            Caja
          </Badge>
          <Badge variant="outline" className="px-3 py-1 border-[#004a93] text-[#004a93]">
            Rollo
          </Badge>
        </div>
      </div>
    </div>
  )
}
