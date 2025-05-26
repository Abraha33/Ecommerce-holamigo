"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { generateBlurDataURL } from "@/lib/image-optimization"

interface OptimizedImageProps extends Omit<ImageProps, "onLoadingComplete"> {
  containerWidth?: "full" | "half" | "third" | "quarter"
  lowQualityPlaceholder?: boolean
  fadeIn?: boolean
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  containerWidth = "full",
  lowQualityPlaceholder = true,
  fadeIn = true,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, ref] = useIntersectionObserver({
    freezeOnceVisible: true,
    rootMargin: "200px", // Cargar un poco antes de que sea visible
  })

  // Generar un placeholder SVG para mejorar LCP
  const placeholderDataURL = lowQualityPlaceholder
    ? generateBlurDataURL(typeof width === "number" ? width : 100, typeof height === "number" ? height : 100)
    : undefined

  // Determinar los tamaños responsivos
  const sizes =
    props.sizes ||
    (() => {
      switch (containerWidth) {
        case "full":
          return "100vw"
        case "half":
          return "(max-width: 768px) 100vw, 50vw"
        case "third":
          return "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        case "quarter":
          return "(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        default:
          return "100vw"
      }
    })()

  return (
    <div ref={ref} className="relative overflow-hidden">
      {isVisible && (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className={`
            ${className || ""}
            ${fadeIn ? "transition-opacity duration-500" : ""}
            ${isLoaded ? "opacity-100" : "opacity-0"}
          `}
          sizes={sizes}
          placeholder={lowQualityPlaceholder ? "blur" : "empty"}
          blurDataURL={placeholderDataURL}
          onLoadingComplete={() => setIsLoaded(true)}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  )
}
