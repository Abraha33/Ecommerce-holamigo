"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { createOrder, type ShippingAddress } from "@/lib/order-service"
import { PaymentQRModal } from "@/components/payment-qr-modal"
import { OrderConfirmationModal } from "@/components/order-confirmation-modal"
import { AddCardModal } from "@/components/add-card-modal"
import { Pencil } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Verificar si estamos en el cliente
const isClient = typeof window !== "undefined"

export default function PaymentPage() {
  const router = useRouter()
  const { items, subtotal, clearItems } = useCart()
  const { user } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState("contraentrega")
  const [paymentOption, setPaymentOption] = useState<"efectivo" | "datafono" | null>("efectivo")
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [selectedQRType, setSelectedQRType] = useState<"nequi" | "bancolombia" | null>(null)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [isShippingDetailsExpanded, setIsShippingDetailsExpanded] = useState(false)
  const [isAuthRequired, setIsAuthRequired] = useState(false)

  // State for saved cards (simulated)
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

  // Retrieve delivery info from localStorage
  const [deliveryType, setDeliveryType] = useState("sprint")
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      setIsAuthRequired(true)
    }
  }, [user])

  // Load selected address from context
  useEffect(() => {
    if (!isClient) return

    // Try to get address from multiple possible sources
    const headerAddress = localStorage.getItem("deliveryAddress")
    const deliveryInfoAddress = localStorage.getItem("holamigo_delivery_address")
    const deliveryInfo = localStorage.getItem("deliveryInfo")

    let addressFound = false

    // First try with header address
    if (headerAddress) {
      const defaultAddress: ShippingAddress = {
        fullName: "Delivery Address",
        address: headerAddress,
        city: "Bucaramanga",
        state: "",
        postalCode: "",
        country: "Colombia",
        phone: "",
      }

      setSelectedAddress(defaultAddress)
      localStorage.setItem("selectedAddress", JSON.stringify(defaultAddress))
      addressFound = true
      console.log("Address loaded from header:", defaultAddress)
    }

    // Then try with delivery context address
    if (!addressFound && deliveryInfo) {
      try {
        const parsedInfo = JSON.parse(deliveryInfo)
        if (parsedInfo.selectedAddress && parsedInfo.selectedAddress.address) {
          const addressFromDelivery: ShippingAddress = {
            fullName: parsedInfo.selectedAddress.name || "Delivery Address",
            address: parsedInfo.selectedAddress.address,
            city: parsedInfo.selectedAddress.city || "Bucaramanga",
            state: "",
            postalCode: "",
            country: "Colombia",
            phone: "",
          }
          setSelectedAddress(addressFromDelivery)
          localStorage.setItem("selectedAddress", JSON.stringify(addressFromDelivery))
          addressFound = true
          console.log("Address loaded from deliveryInfo:", addressFromDelivery)
        }
      } catch (error) {
        console.error("Error parsing delivery info:", error)
      }
    }

    // If no address found, create a default address
    if (!addressFound) {
      const defaultAddress: ShippingAddress = {
        fullName: "Delivery Address",
        address: "Calle 31#15-09, Centro",
        city: "Bucaramanga",
        state: "",
        postalCode: "",
        country: "Colombia",
        phone: "",
      }
      setSelectedAddress(defaultAddress)
      localStorage.setItem("selectedAddress", JSON.stringify(defaultAddress))
      console.log("Default address set:", defaultAddress)
    }
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Load saved delivery method
    const savedDeliveryType = localStorage.getItem("deliveryType") || "sprint"
    setDeliveryType(savedDeliveryType)

    // Load saved address - try multiple sources
    const addressSources = ["selectedAddress", "shippingAddress", "lastUsedAddress"]

    let foundAddress = null
    for (const source of addressSources) {
      const savedAddress = localStorage.getItem(source)
      if (savedAddress) {
        try {
          foundAddress = JSON.parse(savedAddress)
          console.log(`Address loaded from ${source}:`, foundAddress)
          setSelectedAddress(foundAddress)
          break
        } catch (error) {
          console.error(`Error parsing address from ${source}:`, error)
        }
      }
    }

    // Load saved schedule if it exists
    const savedDay = localStorage.getItem("selectedDay")
    const savedTimeSlot = localStorage.getItem("selectedTimeSlot")
    if (savedDay) setSelectedDay(savedDay)
    if (savedTimeSlot) setSelectedTimeSlot(savedTimeSlot)
  }, [])

  // Effect to set address from header if no address selected
  useEffect(() => {
    if (!isClient || selectedAddress) return

    // Try to get address from multiple sources
    const headerAddress = localStorage.getItem("deliveryAddress")
    const deliveryInfoAddress = localStorage.getItem("holamigo_delivery_address")

    // Use first available address
    const address = headerAddress || deliveryInfoAddress || "Calle 31#15-09, Centro"

    // Create address object with found address
    const defaultAddress = {
      fullName: "Delivery Address",
      address: address,
      city: "Bucaramanga",
      state: "",
      postalCode: "",
      country: "Colombia",
      phone: "",
    }

    // Set address in state safely
    setSelectedAddress(defaultAddress)
    console.log("Address set from header:", defaultAddress)
  }, [selectedAddress]) // Only runs when selectedAddress changes or is null

  const shipping = deliveryType === "sprint" ? 7500 : deliveryType === "programada" ? 5000 : 0
  const discount = -2500 // Example discount
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
    if (!isClient) return

    // Check if user is logged in
    if (!user) {
      setIsAuthRequired(true)
      return
    }

    // Get address from header directly
    const headerAddress = localStorage.getItem("deliveryAddress") || localStorage.getItem("holamigo_delivery_address")

    // If no selected address, create one with header address
    if (!selectedAddress && headerAddress) {
      const defaultAddress: ShippingAddress = {
        fullName: "Delivery Address",
        address: headerAddress,
        city: "Bucaramanga",
        state: "",
        postalCode: "",
        country: "Colombia",
        phone: "",
      }

      // Process order with this address without waiting for state update
      processOrder(defaultAddress)
      return
    } else if (!selectedAddress) {
      // If no address available anywhere, show alert
      toast.error("Please select a delivery address")
      return
    }

    // If address selected, continue with purchase
    processOrder(selectedAddress)
  }

  const processOrder = async (address: ShippingAddress) => {
    if (!isClient) return

    setIsProcessing(true)

    try {
      // Save selected address permanently
      const addressToSave = JSON.stringify(address)
      localStorage.setItem("selectedAddress", addressToSave)
      localStorage.setItem("shippingAddress", addressToSave)
      localStorage.setItem("lastUsedAddress", addressToSave)
      console.log("Address saved:", address)

      // Validate cart items before creating order
      const validItems = items.map((item) => {
        // If no product_id, generate a temporary one
        if (!item.product_id) {
          console.log("Item without product_id:", item.name)
          return {
            ...item,
            product_id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          }
        }
        return item
      })

      // Create order in Supabase
      const result = await createOrder(
        validItems,
        address,
        paymentMethod + (paymentOption ? ` (${paymentOption})` : ""),
        deliveryType,
        comments || (electronicInvoice ? "Electronic invoice required" : ""),
      )

      // Check if result is null before trying to access its properties
      if (result) {
        // Save order ID and number
        const orderNumber = result.order_number || "37096825" // Default value for demo
        setOrderId(result.id || "order-123") // Default value for demo
        setOrderNumber(orderNumber)

        // Save order information for status page
        localStorage.setItem("currentOrderId", result.id || "order-123")
        localStorage.setItem("currentOrderNumber", orderNumber)
        localStorage.setItem("currentOrderStatus", "processing")
        localStorage.setItem("currentOrderDate", new Date().toISOString())

        // Clear cart
        await clearItems()

        // Show confirmation modal
        setIsConfirmationModalOpen(true)
      } else {
        toast.error("There was an error processing your order. Please try again.")
      }
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error("There was an error processing your order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOrderConfirmed = () => {
    setIsConfirmationModalOpen(false)
    // Redirect to order status page
    router.push(`/orders/latest`)
  }

  const handleEditAddress = () => {
    router.push("/checkout")
  }

  const handleOpenQRModal = (type: "nequi" | "bancolombia") => {
    setSelectedQRType(type)
    setIsQRModalOpen(true)
  }

  const handleLoginRedirect = () => {
    if (!isClient) return

    // Save current path for redirect after login
    localStorage.setItem("loginRedirect", "/checkout/payment")
    router.push("/login")
  }

  // Renderizado condicional para el servidor
  if (!isClient) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <div className="flex items-center justify-center h-96">
          <p>Cargando información de pago...</p>
        </div>
      </div>
    )
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
          {/* 1. Shipping address */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">1. Shipping Address</h2>
            </div>
            {selectedAddress ? (
              <div className="bg-white p-4 rounded-md border">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{selectedAddress.fullName || "Delivery Address"}</p>
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
                    Edit address
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-md border">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Delivery Address</p>
                    <p className="text-gray-600">
                      {isClient &&
                        (localStorage.getItem("deliveryAddress") ||
                          localStorage.getItem("holamigo_delivery_address") ||
                          "Calle 31#15-09, Centro")}
                    </p>
                  </div>
                  <button onClick={handleEditAddress} className="text-blue-600 flex items-center hover:underline">
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit address
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Documentation */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold mb-4">2. Documentation</h2>
            <div className="bg-white p-4 rounded-md border">
              <p className="mb-2">Do you require an electronic invoice?</p>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="factura"
                    className="mr-2 h-4 w-4"
                    checked={electronicInvoice}
                    onChange={() => setElectronicInvoice(true)}
                  />
                  <span>Yes</span>
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
                    <span>Your account is not enabled for electronic invoicing. </span>
                    <a href="/account/billing" className="text-blue-600 underline hover:text-blue-800">
                      Enable electronic invoicing
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Payment method */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold mb-4">3. Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-md border overflow-hidden">
                <div className="p-4">
                  <h3 className="font-medium mb-3">Select payment method</h3>
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
                      <span>Cash on delivery</span>
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
                      <span>Debit/credit card (CVV)</span>
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
                      <span>Bank transfer</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-md border overflow-hidden">
                <div className="p-4">
                  <h3 className="font-medium mb-3">Select payment method:</h3>

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
                        <span className="text-center">Cash</span>
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
                        <span className="text-center">Card terminal</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "tarjeta" && (
                    <div className="space-y-3">
                      {savedCards.length > 0 ? (
                        <>
                          <p className="text-sm text-gray-600 mb-2">Select a saved card:</p>
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
                                <p className="text-xs text-gray-500">Expires: {card.expiryDate}</p>
                              </div>
                              {card.isDefault && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>
                              )}
                            </div>
                          ))}
                        </>
                      ) : (
                        <p className="text-sm text-gray-600 mb-2">You don't have any saved cards</p>
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
                        Add new card
                      </button>
                    </div>
                  )}

                  {paymentMethod === "consignacion" && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 mb-2">Select an account for bank transfer:</p>

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
                          <p className="text-xs text-gray-500">View account details</p>
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
                          <p className="text-xs text-gray-500">View account details</p>
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
                          <span className="font-medium">Important:</span> After making the bank transfer, enter the
                          confirmation number in the order comments.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Shipping information */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold mb-4">4. Shipping Information</h2>
            <div className="bg-white p-4 rounded-md border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Shipment 1 of 1</p>
                  <div className="flex items-center mt-2">
                    <div className="w-6 h-6 mr-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 8H17V4H7V8H4C2.9 8 2 8.9 2 10V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V10C22 8.9 21.1 8 20 8ZM9 6H15V8H9V6ZM20 20H4V10H7V12H17V10H20V20Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <span>Sprint delivery by motorcycle (35 min. average) ({items.length} items)</span>
                  </div>
                </div>
                <button
                  className="text-blue-600 flex items-center"
                  onClick={() => setIsShippingDetailsExpanded(!isShippingDetailsExpanded)}
                >
                  {isShippingDetailsExpanded ? "Hide details" : "View details"}
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
                  <h4 className="font-medium mb-2">Products in this shipment:</h4>
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
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
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
              <h2>Order Summary</h2>
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
                  Schedule your order
                </button>
              </div>

              <div className="bg-blue-50 p-3 rounded-md mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded mr-3">
                    <Image src="/placeholder.svg" alt="Prime" width={32} height={32} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">As a prime member you would save:</p>
                    <p className="font-bold">$7,500.00</p>
                  </div>
                </div>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md px-3 py-1 text-sm">
                  I want to save
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Product cost</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-500">
                  <span>Product savings</span>
                  <span>${Math.abs(discount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Cost</span>
                  <span>${shipping.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="comments" className="block text-sm mb-1">
                  Write your comments
                </label>
                <textarea
                  id="comments"
                  className="w-full border rounded-md p-2 text-sm"
                  rows={3}
                  placeholder="E.g.: Leave with the building doorman, please."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              </div>

              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 mb-4"
                onClick={handleCompletePurchase}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Complete purchase"}
              </Button>

              <div className="text-sm text-gray-600">
                <h3 className="font-medium mb-2">Sprint product order information</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>The average time for sprint orders in the last month is less than 45 minutes.</li>
                  <li>
                    Delivery will be by motorcycle by default, so it's important to consider the size of the products.
                  </li>
                  <li>The cost of your delivery is detailed in the shopping cart.</li>
                  <li>For cash payments, please have the exact amount available.</li>
                  <li>For card terminal payments, make sure you have your card on hand.</li>
                  <li>If you have questions, contact us via chat.</li>
                  <li>Remember that you must present a medical prescription for prescription products.</li>
                </ul>
                <p className="text-xs text-gray-500 text-center mt-4">© 2023 All rights reserved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR payment modal */}
      {selectedQRType && (
        <PaymentQRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} paymentMethod={selectedQRType} />
      )}

      {/* Order confirmation modal */}
      <OrderConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleOrderConfirmed}
        estimatedTime="17 - 25 min"
      />

      {/* Add card modal */}
      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        onAddCard={(cardData) => {
          // Verificar que cardData tenga todas las propiedades necesarias
          if (!cardData) {
            toast.error("Error al procesar los datos de la tarjeta")
            return
          }

          // Crear un objeto de tarjeta con valores predeterminados seguros
          const newCard = {
            id: `card${savedCards.length + 1}`,
            type: (cardData.cardType || cardData.brand || "visa") as "visa" | "mastercard" | "amex",
            lastFour: cardData.last4 || "0000",
            expiryDate:
              cardData.expMonth && cardData.expYear
                ? `${cardData.expMonth}/${cardData.expYear.toString().slice(-2)}`
                : "00/00",
          }

          setSavedCards([...savedCards, newCard])
          setSelectedCardId(newCard.id)
          setIsAddCardModalOpen(false)
          toast.success("Tarjeta añadida correctamente")
        }}
      />

      {/* Authentication required dialog */}
      <Dialog open={isAuthRequired} onOpenChange={setIsAuthRequired}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to complete your purchase. Please log in or create an account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsAuthRequired(false)}>
              Continue as guest
            </Button>
            <Button onClick={handleLoginRedirect}>Log in</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
