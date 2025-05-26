"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ShoppingCart, CreditCard, Truck, Package } from "lucide-react"
import Link from "next/link"

export function TestPurchaseGuide() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    {
      id: 1,
      title: "Explorar Productos",
      description: "Navega por las categorías y encuentra productos",
      icon: <Package className="h-5 w-5" />,
      actions: [
        { label: "Ver Tienda", href: "/shop" },
        { label: "Ver Categorías", href: "/categories" },
        { label: "Productos Destacados", href: "/promos/destacadas" },
      ],
    },
    {
      id: 2,
      title: "Agregar al Carrito",
      description: "Selecciona productos y agrégalos al carrito",
      icon: <ShoppingCart className="h-5 w-5" />,
      actions: [
        { label: "Abrir Modal de Producto", href: "/shop" },
        { label: "Seleccionar Presentación", href: "/shop" },
        { label: "Ver Carrito", href: "/cart" },
      ],
    },
    {
      id: 3,
      title: "Configurar Entrega",
      description: "Elige método de entrega y dirección",
      icon: <Truck className="h-5 w-5" />,
      actions: [
        { label: "Ir a Checkout", href: "/checkout" },
        { label: "Seleccionar Entrega", href: "/checkout" },
        { label: "Configurar Dirección", href: "/checkout" },
      ],
    },
    {
      id: 4,
      title: "Procesar Pago",
      description: "Completa la información y realiza el pago",
      icon: <CreditCard className="h-5 w-5" />,
      actions: [
        { label: "Información de Pago", href: "/checkout/payment" },
        { label: "Confirmar Pedido", href: "/checkout/payment" },
        { label: "Ver Confirmación", href: "/checkout/confirmation" },
      ],
    },
  ]

  const toggleStep = (stepId: number) => {
    setCompletedSteps((prev) => (prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">🛒 Guía de Compra de Prueba</h1>
        <p className="text-gray-600">Sigue estos pasos para probar todo el flujo de compra como invitado</p>
      </div>

      <div className="grid gap-6">
        {steps.map((step, index) => (
          <Card key={step.id} className="p-6">
            <div className="flex items-start space-x-4">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  completedSteps.includes(step.id) ? "bg-green-500 text-white" : "bg-blue-100 text-blue-600"
                }`}
              >
                {completedSteps.includes(step.id) ? <CheckCircle className="h-5 w-5" /> : step.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold">
                    Paso {index + 1}: {step.title}
                  </h3>
                  <Badge variant={completedSteps.includes(step.id) ? "default" : "secondary"}>
                    {completedSteps.includes(step.id) ? "Completado" : "Pendiente"}
                  </Badge>
                </div>

                <p className="text-gray-600 mb-4">{step.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {step.actions.map((action, actionIndex) => (
                    <Button key={actionIndex} variant="outline" size="sm" asChild>
                      <Link href={action.href}>{action.label}</Link>
                    </Button>
                  ))}
                </div>

                <Button
                  variant={completedSteps.includes(step.id) ? "secondary" : "default"}
                  size="sm"
                  onClick={() => toggleStep(step.id)}
                >
                  {completedSteps.includes(step.id) ? "Marcar como Pendiente" : "Marcar como Completado"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Datos de Prueba</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-green-700">Información de Contacto:</h4>
            <ul className="text-green-600 mt-1">
              <li>• Email: test@holamigo.com</li>
              <li>• Teléfono: 300 123 4567</li>
              <li>• Nombre: Juan Pérez</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-green-700">Tarjeta de Prueba:</h4>
            <ul className="text-green-600 mt-1">
              <li>• Número: 4242 4242 4242 4242</li>
              <li>• Vencimiento: 12/25</li>
              <li>• CVC: 123</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Progreso: {completedSteps.length} de {steps.length} pasos completados
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
