"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronDown,
  Phone,
  AlertTriangle,
  X,
  Clock,
  MapPin,
  Package,
  Truck,
  CheckCircle,
  ShoppingBag,
  Clipboard,
  Home,
  ArrowLeft,
  RefreshCw,
  Calendar,
  MessageCircle,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCart } from "@/components/cart-provider"
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

// Simplificar el componente OrderMap para reducir animaciones
const OrderMap = () => {
  return (
    <div className="relative h-72 w-full overflow-hidden rounded-lg shadow-md">
      <div className="absolute inset-0 bg-gray-200">
        <div className="w-full h-full relative">
          <div
            className="w-full h-full absolute inset-0"
            style={{
              backgroundImage: `url(/map-placeholder.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Ruta simplificada */}
          <div className="absolute top-0 left-0 w-full h-full z-[5]">
            <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50,150 C100,50 200,250 350,150" stroke="#3B82F6" strokeWidth="4" strokeDasharray="8,8" />
            </svg>
          </div>

          {/* Marcador de tienda */}
          <div className="absolute top-[30%] left-[12%] z-10">
            <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg">
              <ShoppingBag size={16} />
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rotate-45"></div>
            <div className="absolute -top-10 -left-10 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs shadow-md whitespace-nowrap">
              Punto de recogida
            </div>
          </div>

          {/* Marcador de destino */}
          <div className="absolute bottom-[30%] right-[15%] z-10">
            <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
              <Home size={16} />
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rotate-45"></div>
            <div className="absolute -top-10 -left-10 bg-green-100 text-green-800 px-2 py-1 rounded text-xs shadow-md whitespace-nowrap">
              Tu ubicación
            </div>
          </div>

          {/* Marcador de ubicación actual */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="absolute w-8 h-8 bg-blue-500 rounded-full opacity-30" />
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
                  <span className="font-medium">Martha</span>
                </div>
                <div className="bg-white p-1 rounded-full shadow-lg">
                  <div className="bg-blue-500 rounded-full p-1.5">
                    <Truck className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tiempo estimado de llegada */}
          <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg shadow-lg z-20 flex items-center">
            <Clock size={16} className="text-blue-500 mr-2" />
            <span className="text-sm font-medium">Llegada: 15 min</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Iconos personalizados para cada estado del pedido
const statusIcons = {
  Creado: <ShoppingBag className="text-white" size={16} />,
  Armado: <Clipboard className="text-white" size={16} />,
  Enviado: <Package className="text-white" size={16} />,
  Entregado: <Truck className="text-white" size={16} />,
  Recibido: <CheckCircle className="text-white" size={16} />,
}

// Colores personalizados para cada estado
const statusColors = {
  Creado: {
    bg: "bg-gray-600",
    text: "text-gray-600",
    light: "bg-gray-100",
    border: "border-gray-200",
    inactive: "bg-gray-300",
    inactiveText: "text-gray-400",
  },
  Armado: {
    bg: "bg-blue-600",
    text: "text-blue-600",
    light: "bg-blue-100",
    border: "border-blue-200",
    inactive: "bg-gray-300",
    inactiveText: "text-gray-400",
  },
  Enviado: {
    bg: "bg-purple-600",
    text: "text-purple-600",
    light: "bg-purple-100",
    border: "border-purple-200",
    inactive: "bg-gray-300",
    inactiveText: "text-gray-400",
  },
  Entregado: {
    bg: "bg-orange-600",
    text: "text-orange-600",
    light: "bg-orange-100",
    border: "border-orange-200",
    inactive: "bg-gray-300",
    inactiveText: "text-gray-400",
  },
  Recibido: {
    bg: "bg-green-600",
    text: "text-green-600",
    light: "bg-green-100",
    border: "border-green-200",
    inactive: "bg-gray-300",
    inactiveText: "text-gray-400",
  },
}

// Modificar el OrderProgressBar para reducir las animaciones:
const OrderProgressBar = ({
  currentStep = "Recogido",
  isCancelled = false,
  className = "",
}: { currentStep?: string; isCancelled?: boolean; className?: string }) => {
  const statuses = ["Creado", "Armado", "Enviado", "Entregado", "Recibido"]
  const currentIndex = statuses.indexOf(currentStep)

  // Colores para estado normal y cancelado - Usando paleta azul
  const progressColor = isCancelled ? "bg-red-500" : "bg-blue-600"
  const textColor = isCancelled ? "text-red-500" : "text-blue-600"
  const circleColor = isCancelled ? "bg-red-500" : "bg-blue-600"
  const inactiveCircleColor = isCancelled ? "bg-red-300" : "bg-gray-200"
  const inactiveTextColor = isCancelled ? "text-red-400" : "text-gray-400"

  return (
    <div className={`w-full mb-6 ${className}`}>
      <div className="flex justify-between mb-2">
        {statuses.map((status, index) => {
          const isActive = index === currentIndex
          const isCompleted = index < currentIndex
          const isPending = index > currentIndex

          // Determinar qué colores usar basado en el estado actual
          const circleColorClass = isCancelled
            ? "bg-red-500"
            : isActive
              ? "bg-blue-600"
              : isCompleted
                ? "bg-blue-600"
                : "bg-gray-200"

          const textColorClass = isCancelled
            ? "text-red-500"
            : isActive
              ? "text-blue-600"
              : isCompleted
                ? "text-blue-600"
                : "text-gray-400"

          return (
            <div key={status} className={`flex flex-col items-center ${textColorClass}`}>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-1
                  ${circleColorClass} text-white relative overflow-hidden`}
              >
                {!isCancelled && isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                      fill="currentColor"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </svg>
                ) : (
                  <div>{statusIcons[status] || <span className="text-xs">{index + 1}</span>}</div>
                )}
              </div>
              <span className="text-xs text-center font-medium">{status}</span>

              {/* Fecha estimada para cada paso */}
              <span
                className={`text-[10px] mt-1 px-2 py-0.5 rounded-full ${
                  isActive ? "bg-blue-50" : isCompleted ? "bg-gray-100" : "text-gray-500"
                }`}
              >
                {isCompleted
                  ? "Completado"
                  : isActive
                    ? "En proceso"
                    : index === currentIndex + 1
                      ? "Próximo"
                      : "Pendiente"}
              </span>
            </div>
          )
        })}
      </div>

      <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mt-6 shadow-inner">
        {/* Línea de conexión entre círculos con efecto de gradiente */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center">
          {statuses.map(
            (status, index) =>
              index < statuses.length - 1 && (
                <div key={index} className="flex-1 flex items-center justify-center">
                  <div
                    className={`h-0.5 w-full ${
                      isCancelled
                        ? "bg-red-500"
                        : index < currentIndex
                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                          : "bg-gray-200"
                    }`}
                  />
                </div>
              ),
          )}
        </div>

        {/* Marcadores de puntos en la barra */}
        <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-[2%]">
          {statuses.map((status, index) => {
            const isActive = index <= currentIndex
            return (
              <div
                key={`dot-${index}`}
                className={`w-2 h-2 rounded-full z-10 ${
                  isCancelled
                    ? index === statuses.length - 1
                      ? "bg-red-600"
                      : "bg-red-400"
                    : isActive
                      ? "bg-blue-700"
                      : "bg-gray-300"
                }`}
              />
            )
          })}
        </div>

        {/* Barra de progreso principal con animación mejorada */}
        <motion.div
          className={`absolute top-0 left-0 h-full ${
            isCancelled ? "bg-gradient-to-r from-red-400 to-red-600" : "bg-gradient-to-r from-blue-400 to-blue-600"
          } rounded-full`}
          initial={{ width: "0%" }}
          animate={{
            width: isCancelled ? "100%" : `${((currentIndex + 0.5) / (statuses.length - 1)) * 100}%`,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            type: "spring",
            stiffness: 50,
          }}
        >
          {/* Efecto de brillo que se mueve a lo largo de la barra */}
          <div
            className="absolute top-0 h-full w-20 bg-white/20 blur-sm"
            style={{
              animation: !isCancelled ? "moveLight 2s infinite linear" : "none",
            }}
          />
        </motion.div>
      </div>

      {/* Añadir estilos de animación */}
      <style jsx>{`
        @keyframes moveLight {
          0% { left: -10%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  )
}

// Reemplazar el componente EstimatedDeliveryTime completo con esta versión mejorada sin animaciones:

const EstimatedDeliveryTime = ({ deliveryTime = "15:30", deliveryDate = "Hoy" }) => {
  return (
    <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 mb-4 relative overflow-hidden">
      <div className="flex flex-col items-center relative z-10">
        <h3 className="font-semibold text-blue-800 text-center mb-4 text-lg">Estamos preparando tu orden</h3>

        {/* Diseño estático mejorado sin animaciones */}
        <div className="flex items-center justify-center gap-6 mb-5 w-full">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-md border border-blue-200 flex items-center justify-center mb-2">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs text-blue-700">Empacando</span>
          </div>

          <div className="w-16 h-0.5 bg-blue-200"></div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center mb-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <circle cx="12" cy="7" r="4" fill="currentColor" />
                <path
                  d="M18 14H6C4.89543 14 4 14.8954 4 16V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V16C20 14.8954 19.1046 14 18 14Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-xs text-blue-700">Preparando</span>
          </div>

          <div className="w-16 h-0.5 bg-blue-200"></div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-md border border-blue-200 flex items-center justify-center mb-2">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs text-blue-700">En camino</span>
          </div>
        </div>

        <div className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-full">
          <span className="text-sm font-medium">En proceso</span>
        </div>

        <div className="flex items-center mt-4 text-sm text-blue-700 justify-center">
          <Calendar size={14} className="mr-2" />
          <span>Fecha de entrega: 12 may. 2025</span>
        </div>
      </div>
    </div>
  )
}

// Componente para mostrar información del repartidor
const DeliveryPersonInfo = ({ name = "Martha Liliana", phone = "573145389067" }) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
      <div className="flex items-center">
        <div className="relative">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-lg font-bold mr-3">
            {name.charAt(0)}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-gray-600 rounded-full w-4 h-4 border-2 border-white"></div>
        </div>
        <div>
          <div className="flex items-center">
            <p className="text-sm font-medium">{name}</p>
            <div className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">Repartidor</div>
          </div>
          <div className="flex items-center text-xs text-gray-500 mt-0.5">
            <Star size={12} className="text-gray-600 mr-1" />
            <span className="font-medium text-gray-700">4.9</span>
            <span className="mx-1">•</span>
            <span>573 entregas</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <a
          href={`https://wa.me/${phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <MessageCircle size={20} />
        </a>
        <a
          href={`tel:+${phone}`}
          className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500 transition-colors"
        >
          <Phone size={20} />
        </a>
      </div>
    </div>
  )
}

