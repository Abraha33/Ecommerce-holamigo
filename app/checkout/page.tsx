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
import { ChevronRight, Plus, AlertTriangle, Truck, Store, Clock, CreditCard, Wallet, BanknoteIcon } from "lucide-react"
import { AddressForm } from "@/components/address-form"
import { AddressList } from "@/components/address-list"
import { WhatsAppSupport } from "@/components/whatsapp-support"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CheckoutPage() {
  const { cart } = useCart()
  const [activeTab, setActiveTab] = useState("address")
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [shippingMethod, setShippingMethod] = useState("")
  const [requiresInvoice, setRequiresInvoice] = useState(false)
  const [isElectronicInvoiceEnabled, setIsElectronicInvoiceEnabled] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [deliveryType, setDeliveryType] = useState("route")

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = shippingMethod === "express" ? 15 : shippingMethod === "scheduled" ? 10 : 0
  const total = subtotal + shipping

  // Verificar si el cliente es de ruta (simulado)
  const isRouteCustomer = true

  // Verificar si el cliente está habilitado para facturador electrónico (simulado)
  const checkElectronicInvoiceStatus = () => {
    // Simulación de verificación - en producción, esto sería una llamada a API
    setTimeout(() => {
      setIsElectronicInvoiceEnabled(false)
    }, 500)
  }

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
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-4">
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="scheduled" id="scheduled" />
                      <Label htmlFor="scheduled" className="flex-1 cursor-pointer">
                        <div className="font-medium flex items-center">
                          <Truck className="mr-2 h-5 w-5 text-primary" />
                          Programar envío
                        </div>

                        {shippingMethod === "scheduled" && (
                          <div className="mt-3 pl-7">
                            <RadioGroup value={deliveryType} onValueChange={setDeliveryType} className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="route" id="route" />
                                <Label htmlFor="route">
                                  <div className="font-medium">Entrega por ruta</div>
                                  <div className="text-sm text-muted-foreground">
                                    Entrega programada por camión de la empresa
                                  </div>
                                </Label>
                              </div>

                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="home" id="home" />
                                <Label htmlFor="home">
                                  <div className="font-medium">Entrega a domicilio</div>
                                  <div className="text-sm text-muted-foreground">Entrega programada a su dirección</div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        )}

                        <div className="text-sm text-muted-foreground mt-1">Entrega programada en 1-3 días hábiles</div>
                      </Label>
                      <div className="font-medium">{formatCurrency(10)}</div>
                    </div>

                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="flex-1 cursor-pointer">
                        <div className="font-medium flex items-center">
                          <Clock className="mr-2 h-5 w-5 text-primary" />
                          Domicilio express
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Envío inmediato (costo cubierto por el cliente)
                        </div>
                      </Label>
                      <div className="font-medium">{formatCurrency(15)}</div>
                    </div>

                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="font-medium flex items-center">
                          <Store className="mr-2 h-5 w-5 text-primary" />
                          Retiro en tienda
                        </div>
                        <div className="text-sm text-muted-foreground">Disponible para recoger en 24 horas</div>
                      </Label>
                      <div className="font-medium">Gratis</div>
                    </div>
                  </RadioGroup>

                  <div className="mt-6 border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="invoice" className="font-medium">
                          ¿Requiere factura electrónica?
                        </Label>
                        <Switch
                          id="invoice"
                          checked={requiresInvoice}
                          onCheckedChange={(checked) => {
                            setRequiresInvoice(checked)
                            if (checked) {
                              checkElectronicInvoiceStatus()
                            }
                          }}
                        />
                      </div>
                    </div>

                    {requiresInvoice && !isElectronicInvoiceEnabled && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Advertencia</AlertTitle>
                        <AlertDescription>
                          Su cuenta no está habilitada para facturación electrónica. Por favor, contacte con soporte.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => setActiveTab("payment")} disabled={!shippingMethod}>
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
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    {(isRouteCustomer || deliveryType === "route") && (
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                        <Label htmlFor="cash_on_delivery" className="flex-1 cursor-pointer">
                          <div className="font-medium flex items-center">
                            <Wallet className="mr-2 h-5 w-5 text-primary" />
                            Contraentrega
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Pago al recibir su pedido (solo para clientes de ruta)
                          </div>
                        </Label>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="immediate" id="immediate" />
                      <Label htmlFor="immediate" className="flex-1 cursor-pointer">
                        <div className="font-medium flex items-center">
                          <CreditCard className="mr-2 h-5 w-5 text-primary" />
                          Pago inmediato
                        </div>
                        <div className="text-sm text-muted-foreground">Pasarela de pago con link de pago</div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                        <div className="font-medium flex items-center">
                          <BanknoteIcon className="mr-2 h-5 w-5 text-primary" />
                          Consignación
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "bank_transfer" && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-md">
                      <h3 className="font-medium mb-2">Cuentas habilitadas para consignación:</h3>
                      <div className="space-y-3">
                        <div className="flex items-center border-b pb-2">
                          <div className="w-16 h-16 relative mr-3 flex-shrink-0">
                            <Image src="/nequi-logo.png" alt="Nequi" fill className="object-contain" />
                          </div>
                          <div>
                            <p className="font-medium">Nequi</p>
                            <p className="text-sm">Número: 300 123 4567</p>
                            <p className="text-sm text-muted-foreground">A nombre de: EcoPlast S.A.S</p>
                          </div>
                        </div>

                        <div className="flex items-center pt-2">
                          <div className="w-16 h-16 relative mr-3 flex-shrink-0">
                            <Image src="/bancolombia-logo.png" alt="Bancolombia" fill className="object-contain" />
                          </div>
                          <div>
                            <p className="font-medium">Bancolombia</p>
                            <p className="text-sm">Cuenta de Ahorros: 123-456789-00</p>
                            <p className="text-sm text-muted-foreground">A nombre de: EcoPlast S.A.S</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="transfer-confirmation">Número de confirmación</Label>
                        <Input
                          id="transfer-confirmation"
                          placeholder="Ingrese el número de confirmación"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "immediate" && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-md">
                      <h3 className="font-medium mb-3">Opciones de pago inmediato</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                          <Image src="/visa.png" alt="Visa" width={40} height={25} className="mb-1" />
                          <span className="text-xs">Visa</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                          <Image src="/mastercard.png" alt="Mastercard" width={40} height={25} className="mb-1" />
                          <span className="text-xs">Mastercard</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                          <Image src="/paypal.png" alt="PayPal" width={50} height={25} className="mb-1" />
                          <span className="text-xs">PayPal</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Button disabled={!paymentMethod}>Completar compra</Button>
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
                  <span>{shipping === 0 ? "Gratis" : formatCurrency(shipping)}</span>
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
