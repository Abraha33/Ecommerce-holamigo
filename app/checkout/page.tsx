"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils"
import { Plus, Store, BikeIcon, Calendar, Minus, X, Truck, AlertTriangle } from "lucide-react"
import { WhatsAppSupport } from "@/components/whatsapp-support"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DeliveryOptionsModal } from "@/components/delivery-options-modal"
import { AddressSelectionModal } from "@/components/address-selection-modal"
import { ScheduleDeliveryModal } from "@/components/schedule-delivery-modal"
import { getDeliveryTime, getDeliveryTitle } from "@/lib/delivery-service"
import { useDelivery } from "@/contexts/delivery-context"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import type { Address } from "@/lib/delivery-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, subtotal, isLoading, clearItems } = useCart()
  const { user } = useAuth()
  const {
    deliveryInfo,
    isDeliveryModalOpen,
    openDeliveryModal,
    closeDeliveryModal,
    isScheduleModalOpen,
    openScheduleModal,
    closeScheduleModal,
    updateSelectedAddress,
  } = useDelivery()

  const [selectedAddress, setSelectedAddress] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [receiveMethod, setReceiveMethod] = useState("personal")
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false)
  const [showClearCartDialog, setShowClearCartDialog] = useState(false)
  const [isAuthRequired, setIsAuthRequired] = useState(false)

  // Add this after state declarations
  const [addresses, setAddresses] = useState<Address[]>([
    { id: "1", name: "Home", address: "KR 35 A # 45 - 25 CABECERA DEL LLANO", city: "Bucaramanga", isDefault: true },
    { id: "2", name: "Office", address: "CL 56 # 23 - 15 APTO 502", city: "Bucaramanga", isDefault: false },
  ])

  // Modify the CheckoutPage component to properly sync with the delivery context

  // 1. Modify useEffect to sync with delivery context
  // Replace existing useEffect with this
  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      setIsAuthRequired(true)
    }

    // Load saved receive method
    const savedReceiveMethod = localStorage.getItem("receiveMethod")
    if (savedReceiveMethod) {
      setReceiveMethod(savedReceiveMethod)
    }

    // Sync with delivery context
    if (deliveryInfo) {
      // If there's a selected address in the context, use it
      if (deliveryInfo.selectedAddress) {
        setSelectedAddress(deliveryInfo.selectedAddress.address)
      } else if (addresses.length > 0) {
        // If no selected address but addresses available, use the first one
        setSelectedAddress(addresses[0].address)
        updateSelectedAddress(addresses[0])
      }

      // Update UI based on delivery info
      if (deliveryInfo.type === "programada" && deliveryInfo.schedule) {
        // If there's a schedule, update UI
        console.log("Scheduled delivery:", deliveryInfo.schedule)
      } else if (deliveryInfo.type === "tienda" && deliveryInfo.storeAddress) {
        // If there's a store address, update UI
        console.log("Store pickup:", deliveryInfo.storeAddress)
      }
    }
  }, [deliveryInfo, addresses, updateSelectedAddress, user])

  // 2. Modify getDeliveryIcon to be more robust
  const getDeliveryIcon = () => {
    if (!deliveryInfo) return <BikeIcon className="text-blue-600 mr-2" />

    switch (deliveryInfo.type) {
      case "sprint":
        return <BikeIcon className="text-blue-600 mr-2" />
      case "programada":
        return <Calendar className="text-blue-600 mr-2" />
      case "tienda":
        return <Store className="text-blue-600 mr-2" />
      default:
        return <BikeIcon className="text-blue-600 mr-2" />
    }
  }

  const handleQuantityChange = (itemId: string | undefined, newQuantity: number) => {
    if (!itemId || newQuantity < 1) return
    updateQuantity(itemId, newQuantity)
  }

  const handleRemoveItem = (itemId: string | undefined) => {
    if (!itemId) return
    removeItem(itemId)
  }

  const handleApplyCoupon = () => {
    // This function would be implemented in a real context to apply a coupon
    toast.success(`Coupon ${couponCode} applied`, {
      description: "Discount has been applied to your order",
    })
  }

  const handleGoToPayment = () => {
    // Check if user is logged in
    if (!user) {
      setIsAuthRequired(true)
      return
    }

    // Save receive method in localStorage or global state
    localStorage.setItem("receiveMethod", receiveMethod)
    router.push("/checkout/payment")
  }

  const handleClearCart = () => {
    setShowClearCartDialog(true)
  }

  const confirmClearCart = () => {
    // Clear cart
    clearItems()
    setShowClearCartDialog(false)
    toast.success("Cart cleared", {
      description: "All items have been removed from your cart",
    })
  }

  const handleLoginRedirect = () => {
    // Save current path for redirect after login
    localStorage.setItem("loginRedirect", "/checkout")
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  const discount = 2000
  const shipping = 3500
  const total = subtotal + shipping - discount

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Cart <span className="text-gray-500 text-lg">({items.length} items)</span>
            </h1>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleClearCart}
            >
              Clear cart
            </Button>
          </div>

          <div className="mb-6">
            <Select
              value={selectedAddress}
              onValueChange={(value) => {
                setSelectedAddress(value)
                // Find complete address and update context
                const addressObj = addresses.find((addr) => addr.address === value)
                if (addressObj) {
                  // Update selected address in context
                  updateSelectedAddress(addressObj)
                }
              }}
            >
              <SelectTrigger className="w-full bg-blue-500 text-white py-2 px-4 rounded">
                <SelectValue placeholder="Select an address" />
              </SelectTrigger>
              <SelectContent>
                {addresses.map((addr) => (
                  <SelectItem key={addr.id} value={addr.address}>
                    {addr.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="link" className="text-blue-500 mt-2 p-0 h-auto" onClick={() => setIsAddressFormOpen(true)}>
              Edit address
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  {getDeliveryIcon()}
                  <div>
                    <div className="font-medium">{getDeliveryTitle(deliveryInfo.type)}</div>
                    <div className="text-sm text-gray-500">Delivered by: Holamigo</div>
                    <div className="text-sm text-gray-500">{items.length} products</div>

                    {/* Show selected address for all delivery types */}
                    {deliveryInfo.selectedAddress && (
                      <div className="text-sm text-gray-600">{deliveryInfo.selectedAddress.address}</div>
                    )}

                    {/* Show date and time for scheduled delivery */}
                    {deliveryInfo.type === "programada" &&
                      deliveryInfo.schedule?.day &&
                      deliveryInfo.schedule?.timeSlot && (
                        <div className="text-sm font-medium text-blue-600">
                          {deliveryInfo.schedule.day}, {deliveryInfo.schedule.timeSlot}
                        </div>
                      )}

                    {/* Show store address for store pickup */}
                    {deliveryInfo.type === "tienda" && deliveryInfo.storeAddress && (
                      <div className="text-sm text-gray-600">
                        {deliveryInfo.storeAddress} (2.5 km from your location)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <div className="bg-white border border-blue-200 rounded-lg px-4 py-2 flex items-center">
                  {getDeliveryIcon()}
                  <div>
                    <div className="font-medium">{getDeliveryTime(deliveryInfo.type)}</div>
                    <div className="text-xs text-gray-500">
                      {deliveryInfo.type === "sprint"
                        ? "Sprint"
                        : deliveryInfo.type === "programada"
                          ? "Scheduled"
                          : "Pickup"}
                    </div>
                  </div>
                </div>

                {/* 3. Modify schedule button to correctly reflect state */}
                {/* Replace existing button with this */}
                <Button
                  variant="outline"
                  className="bg-white border-blue-200 text-blue-600 text-xs px-2 py-1 h-auto"
                  onClick={openDeliveryModal}
                >
                  Change method
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="border rounded-lg p-3 flex items-center">
                <div className="relative h-20 w-20 rounded overflow-hidden bg-muted flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>

                <div className="ml-4 flex-1 flex items-center">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
                    <p className="text-xs text-gray-400">SKU: {item.sku || "N/A"}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded-md">
                      <button
                        className="px-2 py-1 text-blue-600"
                        onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-2 py-1 border-x">{item.quantity}</span>
                      <button
                        className="px-2 py-1 text-blue-600"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="font-bold text-blue-600">{formatCurrency(item.price)}</div>
                    <button className="text-gray-400 hover:text-gray-600" onClick={() => handleRemoveItem(item.id)}>
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg overflow-hidden sticky top-24">
            <div className="bg-muted px-4 py-3 font-medium">
              <h2>Order Summary</h2>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <div className="font-medium">9 - 13 min</div>
                    <div className="text-xs text-gray-500">Sprint</div>
                  </div>
                </div>

                {/* 3. Modify schedule button to correctly reflect state */}
                {/* Replace existing button with this */}
                <Button
                  variant="outline"
                  className="text-blue-500 border-blue-200"
                  onClick={openScheduleModal}
                  disabled={
                    deliveryInfo.type === "programada" &&
                    !!deliveryInfo.schedule?.day &&
                    !!deliveryInfo.schedule?.timeSlot
                  }
                  title={
                    deliveryInfo.type === "programada" && deliveryInfo.schedule?.day && deliveryInfo.schedule?.timeSlot
                      ? `Scheduled for: ${deliveryInfo.schedule.day}, ${deliveryInfo.schedule.timeSlot}`
                      : "Schedule your order"
                  }
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-xs">
                    {deliveryInfo.type === "programada" && deliveryInfo.schedule?.day && deliveryInfo.schedule?.timeSlot
                      ? "Scheduled"
                      : "Schedule your order"}
                  </span>
                </Button>
              </div>

              <div className="bg-blue-100 rounded-lg p-3 mb-4 flex items-center">
                <div className="w-10 h-10 relative mr-2">
                  <Image src="/prime-number-concept.png" alt="Prime" fill className="object-contain" />
                </div>
                <div className="flex-1">
                  <div className="text-sm">As a prime member you would save:</div>
                  <div className="font-bold">{formatCurrency(7500)}</div>
                </div>
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs">I want to save</Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Product cost</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-green-500">
                  <span>Product savings</span>
                  <span>{formatCurrency(discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Cost</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mb-4 mt-4">
                <div className="flex items-center mb-2">
                  <Input
                    placeholder="Enter coupon"
                    className="rounded-r-none"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button className="rounded-l-none bg-blue-500 hover:bg-blue-600" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>
              </div>

              <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600" onClick={handleGoToPayment}>
                Proceed to payment
              </Button>
            </div>

            <WhatsAppSupport />
          </div>
        </div>
      </div>

      {/* Delivery schedule modal */}
      <ScheduleDeliveryModal isOpen={isScheduleModalOpen} onClose={closeScheduleModal} />

      {/* Address selection modal */}
      <AddressSelectionModal
        isOpen={isAddressFormOpen}
        onClose={() => setIsAddressFormOpen(false)}
        onAddressSelect={(addressId) => {
          setIsAddressFormOpen(false)
        }}
      />

      {/* Delivery options modal */}
      <DeliveryOptionsModal isOpen={isDeliveryModalOpen} onClose={closeDeliveryModal} />

      {/* Clear cart confirmation dialog */}
      <Dialog open={showClearCartDialog} onOpenChange={setShowClearCartDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm action
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to clear your cart? This will remove all products.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowClearCartDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmClearCart}>
              Yes, clear cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Authentication required dialog */}
      <Dialog open={isAuthRequired} onOpenChange={setIsAuthRequired}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to proceed with checkout. Please log in or create an account.
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
