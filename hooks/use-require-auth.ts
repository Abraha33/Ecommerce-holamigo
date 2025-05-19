"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export function useRequireAuth(redirectTo = "/auth") {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the current path to redirect back after login
      try {
        sessionStorage.setItem("redirectAfterLogin", pathname)
      } catch (e) {
        console.error("Failed to save redirect path:", e)
      }

      router.push(`${redirectTo}?redirectTo=${encodeURIComponent(pathname)}`)
    }
  }, [isLoading, isAuthenticated, router, redirectTo, pathname])

  return { user, isLoading }
}
