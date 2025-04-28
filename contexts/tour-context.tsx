"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface TourContextType {
  isTourOpen: boolean
  startTour: () => void
  closeTour: () => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function TourProvider({ children }: { children: ReactNode }) {
  const [isTourOpen, setIsTourOpen] = useState(false)

  const startTour = () => {
    setIsTourOpen(true)
  }

  const closeTour = () => {
    setIsTourOpen(false)
  }

  return <TourContext.Provider value={{ isTourOpen, startTour, closeTour }}>{children}</TourContext.Provider>
}

export function useTour() {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider")
  }
  return context
}
