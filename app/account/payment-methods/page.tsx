"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusCircle, Check, CreditCardIcon, AlertTriangle, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AccountSidebar from "@/components/account-sidebar"
import Script from "next/script"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Importar Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
// Importar Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
// Importar módulos requeridos
import { Pagination, Navigation } from "swiper/modules"

type PaymentMethod = {
  id: string
  type: "card" | "bank"
  name: string
  last4: string
  expiry?: string
  brand?: string
  logo: string
  cardNumber?: string
  cardholderName?: string
  isDefault?: boolean
}

export default function PaymentMethodsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      name: "Visa terminada en 4242",
      last4: "4242",
      expiry: "12/25",
      brand: "visa",
      logo: "/visa.png",
      cardNumber: "•••• •••• •••• 4242",
      cardholderName: "JUAN PÉREZ",
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      name: "Mastercard terminada en 5678",
      last4: "5678",
      expiry: "09/26",
      brand: "mastercard",
      logo: "/mastercard.png",
      cardNumber: "•••• •••• •••• 5678",
      cardholderName: "JUAN PÉREZ",
    },
    {
      id: "3",
      type: "bank",
      name: "Nequi",
      last4: "9012",
      logo: "/nequi-logo.png",
    },
    {
      id: "4",
      type: "card",
      name: "Visa terminada en 1111",
      last4: "1111",
      expiry: "10/27",
      brand: "visa",
      logo: "/visa.png",
      cardNumber: "•••• •••• •••• 1111",
      cardholderName: "JUAN PÉREZ",
    },
    {
      id: "5",
      type: "bank",
      name: "Bancolombia",
      last4: "3456",
      logo: "/bancolombia-logo.png",
    },
  ])

  // Estado para el diálogo de confirmación de eliminación
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null)

  // Estado para el diálogo de edición
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [editedName, setEditedName] = useState("")
  const [editedExpiry, setEditedExpiry] = useState("")

  const handleAddCard = () => {
    router.push("/payment/add-card")
  }

  const handleRemoveMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id))
    toast({
      title: "Método de pago eliminado",
      description: "El método de pago ha sido eliminado correctamente.",
    })
    setDeleteConfirmation(null)
  }

  const setDefaultCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
    toast({
      title: "Método de pago predeterminado",
      description: "Se ha establecido como método de pago predeterminado.",
    })
  }

  const handleEditMethod = (method: PaymentMethod) => {
    setEditingMethod(method)
    setEditedName(method.cardholderName || "")
    setEditedExpiry(method.expiry || "")
  }

  const saveEditedMethod = () => {
    if (!editingMethod) return

    setPaymentMethods((prev) =>
      prev.map((method) =>
        method.id === editingMethod.id
          ? {
              ...method,
              cardholderName: editedName,
              expiry: editedExpiry,
              name:
                method.type === "card"
                  ? `${method.brand === "visa" ? "Visa" : "Mastercard"} terminada en ${method.last4}`
                  : method.name,
            }
          : method,
      ),
    )

    toast({
      title: "Método de pago actualizado",
      description: "Los datos del método de pago han sido actualizados correctamente.",
    })

    setEditingMethod(null)
  }

  // Función para obtener un color de fondo basado en el ID
  const getCardBackground = (id: string, type: string) => {
    const backgrounds = {
      "1": "linear-gradient(135deg, #2E8B57, #1E90FF)",
      "2": "linear-gradient(135deg, #0088cc, #004080)",
      "3": "linear-gradient(135deg, #FF416C, #FF4B2B)",
      "4": "linear-gradient(135deg, #43cea2, #185a9d)",
      "5": "linear-gradient(135deg, #f46b45, #eea849)",
    }

    return (
      backgrounds[id as keyof typeof backgrounds] ||
      (type === "bank" ? "linear-gradient(135deg, #f46b45, #eea849)" : "linear-gradient(135deg, #2E8B57, #1E90FF)")
    )
  }

  return (
    <>
      <style jsx global>{`
        /* Google Fonts - Poppins */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        .slide-container {
          max-width: 1120px;
          width: 100%;
          padding: 40px 0;
        }
        .slide-content {
          margin: 0 40px;
          overflow: hidden;
          border-radius: 25px;
        }
        .payment-card {
          border-radius: 25px;
          background-color: #FFF;
          height: 100%;
        }
        .image-content,
        .card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 14px;
        }
        .image-content {
          position: relative;
          row-gap: 5px;
          padding: 25px 0;
          height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card-overlay {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
        }
        .credit-card-container {
          width: 320px;
          height: 200px;
          perspective: 1000px;
          margin: 0 auto;
        }
        .credit-card {
          width: 100%;
          height: 100%;
          position: relative;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          border-radius: 16px;
          overflow: hidden;
        }
        .credit-card-front {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 16px;
          padding: 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
          position: relative;
        }
        .credit-card-front::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFFFFF' fillOpacity='0.1' d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'%3E%3C/path%3E%3C/svg%3E"),
            linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
          mix-blend-mode: overlay;
          opacity: 0.3;
          z-index: 1;
        }
        .polygon-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          opacity: 0.4;
        }
        .polygon-1 {
          position: absolute;
          width: 150px;
          height: 150px;
          background: rgba(255,255,255,0.1);
          transform: rotate(45deg);
          top: -50px;
          left: -50px;
          border-radius: 30px;
        }
        .polygon-2 {
          position: absolute;
          width: 200px;
          height: 200px;
          background: rgba(255,255,255,0.1);
          transform: rotate(25deg);
          bottom: -100px;
          right: -50px;
          border-radius: 40px;
        }
        .polygon-3 {
          position: absolute;
          width: 100px;
          height: 100px;
          background: rgba(255,255,255,0.1);
          transform: rotate(15deg);
          top: 50px;
          right: 50px;
          border-radius: 20px;
        }
        .bank-name {
          font-size: 14px;
          color: white;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          position: relative;
          z-index: 2;
        }
        .card-chip {
          width: 45px;
          height: 35px;
          background: linear-gradient(135deg, #f6e05e, #d69e2e);
          border-radius: 6px;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .chip-line {
          position: absolute;
          height: 1px;
          background: rgba(0,0,0,0.3);
          width: 80%;
          left: 10%;
        }
        .chip-line:nth-child(1) { top: 20%; }
        .chip-line:nth-child(2) { top: 40%; }
        .chip-line:nth-child(3) { top: 60%; }
        .chip-line:nth-child(4) { top: 80%; }
        .card-number {
          font-size: 18px;
          letter-spacing: 2px;
          margin-bottom: 20px;
          font-family: 'Courier New', monospace;
          color: white;
          position: relative;
          z-index: 2;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .card-holder {
          font-size: 12px;
          text-transform: uppercase;
          color: white;
          position: relative;
          z-index: 2;
          letter-spacing: 1px;
        }
        .card-expiry {
          font-size: 12px;
          color: white;
          position: relative;
          z-index: 2;
        }
        .expiry-label {
          font-size: 8px;
          text-transform: uppercase;
          margin-bottom: 2px;
          color: rgba(255,255,255,0.8);
        }
        .card-details {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          position: relative;
          z-index: 2;
        }
        .card-brand {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 60px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .world-map {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 50px;
          height: 30px;
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
          z-index: 2;
        }
        .bank-card {
          width: 320px;
          height: 200px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          box-sizing: border-box;
        }
        .bank-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFFFFF' fillOpacity='0.1' d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'%3E%3C/path%3E%3C/svg%3E"),
            linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
          mix-blend-mode: overlay;
          opacity: 0.3;
          z-index: 1;
        }
        .bank-logo {
          width: 80px;
          height: 40px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          position: relative;
          z-index: 2;
        }
        .bank-account {
          font-size: 16px;
          color: white;
          margin-bottom: 10px;
          position: relative;
          z-index: 2;
        }
        .bank-name-text {
          font-size: 18px;
          color: white;
          font-weight: bold;
          position: relative;
          z-index: 2;
        }
        .name {
          font-size: 18px;
          font-weight: 500;
          color: #333;
        }
        .description {
          font-size: 14px;
          color: #707070;
          text-align: center;
        }
        .payment-button {
          border: none;
          font-size: 16px;
          color: #FFF;
          padding: 8px 16px;
          background-color: #4070F4;
          border-radius: 6px;
          margin: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .payment-button:hover {
          background: #265DF2;
        }

        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .swiper-navBtn {
          color: #6E93f7;
          transition: color 0.3s ease;
        }
        .swiper-navBtn:hover {
          color: #4070F4;
        }
        .swiper-navBtn::before,
        .swiper-navBtn::after {
          font-size: 35px;
        }
        .swiper-button-next {
          right: 0;
        }
        .swiper-button-prev {
          left: 0;
        }
        .swiper-pagination-bullet {
          background-color: #6E93f7;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background-color: #4070F4;
        }

        @media screen and (max-width: 768px) {
          .slide-content {
            margin: 0 10px;
          }
          .swiper-navBtn {
            display: none;
          }
          .credit-card-container {
            width: 280px;
            height: 180px;
          }
          .bank-card {
            width: 280px;
            height: 180px;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="bg-gradient-to-r from-red-100 to-red-50 text-red-600 py-3 px-4 text-center font-semibold shadow-sm">
          ¡ERES UN CLIENTE MAYORISTA!
        </div>

        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar compartido */}
            <AccountSidebar />

            {/* Contenido principal */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl min-h-[600px]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Métodos de pago</h2>
                  <Button
                    onClick={() => router.push("/payment/add-card")}
                    className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Nuevo método de pago
                  </Button>
                </div>

                {paymentMethods.length > 0 ? (
                  <div className="slide-container">
                    <div className="slide-content">
                      <Swiper
                        slidesPerView={3}
                        spaceBetween={25}
                        loop={true}
                        pagination={{
                          clickable: true,
                          dynamicBullets: true,
                        }}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        breakpoints={{
                          0: {
                            slidesPerView: 1,
                          },
                          520: {
                            slidesPerView: 2,
                          },
                          950: {
                            slidesPerView: 3,
                          },
                        }}
                        className="mySwiper"
                      >
                        {paymentMethods.map((method) => (
                          <SwiperSlide key={method.id}>
                            <div className="payment-card relative">
                              {method.isDefault ? (
                                <div className="absolute top-2 right-2 z-10 bg-green-500 text-white rounded-full p-1 shadow-md">
                                  <Check className="h-3 w-3" />
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => setDefaultCard(method.id, e)}
                                  className="absolute top-2 right-2 z-10 bg-white text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 shadow-sm scale-75"
                                >
                                  Predeterminado
                                </Button>
                              )}

                              <div className="image-content">
                                <span className="card-overlay">
                                  {method.type === "card" ? (
                                    <div className="credit-card-container">
                                      <div className="credit-card">
                                        <div
                                          className="credit-card-front"
                                          style={{ background: getCardBackground(method.id, method.type) }}
                                        >
                                          <div className="polygon-bg">
                                            <div className="polygon-1"></div>
                                            <div className="polygon-2"></div>
                                            <div className="polygon-3"></div>
                                          </div>

                                          <div className="bank-name">
                                            {method.brand === "visa"
                                              ? "VISA BANK"
                                              : method.brand === "mastercard"
                                                ? "MASTER BANK"
                                                : "BANK NAME"}
                                          </div>

                                          <div className="world-map"></div>

                                          <div className="card-chip">
                                            <div className="chip-line"></div>
                                            <div className="chip-line"></div>
                                            <div className="chip-line"></div>
                                            <div className="chip-line"></div>
                                          </div>

                                          <div className="card-number">•••• •••• •••• {method.last4}</div>

                                          <div className="card-details">
                                            <div>
                                              <div className="card-holder">
                                                {method.cardholderName || "TITULAR DE LA TARJETA"}
                                              </div>
                                            </div>
                                            <div>
                                              <div className="expiry-label">EXPIRES END</div>
                                              <div className="card-expiry">{method.expiry || "MM/YY"}</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      className="bank-card"
                                      style={{ background: getCardBackground(method.id, method.type) }}
                                    >
                                      <div className="polygon-bg">
                                        <div className="polygon-1"></div>
                                        <div className="polygon-2"></div>
                                        <div className="polygon-3"></div>
                                      </div>

                                      <div className="bank-name">{method.name.toUpperCase()}</div>

                                      <div className="world-map"></div>

                                      <div className="card-chip">
                                        <div className="chip-line"></div>
                                        <div className="chip-line"></div>
                                        <div className="chip-line"></div>
                                        <div className="chip-line"></div>
                                      </div>

                                      <div className="card-number">•••• •••• •••• {method.last4}</div>

                                      <div className="card-details">
                                        <div className="card-holder">CUENTA ASOCIADA</div>
                                        <div>
                                          <div className="expiry-label">ACTIVA</div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </span>
                              </div>

                              <div className="card-content">
                                <div className="flex gap-2 mt-4">
                                  <button className="payment-button" onClick={() => handleEditMethod(method)}>
                                    <Edit size={16} className="mr-2" /> Editar
                                  </button>
                                  <button
                                    className="payment-button bg-red-500 hover:bg-red-600"
                                    onClick={() => setDeleteConfirmation(method.id)}
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes métodos de pago</h3>
                    <p className="text-gray-500 mb-4">Añade un método de pago para realizar compras más rápido.</p>
                    <Button onClick={() => router.push("/payment/add-card")} className="bg-blue-600 hover:bg-blue-700">
                      <PlusCircle className="mr-2 h-4 w-4" /> Añadir método de pago
                    </Button>
                  </div>
                )}

                <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">Información importante</h3>
                  <p className="text-sm text-blue-700">
                    Tus datos de pago están seguros y encriptados. Nunca compartimos tu información financiera con
                    terceros.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación para eliminar método de pago */}
      <Dialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este método de pago? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Si eliminas este método de pago, ya no podrás utilizarlo para realizar compras en nuestra plataforma.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmation && handleRemoveMethod(deleteConfirmation)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar método de pago */}
      <Dialog open={!!editingMethod} onOpenChange={(open) => !open && setEditingMethod(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-500" />
              Editar método de pago
            </DialogTitle>
            <DialogDescription>
              Actualiza los datos de tu {editingMethod?.type === "card" ? "tarjeta" : "cuenta bancaria"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {editingMethod?.type === "card" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cardholder-name" className="text-right">
                    Titular
                  </Label>
                  <Input
                    id="cardholder-name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="col-span-3"
                    placeholder="Nombre del titular"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiry" className="text-right">
                    Vencimiento
                  </Label>
                  <Input
                    id="expiry"
                    value={editedExpiry}
                    onChange={(e) => setEditedExpiry(e.target.value)}
                    className="col-span-3"
                    placeholder="MM/YY"
                  />
                </div>
              </>
            )}

            {editingMethod?.type === "bank" && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  Para modificar los datos de tu cuenta bancaria, por favor contacta con nuestro servicio de atención al
                  cliente.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMethod(null)}>
              Cancelar
            </Button>
            <Button onClick={saveEditedMethod}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scripts para Swiper */}
      <Script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js" strategy="afterInteractive" />
    </>
  )
}
