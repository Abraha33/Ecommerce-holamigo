"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function PaymentPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [guestInfo, setGuestInfo] = useState<any>(null)

  useEffect(() => {
    const savedGuestInfo = localStorage.getItem("guestCheckoutInfo")
    if (savedGuestInfo) {
      setGuestInfo(JSON.parse(savedGuestInfo))
    }
  }, [])

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Delivery Information</h3>
        {user ? (
          <div>
            <p className="text-sm">
              <strong>Name:</strong> {user.user_metadata?.full_name || user.email}
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        ) : guestInfo ? (
          <div>
            <p className="text-sm">
              <strong>Name:</strong> {guestInfo.name}
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {guestInfo.email}
            </p>
            <p className="text-sm">
              <strong>Phone:</strong> {guestInfo.phone}
            </p>
            <p className="text-sm">
              <strong>Address:</strong> {guestInfo.address}, {guestInfo.city}
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">Please provide your information to continue</p>
            <Button onClick={() => router.push("/checkout/guest")}>Continue as Guest</Button>
          </div>
        )}
      </div>

      {/* Payment form or details will go here */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Payment Details</h3>
        <p className="text-sm">Payment details will be displayed here.</p>
      </div>

      <Button>Complete Order</Button>
    </div>
  )
}
