"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingArrow,
  FloatingFocusManager,
  useId,
} from "@floating-ui/react"

interface TourStep {
  targetSelector: string
  content: string
  placement?: "top" | "bottom" | "left" | "right"
}

interface SiteTourProps {
  isOpen?: boolean
  onClose?: () => void
}

export function SiteTour({ isOpen = false, onClose }: SiteTourProps) {
  const [active, setActive] = useState(isOpen)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [steps, setSteps] = useState<TourStep[]>([])
  const [currentTarget, setCurrentTarget] = useState<Element | null>(null)
  const arrowRef = useRef(null)
  const pathname = usePathname()

  const headingId = useId()
  const descriptionId = useId()

  // Configuración de Floating UI
  const { refs, floatingStyles, context } = useFloating({
    open: active && currentTarget !== null,
    onOpenChange: setActive,
    middleware: [offset(10), flip(), shift(), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate,
    elements: {
      reference: currentTarget,
    },
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])

  // Efecto para actualizar el estado activo cuando cambia isOpen
  useEffect(() => {
    setActive(isOpen)
    if (isOpen) {
      setCurrentStepIndex(0)
    }
  }, [isOpen])

  // Efecto para definir los pasos según la ruta actual
  useEffect(() => {
    // Definir los pasos según la ruta actual
    const commonSteps: TourStep[] = [
      {
        targetSelector: ".header-logo",
        content: "Bienvenido a Envax. Haz clic en nuestro logo para volver a la página principal en cualquier momento.",
        placement: "bottom",
      },
      {
        targetSelector: ".search-bar",
        content:
          "Busca productos por nombre, categoría o descripción. Prueba términos como 'eco', 'biodegradable' o 'reciclado'.",
        placement: "bottom",
      },
      {
        targetSelector: ".categories-menu",
        content: "Explora nuestras categorías de productos organizadas para facilitar tu búsqueda.",
        placement: "bottom",
      },
      {
        targetSelector: ".account-icon",
        content: "Accede a tu cuenta para ver tus pedidos, direcciones guardadas y lista de deseos.",
        placement: "bottom",
      },
      {
        targetSelector: ".cart-icon",
        content: "Revisa los productos en tu carrito y procede al pago cuando estés listo.",
        placement: "bottom",
      },
    ]

    // Pasos específicos para la página principal
    const homeSteps: TourStep[] = [
      ...commonSteps,
      {
        targetSelector: ".hero-section",
        content: "Descubre nuestras ofertas destacadas y novedades en esta sección principal.",
        placement: "bottom",
      },
      {
        targetSelector: ".category-circles",
        content: "Accede rápidamente a nuestras categorías principales desde estos círculos.",
        placement: "top",
      },
      {
        targetSelector: ".featured-products",
        content: "Estos son nuestros productos más populares y recomendados.",
        placement: "top",
      },
      {
        targetSelector: ".newsletter-section",
        content: "Suscríbete a nuestro boletín para recibir ofertas exclusivas y novedades.",
        placement: "top",
      },
    ]

    // Pasos específicos para la página de tienda/productos
    const shopSteps: TourStep[] = [
      ...commonSteps,
      {
        targetSelector: ".filter-section",
        content: "Filtra los productos por marca, precio, disponibilidad y más características.",
        placement: "right",
      },
      {
        targetSelector: ".sort-options",
        content: "Ordena los productos por precio, popularidad o novedades.",
        placement: "bottom",
      },
      {
        targetSelector: ".product-grid",
        content: "Explora nuestra selección de productos. Pasa el cursor sobre un producto para ver opciones rápidas.",
        placement: "top",
      },
    ]

    // Pasos específicos para la página de carrito
    const cartSteps: TourStep[] = [
      ...commonSteps,
      {
        targetSelector: ".cart-items",
        content: "Aquí puedes ver todos los productos que has añadido a tu carrito.",
        placement: "top",
      },
      {
        targetSelector: ".cart-summary",
        content: "Revisa el resumen de tu pedido, incluyendo subtotal, descuentos y total.",
        placement: "left",
      },
      {
        targetSelector: ".checkout-button",
        content: "Haz clic aquí para proceder al pago cuando estés listo para completar tu compra.",
        placement: "top",
      },
    ]

    // Seleccionar los pasos según la ruta actual
    if (pathname === "/") {
      setSteps(homeSteps)
    } else if (pathname.includes("/shop")) {
      setSteps(shopSteps)
    } else if (pathname === "/cart") {
      setSteps(cartSteps)
    } else {
      setSteps(commonSteps)
    }
  }, [pathname])

  // Efecto para actualizar el elemento objetivo cuando cambia el paso actual
  useEffect(() => {
    if (!active || steps.length === 0) return

    const currentStep = steps[currentStepIndex]
    if (!currentStep) return

    const targetElement = document.querySelector(currentStep.targetSelector)
    setCurrentTarget(targetElement)
  }, [active, currentStepIndex, steps])

  // Manejadores para la navegación del tour
  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      handleFinish()
    }
  }

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleFinish = () => {
    setActive(false)
    if (onClose) onClose()
  }

  const handleSkip = () => {
    handleFinish()
  }

  // Si no estamos en el navegador o no hay pasos, no renderizar nada
  if (typeof window === "undefined" || steps.length === 0 || !active) {
    return null
  }

  const currentStep = steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  return (
    <>
      {/* Overlay para oscurecer el fondo */}
      <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={handleSkip} aria-hidden="true" />

      {/* Tooltip del tour */}
      {currentTarget && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="z-[10000] bg-white rounded-lg shadow-lg p-4 max-w-[350px]"
            aria-labelledby={headingId}
            aria-describedby={descriptionId}
            {...getFloatingProps()}
          >
            <FloatingArrow ref={arrowRef} context={context} fill="#ffffff" />

            <div className="mb-4">
              <p id={headingId} className="text-lg font-medium text-gray-900">
                Paso {currentStepIndex + 1} de {steps.length}
              </p>
              <p id={descriptionId} className="text-gray-700 mt-1">
                {currentStep.content}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <button onClick={handleSkip} className="text-sm text-gray-500 hover:text-gray-700">
                Saltar tour
              </button>

              <div className="flex space-x-2">
                {!isFirstStep && (
                  <button onClick={handlePrev} className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
                    Anterior
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isLastStep ? "Finalizar" : "Siguiente"}
                </button>
              </div>
            </div>
          </div>
        </FloatingFocusManager>
      )}
    </>
  )
}