// Definir la interfaz para los productos del pedido
interface OrderProduct {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
  sku?: string
}

export default function LatestOrderPage() {
  const router = useRouter()
  const [showDetails, setShowDetails] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)
  const [currentStep, setCurrentStep] = useState("Armado")
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Obtener funciones del carrito
  const { addItem, clearItems } = useCart()

  // Estados para los diálogos
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)
  const [showCancelReasons, setShowCancelReasons] = useState(false)
  const [selectedReason, setSelectedReason] = useState("")

  // Productos del pedido para "Volver a pedir"
  const orderProducts: OrderProduct[] = [
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

  useEffect(() => {
    setIsMounted(true)

    // Simulación de progreso del pedido para demostración
    const demoTimer = setTimeout(() => {
      if (!isCancelled) {
        setCurrentStep("Enviado")
        toast({
          title: "¡Tu pedido está en camino!",
          description: "El domiciliario se dirige a tu ubicación",
          variant: "default",
        })
      }
    }, 10000)

    return () => clearTimeout(demoTimer)
  }, [isCancelled])

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

  const handleOrderAgain = async () => {
    if (!isMounted) return

    try {
      setLoading(true)

      // Limpiar el carrito actual
      await clearItems()

      // Añadir cada producto del pedido al carrito
      for (const product of orderProducts) {
        await addItem({
          id: product.id,
          product_id: product.id, // Usar el id como product_id
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          image: product.image,
          variant: product.variant,
        })
      }

      // Mostrar mensaje de éxito
      toast({
        title: "Productos añadidos al carrito",
        description: "Los productos de tu pedido anterior han sido añadidos al carrito",
        variant: "default",
      })

      // Ya no redirigimos al carrito, nos quedamos en la misma página
    } catch (error) {
      console.error("Error al volver a pedir:", error)
      toast({
        title: "Error",
        description: "No se pudieron añadir los productos al carrito",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBackToShop = () => {
    // Redirigir a la página de tienda
    router.push("/shop")
  }

  // Remover la verificación de autenticación y mostrar el contenido directamente
  // Comentar o eliminar estas líneas:
  // if (!isMounted) {
  //   return <div className="container mx-auto py-8 px-4 md:px-6 max-w-6xl">Cargando...</div>
  // }

  // Asegurar que el componente se renderice sin verificación de autenticación

  // Asegurar que el componente siempre se monte
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información del pedido...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Link href="/orders" className="text-gray-700 hover:text-gray-900 flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" />
          <span>Volver a mis pedidos</span>
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

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="bg-gray-50 p-5 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  <Package size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">Pedido Express #37096825</h2>
                  <p className="text-sm text-gray-600">2 productos • Entrega hoy</p>
                </div>
              </div>
            </div>

            {/* Tiempo estimado de entrega */}
            {!isCancelled && <EstimatedDeliveryTime deliveryTime="15:30" />}

            {/* Información del repartidor */}
            {!isCancelled && currentStep !== "Creado" && currentStep !== "Armado" && <DeliveryPersonInfo />}

            {/* Barra de progreso */}
            <OrderProgressBar currentStep={currentStep} isCancelled={isCancelled} className="my-8 px-4" />

            {/* Mapa de seguimiento */}
            <OrderMap />

            {/* Sección de detalles del pedido */}
            <div className="p-5 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">
                    Estado:{" "}
                    <span className={isCancelled ? "text-red-600 font-medium" : `text-gray-800 font-medium`}>
                      {isCancelled ? "Cancelado" : currentStep}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">Fecha Entrega: 12/5/25</p>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm font-medium">2 productos</p>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-blue-600 flex items-center text-sm hover:underline focus:outline-none"
                >
                  {showDetails ? "Ocultar detalles" : "Ver detalles"}
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showDetails ? "rotate-180" : ""}`} />
                </button>
              </div>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    className="mt-4 pt-4 border-t"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-medium mb-2">Productos en tu pedido:</h3>
                    <div className="space-y-3">
                      {orderProducts.map((product, index) => (
                        <motion.div
                          key={product.id}
                          className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ backgroundColor: "#f9fafb", y: -2 }}
                        >
                          <motion.div
                            className="relative h-16 w-16 rounded-lg bg-white overflow-hidden flex-shrink-0 border"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </motion.div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{product.name}</p>
                            <div className="flex justify-between mt-1">
                              <div className="flex items-center">
                                <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                                  Cantidad: {product.quantity}
                                </span>
                                {product.variant && (
                                  <span className="text-xs ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded-full">
                                    {product.variant}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-medium">${product.price.toLocaleString()}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Resumen de costos */}
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span>$30.500</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Envío</span>
                        <span>$0</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Descuento</span>
                        <span>-$440</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Total</span>
                        <span>$30.060</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96">
          <div className="flex justify-between mb-4">
            <div className="flex gap-2">
              {!isCancelled && (
                <div>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={handleCancelOrder}
                  >
                    Cancelar pedido
                  </Button>
                </div>
              )}
            </div>
            <div>
              <a
                href="https://wa.me/573192102438?text=Hola,%20necesito%20ayuda%20con%20mi%20pedido%20%2337096825"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 h-10 px-4 py-2"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Necesito Ayuda
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold">Resumen de compra</h2>
              <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">#37096825</div>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Calendar size={16} />
                </div>
                <div>
                  <h3 className="font-medium">Fecha del pedido:</h3>
                  <p className="text-sm">12 may. 2025</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <MapPin size={16} />
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
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Método de pago:</h3>
                  <div className="flex items-center mt-1">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs font-bold text-yellow-800">$</span>
                    </div>
                    <p className="text-sm">Efectivo</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                <h3 className="font-medium mb-2 text-blue-800">Tipo de envío</h3>
                <div className="flex items-center">
                  <div className="relative w-8 h-8 mr-2 bg-blue-600 rounded-full flex items-center justify-center">
                    <Truck size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Express</p>
                    <p className="text-xs text-blue-600">Entrega en 30-45 minutos</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Subtotal</span>
                  <span>$26.000</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>IVA (19%)</span>
                  <span>$4.940</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Envío</span>
                  <span>$0</span>
                </div>
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span>Descuento</span>
                  <span>-$440</span>
                </div>
                <div className="flex justify-between items-center font-bold pt-1 border-t mt-1">
                  <span>TOTAL</span>
                  <span>$30.500</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 mb-2"
                onClick={isCancelled ? handleOrderAgain : handleBackToShop}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Procesando...
                  </span>
                ) : isCancelled ? (
                  <span className="flex items-center">
                    <RefreshCw size={16} className="mr-2" />
                    Volver a pedir
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ShoppingBag size={16} className="mr-2" />
                    Volver a tienda
                  </span>
                )}
              </Button>

              {/* Botón adicional para volver a la tienda cuando se cancela el pedido */}
              {isCancelled && (
                <Button
                  variant="outline"
                  className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={handleBackToShop}
                >
                  <span className="flex items-center">
                    <ShoppingBag size={16} className="mr-2" />
                    Ir a la tienda
                  </span>
                </Button>
              )}
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
              <motion.button
                key={reason}
                className="w-full text-left p-3 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => handleReasonSelect(reason)}
                whileHover={{ backgroundColor: "#f3f4f6", x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                {reason}
              </motion.button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para cancelar pedido */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </motion.div>
              Confirmar cancelación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <motion.div
            className="p-4 bg-red-50 rounded-md border border-red-100 text-sm text-red-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p>Al cancelar tu pedido:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                Se notificará al domiciliario y al establecimiento
              </motion.li>
              <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                No se realizará el cobro si aún no has pagado
              </motion.li>
              <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                Si ya pagaste, el reembolso puede tardar hasta 15 días hábiles
              </motion.li>
            </ul>
          </motion.div>
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Volver
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="destructive" onClick={confirmCancelOrder}>
                Sí, cancelar pedido
              </Button>
            </motion.div>
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
          <motion.div
            className="p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
            >
              <X className="h-8 w-8 text-red-500" />
            </motion.div>
            <motion.h2
              className="text-xl font-bold mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              ¡Tu pedido ha sido cancelado!
            </motion.h2>
            <motion.p
              className="text-gray-600 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Lamentamos lo sucedido,
              <br />
              no se realizó ningún cobro.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={() => setShowCancelConfirmation(false)}>
                Aceptar
              </Button>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
