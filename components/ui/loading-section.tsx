"use client"

import type React from "react"

import { Loader } from "@/components/ui/loader"
import { cn } from "@/lib/utils"

interface LoadingSectionProps {
  className?: string
  message?: string
  isLoading: boolean
  children: React.ReactNode
  color?: "primary" | "secondary" | "white"
}

export function LoadingSection({ className, message, isLoading, children, color = "primary" }: LoadingSectionProps) {
  return (
    <div className={cn("relative", className)}>
      {children}

      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center z-10">
          <Loader size="medium" color={color} />
          {message && <p className="mt-2 text-sm font-medium text-[#20509E]">{message}</p>}
        </div>
      )}
    </div>
  )
}
