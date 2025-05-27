"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MessageSquare, Package, AlertCircle, Search, HelpCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

const helpOptions = [
  {
    id: "order",
    title: "Problema con mi pedido",
    description: "Seguimiento, cambios o problemas con tu pedido",
    icon: <Package className="h-5 w-5" />,
    message: "Hola, tengo un problema con mi pedido. Necesito ayuda con:",
  },
  {
    id: "website",
    title: "Problema con la página web",
    description: "Errores, problemas técnicos o de navegación",
    icon: <AlertCircle className="h-5 w-5" />,
    message: "Hola, estoy teniendo problemas técnicos con la página web. El problema es:",
  },
  {
    id: "product",
    title: "No encuentro lo que busco",
    description: "Ayuda para encontrar productos específicos",
    icon: <Search className="h-5 w-5" />,
    message: "Hola, no puedo encontrar un producto específico. Estoy buscando:",
  },
  {
    id: "account",
    title: "Problemas con mi cuenta",
    description: "Login, registro o configuración de cuenta",
    icon: <HelpCircle className="h-5 w-5" />,
    message: "Hola, tengo problemas con mi cuenta de usuario. Necesito ayuda con:",
  },
  {
    id: "payment",
    title: "Problemas de pago",
    description: "Métodos de pago, facturación o reembolsos",
    icon: <MessageSquare className="h-5 w-5" />,
    message: "Hola, tengo una consulta sobre pagos o facturación. Mi problema es:",
  },
  {
    id: "other",
    title: "Otra consulta",
    description: "Cualquier otra pregunta o comentario",
    icon: <MessageSquare className="h-5 w-5" />,
    message: "Hola, tengo una consulta general. Mi pregunta es:",
  },
]

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [selectedOption, setSelectedOption] = useState("")
  const [additionalContent, setAdditionalContent] = useState("")
  const phoneNumber = "+573192102438"

  const handleSendToWhatsApp = () => {
    if (!selectedOption) return

    const option = helpOptions.find((opt) => opt.id === selectedOption)
    if (!option) return

    let message = option.message
    if (additionalContent.trim()) {
      message += ` ${additionalContent.trim()}`
    }

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, "")}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            ¿En qué podemos ayudarte?
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            Selecciona el motivo de tu consulta y te conectaremos directamente con nuestro equipo de soporte por
            WhatsApp.
          </p>

          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            <div className="space-y-3">
              {helpOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="flex items-start gap-2 cursor-pointer">
                      <div className="text-blue-600 mt-0.5">{option.icon}</div>
                      <div>
                        <div className="font-medium text-sm">{option.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
          {selectedOption && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="additional-content" className="text-sm font-medium">
                Información adicional (opcional)
              </Label>
              <Textarea
                id="additional-content"
                placeholder="Describe tu consulta con más detalle..."
                value={additionalContent}
                onChange={(e) => setAdditionalContent(e.target.value)}
                className="min-h-[80px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500">{additionalContent.length}/500 caracteres</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleSendToWhatsApp}
            disabled={!selectedOption}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Enviar a WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
