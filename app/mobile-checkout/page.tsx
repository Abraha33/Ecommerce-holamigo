"use client"

import { useState } from "react"
import { MobileCheckoutLayout } from "@/components/mobile-checkout-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, CreditCard, MapPin, Package, ShoppingBag, Check } from "lucide-react"

export default function MobileCheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const steps = [
    { id: 1, title: "Método de entrega", icon: Package },
    { id: 2, title: "Dirección", icon: MapPin },
    { id: 3, title: "Pago", icon: CreditCard },
    { id: 4, title: "Confirmar", icon: ShoppingBag },
  ]

  const getCurrentTitle = () => {
    const step = steps.find((s) => s.id === currentStep)
    return step ? step.title : ""
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  return (
    <MobileCheckoutLayout
      title={getCurrentTitle()}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onBack={handleBack}
    >
      <div className="px-4 py-6">
        {/* Indicador de pasos */}
        <div className="flex justify-between mb-6">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step.id === currentStep
                    ? "bg-blue-600 text-white"
                    : step.id < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.id < currentStep ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </div>
              <span className={`text-xs ${step.id === currentStep ? "font-medium" : "text-gray-500"}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Contenido del paso actual */}
        <Card className="mb-6">
          <div className="p-4">
            {currentStep === 1 && (
              <div>
                <h2 className="text-lg font-medium mb-4">Selecciona método de entrega</h2>
                {["Entrega estándar", "Entrega express", "Programar entrega", "Recoger en tienda"].map(
                  (method, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border-b last:border-0 cursor-pointer hover:bg-gray-50"
                      onClick={handleNext}
                    >
                      <span>{method}</span>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ),
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-lg font-medium mb-4">Dirección de entrega</h2>
                {["Casa (Calle 123 #45-67)", "Oficina (Av. Principal #89)", "Añadir nueva dirección"].map(
                  (address, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border-b last:border-0 cursor-pointer hover:bg-gray-50"
                      onClick={handleNext}
                    >
                      <span>{address}</span>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ),
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-lg font-medium mb-4">Método de pago</h2>
                {[
                  "Tarjeta de crédito",
                  "Efectivo contra entrega",
                  "Transferencia bancaria",
                  "Nequi",
                  "Añadir nuevo método",
                ].map((method, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border-b last:border-0 cursor-pointer hover:bg-gray-50"
                    onClick={handleNext}
                  >
                    <span>{method}</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-lg font-medium mb-4">Confirmar pedido</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm text-gray-500">Método de entrega</div>
                    <div>Entrega estándar</div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm text-gray-500">Dirección</div>
                    <div>Casa (Calle 123 #45-67)</div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm text-gray-500">Método de pago</div>
                    <div>Tarjeta de crédito</div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>$120.000</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Envío</span>
                      <span>$10.000</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>$130.000</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Resumen del carrito */}
        <Card className="mb-6">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">Resumen del pedido</h2>
            <div className="space-y-3">
              {[
                { name: "Producto 1", price: "$45.000", qty: 2 },
                { name: "Producto 2", price: "$30.000", qty: 1 },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div>{item.name}</div>
                    <div className="text-sm text-gray-500">Cantidad: {item.qty}</div>
                  </div>
                  <div>{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Botón de acción */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden">
          {currentStep < totalSteps ? (
            <Button onClick={handleNext} className="w-full">
              Continuar
            </Button>
          ) : (
            <Button onClick={() => alert("¡Pedido completado!")} className="w-full bg-green-600 hover:bg-green-700">
              Confirmar pedido
            </Button>
          )}
        </div>
      </div>
    </MobileCheckoutLayout>
  )
}
