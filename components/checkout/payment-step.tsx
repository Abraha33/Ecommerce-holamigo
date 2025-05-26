"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Plus, CreditCard, Wallet, DollarSign, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaymentStepProps {
  onNext: () => void
  onSelectPayment: (method: string) => void
  selectedMethod: string
}

export function PaymentStep({ onNext, onSelectPayment, selectedMethod }: PaymentStepProps) {
  const [selected, setSelected] = useState(selectedMethod || "card")
  const [selectedCard, setSelectedCard] = useState<string | null>("card1")
  const [showAddCard, setShowAddCard] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)

  const savedCards = [
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
      isDefault: false,
    },
  ]

  const handleSelectMethod = (method: string) => {
    setSelected(method)
    onSelectPayment(method)
  }

  const handleSelectCard = (cardId: string) => {
    setSelectedCard(cardId)
    onSelectPayment(`card_${cardId}`)
  }

  const handleAddCard = () => {
    setShowAddCard(true)
  }

  const handleCancelAddCard = () => {
    setShowAddCard(false)
  }

  const handleApplyCoupon = () => {
    if (couponCode) {
      setCouponApplied(true)
    }
  }

  const handleContinue = () => {
    onSelectPayment(selected === "card" && selectedCard ? `card_${selectedCard}` : selected)
    onNext()
  }

  const paymentMethods = [
    {
      id: "card",
      title: "Credit/Debit Card",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: "cash",
      title: "Cash on Delivery",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      id: "wallet",
      title: "Digital Wallet",
      icon: <Wallet className="h-5 w-5" />,
    },
  ]

  return (
    <div className="space-y-6">
      {!showAddCard ? (
        <>
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Select payment method</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={cn(
                    "flex items-center border rounded-lg p-4 cursor-pointer transition-colors",
                    selected === method.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-600 hover:bg-blue-50",
                  )}
                  onClick={() => handleSelectMethod(method.id)}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full mr-3",
                      selected === method.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500",
                    )}
                  >
                    {method.icon}
                  </div>
                  <div className="font-medium">{method.title}</div>
                </div>
              ))}
            </div>
          </div>

          {selected === "card" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Your saved cards</h3>
                <Button variant="ghost" size="sm" className="h-8 px-2" onClick={handleAddCard}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="space-y-3">
                {savedCards.map((card) => (
                  <div
                    key={card.id}
                    className={cn(
                      "border rounded-lg p-3 flex items-center cursor-pointer transition-colors",
                      selectedCard === card.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-600 hover:bg-blue-50",
                    )}
                    onClick={() => handleSelectCard(card.id)}
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
              </div>
            </div>
          )}

          {selected === "wallet" && (
            <div className="space-y-4">
              <h3 className="font-medium">Select wallet</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "nequi", name: "Nequi", logo: "/nequi-logo.png" },
                  { id: "bancolombia", name: "Bancolombia", logo: "/bancolombia-logo.png" },
                ].map((wallet) => (
                  <div
                    key={wallet.id}
                    className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-blue-600 hover:bg-blue-50"
                  >
                    <div className="w-12 h-12 relative mb-2">
                      <Image
                        src={wallet.logo || "/placeholder.svg"}
                        alt={wallet.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium">{wallet.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-medium">Have a coupon?</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
                className="flex-1"
              />
              <Button
                variant={couponApplied ? "outline" : "default"}
                className={couponApplied ? "bg-green-50 text-green-600 border-green-200" : ""}
                onClick={handleApplyCoupon}
                disabled={!couponCode || couponApplied}
              >
                {couponApplied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" /> Applied
                  </>
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
            {couponApplied && <div className="text-sm text-green-600">Coupon applied! You saved $10,000.</div>}
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleContinue}>
            Continue to review
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Add new card</h2>

          <div className="space-y-3">
            <div>
              <Input placeholder="Card number" className="mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input placeholder="MM/YY" className="mt-1" />
              </div>
              <div>
                <Input placeholder="CVC" className="mt-1" />
              </div>
            </div>

            <div>
              <Input placeholder="Cardholder name" className="mt-1" />
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <input type="checkbox" id="save-card" className="rounded border-gray-300" />
              <label htmlFor="save-card" className="text-sm">
                Save card for future purchases
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="default-card" className="rounded border-gray-300" />
              <label htmlFor="default-card" className="text-sm">
                Set as default payment method
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={handleCancelAddCard}>
              Cancel
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Save card</Button>
          </div>
        </div>
      )}
    </div>
  )
}
