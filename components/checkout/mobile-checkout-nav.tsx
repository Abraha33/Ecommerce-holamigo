"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"

interface MobileCheckoutNavProps {
  currentStep: number
  totalSteps: number
  title: string
  onBack?: () => void
}

export function MobileCheckoutNav({ currentStep, totalSteps, title, onBack }: MobileCheckoutNavProps) {
  const router = useRouter()
  const { itemCount } = useCart()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  const progress = (currentStep / totalSteps) * 100

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 bg-white border-b z-50 transition-transform duration-300 md:hidden",
        isVisible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div className="flex items-center justify-between p-4">
        <button onClick={handleBack} className="p-1 -ml-1">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-medium">{title}</h1>
        <div className="relative">
          <ShoppingBag className="h-6 w-6" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              {itemCount}
            </span>
          )}
        </div>
      </div>
      <div className="h-1 bg-gray-200 w-full">
        <div className="h-1 bg-blue-600 transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
