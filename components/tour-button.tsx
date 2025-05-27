"use client"

import { useState } from "react"
import { SiteTour } from "./site-tour"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function TourButton() {
  const [isTourOpen, setIsTourOpen] = useState(false)

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed bottom-20 right-4 z-50 bg-blue-600 hover:bg-blue-700 shadow-lg rounded-full h-14 w-14 flex items-center justify-center text-white"
              onClick={() => setIsTourOpen(true)}
            >
              <HelpCircle className="h-7 w-7" />
              <span className="sr-only">Iniciar tour del sitio</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>🎯 Tour guiado del sitio</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SiteTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
    </>
  )
}
