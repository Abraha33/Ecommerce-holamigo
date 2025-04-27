"use client"

import { cn } from "@/lib/utils"

interface SkeletonCardProps {
  className?: string
  rows?: number
}

export function SkeletonCard({ className, rows = 3 }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-lg border p-4 space-y-3", className)}>
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </div>

      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        ))}
      </div>

      <div className="flex justify-between pt-2">
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}
