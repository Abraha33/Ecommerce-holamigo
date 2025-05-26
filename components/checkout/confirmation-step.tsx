"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CheckCircle, Truck, Clock, FileText } from "lucide-react"

export function ConfirmationStep() {
  const router = useRouter()
  const orderNumber = "ORD-230520-7845"

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 mb-2">Your order has been successfully placed.</p>
        <p className="font-medium">Order #{orderNumber}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg flex items-center">
          <Clock className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-800">Estimated delivery time</p>
            <p className="text-blue-600">Monday, May 10 • 9:00 AM - 11:00 AM</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center">
          <Truck className="h-5 w-5 text-gray-600 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium">Delivery updates</p>
            <p className="text-sm text-gray-600">We'll send you updates about your order via email and SMS</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center">
          <FileText className="h-5 w-5 text-gray-600 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium">Order details</p>
            <p className="text-sm text-gray-600">
              You can view your order details and track your delivery in your account
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => router.push(`/orders/latest`)}>
          Track my order
        </Button>
        <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
          Continue shopping
        </Button>
      </div>
    </div>
  )
}
