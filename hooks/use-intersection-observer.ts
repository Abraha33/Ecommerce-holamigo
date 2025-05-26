"use client"

import { useState, useEffect, useRef, type RefObject } from "react"

interface UseIntersectionObserverProps {
  threshold?: number
  root?: Element | null
  rootMargin?: string
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
}: UseIntersectionObserverProps = {}): [boolean, RefObject<HTMLDivElement>] {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const frozen = useRef<boolean>(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Evitar observar si ya está congelado
    if (frozen.current && freezeOnceVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementVisible = entry.isIntersecting

        // Actualizar estado solo si es necesario
        if (isElementVisible !== isVisible) {
          setIsVisible(isElementVisible)

          if (isElementVisible && freezeOnceVisible) {
            frozen.current = true
          }
        }
      },
      { threshold, root, rootMargin },
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [threshold, root, rootMargin, freezeOnceVisible, isVisible])

  return [isVisible, elementRef]
}
