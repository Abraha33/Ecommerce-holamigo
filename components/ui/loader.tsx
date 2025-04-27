"use client"
import { cn } from "@/lib/utils"

interface LoaderProps {
  className?: string
  color?: "blue" | "red" | "white"
  size?: "small" | "medium" | "large"
}

export function Loader({ className, color = "blue", size = "medium" }: LoaderProps) {
  // Map size to pixel values
  const sizeMap = {
    small: {
      width: "8px",
      height: "8px",
      boxShadow: "13px 0, -13px 0",
    },
    medium: {
      width: "13.4px",
      height: "13.4px",
      boxShadow: "22.4px 0, -22.4px 0",
    },
    large: {
      width: "20px",
      height: "20px",
      boxShadow: "33px 0, -33px 0",
    },
  }

  // Map color to actual color values
  const colorMap = {
    blue: "#0003b0",
    red: "#e30613",
    white: "#ffffff",
  }

  const selectedSize = sizeMap[size]
  const selectedColor = colorMap[color]

  return (
    <div
      className={cn("loader-dots", className)}
      style={{
        width: selectedSize.width,
        height: selectedSize.height,
        background: selectedColor,
        color: selectedColor,
        borderRadius: "50%",
        boxShadow: selectedSize.boxShadow.replace(/(\d+px)/g, `$1 ${selectedColor}`),
        animation: "dots-loader 1s infinite linear alternate",
      }}
    />
  )
}

// Add the keyframes animation to the global styles
export function LoaderStyles() {
  return (
    <style jsx global>{`
      @keyframes dots-loader {
        0% {
          box-shadow: var(--tw-box-shadow);
          background: var(--tw-bg-opacity);
        }
        
        33% {
          box-shadow: var(--tw-box-shadow);
          background: rgba(var(--color-rgb), 0.13);
        }
        
        66% {
          box-shadow: var(--tw-box-shadow);
          background: rgba(var(--color-rgb), 0.13);
        }
      }
    `}</style>
  )
}
