"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Clock, Phone, Mail, MessageSquare, Send, ChevronDown, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const WHATSAPP_NUMBER = "+573001234567"
const WHATSAPP_TEXT = "Hola, me gustaría hacer un pedido."
const EMAIL_ORDERS = "pedidos@holamigo.com"

const storeLocations = [
  {
    id: 1,
    name: "Tienda Principal",
    address: "Calle 123 #45-67, Barrio Centro",
    city: "Bogotá",
    phone: "+57 300 123 4567",
    email: "tiendaprincipal@holamigo.com",
    hours: [
      { days: "Lunes a Viernes", hours: "8:00 AM - 8:00 PM" },
      { days: "Sábados", hours: "9:00 AM - 7:00 PM" },
      { days: "Domingos y Festivos", hours: "10:00 AM - 4:00 PM" },
    ],
    mapUrl: "https://maps.google.com/?q=4.6097,-74.0817",
  },
  {
    id: 2,
    name: "Sucursal Norte",
    address: "Avenida 456 #78-90, Barrio Norte",
    city: "Bogotá",
    phone: "+57 300 987 6543",
    email: "sucursalnorte@holamigo.com",
    hours: [
      { days: "Lunes a Viernes", hours: "8:30 AM - 7:30 PM" },
      { days: "Sábados", hours: "9:30 AM - 6:30 PM" },
      { days: "Domingos y Festivos", hours: "11:00 AM - 3:00 PM" },
    ],
    mapUrl: "https://maps.google.com/?q=4.7110,-74.0721",
  },
]

