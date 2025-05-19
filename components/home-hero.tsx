"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover brightness-[0.7]"
              priority={index === 0}
            />
          </div>

          {/* Slide content */}
          <div className="container mx-auto h-full flex items-center relative z-10">
            <div className="max-w-2xl text-white p-6">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
              <p className="text-lg mb-8">{slide.description}</p>
              <Link href={slide.ctaLink}>
                <Button className="bg-[#004a93] hover:bg-[#003a73] text-white font-bold px-8 py-3 rounded-full text-lg transition-all">
                  {slide.cta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

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
