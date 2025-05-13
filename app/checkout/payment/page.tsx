"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { createOrder, type ShippingAddress } from "@/lib/order-service"
import { PaymentQRModal } from "@/components/payment-qr-modal"
import { OrderConfirmationModal } from "@/components/order-confirmation-modal"
import { AddCardModal } from "@/components/add-card-modal"
import { Pencil } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const { items, subtotal, clearItems } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("contraentrega")
  const [paymentOption, setPaymentOption] = useState<"efectivo" | "datafono" | null>("efectivo")
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [selectedQRType, setSelectedQRType] = useState<"nequi" | "bancolombia" | null>(null)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [isShippingDetailsExpanded, setIsShippingDetailsExpanded] = useState(false)

  // Estado para las tarjetas guardadas (simulado)
  const [savedCards, setSavedCards] = useState<
    Array<{
      id: string
      type: "visa" | "mastercard" | "amex"
      lastFour: string
      expiryDate: string
      isDefault?: boolean
    }>
  >([
    {
      id: "card1",
      type: "visa",
      lastFour: "4242",
      expiryDate: "12/25",
      isDefault: true,
    },
    {
      id: "card2",
      type: "mastercard",
      lastFour: "8765",
      expiryDate: "09/26",
    },
  ])
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [electronicInvoice, setElectronicInvoice] = useState(false)
  const [comments, setComments] = useState("")

  // Recuperar información de entrega del localStorage
  const [deliveryType, setDeliveryType] = useState("sprint")
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

  // Cargar la dirección seleccionada del contexto de entrega
  useEffect(() => {
    // Intentar obtener la dirección de múltiples fuentes posibles
    const headerAddress = localStorage.getItem("deliveryAddress")
    const deliveryInfoAddress = localStorage.getItem("holamigo_delivery_address")
    const deliveryInfo = localStorage.getItem("deliveryInfo")

    let addressFound = false

    // Primero intentar con la dirección del header
    if (headerAddress) {
      const defaultAddress: ShippingAddress = {
        name: "Dirección de entrega",
        address: headerAddress,
        city: "Bucaramanga",
        state: "",
        postalCode: "",
        phone: "",
      }

      setSelectedAddress(defaultAddress)
      localStorage.setItem("selectedAddress", JSON.stringify(defaultAddress))
      addressFound = true
      console.log("Dirección cargada desde header:", defaultAddress)
    }

    // Luego intentar con la dirección del contexto de entrega
    if (!addressFound && deliveryInfo) {
      try {
        const parsedInfo = JSON.parse(deliveryInfo)
        if (parsedInfo.selectedAddress && parsedInfo.selectedAddress.address) {
          const addressFromDelivery: ShippingAddress = {
            name: parsedInfo.selectedAddress.name || "Dirección de entrega",
            address: parsedInfo.selectedAddress.address,
            city: parsedInfo.selectedAddress.city || "Bucaramanga",
            state: "",
            postalCode: "",
            phone: "",
          }
          setSelectedAddress(addressFromDelivery)
          localStorage.setItem("selectedAddress", JSON.stringify(addressFromDelivery))
          addressFound = true
          console.log("Dirección cargada desde deliveryInfo:", addressFromDelivery)
        }
      } catch (error) {
        console.error("Error parsing delivery info:", error)
      }
    }

    // Si no se encontró dirección, crear una dirección por defecto
    if (!addressFound) {
      const defaultAddress: ShippingAddress = {
        name: "Dirección de entrega",
        address: "Calle 31#15-09, Centro",
        city: "Bucaramanga",
        state: "",
        postalCode: "",
        phone: "",
      }
      setSelectedAddress(defaultAddress)
      localStorage.setItem("selectedAddress", JSON.stringify(defaultAddress))
      console.log("Dirección por defecto establecida:", defaultAddress)
    }
  }, [])

  useEffect(() => {
    // Cargar el método de entrega guardado
    const savedDeliveryType = localStorage.getItem("deliveryType") || "sprint"
    setDeliveryType(savedDeliveryType)

    // Cargar la dirección guardada - intentar múltiples fuentes
    const addressSources = ["selectedAddress", "shippingAddress", "lastUsedAddress"]

    let foundAddress = null
    for (const source of addressSources) {
      const savedAddress = localStorage.getItem(source)
      if (savedAddress) {
        try {
          foundAddress = JSON.parse(savedAddress)
          console.log(`Dirección cargada desde ${source}:`, foundAddress)
          setSelectedAddress(foundAddress)
          break
        } catch (error) {
          console.error(`Error al analizar dirección desde ${source}:`, error)
        }
      }
    }

    // Cargar la programación guardada si existe
    const savedDay = localStorage.getItem("selectedDay")
    const savedTimeSlot = localStorage.getItem("selectedTimeSlot")
    if (savedDay) setSelectedDay(savedDay)
    if (savedTimeSlot) setSelectedTimeSlot(savedTimeSlot)
  }, [])

  // Efecto para establecer la dirección desde el header si no hay dirección seleccionada
  useEffect(() => {
    if (!selectedAddress) {
      // Intentar obtener la dirección de múltiples fuentes
      const headerAddress = localStorage.getItem("deliveryAddress")
      const deliveryInfoAddress = localStorage.getItem("holamigo_delivery_address")

      // Usar la primera dirección disponible
      const address = headerAddress || deliveryInfoAddress || "Calle 31#15-09, Centro"

      // Crear un objeto de dirección con la dirección encontrada
      const defaultAddress = {
        name: "Dirección de entrega",
        address: address,
        city: "Bucaramanga",
        state: "",
        postalCode: "",
        phone: "",
      }

      // Establecer la dirección en el estado de forma segura
      setSelectedAddress(defaultAddress)
      console.log("Dirección establecida desde el header:", defaultAddress)
    }
  }, [selectedAddress]) // Solo se ejecuta cuando selectedAddress cambia o es null

  const shipping = deliveryType === "sprint" ? 7500 : deliveryType === "programada" ? 5000 : 0
  const discount = -25170 // Ejemplo de descuento
  const total = subtotal + shipping + discount

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method)
    if (method === "contraentrega") {
      setPaymentOption("efectivo")
    } else {
      setPaymentOption(null)
    }
  }

  const handlePaymentOptionChange = (option: "efectivo" | "datafono") => {
    setPaymentOption(option)
  }

  const handleCompletePurchase = async () => {
    // Obtener la dirección del header directamente
    const headerAddress = localStorage.getItem("deliveryAddress") || localStorage.getItem("holamigo_delivery_address")

    // Si no hay dirección seleccionada, crear una con la dirección del header
    if (!selectedAddress && headerAddress) {
      const defaultAddress: ShippingAddress = {
        name: "Dirección de entrega",
        address: headerAddress,
        city: "Bucaramanga",
        state: "",
        postalCode: "",
        phone: "",
      }

      // Procesar el pedido con esta dirección sin esperar a que se actualice el estado
      processOrder(defaultAddress)
      return
    } else if (!selectedAddress) {
      // Si no hay dirección disponible en ninguna parte, mostrar alerta
      alert("Por favor selecciona una dirección de envío")
      return
    }

    // Si hay dirección seleccionada, continuar con la compra
    processOrder(selectedAddress)
  }

  const processOrder = async (address: ShippingAddress) => {
    setIsProcessing(true)

    try {
      // Guardar la dirección seleccionada de forma permanente
      const addressToSave = JSON.stringify(address)
      localStorage.setItem("selectedAddress", addressToSave)
      localStorage.setItem("shippingAddress", addressToSave)
      localStorage.setItem("lastUsedAddress", addressToSave)
      console.log("Dirección guardada:", address)

      // Crear el pedido en Supabase
      const result = await createOrder(
        items,
        address,
        paymentMethod + (paymentOption ? ` (${paymentOption})` : ""),
        deliveryType,
        comments || (electronicInvoice ? "Requiere factura electrónica" : ""),
      )

      // Verificar si el resultado es nulo antes de intentar acceder a sus propiedades
      if (result) {
        // Guardar el ID y número del pedido
        const orderNumber = result.order_number || "37096825" // Valor por defecto para demo
        setOrderId(result.id || "order-123") // Valor por defecto para demo
        setOrderNumber(orderNumber)

        // Guardar información del pedido para la página de estado
        localStorage.setItem("currentOrderId", result.id || "order-123")
        localStorage.setItem("currentOrderNumber", orderNumber)
        localStorage.setItem("currentOrderStatus", "processing")
        localStorage.setItem("currentOrderDate", new Date().toISOString())

        // Limpiar el carrito
        await clearItems()

        // Mostrar el modal de confirmación
        setIsConfirmationModalOpen(true)
      } else {
        alert("Hubo un error al procesar tu pedido. Por favor intenta de nuevo.")
      }
    } catch (error) {
      console.error("Error al crear el pedido:", error)
      alert("Hubo un error al procesar tu pedido. Por favor intenta de nuevo.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOrderConfirmed = () => {
    setIsConfirmationModalOpen(false)
    // Redirigir a la página de estado del pedido
    router.push(`/orders/latest`)
  }

  const handleEditAddress = () => {
    router.push("/checkout")
  }

  const handleOpenQRModal = (type: "nequi" | "bancolombia") => {
    setSelectedQRType(type)
    setIsQRModalOpen(true)
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-6xl">
      <div className="flex items-center mb-6">
        <Link href="/checkout" className="text-blue-600 flex items-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
          >
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor" />
          </svg>
          Checkout
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* 1. Dirección de envío */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">1. Dirección de envío</h2>
            </div>
            {selectedAddress ? (
              <div className="bg-white p-4 rounded-md border">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{selectedAddress.name || "Dirección de entrega"}</p>
                    <p className="text-gray-600">
                      {selectedAddress.address || ""},{selectedAddress.city || "Bucaramanga"}
                      {selectedAddress.state ? `, ${selectedAddress.state}` : ""}
                      {selectedAddress.postalCode ? ` ${selectedAddress.postalCode}` : ""}
                    </p>
                    {selectedAddress.phone && (
                      <p className="text-gray-500 text-sm mt-1">Tel: {selectedAddress.phone}</p>
                    )}
                  </div>
                  <button onClick={handleEditAddress} className="text-blue-600 flex items-center hover:underline">
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar dirección
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-md border">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Dirección de entrega</p>
                    <p className="text-gray-600">
                      {localStorage.getItem("deliveryAddress") ||
                        localStorage.getItem("holamigo_delivery_address") ||
                        "Calle 31#15-09, Centro"}
                    </p>
                  </div>
                  <button onClick={handleEditAddress} className="text-blue-600 flex items-center hover:underline">
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar dirección
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Documentación */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold mb-4">2. Documentación</h2>
            <div className="bg-white p-4 rounded-md border">
              <p className="mb-2">¿Requiere factura electrónica?</p>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="factura"
                    className="mr-2 h-4 w-4"
                    checked={electronicInvoice}
                    onChange={() => setElectronicInvoice(true)}
                  />
                  <span>Sí</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="factura"
                    className="mr-2 h-4 w-4"
                    checked={!electronicInvoice}
                    onChange={() => setElectronicInvoice(false)}
                  />
                  <span>No</span>
                </label>
              </div>

              {electronicInvoice && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md flex items-center">
                  <svg
                    className="w-5 h-5 text-yellow-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div className="text-sm text-yellow-700">
                    <span>Su cuenta no está habilitada para facturación electrónica. </span>
                    <a href="/account/billing" className="text-blue-600 underline hover:text-blue-800">
                      Habilitar facturación electrónica
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Método de pago */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold mb-4">3. Método de pago</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-md border overflow-hidden">
                <div className="p-4">
                  <h3 className="font-medium mb-3">Selecciona el método de pago</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment-method"
                        className="mr-3 h-4 w-4"
                        checked={paymentMethod === "contraentrega"}
                        onChange={() => handlePaymentMethodChange("contraentrega")}
                      />
                      <div className="w-6 h-6 mr-2 flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M19 14V6C19 4.9 18.1 4 17 4H3C1.9 4 1 4.9 1 6V14C1 15.1 1.9 16 3 16H17C18.1 16 19 15.1 19 14ZM17 14H3V6H17V14ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7ZM23 7V18C23 19.1 22.1 20 21 20H4C4 19 4 19 4 18H21V7C22.1 7 22.1 7 23 7Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <span>Contraentrega</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment-method"
                        className="mr-3 h-4 w-4"
                        checked={paymentMethod === "tarjeta"}
                        onChange={() => handlePaymentMethodChange("tarjeta")}
                      />
                      <div className="w-6 h-6 mr-2 flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <span>Tarjeta débito/crédito (CVV)</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment-method"
                        className="mr-3 h-4 w-4"
                        checked={paymentMethod === "consignacion"}
                        onChange={() => handlePaymentMethodChange("consignacion")}
                      />
                      <div className="w-6 h-6 mr-2 flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M4 10V17H7V10H4ZM10 10V17H13V10H10ZM2 22H21V19H2V22ZM16 10V17H19V10H16ZM11.5 1L2 6V8H21V6L11.5 1Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <span>Consignación</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-md border overflow-hidden">
                <div className="p-4">
                  <h3 className="font-medium mb-3">Selecciona el método de pago:</h3>

                  {paymentMethod === "contraentrega" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className={`border rounded-md p-4 flex flex-col items-center cursor-pointer ${
                          paymentOption === "efectivo" ? "border-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => handlePaymentOptionChange("efectivo")}
                      >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.31 11.14C10.54 10.69 9.97 10.2 9.97 9.47C9.97 8.63 10.76 8.04 12.07 8.04C13.45 8.04 13.97 8.7 14.01 9.68H15.72C15.67 8.34 14.85 7.11 13.23 6.71V5H10.9V6.69C9.39 7.01 8.18 7.99 8.18 9.5C8.18 11.29 9.67 12.19 11.84 12.71C13.79 13.17 14.18 13.86 14.18 14.58C14.18 15.11 13.79 15.97 12.08 15.97C10.48 15.97 9.85 15.25 9.76 14.33H8.04C8.14 16.03 9.4 16.99 10.9 17.3V19H13.24V17.33C14.76 17.04 15.98 16.17 15.98 14.56C15.97 12.36 14.07 11.6 12.31 11.14Z"
                              fill="#4CAF50"
                            />
                          </svg>
                        </div>
                        <span className="text-center">Efectivo</span>
                      </div>

                      <div
                        className={`border rounded-md p-4 flex flex-col items-center cursor-pointer ${
                          paymentOption === "datafono" ? "border-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => handlePaymentOptionChange("datafono")}
                      >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z"
                              fill="#2196F3"
                            />
                          </svg>
                        </div>
                        <span className="text-center">Datafono</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "tarjeta" && (
                    <div className="space-y-3">
                      {savedCards.length > 0 ? (
                        <>
                          <p className="text-sm text-gray-600 mb-2">Selecciona una tarjeta guardada:</p>
                          {savedCards.map((card) => (
                            <div
                              key={card.id}
                              className={`border rounded-lg p-3 flex items-center cursor-pointer ${
                                selectedCardId === card.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-400"
                              }`}
                              onClick={() => setSelectedCardId(card.id)}
                            >
                              <div className="w-10 h-6 relative mr-3">
                                <Image src={`/${card.type}.png`} alt={card.type} fill className="object-contain" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">•••• •••• •••• {card.lastFour}</p>
                                <p className="text-xs text-gray-500">Vence: {card.expiryDate}</p>
                              </div>
                              {card.isDefault && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  Predeterminada
                                </span>
                              )}
                            </div>
                          ))}
                        </>
                      ) : (
                        <p className="text-sm text-gray-600 mb-2">No tienes tarjetas guardadas</p>
                      )}

                      <button
                        className="w-full py-2 px-3 border border-dashed border-blue-500 text-blue-500 rounded-md flex items-center justify-center hover:bg-blue-50"
                        onClick={() => setIsAddCardModalOpen(true)}
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Agregar nueva tarjeta
                      </button>
                    </div>
                  )}

                  {paymentMethod === "consignacion" && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 mb-2">Selecciona una cuenta para consignación:</p>

                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${
                            selectedQRType === "bancolombia"
                              ? "border-blue-500 bg-blue-50"
                              : "hover:border-blue-500 hover:bg-blue-50"
                          }`}
                          onClick={() => handleOpenQRModal("bancolombia")}
                        >
                          <div className="w-16 h-16 relative mb-2">
                            <Image src="/bancolombia-logo.png" alt="Bancolombia" fill className="object-contain" />
                          </div>
                          <p className="text-sm font-medium">Bancolombia</p>
                          <p className="text-xs text-gray-500">Ver datos de cuenta</p>
                          {selectedQRType === "bancolombia" && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div
                          className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${
                            selectedQRType === "nequi"
                              ? "border-blue-500 bg-blue-50"
                              : "hover:border-blue-500 hover:bg-blue-50"
                          }`}
                          onClick={() => handleOpenQRModal("nequi")}
                        >
                          <div className="w-16 h-16 relative mb-2">
                            <Image src="/nequi-logo.png" alt="Nequi" fill className="object-contain" />
                          </div>
                          <p className="text-sm font-medium">Nequi</p>
                          <p className="text-xs text-gray-500">Ver datos de cuenta</p>
                          {selectedQRType === "nequi" && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">Importante:</span> Después de realizar la consignación, ingresa
                          el número de confirmación en los comentarios del pedido.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Información de envío */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold mb-4">4. Información de envío</h2>
            <div className="bg-white p-4 rounded-md border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Envío 1 de 1</p>
                  <div className="flex items-center mt-2">
                    <div className="w-6 h-6 mr-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 8H17V4H7V8H4C2.9 8 2 8.9 2 10V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V10C22 8.9 21.1 8 20 8ZM9 6H15V8H9V6ZM20 20H4V10H7V12H17V10H20V20Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <span>Envío Sprint por moto (35 min. promedio) (3 artículos)</span>
                  </div>
                </div>
                <button
                  className="text-blue-600 flex items-center"
                  onClick={() => setIsShippingDetailsExpanded(!isShippingDetailsExpanded)}
                >
                  {isShippingDetailsExpanded ? "Ocultar detalles" : "Ver detalles"}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`ml-1 transition-transform ${isShippingDetailsExpanded ? "rotate-180" : ""}`}
                  >
                    <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" fill="currentColor" />
                  </svg>
                </button>
              </div>

              {isShippingDetailsExpanded && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Productos en este envío:</h4>
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-md mr-3 relative overflow-hidden">
                          {item.image && (
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg overflow-hidden sticky top-24">
            <div className="bg-gray-100 px-4 py-3 font-medium">
              <h2>Resumen del pedido</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm">9 - 13 min</p>
                    <p className="text-xs text-gray-500">Sprint</p>
                  </div>
                </div>
                <button className="text-blue-600 border border-blue-600 rounded-md px-3 py-1 text-sm flex items-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                  >
                    <path
                      d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z"
                      fill="currentColor"
                    />
                  </svg>
                  Programa tu pedido
                </button>
              </div>

              <div className="bg-blue-50 p-3 rounded-md mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded mr-3">
                    <Image src="/placeholder.svg" alt="Prime" width={32} height={32} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Siendo prime ahorrarías:</p>
                    <p className="font-bold">$7,500.00</p>
                  </div>
                </div>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md px-3 py-1 text-sm">
                  Quiero ahorrar
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Costo de productos</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-500">
                  <span>Ahorro en productos</span>
                  <span>${Math.abs(discount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Costo Domicilio</span>
                  <span>${shipping.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="comments" className="block text-sm mb-1">
                  Escríbenos tus comentarios
                </label>
                <textarea
                  id="comments"
                  className="w-full border rounded-md p-2 text-sm"
                  rows={3}
                  placeholder="Ej: Dejar con el celador del edificio, por favor."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              </div>

              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 mb-4"
                onClick={handleCompletePurchase}
                disabled={isProcessing}
              >
                {isProcessing ? "Procesando..." : "Completar compra"}
              </Button>

              <div className="text-sm text-gray-600">
                <h3 className="font-medium mb-2">Información pedido de productos Sprint</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>El tiempo promedio de los pedidos sprint del último mes es menor a 45 minutos.</li>
                  <li>
                    El envío se realizará por defecto en moto, por lo que es importante considerar los tamaños de los
                    productos.
                  </li>
                  <li>El costo del envío de su domicilio está detallado en el carrito de compras.</li>
                  <li>Para pagos en efectivo, por favor tenga el monto exacto disponible.</li>
                  <li>Para pagos con datafono, asegúrese de tener su tarjeta a mano.</li>
                  <li>Si tienes dudas, contáctanos al chat.</li>
                  <li>Recuerda que debes presentar fórmula médica para los productos con prescripción.</li>
                </ul>
                <p className="text-xs text-gray-500 text-center mt-4">© 2023 Todos los derechos reservados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de QR para pagos */}
      {selectedQRType && (
        <PaymentQRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} paymentMethod={selectedQRType} />
      )}

      {/* Modal de confirmación de pedido */}
      <OrderConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleOrderConfirmed}
        estimatedTime="17 - 25 min"
      />

      {/* Modal para agregar tarjeta */}
      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        onAddCard={(cardData) => {
          // Simulación de agregar una nueva tarjeta
          const newCard = {
            id: `card${savedCards.length + 1}`,
            type: cardData.cardType || "visa",
            lastFour: cardData.cardNumber.slice(-4),
            expiryDate: `${cardData.expiryMonth}/${cardData.expiryYear.slice(-2)}`,
          }
          setSavedCards([...savedCards, newCard])
          setSelectedCardId(newCard.id)
          setIsAddCardModalOpen(false)
        }}
      />
    </div>
  )
}