export default function ContactPage() {
  const { toast } = useToast()
  const [activeLocation, setActiveLocation] = useState(storeLocations[0].id)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [expandedHours, setExpandedHours] = useState<number[]>([1])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Mensaje enviado",
      description: "Hemos recibido tu mensaje. Te contactaremos pronto.",
    })
    setName("")
    setEmail("")
    setMessage("")
  }

  const toggleHoursExpand = (id: number) => {
    setExpandedHours((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`, "_blank")
  }

  const mailtoOrders = () => {
    window.location.href = `mailto:${EMAIL_ORDERS}?subject=Nuevo Pedido&body=Hola, me gustaría realizar el siguiente pedido:%0A%0AProductos:%0A- %0A%0ADirección de entrega:%0A%0ATeléfono de contacto:%0A%0AForma de pago preferida:`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Banner superior */}
      <div className="bg-blue-600 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contáctanos</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos por WhatsApp, teléfono o correo electrónico.
          </p>
        </div>
      </div>

      {/* Sección de WhatsApp destacada */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 rounded-full p-3 flex-shrink-0">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">WhatsApp</h2>
                <p className="text-gray-600 mb-1">Pedidos y atención 24/7</p>
                <p className="text-xl font-semibold text-green-600">{WHATSAPP_NUMBER}</p>
              </div>
            </div>
            <Button
              onClick={openWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white w-full md:w-auto text-lg py-6 px-8"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Contactar por WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Sección de pedidos por correo */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white border-2 border-blue-100 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 rounded-full p-3 flex-shrink-0">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Pedidos por correo</h2>
                <p className="text-gray-600 mb-3">Envía tu pedido detallado a:</p>
                <p className="text-xl font-semibold text-blue-600 mb-4">{EMAIL_ORDERS}</p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Formato sugerido para pedidos:</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Lista de productos con cantidades</li>
                    <li>• Dirección de entrega completa</li>
                    <li>• Teléfono de contacto</li>
                    <li>• Forma de pago preferida</li>
                  </ul>
                </div>
              </div>
            </div>
            <Button
              onClick={mailtoOrders}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full md:w-auto text-lg py-6 px-8"
            >
              <Mail className="h-5 w-5 mr-2" />
              Enviar correo de pedido
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Columna izquierda - Información de contacto */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Nuestras Tiendas</h2>

                <div className="flex space-x-2 mb-6">
                  {storeLocations.map((location) => (
                    <button
                      key={location.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeLocation === location.id
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setActiveLocation(location.id)}
                    >
                      {location.name}
                    </button>
                  ))}
                </div>

                {storeLocations.map(
                  (location) =>
                    activeLocation === location.id && (
                      <div key={location.id} className="space-y-6">
                        <div className="bg-gray-100 h-48 rounded-lg relative overflow-hidden">
                          <Image src="/map-placeholder.png" alt="Mapa de ubicación" fill className="object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Link
                              href={location.mapUrl}
                              target="_blank"
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                            >
                              Ver en Google Maps
                            </Link>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h3 className="font-medium text-gray-900">{location.name}</h3>
                              <p className="text-gray-600">{location.address}</p>
                              <p className="text-gray-600">{location.city}</p>
                            </div>
                          </div>

                          <div
                            className="flex items-start gap-3 cursor-pointer"
                            onClick={() => toggleHoursExpand(location.id)}
                          >
                            <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="w-full">
                              <div className="flex justify-between items-center w-full">
                                <h3 className="font-medium text-gray-900">Horario de atención</h3>
                                <ChevronDown
                                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                                    expandedHours.includes(location.id) ? "transform rotate-180" : ""
                                  }`}
                                />
                              </div>

                              {expandedHours.includes(location.id) && (
                                <div className="mt-2 space-y-1">
                                  {location.hours.map((hour, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                      <span className="text-gray-600">{hour.days}</span>
                                      <span className="text-gray-800 font-medium">{hour.hours}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h3 className="font-medium text-gray-900">Teléfono</h3>
                              <p className="text-gray-600">{location.phone}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h3 className="font-medium text-gray-900">Correo electrónico</h3>
                              <p className="text-gray-600">{location.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                )}
              </div>
            </div>

            {/* Sección de métodos de pago */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-gray-100 mt-8">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Métodos de pago aceptados</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 p-3 rounded-lg mb-2">
                      <Image src="/nequi-logo.png" alt="Nequi" width={60} height={60} />
                    </div>
                    <span className="text-sm text-gray-600">Nequi</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 p-3 rounded-lg mb-2">
                      <Image src="/bancolombia-logo.png" alt="Bancolombia" width={60} height={60} />
                    </div>
                    <span className="text-sm text-gray-600">Bancolombia</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 p-3 rounded-lg mb-2">
                      <ShoppingBag className="h-12 w-12 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">Contra entrega</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Formulario de contacto */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-gray-100 h-full">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Envíanos un mensaje</h2>
                <p className="text-gray-600 mb-6">Completa el formulario y te responderemos a la brevedad posible.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Nombre completo
                      </label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Correo electrónico
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Mensaje
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="¿En qué podemos ayudarte?"
                      required
                      className="min-h-[150px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-6"
                  >
                    <Send className="h-4 w-4" />
                    Enviar mensaje
                  </Button>
                </form>

                <div className="mt-8 space-y-4">
                  <h3 className="font-bold text-gray-800 mb-2">Preguntas frecuentes</h3>

                  <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-800 mb-2">¿Cuál es el tiempo de entrega?</h4>
                    <p className="text-gray-600 text-sm">
                      El tiempo de entrega varía según tu ubicación. Generalmente, realizamos entregas en 24-48 horas en
                      zonas urbanas.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-800 mb-2">¿Cómo puedo hacer un seguimiento de mi pedido?</h4>
                    <p className="text-gray-600 text-sm">
                      Una vez realizado tu pedido, recibirás un código de seguimiento por correo electrónico para
                      rastrear tu envío.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-800 mb-2">¿Cuál es el pedido mínimo?</h4>
                    <p className="text-gray-600 text-sm">
                      El pedido mínimo es de $30.000 COP para entregas dentro de la ciudad y $50.000 COP para entregas
                      en zonas periféricas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner de WhatsApp flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={openWhatsApp}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
          aria-label="Contactar por WhatsApp"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
