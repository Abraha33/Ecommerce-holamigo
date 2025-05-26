"use client"

import { useState, useEffect } from "react"

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  const [connection, setConnection] = useState<string | null>(null)

  useEffect(() => {
    // Check if client-side
    if (typeof window !== "undefined") {
      // Initial check
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }

      // Check device performance
      const checkPerformance = () => {
        const memory = (navigator as any).deviceMemory
        const cores = (navigator as any).hardwareConcurrency

        // Low-end device has limited memory and cores
        setIsLowEndDevice(
          (typeof memory !== "undefined" && memory <= 4) || (typeof cores !== "undefined" && cores <= 4),
        )
      }

      // Check network connection
      const checkConnection = () => {
        const connection = (navigator as any).connection
        if (connection) {
          setConnection(connection.effectiveType)

          // Add listener for connection changes
          connection.addEventListener("change", checkConnection)
        }
      }

      // Initialize checks
      checkMobile()
      checkPerformance()
      checkConnection()

      // Add resize listener
      window.addEventListener("resize", checkMobile)

      // Clean up
      return () => {
        window.removeEventListener("resize", checkMobile)

        const connection = (navigator as any).connection
        if (connection) {
          connection.removeEventListener("change", checkConnection)
        }
      }
    }
  }, [])

  return {
    isMobile,
    isLowEndDevice,
    connection,
    isSlow: isLowEndDevice || ["slow-2g", "2g", "3g"].includes(connection || ""),
  }
}
