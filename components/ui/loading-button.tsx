"use client"

import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { cn } from "@/lib/utils"
import type { ButtonProps } from "@radix-ui/react-button"
import { forwardRef } from "react"

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean
  loadingText?: string
  className?: string
  loaderColor?: "primary" | "secondary" | "white"
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, isLoading, loadingText, className, loaderColor = "white", ...props }, ref) => {
    return (
      <Button ref={ref} className={cn("relative", className)} disabled={isLoading || props.disabled} {...props}>
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
