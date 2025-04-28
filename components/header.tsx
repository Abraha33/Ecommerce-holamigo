"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/components/cart-provider"
import { useTheme } from "next-themes"
import {
  Menu,
  Phone,
  Mail,
  User,
  MapPin,
  Bell,
  Printer,
  ChevronDown,
  Home,
  Truck,
  Clock,
  ShoppingCart,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SearchBar } from "@/components/search-bar"

// Actualizar el array de navegación para incluir el enlace a Promos
const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Nosotros", href: "/about" },
  { name: "Tienda", href: "/shop" },
  { name: "Promos", href: "/promos" },
  { name: "Categorías", href: "/categories" },
  { name: "Contacto", href: "/contact" },
  { name: "Mi pedido", href: "/orders" },
]

export default function Header() {
  const pathname = usePathname()
  const { cart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [deliveryOption, setDeliveryOption] = useState("delivery")

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0)

  // Asegurarse de que el componente está montado para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Determinar qué logo mostrar basado en el tema
  const logoSrc = mounted && theme === "dark" ? "/envaxlogo-gold.png" : "/envaxlogo.png"

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Main header - Estilo Éxito */}
      <div className="bg-[#20509E] dark:bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-14">
            {/* Logo y Menú */}
            <div className="flex items-center">
              {/* Botón de menú móvil */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white mr-2 md:mr-4 group">
                    <Menu className="h-6 w-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-110" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="dark:bg-gray-900 dark:text-white">
                  <div className="flex flex-col gap-6 mt-6">
                    <div className="relative h-10 w-40 mx-auto">
                      <Image src={logoSrc || "/placeholder.svg"} alt="Envax Logo" fill className="object-contain" />
                    </div>

                    <SearchBar placeholder="¿Qué estás buscando?" />

                    <nav className="flex flex-col gap-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`px-2 py-2 rounded-md ${
                            pathname === item.href
                              ? "bg-[#f2f2f2] text-[#20509E] dark:bg-gray-800 dark:text-white font-medium"
                              : "hover:bg-[#184589] dark:hover:bg-gray-800"
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-[#184589] dark:border-gray-700">
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>+57 (601) 745-7000</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>ventas@envax.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Calle 12 # 68-55, Bogotá</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link href="/" className="flex items-center mr-6">
                <div className="relative h-8 w-8 mr-2">
                  <Image src={logoSrc || "/placeholder.svg"} alt="Envax Logo" fill className="object-contain" />
                </div>
                <span className="text-xl font-bold">Envax</span>
              </Link>
            </div>

            {/* Barra de búsqueda mejorada */}
            <div className="flex-1 max-w-4xl mx-4">
              <SearchBar placeholder="Buscar en envax.com" darkMode={true} />
            </div>

            {/* Iconos de usuario - estilo Éxito */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Ubicación - estilo Éxito con Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="hidden lg:flex items-center mr-2 text-sm cursor-pointer hover:text-gray-200">
                    <MapPin className="h-5 w-5 mr-1" />
                    <div className="flex flex-col">
                      <span className="text-xs">¿Cómo quieres</span>
                      <span className="font-medium">recibir tu pedido?</span>
                    </div>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <div className="p-4 border-b">
                    <h3 className="font-medium text-lg">Elige cómo recibir tu pedido</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div
                      className={`flex items-center gap-3 p-3 rounded-md cursor-pointer border ${deliveryOption === "delivery" ? "border-[#20509E] bg-blue-50" : "border-gray-200"}`}
                      onClick={() => setDeliveryOption("delivery")}
                    >
                      <div className="bg-[#20509E] text-white p-2 rounded-full">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Entrega a domicilio</h4>
                        <p className="text-sm text-gray-500">Recibe tu pedido en la comodidad de tu hogar</p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-3 rounded-md cursor-pointer border ${deliveryOption === "pickup" ? "border-[#20509E] bg-blue-50" : "border-gray-200"}`}
                      onClick={() => setDeliveryOption("pickup")}
                    >
                      <div className="bg-[#20509E] text-white p-2 rounded-full">
                        <Home className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Recoge en tienda</h4>
                        <p className="text-sm text-gray-500">Recoge tu pedido en nuestra tienda más cercana</p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-3 rounded-md cursor-pointer border ${deliveryOption === "express" ? "border-[#20509E] bg-blue-50" : "border-gray-200"}`}
                      onClick={() => setDeliveryOption("express")}
                    >
                      <div className="bg-[#20509E] text-white p-2 rounded-full">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Entrega express</h4>
                        <p className="text-sm text-gray-500">Recibe tu pedido en menos de 2 horas</p>
                      </div>
                    </div>

                    <Button className="w-full bg-[#20509E]">Confirmar</Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Iconos reorganizados: cuenta (extremo derecho), notificaciones, carrito, PrintFlow Manager */}
              <Link href="/account" className="flex flex-col items-center">
                <User className="h-6 w-6" />
                <span className="text-xs hidden md:block">Mi cuenta</span>
              </Link>

              <Link href="/notifications" className="flex flex-col items-center">
                <div className="relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-[#ffff1a] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </div>
                <span className="text-xs hidden md:block">Notificaciones</span>
              </Link>

              <Link href="/cart" className="flex flex-col items-center">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#ffff1a] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                <span className="text-xs hidden md:block">Carrito</span>
              </Link>

              {/* Icono de PrintFlow Manager */}
              <Link href="/dashboard" className="flex flex-col items-center">
                <div className="relative">
                  <Printer className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-[#ffff1a] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    5
                  </span>
                </div>
                <span className="text-xs hidden md:block">PrintFlow Manager</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación - Categorías */}
      <div className="bg-white dark:bg-gray-800 text-gray-800 hidden md:block shadow-sm">
        <div className="container mx-auto px-4 pr-72">
          <nav className="flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white ${
                  pathname === item.href ? "bg-gray-200 text-gray-900 dark:bg-gray-700" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
