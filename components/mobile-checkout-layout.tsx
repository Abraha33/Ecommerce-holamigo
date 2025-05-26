"use client"

import type { ReactNode } from "react"
import { MobileCheckoutNav } from "@/components/checkout/mobile-checkout-nav"

interface MobileCheckoutLayoutProps {
  children: ReactNode
  title: string
  currentStep: number
  totalSteps: number
  onBack?: () => void
}

export function MobileCheckoutLayout({ children, title, currentStep, totalSteps, onBack }: MobileCheckoutLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <MobileCheckoutNav currentStep={currentStep} totalSteps={totalSteps} title={title} onBack={onBack} />
      <div className="pt-16">{children}</div>
    </div>
  )
}
