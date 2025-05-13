"use client"

import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface PaymentQRModalProps {
  isOpen: boolean
  onClose: () => void
  paymentMethod?: "nequi" | "bancolombia"
}

export function PaymentQRModal({ isOpen, onClose, paymentMethod = "bancolombia" }: PaymentQRModalProps) {
  const [copied, setCopied] = useState(false)

  const paymentInfo = {
    nequi: {
      title: "Pago con Nequi",
      qrImage: "/nequi-qr.png",
      accountNumber: "300 123 4567",
      accountName: "Holamigo S.A.S.",
      instructions: [
        "Escanea el código QR con la app de Nequi",
        "Confirma el monto a pagar",
        "Completa la transacción en la app",
        "Ingresa el número de confirmación en el campo correspondiente",
      ],
    },
    bancolombia: {
      title: "Pago con Bancolombia",
      qrImage: "/bancolombia-qr.png",
      accountNumber: "123-456789-10",
      accountName: "Holamigo S.A.S.",
      instructions: [
        "Escanea el código QR con la app de Bancolombia",
        "Selecciona la cuenta de origen",
        "Confirma el monto a pagar",
        "Ingresa el número de confirmación en el campo correspondiente",
      ],
    },
  }

  const info = paymentMethod ? paymentInfo[paymentMethod] : paymentInfo.bancolombia

  const copyToClipboard = () => {
    navigator.clipboard.writeText(info.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 gap-0 rounded-md">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

        <DialogTitle className="text-xl font-bold mb-4 text-center">{info.title}</DialogTitle>

        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 mb-4">
            <Image
              src={info.qrImage || "/placeholder.svg"}
              alt={`Código QR para ${info.title}`}
              fill
              className="object-contain"
            />
          </div>

          <div className="w-full bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm text-gray-500">Número de cuenta:</p>
                <p className="font-medium">{info.accountNumber}</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 px-2" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-gray-500">Titular:</p>
            <p className="font-medium">{info.accountName}</p>
          </div>

          <div className="w-full">
            <h4 className="font-medium mb-2">Instrucciones:</h4>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              {info.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>

          <Button className="w-full mt-6 bg-blue-500 hover:bg-blue-600" onClick={onClose}>
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
