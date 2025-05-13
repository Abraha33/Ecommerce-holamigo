"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"
import { useEffect, useState } from "react"

interface OrderConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  estimatedTime?: string
}

export function OrderConfirmationModal({
  isOpen,
  onClose,
  estimatedTime = "15 - 30 min",
}: OrderConfirmationModalProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isOpen) {
      // Reiniciar el progreso cuando se abre el modal
      setProgress(0)

      // Simular progreso de carga
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 1
          if (newProgress >= 100) {
            clearInterval(interval)
            return 100
          }
          return newProgress
        })
      }, 30)

      // Limpiar el intervalo cuando se cierra el modal
      return () => clearInterval(interval)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-md">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-32 h-32 mb-6 relative">
            <Image src="/shopping-bag.png" alt="Bolsa de compras" fill className="object-contain" />
          </div>

          <h2 className="text-xl font-bold mb-2">ESTAMOS CREANDO TU ORDEN</h2>

          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"
                  fill="#2196F3"
                />
              </svg>
            </div>
            <p className="text-lg">
              Entrega estimada: <strong>{estimatedTime}</strong>
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
