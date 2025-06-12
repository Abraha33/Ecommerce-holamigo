"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Truck } from "lucide-react"
import { useState, useEffect } from "react"

interface OrderProcessingModalProps {
  isOpen: boolean
  estimatedTime?: string
}

export function OrderProcessingModal({ isOpen, estimatedTime = "33 - 49 min" }: OrderProcessingModalProps) {
  const [currentImage, setCurrentImage] = useState(0)

  // Array of delivery-related images that will cycle
  const deliveryImages = [
    "📦", // Package
    "🚚", // Truck
    "📋", // Clipboard/Order
    "✅", // Check mark
  ]

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % deliveryImages.length)
      }, 800) // Change image every 800ms

      return () => clearInterval(interval)
    }
  }, [isOpen, deliveryImages.length])

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md border-0 bg-white rounded-2xl p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Animated delivery illustration */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="text-6xl animate-pulse transition-all duration-500">{deliveryImages[currentImage]}</div>
          </div>

          {/* Animated text */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-black animate-pulse">ESTAMOS CREANDO</h2>
            <h2 className="text-xl font-bold text-black animate-pulse" style={{ animationDelay: "0.3s" }}>
              TU ORDEN
            </h2>
          </div>

          {/* Delivery time with icon */}
          <div className="flex items-center space-x-2 text-blue-600">
            <Truck className="h-5 w-5" />
            <span className="text-sm font-medium">
              Entrega estimada: <span className="font-bold">{estimatedTime}</span>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
