"use client"
import { cn } from "@/lib/utils"

interface LoaderProps {
  className?: string
  color?: "primary" | "secondary" | "white"
  size?: "small" | "medium" | "large"
}

export function Loader({ className, color = "primary", size = "medium" }: LoaderProps) {
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
    primary: "#1f4b9b",
    secondary: "#CDA22A",
    white: "#ffffff",
  }

  const selectedSize = sizeMap[size]
  const selectedColor = colorMap[color]

  return (
    <div
      className={cn("dots", className)}
      style={{
        width: selectedSize.width,
        height: selectedSize.height,
        background: selectedColor,
        color: selectedColor,
        borderRadius: "50%",
        boxShadow: selectedSize.boxShadow.replace(/(\d+px)/g, `$1 ${selectedColor}`),
        animation: "dots-u8fzftmd 1s infinite linear alternate",
      }}
    />
  )
}

// Add the keyframes animation to the global styles
export function LoaderStyles() {
  return (
    <style jsx global>{`
      @keyframes dots-u8fzftmd {
        0% {
          box-shadow: 22.4px 0, -22.4px 0;
          background: currentColor;
        }
        
        33% {
          box-shadow: 22.4px 0, -22.4px 0 rgba(31, 75, 155, 0.13);
          background: rgba(31, 75, 155, 0.13);
        }
        
        66% {
          box-shadow: 22.4px 0 rgba(31, 75, 155, 0.13), -22.4px 0;
          background: rgba(31, 75, 155, 0.13);
        }
      }
    `}</style>
  )
}
