"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Truck, Calendar, Store } from "lucide-react"
import { cn } from "@/lib/utils"

interface DeliveryStepProps {
  onNext: () => void
  onSelectDelivery: (method: string) => void
  selectedMethod: string
}

export function DeliveryStep({ onNext, onSelectDelivery, selectedMethod }: DeliveryStepProps) {
  const [selected, setSelected] = useState(selectedMethod || "standard")

  const handleSelect = (method: string) => {
    setSelected(method)
    onSelectDelivery(method)
  }

  const handleContinue = () => {
    onSelectDelivery(selected)
    onNext()
  }

  const deliveryOptions = [
    {
      id: "express",
      title: "Express Delivery",
      description: "Get it today (11-17 min)",
      price: "$7,500",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      id: "standard",
      title: "Standard Delivery",
      description: "Get it tomorrow",
      price: "$5,000",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      id: "scheduled",
      title: "Scheduled Delivery",
      description: "Choose date & time",
      price: "$5,000",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      id: "pickup",
      title: "Store Pickup",
      description: "Ready in 2 hours",
      price: "Free",
      icon: <Store className="h-5 w-5" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Choose delivery method</h2>
        <div className="space-y-3">
          {deliveryOptions.map((option) => (
            <div
              key={option.id}
              className={cn(
                "flex items-center border rounded-lg p-4 cursor-pointer transition-colors",
                selected === option.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-blue-600 hover:bg-blue-50",
              )}
              onClick={() => handleSelect(option.id)}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full mr-3",
                  selected === option.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500",
                )}
              >
                {option.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium">{option.title}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{option.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected === "scheduled" && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-medium">Select delivery date & time</h3>
          <div className="grid grid-cols-4 gap-2">
            {["Mon", "Tue", "Wed", "Thu"].map((day, i) => (
              <button
                key={day}
                className={cn(
                  "p-2 text-center border rounded-md",
                  i === 0 ? "bg-blue-600 text-white border-blue-600" : "border-gray-200",
                )}
              >
                <div className="text-sm font-medium">{day}</div>
                <div className="text-xs">{i + 10} May</div>
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {["9:00 AM - 11:00 AM", "1:00 PM - 3:00 PM", "4:00 PM - 6:00 PM"].map((time, i) => (
              <button
                key={time}
                className={cn(
                  "w-full p-3 text-left border rounded-md",
                  i === 0 ? "border-blue-600 bg-blue-50" : "border-gray-200",
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {selected === "pickup" && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-medium">Select store location</h3>
          <div className="space-y-3">
            {[
              { name: "Centro Store", address: "Calle 31 #15-09, Centro", distance: "2.5 km" },
              { name: "Cabecera Store", address: "Carrera 35 #48-20, Cabecera", distance: "4.2 km" },
            ].map((store, i) => (
              <div
                key={store.name}
                className={cn("p-3 border rounded-md", i === 0 ? "border-blue-600 bg-blue-50" : "border-gray-200")}
              >
                <div className="font-medium">{store.name}</div>
                <div className="text-sm text-gray-500">{store.address}</div>
                <div className="text-sm text-gray-500">{store.distance} away</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleContinue}>
        Continue to shipping
      </Button>
    </div>
  )
}
