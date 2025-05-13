"use client"

interface OrderTrackingProps {
  currentStep: string
}

export function OrderTracking({ currentStep }: OrderTrackingProps) {
  const steps = ["Creado", "Asignado", "Recogido", "En camino", "Entregado"]

  const stepIndex = steps.indexOf(currentStep)

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
        style={{
          width: `${(stepIndex / (steps.length - 1)) * 100}%`,
        }}
      />
    </div>
  )
}
