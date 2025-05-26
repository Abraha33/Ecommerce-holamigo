"use client"

import { type ReactNode, useState, useEffect } from "react"
import { useMobileDetection } from "@/hooks/use-mobile-detection"

interface PerformanceMonitorProps {
  children: ReactNode
  lowPerformanceFallback?: ReactNode
}

export function PerformanceMonitor({ children, lowPerformanceFallback }: PerformanceMonitorProps) {
  const [shouldOptimize, setShouldOptimize] = useState(false)
  const { isLowEndDevice, isSlow } = useMobileDetection()

  useEffect(() => {
    // Add class to body to disable animations if needed
    if (isLowEndDevice || isSlow) {
      document.body.classList.add("slow-connection")
      setShouldOptimize(true)
    } else {
      document.body.classList.remove("slow-connection")
      setShouldOptimize(false)
    }

    // Monitor frame rate
    let lastTime = 0
    const frameTimes: number[] = []

    const checkFrameRate = (time: number) => {
      if (lastTime) {
        const frameTime = time - lastTime
        frameTimes.push(frameTime)

        // Keep the last 10 frames
        if (frameTimes.length > 10) {
          frameTimes.shift()

          // Calculate average frame time
          const avgFrameTime = frameTimes.reduce((sum, t) => sum + t, 0) / frameTimes.length
          const fps = 1000 / avgFrameTime

          // If FPS is consistently below 30, optimize
          if (fps < 30) {
            setShouldOptimize(true)
            document.body.classList.add("slow-connection")
          } else if (!isLowEndDevice && !isSlow) {
            setShouldOptimize(false)
            document.body.classList.remove("slow-connection")
          }
        }
      }

      lastTime = time
      requestAnimationFrame(checkFrameRate)
    }

    const animFrameId = requestAnimationFrame(checkFrameRate)

    return () => {
      cancelAnimationFrame(animFrameId)
    }
  }, [isLowEndDevice, isSlow])

  return <>{shouldOptimize && lowPerformanceFallback ? lowPerformanceFallback : children}</>
}
