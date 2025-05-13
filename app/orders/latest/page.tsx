"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Phone, AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Componente para el mapa
const OrderMap = () => {
  return (
    <div className="relative h-64 w-full overflow-hidden">
      <div className="absolute inset-0 bg-gray-200">
        <div className="w-full h-full relative">
          <Image src="/map-placeholder.png" alt="Mapa de seguimiento" fill className="object-cover" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-12 h-12">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                  fill="#FF0000"
                />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 z-10 text-xs">
            <a href="https://leafletjs.com" className="text-blue-500 hover:underline text-[10px]">
              Leaflet
            </a>{" "}
            |
            <a href="https://openstreetmap.org" className="text-blue-500 hover:underline text-[10px]">
              {" "}
              © OpenStreetMap
            </a>
          </div>
          <div className="absolute top-2 left-2 z-10">
            <div className="flex flex-col gap-1">
              <button className="bg-white rounded-md shadow w-8 h-8 flex items-center justify-center">
                <span className="text-xl">+</span>
              </button>
              <button className="bg-white rounded-md shadow w-8 h-8 flex items-center justify-center">
                <span className="text-xl">−</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para la barra de progreso
const OrderProgressBar = ({
  currentStep = "Recogido",
  isCancelled = false,
  className = "",
}: { currentStep?: string; isCancelled?: boolean; className?: string }) => {
  const statuses = ["Creado", "Asignado", "Recogido", "En camino", "Entregado"]
  const currentIndex = statuses.indexOf(currentStep)

  // Colores para estado normal y cancelado
  const progressColor = isCancelled ? "bg-red-500" : "bg-green-500"
  const textColor = isCancelled ? "text-red-500" : "text-green-500"
  const circleColor = isCancelled ? "bg-red-500" : "bg-green-500"
  const inactiveCircleColor = isCancelled ? "bg-red-300" : "bg-gray-200"
  const inactiveTextColor = isCancelled ? "text-red-400" : "text-gray-400"

  return (
    <div className={`w-full mb-6 ${className}`}>
      <div className="flex justify-between mb-2">
        {statuses.map((status, index) => (
          <div
            key={status}
            className={`flex flex-col items-center ${
              isCancelled
                ? index <= currentIndex
                  ? textColor
                  : inactiveTextColor
                : index <= currentIndex
                  ? textColor
                  : inactiveTextColor
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                ${
                  isCancelled
                    ? index <= currentIndex
                      ? circleColor
                      : inactiveCircleColor
                    : index <= currentIndex
                      ? circleColor
                      : inactiveCircleColor
                } text-white`}
            >
              {!isCancelled && index < currentIndex ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor" />
                </svg>
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </div>
            <span className="text-xs text-center">{status}</span>
          </div>
        ))}
      </div>

      <div className="relative w-full h-1 bg-gray-200 rounded-full">
        <div
          className={`absolute top-0 left-0 h-1 ${progressColor} rounded-full transition-all duration-500`}
          style={{
            width: isCancelled ? "100%" : `${((currentIndex + 0.5) / statuses.length) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  )
}

export default function LatestOrderPage() {
  const router = useRouter()
  const [showDetails, setShowDetails] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)
  const [currentStep, setCurrentStep] = useState("Recogido")
  const [loading, setLoading] = useState(false)

  // Estados para los diálogos
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)
  const [showCancelReasons, setShowCancelReasons] = useState(false)
  const [selectedReason, setSelectedReason] = useState("")

  // Productos del pedido para "Volver a pedir"
  const orderProducts = [
    {
      id: "prod-1",
      name: "Contenedor Ecológico 500ml",
      price: 12500,
      quantity: 1,
      image: "/open-eco-container.png",
    },
    {
      id: "prod-2",
      name: "Set de Vasos Biodegradables",
      price: 18000,
      quantity: 1,
      image: "/colorful-plastic-cups.png",
    },
  ]

  const handleCancelOrder = () => {
    // Mostrar el diálogo de razones de cancelación
    setShowCancelReasons(true)
  }

  const confirmCancelOrder = () => {
    // Cerrar el diálogo de confirmación
    setShowCancelDialog(false)

    // Cancelar el pedido
    setIsCancelled(true)

    // Mostrar el diálogo de confirmación de cancelación
    setShowCancelConfirmation(true)
  }

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason)
    setShowCancelReasons(false)
    setShowCancelDialog(true)
  }

  const handleOrderAgain = () => {
    // Simular la adición de productos al carrito
    console.log("Añadiendo productos al carrito:", orderProducts)

    // Aquí normalmente llamarías a una función del contexto del carrito
    // Por ejemplo: addToCart(orderProducts)

    // Redirigir al carrito
    router.push("/cart")
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-6xl">
      <div className="flex items-center mb-4">
        <Link href="/" className="text-gray-700 hover:text-gray-900 flex items-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
          >
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor" />
          </svg>
          Volver
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Estado de tu pedido</h1>
            <div className="flex items-center">
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <div className="relative w-6 h-6">
                  <Image src="/express-icon.png" alt="Express" width={24} height={24} className="object-contain" />
                </div>
                Express (2)
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
            <div className="bg-blue-50 p-5">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <Image src="/express-icon.png" alt="Express" width={32} height={32} className="object-contain" />
                </div>
                <div>
                  <h2 className="font-bold">Express</h2>
                  <p className="text-sm text-gray-600">2 productos</p>
                </div>
              </div>
            </div>

            <OrderProgressBar currentStep={currentStep} isCancelled={isCancelled} className="my-8 px-4" />

            <OrderMap />

            {/* Sección de domiciliario */}
            <div className="p-5 border-t">
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <div className="relative w-6 h-6 mr-2">
                    <Image src="/delivery-icon.png" alt="Delivery" width={24} height={24} className="object-contain" />
                  </div>
                  <p className="text-sm font-medium">Tu domiciliario</p>
                </div>

                <div className="flex items-center justify-between bg-white border rounded-md p-3">
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-full p-2 mr-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                          fill="#10B981"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Martha Liliana Gómez Rincón _FTD</p>
                      <p className="text-xs text-gray-500">573145389067</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href="https://wa.me/573145389067"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white p-2 rounded-full"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16.6 14.0001C16.4 13.9001 15.1 13.3001 14.9 13.2001C14.7 13.1001 14.5 13.1001 14.3 13.3001C14.1 13.5001 13.7 14.1001 13.5 14.3001C13.4 14.5001 13.2 14.5001 13 14.4001C12.3 14.1001 11.6 13.7001 11 13.2001C10.5 12.7001 10 12.1001 9.6 11.5001C9.5 11.3001 9.6 11.1001 9.7 11.0001C9.8 10.9001 9.9 10.7001 10.1 10.6001C10.2 10.5001 10.3 10.3001 10.3 10.2001C10.4 10.1001 10.4 9.9001 10.3 9.8001C10.2 9.7001 9.7 8.5001 9.5 8.0001C9.4 7.3001 9.2 7.3001 9 7.3001C8.9 7.3001 8.7 7.3001 8.5 7.3001C8.3 7.3001 8 7.5001 7.9 7.6001C7.3 8.2001 7 8.9001 7 9.7001C7.1 10.6001 7.4 11.5001 8 12.3001C9.1 13.9001 10.5 15.2001 12.2 16.0001C12.7 16.2001 13.1 16.4001 13.6 16.5001C14.1 16.7001 14.6 16.7001 15.2 16.6001C15.9 16.5001 16.5 16.0001 16.9 15.4001C17.1 15.0001 17.1 14.6001 17 14.2001C17 14.2001 16.8 14.1001 16.6 14.0001ZM19.1 4.9001C15.2 1.0001 8.9 1.0001 5 4.9001C1.8 8.1001 1.2 13.0001 3.4 16.9001L2 22.0001L7.3 20.6001C8.8 21.4001 10.4 21.8001 12 21.8001C17.5 21.8001 21.9 17.4001 21.9 11.9001C22 9.3001 20.9 6.8001 19.1 4.9001ZM16.4 18.9001C15.1 19.7001 13.6 20.2001 12 20.2001C10.5 20.2001 9.1 19.8001 7.8 19.1001L7.5 18.9001L4.4 19.7001L5.2 16.7001L5 16.4001C2.6 12.4001 3.8 7.4001 7.7 4.9001C11.6 2.4001 16.6 3.7001 19 7.5001C21.4 11.4001 20.3 16.5001 16.4 18.9001Z"
                          fill="white"
                        />
                      </svg>
                    </a>
                    <a href="tel:+573145389067" className="bg-blue-500 text-white p-2 rounded-full">
                      <Phone size={20} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div>
                  <p className="text-sm">
                    Estado:{" "}
                    <span className={isCancelled ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                      {isCancelled ? "Cancelado" : currentStep}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">Fecha Entrega: 12/5/25</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? "Ocultar detalles" : "Ver detalles"}
                    <ChevronDown
                      className={`h-4 w-4 ml-1 transform transition-transform ${showDetails ? "rotate-180" : ""}`}
                    />
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm font-medium">2 productos</p>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-blue-600 flex items-center text-sm"
                >
                  Ver detalles
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </div>

              {showDetails && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-2">Productos en tu pedido:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded bg-white overflow-hidden flex-shrink-0 border">
                        <Image src="/open-eco-container.png" alt="Producto 1" fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Contenedor Ecológico 500ml</p>
                        <div className="flex justify-between">
                          <p className="text-xs text-gray-500">Cantidad: 1</p>
                          <p className="text-sm font-medium">$12,500</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded bg-white overflow-hidden flex-shrink-0 border">
                        <Image src="/colorful-plastic-cups.png" alt="Producto 2" fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Set de Vasos Biodegradables</p>
                        <div className="flex justify-between">
                          <p className="text-xs text-gray-500">Cantidad: 1</p>
                          <p className="text-sm font-medium">$18,000</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96">
          <div className="flex justify-between mb-4">
            {!isCancelled && (
              <Button
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                onClick={handleCancelOrder}
              >
                Cancelar pedido
              </Button>
            )}
            <a
              href="https://wa.me/573192102438?text=Hola,%20necesito%20ayuda%20con%20mi%20pedido%20%2337096825"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                  fill="currentColor"
                />
              </svg>
              Necesito Ayuda
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold">Resumen de compra</h2>
              <span className="text-gray-600">#37096825</span>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 text-gray-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Fecha del pedido:</h3>
                  <p className="text-sm">12 may. 2025</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 text-gray-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Dirección de entrega</h3>
                  <p className="text-sm">
                    KR 35 A # 45 - 25 CABECERA DEL LLANO
                    <br />
                    BUCARAMANGA, BUCARAMANGA
                    <br />
                    SANTANDER COLOMBIA
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 text-gray-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Método de pago:</h3>
                  <p className="text-sm">Efectivo</p>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-md">
                <h3 className="font-medium mb-2">Tipo de envío</h3>
                <div className="flex items-center">
                  <div className="relative w-6 h-6 mr-2">
                    <Image src="/express-icon.png" alt="Express" width={24} height={24} className="object-contain" />
                  </div>
                  <p className="text-sm">Express (2 artículos)</p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center font-bold">
                  <span>TOTAL</span>
                  <div className="flex items-center">
                    <span>$12.050</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={isCancelled ? handleOrderAgain : () => router.push("/tienda")}
              >
                {isCancelled ? "Volver a pedir" : "Volver a tienda"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de razones de cancelación */}
      <Dialog open={showCancelReasons} onOpenChange={setShowCancelReasons}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Por qué deseas cancelar tu pedido?</DialogTitle>
            <DialogDescription>Selecciona el motivo de la cancelación para ayudarnos a mejorar.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {[
              "Ya no necesito el pedido",
              "Encontré una mejor opción",
              "Pedí por error",
              "Problemas con el tiempo de entrega",
              "Otro motivo",
            ].map((reason) => (
              <button
                key={reason}
                className="w-full text-left p-3 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => handleReasonSelect(reason)}
              >
                {reason}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para cancelar pedido */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar cancelación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-red-50 rounded-md border border-red-100 text-sm text-red-800">
            <p>Al cancelar tu pedido:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Se notificará al domiciliario y al establecimiento</li>
              <li>No se realizará el cobro si aún no has pagado</li>
              <li>Si ya pagaste, el reembolso puede tardar hasta 15 días hábiles</li>
            </ul>
          </div>
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Volver
            </Button>
            <Button variant="destructive" onClick={confirmCancelOrder}>
              Sí, cancelar pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de cancelación exitosa */}
      <Dialog open={showCancelConfirmation} onOpenChange={setShowCancelConfirmation}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="relative">
            <button
              onClick={() => setShowCancelConfirmation(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </button>
          </div>
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">¡Tu pedido ha sido cancelado!</h2>
            <p className="text-gray-600 mb-6">
              Lamentamos lo sucedido,
              <br />
              no se realizó ningún cobro.
            </p>
            <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={() => setShowCancelConfirmation(false)}>
              Aceptar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
