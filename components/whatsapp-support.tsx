"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export function WhatsAppSupport() {
  const phoneNumber = "573192102438" // Número actualizado
  const message = "Hola, necesito ayuda con mi pedido"

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <div className="p-4 bg-green-50 border-t border-green-100">
      <Button
        onClick={handleWhatsAppClick}
        className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center"
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Soporte por WhatsApp
        <span className="ml-2 text-xs">+57 319 210 2438</span>
      </Button>
    </div>
  )
}
