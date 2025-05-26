"use client"

import type { ReactNode } from "react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

interface LazySectionProps {
  children: ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  placeholder?: ReactNode
}

export function LazySection({
  children,
  className,
  threshold = 0.1,
  rootMargin = "200px",
  placeholder,
}: LazySectionProps) {
  const [isVisible, ref] = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: true,
  })

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : placeholder || <div className="animate-pulse bg-gray-200 rounded-lg h-40 w-full"></div>}
    </div>
  )
}
