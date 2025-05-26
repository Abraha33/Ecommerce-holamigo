"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { useMobileDetection } from "@/hooks/use-mobile-detection"

interface ResponsiveImageProps extends Omit<ImageProps, "src"> {
  src: string
  lowResSrc?: string
  highQuality?: boolean
  lazyThreshold?: number
}

export function ResponsiveImage({
  src,
  lowResSrc,
  alt,
  width,
  height,
  sizes,
  className,
  priority,
  highQuality = true,
  lazyThreshold = 0.1,
  ...props
}: ResponsiveImageProps) {
  const [loaded, setLoaded] = useState(false)
  const { isMobile, isSlow } = useMobileDetection()

  // Use intersection observer to check if image is near viewport
  const [isNearViewport, setIsNearViewport] = useState(false)

  useEffect(() => {
    if (!priority && typeof IntersectionObserver !== "undefined") {
      const element = document.getElementById(`responsive-img-${alt?.replace(/\s+/g, "-")}`)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsNearViewport(true)
            observer.disconnect()
          }
        },
        {
          rootMargin: `${lazyThreshold * 100}% 0px`,
        },
      )

      observer.observe(element)

      return () => {
        observer.disconnect()
      }
    } else {
      setIsNearViewport(true)
    }
  }, [alt, lazyThreshold, priority])

  // Determine appropriate image quality based on device capabilities
  const qualityLevel = isSlow || isMobile ? (highQuality ? 75 : 60) : highQuality ? 90 : 80

  // Set appropriate sizes attribute if not provided
  const responsiveSizes = sizes || (isMobile ? "100vw" : "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw")

  // Determine which source to use
  const imgSrc = isSlow && lowResSrc ? lowResSrc : src

  return (
    <div
      id={`responsive-img-${alt?.replace(/\s+/g, "-")}`}
      className={`relative overflow-hidden ${className || ""}`}
      style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease-in" }}
    >
      {(isNearViewport || priority) && (
        <Image
          src={imgSrc || "/placeholder.svg"}
          alt={alt || ""}
          width={width}
          height={height}
          sizes={responsiveSizes}
          quality={qualityLevel}
          priority={priority}
          onLoadingComplete={() => setLoaded(true)}
          {...props}
        />
      )}
    </div>
  )
}
