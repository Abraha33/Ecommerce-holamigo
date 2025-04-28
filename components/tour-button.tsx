"use client"

import { useEffect, useState } from "react"
import { HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTour } from "@/contexts/tour-context"

export function TourButton() {
  const { startTour } = useTour()
  const [showButton, setShowButton] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Mostrar el botón después de un tiempo para no distraer inmediatamente
  useEffect(() => {
    const timer = setTimeout(() => {
      // Verificar si el usuario ya ha visto el tour
      const tourSeen = localStorage.getItem("tourSeen")
      if (!tourSeen && !dismissed) {
        setShowButton(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [dismissed])

  const handleStartTour = () => {
    startTour()
    setShowButton(false)
    // Marcar que el usuario ha visto el tour
    localStorage.setItem("tourSeen", "true")
  }

  const handleDismiss = () => {
    setShowButton(false)
    setDismissed(true)
  }

  if (!showButton) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 right-4 z-50 rounded-full bg-white shadow-lg hover:bg-gray-100"
              onClick={startTour}
            >
              <HelpCircle className="h-6 w-6 text-[#20509E]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Iniciar tour guiado</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-white p-3 shadow-lg animate-bounce">
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-gray-200 p-0 hover:bg-gray-300"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
      <HelpCircle className="h-6 w-6 text-[#20509E]" />
      <div className="mr-2">
        <p className="text-sm font-medium">¿Primera vez aquí?</p>
        <p className="text-xs text-gray-500">Descubre nuestra tienda</p>
      </div>
      <Button variant="default" size="sm" className="bg-[#20509E] hover:bg-[#164079]" onClick={handleStartTour}>
        Iniciar tour
      </Button>
    </div>
  )
}
