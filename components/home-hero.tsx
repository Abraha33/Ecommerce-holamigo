"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HeroSlide {
  image: string
  title: string
  description: string
  cta: string
  ctaLink: string
}

interface HomeHeroProps {
  slides: HeroSlide[]
}

export function HomeHero({ slides }: HomeHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Function to go to the next slide (infinite)
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }, [slides.length])

  // Function to go to the previous slide (infinite)
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }, [slides.length])

  // Autoplay for the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 6000)

    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <div className="relative h-0 w-full overflow-hidden">
      {/* Slides */}

      {/* Controls */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full z-20"
        onClick={prevSlide}
        aria-label="Slide anterior"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full z-20"
        onClick={nextSlide}
        aria-label="Siguiente slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-3 rounded-full transition-all ${
              currentSlide === index ? "w-10 bg-[#004a93]" : "w-3 bg-white/60"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
