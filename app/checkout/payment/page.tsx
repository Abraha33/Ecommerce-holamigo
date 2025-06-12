"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/components/cart-provider"
import { ArrowLeft, CreditCard, DollarSign, Building2, Clock, Plus } from "lucide-react"
import { PaymentQRModal } from "@/components/payment-qr-modal"
import { AddCardModal } from "@/components/add-card-modal"
import { OrderProcessingModal } from "@/components/order-processing-modal"
import Image from "next/image"

export default function PaymentPage() {
  const router = useRouter()
  const { items, subtotal, clearItems } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("contraentrega")
  const [requiresInvoice, setRequiresInvoice] = useState(false)
  const [selectedCard, setSelectedCard] = useState("")
  const [showAddCard, setShowAddCard] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedBank, setSelectedBank] = useState<"bancolombia" | "nequi" | null>(null)
  const [orderNotes, setOrderNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showProcessingModal, setShowProcessingModal] = useState(false)

  const savedCards = [
    {
      id: "4242",
      number: "**** **** **** 4242",
      expiry: "12/25",
      isDefault: true,
      brand: "visa",
    },
    {
      id: "8765",
      number: "**** **** **** 8765",
      expiry: "09/26",
      isDefault: false,
      brand: "mastercard",
    },
  ]

  const productCost = 0
  const savings = 25170
  const shipping = 7500
  const total = 17670

  const handleCompleteOrder = async () => {
    setIsProcessing(true)
    setShowProcessingModal(true)

    // Simulate order processing time
    await new Promise((resolve) => setTimeout(resolve, 3000))

    clearItems()
    setShowProcessingModal(false)
    router.push("/orders/latest")
  }

  const handleBankSelection = (bank: "bancolombia" | "nequi") => {
    setSelectedBank(bank)
    setShowQRModal(true)
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="p-0 text-blue-600">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Checkout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Dirección de envío */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">1. Dirección de envío</h2>
            <div className="bg-orange-50 border border-orange-200 rounded p-3 flex justify-between items-center">
              <div>
                <div className="font-medium text-sm">Dirección de entrega</div>
                <div className="text-sm text-gray-600">Calle 31#15-09, Centro,Bucaramanga</div>
              </div>
              <Button variant="link" className="text-blue-600 text-sm p-0">
                ✏️ Editar dirección
              </Button>
            </div>
          </div>

          {/* 2. Documentación */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">2. Documentación</h2>
            <div className="bg-white rounded p-4">
              <div className="mb-3 font-medium">¿Requiere factura electrónica?</div>
              <RadioGroup
                value={requiresInvoice ? "si" : "no"}
                onValueChange={(value) => setRequiresInvoice(value === "si")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="si" id="si" />
                  <Label htmlFor="si">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>

              {requiresInvoice && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                  ⚠️ Su cuenta no está habilitada para facturación electrónica.
                  <Button
                    variant="link"
                    className="text-blue-600 p-0 ml-1 text-sm"
                    onClick={() => router.push("/account/electronic-invoicing")}
                  >
                    Habilitar facturación electrónica
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* 3. Método de pago */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">3. Método de pago</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Payment Methods */}
              <div>
                <div className="font-medium mb-3">Selecciona el método de pago</div>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg bg-white">
                    <RadioGroupItem value="contraentrega" id="contraentrega" />
                    <DollarSign className="h-5 w-5" />
                    <Label htmlFor="contraentrega" className="flex-1 cursor-pointer">
                      Contraentrega
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg bg-white">
                    <RadioGroupItem value="tarjeta" id="tarjeta" />
                    <CreditCard className="h-5 w-5" />
                    <Label htmlFor="tarjeta" className="flex-1 cursor-pointer">
                      Tarjeta débito/crédito (CVV)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg bg-white">
                    <RadioGroupItem value="consignacion" id="consignacion" />
                    <Building2 className="h-5 w-5" />
                    <Label htmlFor="consignacion" className="flex-1 cursor-pointer">
                      Consignación
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Right Column - Payment Details */}
              <div>
                <div className="font-medium mb-3">Selecciona el método de pago:</div>

                {paymentMethod === "contraentrega" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border rounded-lg p-4 text-center bg-green-50 border-green-200">
                      <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-sm font-medium">Efectivo</div>
                    </div>
                    <div className="border rounded-lg p-4 text-center bg-blue-50 border-blue-200">
                      <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-sm font-medium">Datáfono</div>
                    </div>
                  </div>
                )}

                {paymentMethod === "tarjeta" && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Selecciona una tarjeta guardada:</div>
                    {savedCards.map((card) => (
                      <div
                        key={card.id}
                        className={`border rounded-lg p-3 cursor-pointer ${
                          selectedCard === card.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                        onClick={() => setSelectedCard(card.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-6 relative">
                              <Image src={`/${card.brand}.png`} alt={card.brand} fill className="object-contain" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{card.number}</div>
                              <div className="text-xs text-gray-500">Vence: {card.expiry}</div>
                            </div>
                          </div>
                          {card.isDefault && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Predeterminada</span>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full border-dashed" onClick={() => setShowAddCard(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar nueva tarjeta
                    </Button>
                  </div>
                )}

                {paymentMethod === "consignacion" && (
                  <div className="space-y-4">
                    <div className="text-sm font-medium">Selecciona una cuenta para consignación:</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className="border rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50"
                        onClick={() => handleBankSelection("bancolombia")}
                      >
                        <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-sm font-medium">Bancolombia</div>
                        <div className="text-xs text-blue-600">Ver datos de cuenta</div>
                      </div>
                      <div
                        className="border rounded-lg p-4 text-center cursor-pointer hover:border-green-500 hover:bg-green-50"
                        onClick={() => handleBankSelection("nequi")}
                      >
                        <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">N</span>
                        </div>
                        <div className="text-sm font-medium">Nequi</div>
                        <div className="text-xs text-green-600">Ver datos de cuenta</div>
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded p-3 text-sm">
                      <strong>Importante:</strong> Después de realizar la consignación, ingresa el número de
                      confirmación en los comentarios del pedido.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Información de envío */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">4. Información de envío</h2>
            <div className="bg-white rounded p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Envío 1 de 1</div>
                    <div className="text-sm text-gray-600">Envío Sprint por moto (35 min. promedio) (3 artículos)</div>
                  </div>
                </div>
                <Button variant="link" className="text-blue-600 text-sm">
                  Ver detalles ▼
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 sticky top-6">
            <h3 className="font-semibold mb-4">Resumen del pedido</h3>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">9 - 13 min</span>
              </div>
              <Button variant="outline" size="sm" className="text-blue-600">
                📅 Programa tu pedido
              </Button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
              <div className="text-sm">Siendo prime ahorrarías:</div>
              <div className="font-bold">$7,500.00</div>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs mt-2 w-full">
                Quiero ahorrar
              </Button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Costo de productos</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Ahorro en productos</span>
                <span>$25,170</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Costo Domicilio</span>
                <span>$7,500</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>$-17,670</span>
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="comments" className="text-sm font-medium">
                Escríbenos tus comentarios
              </Label>
              <Textarea id="comments" placeholder="Ej: Dejar con el celador del edificio, por favor." rows={3} />
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
              onClick={handleCompleteOrder}
              disabled={isProcessing}
            >
              {isProcessing ? "Procesando..." : "Completar compra"}
            </Button>

            <div className="text-xs text-gray-500 space-y-1">
              <div className="font-medium">Información pedido de productos Sprint</div>
              <ul className="space-y-1">
                <li>• El tiempo promedio de los pedidos sprint del último mes es menor a 45 minutos.</li>
                <li>
                  • El envío se realizará por defecto en moto, por lo que es importante considerar los tamaños de los
                  productos.
                </li>
                <li>• El costo del envío de su domicilio está detallado en el carrito de compras.</li>
                <li>• Para pagos en efectivo, por favor tenga el monto exacto disponible.</li>
                <li>• Para pagos con datáfono, asegúrese de tener su tarjeta a mano.</li>
                <li>• Si tienes dudas, contáctanos al chat.</li>
                <li>• Recuerda que debes presentar fórmula médica para los productos con prescripción.</li>
              </ul>
              <div className="text-center mt-2">© 2023 Todos los derechos reservados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PaymentQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        paymentMethod={selectedBank || "bancolombia"}
      />

      <AddCardModal
        isOpen={showAddCard}
        onClose={() => setShowAddCard(false)}
        onAddCard={(cardData) => {
          console.log("Nueva tarjeta:", cardData)
          setShowAddCard(false)
        }}
      />

      <OrderProcessingModal isOpen={showProcessingModal} estimatedTime="33 - 49 min" />
    </div>
  )
}
