"use client"

import { useCart } from "./cart-provider"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Cloud, CloudOff, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

export function CartSyncStatus() {
  const { isSyncing, lastSynced } = useCart()
  const [timeAgo, setTimeAgo] = useState<string>("")

  // Actualizar el tiempo transcurrido desde la última sincronización
  useEffect(() => {
    if (!lastSynced) return

    const updateTimeAgo = () => {
      const now = new Date()
      const diffMs = now.getTime() - lastSynced.getTime()
      const diffSec = Math.floor(diffMs / 1000)
      const diffMin = Math.floor(diffSec / 60)
      const diffHour = Math.floor(diffMin / 60)

      if (diffSec < 60) {
        setTimeAgo("hace unos segundos")
      } else if (diffMin < 60) {
        setTimeAgo(`hace ${diffMin} ${diffMin === 1 ? "minuto" : "minutos"}`)
      } else {
        setTimeAgo(`hace ${diffHour} ${diffHour === 1 ? "hora" : "horas"}`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 60000) // Actualizar cada minuto

    return () => clearInterval(interval)
  }, [lastSynced])

  if (!lastSynced) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <Badge
              variant="outline"
              className={`flex items-center gap-1 px-2 py-1 text-xs ${
                isSyncing ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"
              }`}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>Sincronizando...</span>
                </>
              ) : (
                <>
                  <Cloud className="h-3 w-3" />
                  <span>Sincronizado</span>
                </>
              )}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-sm">
            {isSyncing ? "Sincronizando carrito entre dispositivos..." : `Último sincronizado: ${timeAgo}`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function CartSyncOffline() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-50 text-yellow-700">
              <CloudOff className="h-3 w-3" />
              <span>Modo local</span>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-sm">Carrito guardado localmente. Inicia sesión para sincronizar entre dispositivos.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
