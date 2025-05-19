"use client"

import { useState, useEffect } from "react"
import { CreditCardIcon } from "lucide-react"

interface CreditCardProps {
  cardNumber: string
  cardholderName: string
  expiryDate: string
  cvv: string
  isFlipped: boolean
  cardType: string
}

export default function CreditCard({
  cardNumber,
  cardholderName,
  expiryDate,
  cvv,
  isFlipped,
  cardType,
}: CreditCardProps) {
  // Estado para controlar la animación
  const [isAnimating, setIsAnimating] = useState(false)
  const [rotation, setRotation] = useState(0)

  // Detectar cambios en isFlipped para activar la animación
  useEffect(() => {
    setIsAnimating(true)
    setRotation(isFlipped ? 180 : 0)

    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 700)

    return () => clearTimeout(timer)
  }, [isFlipped])

  // Formatear número de tarjeta para mostrar
  const displayNumber = cardNumber
    ? cardNumber
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
    : "•••• •••• •••• ••••"

  // Formatear nombre del titular
  const displayName = cardholderName || "NOMBRE DEL TITULAR"

  // Formatear fecha de expiración
  const displayExpiry = expiryDate || "MM/YY"

  // Obtener estilos según el tipo de tarjeta
  const cardStyle = getCardStyle(cardType)

  return (
    <div className="w-full max-w-[430px] h-[270px] perspective-1000 my-8">
      <div
        className="relative w-full h-full transition-transform duration-700 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotation}deg)`,
        }}
      >
        {/* Frente de la tarjeta */}
        <div
          className={`absolute w-full h-full rounded-xl p-6 ${cardStyle.background} shadow-2xl`}
          style={{
            backfaceVisibility: "hidden",
            boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
          }}
        >
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between">
              <div className="w-16 h-12">{cardStyle.logo}</div>
              <div className="w-12 h-12">
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-white opacity-80">
                  <path
                    fill="currentColor"
                    d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xl font-mono tracking-wider text-white">{displayNumber}</p>
            </div>

            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-xs text-white opacity-80 mb-1">Titular de la tarjeta</p>
                <p className="text-sm font-medium tracking-wide text-white uppercase">{displayName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white opacity-80 mb-1">Expira</p>
                <p className="text-sm font-medium text-white">{displayExpiry}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reverso de la tarjeta */}
        <div
          className={`absolute w-full h-full rounded-xl p-6 ${cardStyle.background} shadow-2xl`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
          }}
        >
          <div className="w-full h-12 bg-black mt-4"></div>

          <div className="mt-8 flex justify-end">
            <div className="bg-white h-10 w-3/4 rounded flex items-center px-3 justify-end">
              <div className="font-mono text-right text-gray-800">{cvv || "•••"}</div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="text-white text-xs opacity-80">Para servicio al cliente, llama: 1-800-123-4567</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getCardStyle(cardType: string) {
  switch (cardType) {
    case "visa":
      return {
        background: "bg-gradient-to-r from-blue-700 to-blue-900",
        logo: <div className="text-white font-bold text-2xl italic">VISA</div>,
      }
    case "mastercard":
      return {
        background: "bg-gradient-to-r from-red-600 to-orange-600",
        logo: (
          <div className="relative">
            <div className="w-6 h-6 bg-red-500 rounded-full absolute left-0"></div>
            <div className="w-6 h-6 bg-yellow-400 rounded-full absolute left-3 opacity-90"></div>
          </div>
        ),
      }
    case "amex":
      return {
        background: "bg-gradient-to-r from-blue-400 to-blue-600",
        logo: <div className="text-white font-bold text-lg">AMEX</div>,
      }
    case "discover":
      return {
        background: "bg-gradient-to-r from-orange-400 to-orange-600",
        logo: <div className="text-white font-bold text-lg">Discover</div>,
      }
    default:
      return {
        background: "bg-gradient-to-r from-gray-700 to-gray-900",
        logo: <CreditCardIcon className="text-white" />,
      }
  }
}
