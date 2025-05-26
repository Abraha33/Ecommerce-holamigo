"use client"
import { useRouter } from "next/navigation"
import { GuestCheckoutForm } from "@/components/guest-checkout-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface GuestInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
}

export default function GuestCheckoutPage() {
  const router = useRouter()

  const handleGuestSubmit = (guestInfo: GuestInfo) => {
    // Save guest info to localStorage for the checkout process
    localStorage.setItem("guestCheckoutInfo", JSON.stringify(guestInfo))

    // Redirect to payment
    router.push("/checkout/payment")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Guest Checkout</h1>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-medium text-blue-900 mb-2">Quick & Easy Checkout</h2>
          <p className="text-sm text-blue-700">
            No account needed! Just provide your details and we'll process your order. You'll receive email updates
            about your delivery.
          </p>
        </div>

        <GuestCheckoutForm onSubmit={handleGuestSubmit} />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Already have an account?</p>
          <Button variant="outline" onClick={() => router.push("/auth?redirectTo=/checkout")}>
            Sign In Instead
          </Button>
        </div>
      </div>
    </div>
  )
}
