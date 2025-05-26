"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

export default function MobileLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <>
      {children}
      {isMobile && <MobileBottomNav />}
      {isMobile && <div className="h-16" />} {/* Spacer for bottom nav */}
    </>
  )
}
