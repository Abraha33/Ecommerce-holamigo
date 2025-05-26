"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils"
import { Plus, Minus, X, ShoppingBag, ChevronRight } from "lucide-react"
import { useCart } from "@/components/cart-provider"

export function MobileCart() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, subtotal, isLoading } = useCart()
  const [couponCode, setCouponCode] = useState("")

  const handleQuantityChange = (itemId: string | undefined, newQuantity: number) => {
    if (!itemId || newQuantity < 1) return
    updateQuantity(itemId, newQuantity)
  }

  const handleRemoveItem = (itemId: string | undefined) => {
    if (!itemId) return
    removeItem(itemId)
  }

  const handleApplyCoupon = () => {
    // This function would be implemented in a real context to apply a coupon
    alert(`Coupon ${couponCode} applied`)
  }

  const handleCheckout = () => {
    router.push("/mobile-checkout")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/shop")}>
          Start shopping
        </Button>
      </div>
    )
  }

  const shipping = 5000
  const discount = -2500 // Example discount
  const total = subtotal + shipping + discount

  return (
    <div className="pb-24">
      <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">
          Shopping Cart <span className="text-gray-500 text-base">({items.length})</span>
        </h1>
      </div>

      <div className="divide-y">
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="p-4 flex">
            <div className="relative h-20 w-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>

            <div className="ml-4 flex-1 flex flex-col">
              <div className="flex justify-between">
                <h3 className="font-medium text-sm">{item.name}</h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => handleRemoveItem(item.id)}
                  aria-label="Remove item"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center border rounded-md">
                  <button
                    className="px-2 py-1 text-blue-600"
                    onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-2 py-1 border-x text-sm">{item.quantity}</span>
                  <button
                    className="px-2 py-1 text-blue-600"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="font-bold text-blue-600">{formatCurrency(item.price)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Input
              placeholder="Enter coupon"
              className="rounded-r-none"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button className="rounded-l-none bg-blue-600 hover:bg-blue-700" onClick={handleApplyCoupon}>
              Apply
            </Button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>{formatCurrency(discount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>{formatCurrency(shipping)}</span>
          </div>
          <div className="border-t pt-2 mt-2 font-bold flex justify-between">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-md">
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-xl font-bold">{formatCurrency(total)}</div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCheckout}>
            Checkout <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
