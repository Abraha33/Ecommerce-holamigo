"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock } from "lucide-react"

interface OrderConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  estimatedTime: string
}

export function OrderConfirmationModal({ isOpen, onClose, estimatedTime }: OrderConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl mb-2">Order Confirmed!</DialogTitle>
            <p className="text-gray-600">Your order has been successfully placed and is being processed.</p>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-blue-50 p-4 rounded-lg flex items-center">
            <Clock className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800">Estimated delivery time</p>
              <p className="text-blue-600">{estimatedTime}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            You will receive an email confirmation shortly with your order details. You can also track your order status
            in your account.
          </p>

          <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">
            Track my order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
