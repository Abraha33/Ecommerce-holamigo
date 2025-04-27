"use client"

import { useState } from "react"
import Image from "next/image"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/components/cart-provider"
import { formatCurrency } from "@/lib/utils"
import { ChevronRight, Plus } from "lucide-react"
import { AddressForm } from "@/components/address-form"
import { AddressList } from "@/components/address-list"
import { WhatsAppSupport } from "@/components/whatsapp-support"

export default function CheckoutPage() {
  const { cart } = useCart()
  const [activeTab, setActiveTab] = useState("address")
  const [showAddressForm, setShowAddressForm] = useState(false)

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 0 ? 10 : 0
  const total = subtotal + shipping

  return (
    <div className="container px-4 py-8 mx-auto">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout", href: "/checkout", active: true },
        ]}
      />

      <h1 className="text-3xl font-bold mt-6 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="address">
                <span className="flex items-center">
                  <span className="bg-muted rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">1</span>
                  Dirección
                </span>
              </TabsTrigger>
              <TabsTrigger value="shipping" disabled={activeTab !== "shipping" && activeTab !== "payment"}>
                <span className="flex items-center">
                  <span className="bg-muted rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">2</span>
                  Envío
                </span>
              </TabsTrigger>
              <TabsTrigger value="payment" disabled={activeTab !== "payment"}>
                <span className="flex items-center">
                  <span className="bg-muted rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">3</span>
                  Pago
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="address" className="mt-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-3 font-medium flex justify-between items-center">
                  <h2>Agregar dirección:</h2>
                  {!showAddressForm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddressForm(true)}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Crear tu dirección
                    </Button>
                  )}
                </div>

                {showAddressForm ? (
                  <AddressForm
                    onCancel={() => setShowAddressForm(false)}
                    onSave={() => {
                      setShowAddressForm(false)
                      setActiveTab("shipping")
                    }}
                  />
                ) : (
                  <AddressList onSelect={() => setActiveTab("shipping")} onAddNew={() => setShowAddressForm(true)} />
                )}
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-3 font-medium">
                  <h2>Método de envío</h2>
                </div>
                <div className="p-4">
                  <RadioGroup defaultValue="standard">
                    <div className="flex items-center space-x-2 border p-4 rounded-md mb-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="flex-1 cursor-pointer">
                        <div className="font-medium">Envío estándar</div>
                        <div className="text-sm text-muted-foreground">Entrega en 3-5 días hábiles</div>
                      </Label>
                      <div className="font-medium">$10.00</div>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md mb-3">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="flex-1 cursor-pointer">
                        <div className="font-medium">Envío express</div>
                        <div className="text-sm text-muted-foreground">Entrega en 1-2 días hábiles</div>
                      </Label>
                      <div className="font-medium">$20.00</div>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="font-medium">Recoger en tienda</div>
                        <div className="text-sm text-muted-foreground">Disponible para recoger en 24 horas</div>
                      </Label>
                      <div className="font-medium">Gratis</div>
                    </div>
                  </RadioGroup>

                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => setActiveTab("payment")}>
                      Continuar al pago <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="mt-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-3 font-medium">
                  <h2>Información de pago</h2>
                </div>
                <div className="p-4">
                  <RadioGroup defaultValue="card">
                    <div className="flex items-center space-x-2 border p-4 rounded-md mb-3">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="font-medium">Tarjeta de crédito/débito</div>
                      </Label>
                      <div className="flex gap-2">
                        <Image src="/visa.png" alt="Visa" width={40} height={25} />
                        <Image src="/mastercard.png" alt="Mastercard" width={40} height={25} />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md mb-3">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                        <div className="font-medium">PayPal</div>
                      </Label>
                      <Image src="/paypal.png" alt="PayPal" width={80} height={25} />
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                        <div className="font-medium">Transferencia bancaria</div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Detalles de la tarjeta</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="card-number">Número de tarjeta</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Fecha de expiración</Label>
                          <Input id="expiry" placeholder="MM/AA" />
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="name">Nombre en la tarjeta</Label>
                        <Input id="name" placeholder="Nombre completo" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button>Completar compra</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg overflow-hidden sticky top-24">
            <div className="bg-muted px-4 py-3 font-medium">
              <h2>Resumen del pedido</h2>
            </div>
            <div className="p-4">
              <div className="max-h-80 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="flex py-3 border-b">
                    <div className="relative h-16 w-16 rounded overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.variant}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">
                          {item.quantity} x {formatCurrency(item.price)}
                        </span>
                        <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <WhatsAppSupport />
          </div>
        </div>
      </div>
    </div>
  )
}
