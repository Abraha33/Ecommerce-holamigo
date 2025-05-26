"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"

export function WhatsAppSupport() {
  const phoneNumber = "573192102438" // Número actualizado
  const message = "Hola, necesito ayuda con mi pedido"
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-1000 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <Button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 rounded-full p-3 shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        <MessageSquare className="mr-2 h-5 w-5" />
        WhatsApp
      </Button>
    </div>
  )
}
