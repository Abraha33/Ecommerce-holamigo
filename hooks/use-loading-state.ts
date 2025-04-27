"use client"

import { useState, useCallback } from "react"

interface UseLoadingStateOptions {
  initialState?: boolean
}

export function useLoadingState({ initialState = false }: UseLoadingStateOptions = {}) {
  const [isLoading, setIsLoading] = useState(initialState)
  const [error, setError] = useState<Error | null>(null)

  const startLoading = useCallback(() => {
    setIsLoading(true)
    setError(null)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  const setLoadingError = useCallback((error: Error) => {
    setError(error)
    setIsLoading(false)
  }, [])

  const withLoading = useCallback(
    async <T,>(promise: Promise<T>): Promise<T> => {
      try {
        startLoading()
        const result = await promise
        return result
      } catch (err) {
        setLoadingError(err instanceof Error ? err : new Error(String(err)))
        throw err
      } finally {
        stopLoading()
      }
    },
    [startLoading, stopLoading, setLoadingError],
  )

  return {
    isLoading,
    setIsLoading,
    startLoading,
    stopLoading,
    error,
    setError,
    setLoadingError,
    withLoading,
  }
}
