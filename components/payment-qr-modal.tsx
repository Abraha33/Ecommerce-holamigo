"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface PaymentQRModalProps {
  isOpen: boolean
  onClose: () => void
  paymentMethod: "nequi" | "bancolombia"
}

export function PaymentQRModal({ isOpen, onClose, paymentMethod }: PaymentQRModalProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const accountInfo = {
    nequi: {
      name: "Holamigo Store",
      number: "300 123 4567",
      qrImage: "/nequi-qr.png",
    },
    bancolombia: {
      name: "Holamigo S.A.S.",
      number: "123-456789-10",
      qrImage: "/bancolombia-qr.png",
    },
  }

  const info = accountInfo[paymentMethod]

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {paymentMethod === "nequi" ? "Nequi Payment" : "Bancolombia Transfer"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center">
          <div className="w-48 h-48 relative mb-4">
            <Image
              src={info.qrImage || "/placeholder.svg"}
              alt={`${paymentMethod} QR Code`}
              fill
              className="object-contain"
            />
          </div>

          <div className="w-full space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="text-sm text-gray-500">Account Name</p>
                <p className="font-medium">{info.name}</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => copyToClipboard(info.name, "name")}>
                {copied === "name" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="text-sm text-gray-500">{paymentMethod === "nequi" ? "Phone Number" : "Account Number"}</p>
                <p className="font-medium">{info.number}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => copyToClipboard(info.number, "number")}
              >
                {copied === "number" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800 w-full">
            <p className="font-medium mb-1">Important:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Scan the QR code or use the account information to make your payment</li>
              <li>Include your order number in the payment reference</li>
              <li>After payment, add the confirmation number in the order comments</li>
            </ul>
          </div>

          <Button className="mt-4 w-full" onClick={onClose}>
            I've made the payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
