"use client"

import { type ReactNode, useState, useEffect } from "react"
import { useMobileDetection } from "@/hooks/use-mobile-detection"

interface AdaptiveLoadingProps {
  children: ReactNode
  fallback?: ReactNode
  mobileOnly?: boolean
  desktopOnly?: boolean
  lowEndOnly?: boolean
  highEndOnly?: boolean
}

export function AdaptiveLoading({
  children,
  fallback = null,
  mobileOnly = false,
  desktopOnly = false,
  lowEndOnly = false,
  highEndOnly = false,
}: AdaptiveLoadingProps) {
  const { isMobile, isLowEndDevice, isSlow } = useMobileDetection()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Server-side rendering or initial load - show fallback
  if (!isClient) return fallback

  // Mobile or desktop specific content
  if ((mobileOnly && !isMobile) || (desktopOnly && isMobile)) {
    return fallback
  }

  // Device capability specific content
  if ((lowEndOnly && !isLowEndDevice && !isSlow) || (highEndOnly && (isLowEndDevice || isSlow))) {
    return fallback
  }

  return <>{children}</>
}
