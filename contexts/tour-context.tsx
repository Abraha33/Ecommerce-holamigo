"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface TourContextType {
  showTour: boolean
  setShowTour: (show: boolean) => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function TourProvider({ children }: { children: ReactNode }) {
  const [showTour, setShowTour] = useState(false)

  return <TourContext.Provider value={{ showTour, setShowTour }}>{children}</TourContext.Provider>
}

export function useTour() {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider")
  }
  return context
}
