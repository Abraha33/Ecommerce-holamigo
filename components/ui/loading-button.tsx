"use client"

import type { ButtonHTMLAttributes } from "react"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

// Actualizar la definición de la interfaz LoadingButtonProps
interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  className?: string
  loaderColor?: "primary" | "secondary" | "white"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, isLoading, loadingText, className, loaderColor = "white", variant, size, ...props }, ref) => {
    return (
      <Button 
        ref={ref} 
        className={cn("relative", className)} 
        disabled={isLoading || props.disabled} 
        variant={variant} 
        size={size}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center bg-inherit">
            <Loader size="small" color={loaderColor} />
            {loadingText && <span className="ml-2">{loadingText}</span>}
          </span>
        )}
        <span className={cn("flex items-center justify-center", isLoading ? "invisible" : "visible")}>{children}</span>
      </Button>
    )
  },
)

LoadingButton.displayName = "LoadingButton"
