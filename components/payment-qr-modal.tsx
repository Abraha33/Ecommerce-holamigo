"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface PaymentQRModalProps {
  isOpen: boolean
  onClose: () => void
  paymentMethod: "nequi" | "bancolombia"
}

export function PaymentQRModal({ isOpen, onClose, paymentMethod }: PaymentQRModalProps) {
  const { toast } = useToast()

  const paymentInfo = {
    nequi: {
      title: "Pago con Nequi",
      accountNumber: "300 123 4567",
      accountName: "EcoPlast S.A.S",
      qrImage: "/nequi-qr.png",
    },
    bancolombia: {
      title: "Pago con Bancolombia",
      accountNumber: "123-456789-00",
      accountType: "Cuenta de Ahorros",
      accountName: "EcoPlast S.A.S",
      qrImage: "/bancolombia-qr.png",
    },
  }

  const info = paymentInfo[paymentMethod]

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado al portapapeles",
      description: "La información ha sido copiada.",
      className: "max-w-xs",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md backdrop-blur-sm bg-white/95">
        <DialogHeader>
          <DialogTitle>{info.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <div className="relative w-48 h-48 mb-4 border p-2 bg-white rounded-md">
            <Image
              src={info.qrImage || "/placeholder.svg"}
              alt={`QR para pago con ${paymentMethod}`}
              fill
              className="object-contain"
            />
          </div>

          <div className="w-full space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <div className="text-sm text-gray-500">Número de cuenta</div>
                <div className="font-medium">{info.accountNumber}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopyToClipboard(info.accountNumber)}
                title="Copiar número"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {paymentMethod === "bancolombia" && (
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <div className="text-sm text-gray-500">Tipo de cuenta</div>
                  <div className="font-medium">{info.accountType}</div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <div className="text-sm text-gray-500">A nombre de</div>
                <div className="font-medium">{info.accountName}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopyToClipboard(info.accountName)}
                title="Copiar nombre"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            Escanea el código QR o utiliza los datos bancarios para realizar tu pago.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
