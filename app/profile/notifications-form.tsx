"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

type NotificationPreference = {
  id: string
  title: string
  description: string
}

const notificationOptions: NotificationPreference[] = [
  {
    id: "order_updates",
    title: "Actualizaciones de pedidos",
    description: "Recibe notificaciones sobre el estado de tus pedidos",
  },
  {
    id: "promotions",
    title: "Promociones y ofertas",
    description: "Mantente informado sobre descuentos y ofertas especiales",
  },
  {
    id: "new_products",
    title: "Nuevos productos",
    description: "Sé el primero en conocer cuando añadimos nuevos productos",
  },
  {
    id: "stock_alerts",
    title: "Alertas de stock",
    description: "Recibe notificaciones cuando los productos de tu interés vuelvan a estar disponibles",
  },
  {
    id: "account_updates",
    title: "Actualizaciones de cuenta",
    description: "Información importante sobre tu cuenta y cambios en los términos",
  },
]

type NotificationsFormProps = {
  preferences: Record<string, boolean>
  onSubmit: (preferences: Record<string, boolean>) => void
}

export default function NotificationsForm({ preferences, onSubmit }: NotificationsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState<Record<string, boolean>>(() => {
    // Initialize with default values for all options, then override with user preferences
    const initialState: Record<string, boolean> = {}
    notificationOptions.forEach((option) => {
      initialState[option.id] = preferences[option.id] ?? true // Default to true if not set
    })
    return initialState
  })

  const handleToggle = (id: string, checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      [id]: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formState)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {notificationOptions.map((option) => (
          <div key={option.id} className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor={option.id} className="text-base">
                {option.title}
              </Label>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
            <Switch
              id={option.id}
              checked={formState[option.id]}
              onCheckedChange={(checked) => handleToggle(option.id, checked)}
            />
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Guardando...
          </>
        ) : (
          "Guardar preferencias"
        )}
      </Button>
    </form>
  )
}
