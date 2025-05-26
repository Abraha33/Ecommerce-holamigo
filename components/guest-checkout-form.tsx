"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, MapPin } from "lucide-react"

interface GuestInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
}

interface GuestCheckoutFormProps {
  onSubmit: (guestInfo: GuestInfo) => void
  initialData?: Partial<GuestInfo>
}

export function GuestCheckoutForm({ onSubmit, initialData = {} }: GuestCheckoutFormProps) {
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    address: initialData.address || "",
    city: initialData.city || "Bucaramanga",
  })

  const [errors, setErrors] = useState<Partial<GuestInfo>>({})

  const validateForm = () => {
    const newErrors: Partial<GuestInfo> = {}

    if (!guestInfo.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!guestInfo.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(guestInfo.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!guestInfo.phone.trim()) {
      newErrors.phone = "Phone is required"
    }

    if (!guestInfo.address.trim()) {
      newErrors.address = "Address is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(guestInfo)
    }
  }

  const handleInputChange = (field: keyof GuestInfo, value: string) => {
    setGuestInfo((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Guest Checkout
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guest-name">Full Name *</Label>
            <Input
              id="guest-name"
              type="text"
              placeholder="Juan Pérez"
              value={guestInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="guest-email"
                type="email"
                placeholder="juan@email.com"
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                value={guestInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-phone">Phone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="guest-phone"
                type="tel"
                placeholder="3001234567"
                className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                value={guestInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-address">Delivery Address *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="guest-address"
                type="text"
                placeholder="Calle 10 #18-24, Laureles"
                className={`pl-10 ${errors.address ? "border-red-500" : ""}`}
                value={guestInfo.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-city">City</Label>
            <Input
              id="guest-city"
              type="text"
              placeholder="Bucaramanga"
              value={guestInfo.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
            Continue to Payment
          </Button>

          <p className="text-xs text-gray-500 text-center">We'll send order updates to your email</p>
        </form>
      </CardContent>
    </Card>
  )
}
