"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"
import { ChevronDown, ChevronUp, CreditCard, Truck, MapPin } from "lucide-react"

interface ReviewStepProps {
  checkoutData: {
    deliveryMethod: string
    address: any
    paymentMethod: string
    orderNotes: string
  }
  onUpdateNotes: (notes: string) => void
  onComplete: () => void
}

export function ReviewStep({ checkoutData, onUpdateNotes, onComplete }: ReviewStepProps) {
  const { items, subtotal } = useCart()
  const [notes, setNotes] = useState(checkoutData.orderNotes || "")
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const shipping = checkoutData.deliveryMethod === "express" ? 7500 : 5000
  const discount = -2500 // Example discount
  const total = subtotal + shipping + discount

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
    onUpdateNotes(e.target.value)
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onComplete()
  }

  const getDeliveryMethodName = (method: string) => {
    switch (method) {
      case "express":
        return "Express Delivery"
      case "standard":
        return "Standard Delivery"
      case "scheduled":
        return "Scheduled Delivery"
      case "pickup":
        return "Store Pickup"
      default:
        return "Standard Delivery"
    }
  }

  const getPaymentMethodName = (method: string) => {
    if (method.startsWith("card_")) {
      return "Credit/Debit Card"
    }
    switch (method) {
      case "cash":
        return "Cash on Delivery"
      case "wallet":
        return "Digital Wallet"
      default:
        return "Credit/Debit Card"
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Review your order</h2>

        {/* Delivery Method */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Delivery Method</h3>
              <p className="text-sm text-gray-600">{getDeliveryMethodName(checkoutData.deliveryMethod)}</p>
              {checkoutData.deliveryMethod === "scheduled" && (
                <p className="text-sm text-blue-600 font-medium">Monday, May 10 • 9:00 AM - 11:00 AM</p>
              )}
              {checkoutData.deliveryMethod === "pickup" && (
                <p className="text-sm text-gray-600">Centro Store • Calle 31 #15-09, Centro</p>
              )}
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {checkoutData.deliveryMethod !== "pickup" && checkoutData.address && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Shipping Address</h3>
                <p className="text-sm text-gray-600">{checkoutData.address.recipient}</p>
                <p className="text-sm text-gray-600">{checkoutData.address.address}</p>
                <p className="text-sm text-gray-600">
                  {checkoutData.address.city}, {checkoutData.address.state}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Payment Method</h3>
              <p className="text-sm text-gray-600">{getPaymentMethodName(checkoutData.paymentMethod)}</p>
              {checkoutData.paymentMethod.startsWith("card_") && (
                <p className="text-sm text-gray-600">
                  {checkoutData.paymentMethod.includes("card1") ? "Visa ending in 4242" : "Mastercard ending in 8765"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => setShowOrderDetails(!showOrderDetails)}
          >
            <h3 className="font-medium">Order Summary ({items.length} items)</h3>
            {showOrderDetails ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {showOrderDetails && (
            <div className="border-t border-gray-200">
              <div className="p-4 space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-md mr-3 relative overflow-hidden">
                      {item.image && (
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.price)}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>{formatCurrency(discount)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Order Notes */}
        <div className="space-y-2">
          <label htmlFor="order-notes" className="block text-sm font-medium">
            Order Notes (optional)
          </label>
          <Textarea
            id="order-notes"
            placeholder="Special instructions for delivery"
            rows={3}
            value={notes}
            onChange={handleNotesChange}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handlePlaceOrder} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Place Order"}
      </Button>

      <p className="text-xs text-center text-gray-500">
        By placing your order, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}
