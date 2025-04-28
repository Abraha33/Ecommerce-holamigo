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
              className="fixed bottom-4 right-4 z-50 bg-white shadow-md rounded-full h-12 w-12 flex items-center justify-center hover:bg-gray-100"
              onClick={() => setIsTourOpen(true)}
            >
              <HelpCircle className="h-6 w-6 text-blue-600" />
              <span className="sr-only">Iniciar tour del sitio</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tour del sitio</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SiteTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
    </>
  )
}
