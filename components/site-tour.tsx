"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Joyride, { type CallBackProps, STATUS, type Step } from "react-joyride"

interface SiteTourProps {
  isOpen?: boolean
  onClose?: () => void
}

export function SiteTour({ isOpen = false, onClose }: SiteTourProps) {
  const [run, setRun] = useState(isOpen)
  const [steps, setSteps] = useState<Step[]>([])
  const pathname = usePathname()

  useEffect(() => {
    setRun(isOpen)
  }, [isOpen])

  useEffect(() => {
    // Definir los pasos según la ruta actual
    const commonSteps: Step[] = [
      {
        target: ".header-logo",
        content: "Bienvenido a Envax. Haz clic en nuestro logo para volver a la página principal en cualquier momento.",
        disableBeacon: true,
        placement: "bottom",
      },
      {
        target: ".search-bar",
        content:
          "Busca productos por nombre, categoría o descripción. Prueba términos como 'eco', 'biodegradable' o 'reciclado'.",
        placement: "bottom",
      },
      {
        target: ".categories-menu",
        content: "Explora nuestras categorías de productos organizadas para facilitar tu búsqueda.",
        placement: "bottom",
      },
      {
        target: ".account-icon",
        content: "Accede a tu cuenta para ver tus pedidos, direcciones guardadas y lista de deseos.",
        placement: "bottom",
      },
      {
        target: ".cart-icon",
        content: "Revisa los productos en tu carrito y procede al pago cuando estés listo.",
        placement: "bottom-end",
      },
    ]

    // Pasos específicos para la página principal
    const homeSteps: Step[] = [
      ...commonSteps,
      {
        target: ".hero-section",
        content: "Descubre nuestras ofertas destacadas y novedades en esta sección principal.",
        placement: "bottom",
      },
      {
        target: ".category-circles",
        content: "Accede rápidamente a nuestras categorías principales desde estos círculos.",
        placement: "top",
      },
      {
        target: ".featured-products",
        content: "Estos son nuestros productos más populares y recomendados.",
        placement: "top",
      },
      {
        target: ".newsletter-section",
        content: "Suscríbete a nuestro boletín para recibir ofertas exclusivas y novedades.",
        placement: "top",
      },
    ]

    // Pasos específicos para la página de tienda/productos
    const shopSteps: Step[] = [
      ...commonSteps,
      {
        target: ".filter-section",
        content: "Filtra los productos por marca, precio, disponibilidad y más características.",
        placement: "right",
      },
      {
        target: ".sort-options",
        content: "Ordena los productos por precio, popularidad o novedades.",
        placement: "bottom",
      },
      {
        target: ".view-toggle",
        content: "Cambia entre vista de cuadrícula o lista según tu preferencia.",
        placement: "bottom",
      },
      {
        target: ".product-grid",
        content: "Explora nuestra selección de productos. Pasa el cursor sobre un producto para ver opciones rápidas.",
        placement: "top",
      },
      {
        target: ".product-card",
        content:
          "Cada tarjeta muestra información básica del producto. Haz clic en 'Ver detalles' para más información o en 'Añadir al carrito' para comprarlo.",
        placement: "right",
      },
    ]

    // Pasos específicos para la página de carrito
    const cartSteps: Step[] = [
      ...commonSteps,
      {
        target: ".cart-items",
        content: "Aquí puedes ver todos los productos que has añadido a tu carrito.",
        placement: "top",
      },
      {
        target: ".quantity-selector",
        content: "Ajusta la cantidad de cada producto según tus necesidades.",
        placement: "right",
      },
      {
        target: ".cart-summary",
        content: "Revisa el resumen de tu pedido, incluyendo subtotal, descuentos y total.",
        placement: "left",
      },
      {
        target: ".checkout-button",
        content: "Haz clic aquí para proceder al pago cuando estés listo para completar tu compra.",
        placement: "top",
      },
    ]

    // Pasos específicos para la página de checkout
    const checkoutSteps: Step[] = [
      {
        target: ".delivery-options",
        content: "Selecciona tu método de entrega preferido.",
        disableBeacon: true,
        placement: "right",
      },
      {
        target: ".address-section",
        content: "Ingresa o selecciona la dirección de entrega para tu pedido.",
        placement: "right",
      },
      {
        target: ".payment-methods",
        content: "Elige tu método de pago preferido entre las opciones disponibles.",
        placement: "left",
      },
      {
        target: ".order-summary",
        content: "Revisa el resumen final de tu pedido antes de confirmar.",
        placement: "left",
      },
      {
        target: ".place-order-button",
        content: "Haz clic aquí para confirmar y finalizar tu compra.",
        placement: "top",
      },
    ]

    // Pasos específicos para la página de cuenta
    const accountSteps: Step[] = [
      ...commonSteps,
      {
        target: ".account-sidebar",
        content: "Navega entre las diferentes secciones de tu cuenta desde este menú lateral.",
        disableBeacon: true,
        placement: "right",
      },
      {
        target: ".profile-section",
        content: "Actualiza tu información personal y preferencias de cuenta.",
        placement: "right",
      },
      {
        target: ".orders-section",
        content: "Revisa el historial de tus pedidos y su estado actual.",
        placement: "right",
      },
      {
        target: ".addresses-section",
        content: "Gestiona tus direcciones de entrega guardadas.",
        placement: "right",
      },
      {
        target: ".payment-section",
        content: "Administra tus métodos de pago guardados.",
        placement: "right",
      },
      {
        target: ".wishlist-section",
        content: "Accede a los productos que has guardado en tu lista de deseos.",
        placement: "right",
      },
    ]

    // Pasos específicos para la página de promociones
    const promoSteps: Step[] = [
      ...commonSteps,
      {
        target: ".promo-hero",
        content: "Descubre nuestras mejores ofertas y promociones destacadas.",
        disableBeacon: true,
        placement: "bottom",
      },
      {
        target: ".promo-tabs",
        content: "Navega entre diferentes categorías de promociones: destacadas, outlet, liquidación y más.",
        placement: "bottom",
      },
      {
        target: ".promo-grid",
        content: "Explora todos los productos en promoción. ¡No te pierdas estas ofertas!",
        placement: "top",
      },
      {
        target: ".flash-sale",
        content: "Ofertas por tiempo limitado. ¡Date prisa antes de que se acaben!",
        placement: "right",
      },
    ]

    // Seleccionar los pasos según la ruta actual
    if (pathname === "/") {
      setSteps(homeSteps)
    } else if (pathname.includes("/shop")) {
      setSteps(shopSteps)
    } else if (pathname === "/cart") {
      setSteps(cartSteps)
    } else if (pathname === "/checkout") {
      setSteps(checkoutSteps)
    } else if (pathname === "/account") {
      setSteps(accountSteps)
    } else if (pathname.includes("/promos")) {
      setSteps(promoSteps)
    } else {
      setSteps(commonSteps)
    }
  }, [pathname])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      setRun(false)
      if (onClose) onClose()
    }
  }

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#20509E",
          backgroundColor: "#ffffff",
          arrowColor: "#ffffff",
          textColor: "#333",
        },
        tooltip: {
          borderRadius: "8px",
          fontSize: "16px",
          padding: "16px",
          maxWidth: "350px",
        },
        buttonNext: {
          backgroundColor: "#20509E",
          borderRadius: "4px",
          color: "#fff",
          fontSize: "14px",
          padding: "8px 16px",
        },
        buttonBack: {
          color: "#20509E",
          marginRight: "10px",
          fontSize: "14px",
        },
        buttonSkip: {
          color: "#666",
          fontSize: "14px",
        },
        spotlight: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      }}
      locale={{
        back: "Anterior",
        close: "Cerrar",
        last: "Finalizar",
        next: "Siguiente",
        skip: "Saltar tour",
      }}
    />
  )
}
