"use client"

import { useState, useEffect } from "react"
import { Loader } from "@/components/ui/loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsLoading(false)
            return 0
          }
          return prev + 10
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isLoading])

  const startLoading = () => {
    setIsLoading(true)
    setProgress(0)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-[#1f4b9b]">Demostración de Loader</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader size="large" color="primary" />
              <p className="text-[#1f4b9b] font-medium">Cargando... {progress}%</p>
            </div>
          ) : (
            <p className="text-gray-500">Presiona el botón para iniciar la carga</p>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={startLoading}
            disabled={isLoading}
            className="bg-[#1f4b9b] hover:bg-[#163b7a] transition-colors duration-300"
          >
            {isLoading ? "Cargando..." : "Iniciar carga"}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
            <Loader size="small" color="primary" />
            <span className="text-xs text-gray-500">Pequeño</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
            <Loader size="medium" color="primary" />
            <span className="text-xs text-gray-500">Mediano</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
            <Loader size="large" color="primary" />
            <span className="text-xs text-gray-500">Grande</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
            <Loader size="medium" color="primary" />
            <span className="text-xs text-gray-500">Primario</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
            <Loader size="medium" color="secondary" />
            <span className="text-xs text-gray-500">Secundario</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-[#1f4b9b]">
            <Loader size="medium" color="white" />
            <span className="text-xs text-white">Blanco</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
