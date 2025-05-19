"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

export default function ContactPage() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [acceptPolicy, setAcceptPolicy] = useState(false)
  const [productInterest, setProductInterest] = useState("Vasos")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptPolicy) {
      toast({
        title: "Error",
        description: "Debes aceptar la política de manejo de datos personales",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Mensaje enviado",
      description: "Hemos recibido tu mensaje. Te contactaremos pronto.",
    })

    setName("")
    setEmail("")
    setPhone("")
    setMessage("")
    setAcceptPolicy(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-12">Contáctanos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Columna izquierda - Mapa y datos de contacto */}
          <div>
            {/* Mapa */}
            <div className="bg-gray-200 h-80 mb-8 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.0538893173584!2d-73.12292!3d7.119489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e683f0aaaaaaaa%3A0xaaaaaaaaaaaaaa!2sCalle%2031%20%2315-19%2C%20Bucaramanga%2C%20Santander!5e0!3m2!1ses!2sco!4v1621436289693!5m2!1ses!2sco"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                aria-hidden="false"
                tabIndex={0}
                title="Ubicación de nuestra empresa"
              ></iframe>
            </div>

            {/* Información de contacto */}
            <div>
              <h2 className="text-3xl font-light text-blue-500 mb-6">Visítanos</h2>

              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mt-1.5 h-4 w-4 rounded-full bg-blue-500 flex-shrink-0"></div>
                  <div className="ml-3">
                    <span className="font-medium text-blue-700">Planta principal:</span>{" "}
                    <span className="text-gray-700">Calle 31#15-19, piso 1, Bucaramanga, Santander.</span>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="mt-1.5 h-4 w-4 rounded-full bg-blue-500 flex-shrink-0"></div>
                  <div className="ml-3">
                    <span className="font-medium text-blue-700">Punto de venta:</span>{" "}
                    <span className="text-gray-700">Calle 31#15-09, Bucaramanga, centro</span>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="mt-1.5 h-4 w-4 rounded-full bg-blue-500 flex-shrink-0"></div>
                  <div className="ml-3">
                    <span className="font-medium text-blue-700">Celular:</span>{" "}
                    <span className="text-gray-700">3192102438</span>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="mt-1.5 h-4 w-4 rounded-full bg-blue-500 flex-shrink-0"></div>
                  <div className="ml-3">
                    <span className="font-medium text-blue-700">Fijo:</span>{" "}
                    <span className="text-gray-700">6705556</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Columna derecha - Formulario de contacto */}
          <div>
            <h2 className="text-3xl font-light text-blue-500 mb-4">Escríbenos</h2>
            <p className="text-gray-600 mb-8">
              Obtenga una cotización de Precios. Llámenos o escríbanos en cualquier momento.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Nombre completo <span className="text-red-500">(*)</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eje: Martín"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Correo electrónico <span className="text-red-500">(*)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="martin@sucorreo.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Eje: 3150490000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="product" className="block text-gray-700 mb-2">
                  Producto de interés
                </label>
                <select
                  id="product"
                  value={productInterest}
                  onChange={(e) => setProductInterest(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Vasos">Vasos</option>
                  <option value="Bolsas">Bolsas</option>
                  <option value="Empaques">Empaques</option>
                  <option value="Vasos de cartón">Vasos de cartón</option>
                  <option value="Moldes de aluminio">Moldes de aluminio</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="¿Cómo te podemos ayudar?"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="policy"
                  checked={acceptPolicy}
                  onCheckedChange={(checked) => setAcceptPolicy(checked as boolean)}
                />
                <label htmlFor="policy" className="text-sm text-gray-700">
                  Declaro que conozco y acepto la{" "}
                  <Link href="/politica-datos" className="text-blue-600 underline">
                    política de manejo de datos personales
                  </Link>
                  .
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-md transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
