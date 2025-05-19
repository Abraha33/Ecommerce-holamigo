"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import CreditCardForm from "@/credit-card-form"
import { useRouter } from "next/navigation"

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onAddCard: (cardData: any) => void
}

export function AddCardModal({ isOpen, onClose, onAddCard }: AddCardModalProps) {
  const router = useRouter()

  // Modificar la función handleAddCard para asegurarnos de que cardData tenga todas las propiedades necesarias
  // y que no intentemos acceder a propiedades de valores undefined

  const handleAddCard = (cardData: any) => {
    // Verificar que cardData y sus propiedades existan antes de proceder
    if (!cardData) {
      console.error("Card data is undefined")
      return
    }

    // Crear un objeto seguro con valores predeterminados para evitar errores
    const safeCardData = {
      cardNumber: cardData.cardNumber || "",
      cardholderName: cardData.cardholderName || "",
      expMonth: cardData.expMonth || "",
      expYear: cardData.expYear || "",
      cvv: cardData.cvv || "",
      brand: cardData.brand || "unknown",
      last4: cardData.cardNumber ? cardData.cardNumber.slice(-4) : "0000",
      cardType: cardData.cardType || "visa",
    }

    // Si estamos en la página de checkout, usar onAddCard
    // Si no, redirigir a la página de métodos de pago
    if (onAddCard) {
      onAddCard(safeCardData)
    } else {
      router.push("/account/payment-methods")
    }
    onClose()
  }

  const handleGoToPaymentMethods = () => {
    router.push("/account/payment-methods")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] w-[95vw] p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-xl">Añadir nueva tarjeta</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </button>
        </DialogHeader>

        <div className="p-8">
          <CreditCardForm onSubmit={handleAddCard} />
        </div>

        <div className="p-4 border-t text-center bg-gray-50">
          <Button variant="link" onClick={handleGoToPaymentMethods} className="text-blue-600">
            Ver todos mis métodos de pago
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
