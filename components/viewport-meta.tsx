"use client"

import { useEffect } from "react"

export function ViewportMeta() {
  useEffect(() => {
    // Check if viewport meta tag exists
    let viewportMeta = document.querySelector('meta[name="viewport"]')

    // If it doesn't exist, create it
    if (!viewportMeta) {
      viewportMeta = document.createElement("meta")
      viewportMeta.setAttribute("name", "viewport")
      document.head.appendChild(viewportMeta)
    }

    // Set the content attribute to ensure proper mobile rendering
    viewportMeta.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
    )

    // Add additional meta tags for mobile optimization
    const mobileOptimizationMeta = document.createElement("meta")
    mobileOptimizationMeta.setAttribute("name", "mobile-web-app-capable")
    mobileOptimizationMeta.setAttribute("content", "yes")
    document.head.appendChild(mobileOptimizationMeta)

    // Add Apple-specific meta tags
    const appleMobileOptimizationMeta = document.createElement("meta")
    appleMobileOptimizationMeta.setAttribute("name", "apple-mobile-web-app-capable")
    appleMobileOptimizationMeta.setAttribute("content", "yes")
    document.head.appendChild(appleMobileOptimizationMeta)

    // Clean up on unmount
    return () => {
      document.head.removeChild(mobileOptimizationMeta)
      document.head.removeChild(appleMobileOptimizationMeta)
    }
  }, [])

  return null
}
