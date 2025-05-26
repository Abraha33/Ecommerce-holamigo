"use client"

import { useState, useEffect, type ReactNode } from "react"

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  preventOverflow?: boolean
}

export function ResponsiveContainer({ children, className = "", preventOverflow = true }: ResponsiveContainerProps) {
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    // Update window width on mount and resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // Set initial width
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Apply overflow prevention styles
  const overflowStyles = preventOverflow
    ? {
        maxWidth: "100vw",
        overflowX: "hidden",
        width: "100%",
      }
    : {}

  return (
    <div className={`responsive-container ${className}`} style={overflowStyles} data-viewport-width={windowWidth}>
      {children}
    </div>
  )
}
