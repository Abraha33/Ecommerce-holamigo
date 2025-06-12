"use client"
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

  return null
}
