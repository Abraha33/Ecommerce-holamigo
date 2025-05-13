"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
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
  ChevronDown,
  ShoppingCart,
  Search,
  Heart,
  X,
  Info,
  Trash2,
  Minus,
  Plus,
  Home,
  ShoppingBag,
  LayoutGrid,
  Tag,
  Package,
  MessageSquare,
} from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { useWishlist } from "@/components/wishlist-provider"
import { DeliveryOptionsModal } from "@/components/delivery-options-modal"
// 1. Importar el contexto de entrega
import { useDelivery } from "@/contexts/delivery-context"
import type { DeliveryInfo } from "@/types"

// Add this type at the top of the file, after other imports
type Address = {
  id: string
  name: string
  address: string
  city: string
  isDefault: boolean
}

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
  const router = useRouter()
  const { items: cart, removeItem, updateQuantity, subtotal } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  // 2. Usar el contexto de entrega en el componente
  // Agregar esta línea después de las declaraciones de estado existentes
  const { deliveryInfo = { type: "sprint" }, openDeliveryModal } = useDelivery()

  // Update the useState for localDeliveryInfo to include selectedAddress
  const [localDeliveryInfo, setLocalDeliveryInfo] = useState<DeliveryInfo & { selectedAddress?: Address }>({
    type: "sprint",
  })

  // Modificar la línea que calcula cartItemsCount para contar productos diferentes, no cantidades
  // Cambiar:
  // const cartItemsCount = cart ? cart.reduce((count, item) => count + item.quantity, 0) : 0

  // Por:
  const cartItemsCount = cart ? cart.length : 0
  const totalProductCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0
  const { wishlistCount } = useWishlist()

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

  // Add this useEffect after other useEffect hooks
  useEffect(() => {
    if (deliveryInfo) {
      setLocalDeliveryInfo(deliveryInfo)
    }

    // Listen for delivery updates
    const handleDeliveryUpdate = (e: CustomEvent) => {
      if (e.detail) {
        setLocalDeliveryInfo(e.detail)
      }
    }

    window.addEventListener("delivery-update" as any, handleDeliveryUpdate)

    return () => {
      window.removeEventListener("delivery-update" as any, handleDeliveryUpdate)
    }
  }, [deliveryInfo])

  // Añade este useEffect después de otros useEffect hooks
  useEffect(() => {
    if (localDeliveryInfo.selectedAddress?.address) {
      // Guardar la dirección seleccionada en localStorage para que esté disponible en otras partes
      localStorage.setItem("deliveryAddress", localDeliveryInfo.selectedAddress.address)
    }
  }, [localDeliveryInfo.selectedAddress])

  // Determinar qué logo mostrar basado en el tema
  const logoSrc = mounted && theme === "dark" ? "/envaxlogo-gold.png" : "/envaxlogo.png"

  // Función para alternar la visibilidad de la búsqueda
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  // Función para alternar el carrito
  const toggleCart = () => {
    setCartOpen(!cartOpen)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Main header - Estilo Éxito */}
      <div className="bg-[#20509E] dark:bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-14">
            {/* Logo y Menú - Solo visible cuando la búsqueda está cerrada */}
            {!isSearchOpen && (
              <div className="flex items-center">
                {/* Botón de menú móvil */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white mr-2 md:mr-4 group">
                      <Menu className="h-6 w-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-110" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="dark:bg-gray-900 dark:text-white p-0 w-[300px] overflow-hidden flex flex-col"
                  >
                    {/* Encabezado mejorado */}
                    <div className="bg-[#20509E] dark:bg-gray-800 text-white p-4 flex-shrink-0">
                      <div className="relative h-12 w-full mb-4">
                        <Image src={logoSrc || "/placeholder.svg"} alt="Envax Logo" fill className="object-contain" />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <User className="h-5 w-5" />
                        <span className="font-medium">¡Hola! Bienvenido</span>
                      </div>
                    </div>

                    {/* Barra de búsqueda */}
                    <div className="p-4 flex-shrink-0">
                      <SearchBar placeholder="¿Qué estás buscando?" />
                    </div>

                    {/* Contenedor con scroll */}
                    <div className="flex-1 overflow-y-auto">
                      {/* Navegación mejorada con iconos */}
                      <div className="px-2 py-4">
                        <h3 className="px-2 mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Navegación</h3>
                        <nav className="flex flex-col gap-1">
                          <Link
                            href="/"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                              pathname === "/"
                                ? "bg-[#f2f2f2] text-[#20509E] dark:bg-gray-800 dark:text-white font-medium"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            <Home className="h-5 w-5" />
                            <span>Inicio</span>
                          </Link>
                          <Link
                            href="/shop"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                              pathname === "/shop"
                                ? "bg-[#f2f2f2] text-[#20509E] dark:bg-gray-800 dark:text-white font-medium"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            <ShoppingBag className="h-5 w-5" />
                            <span>Tienda</span>
                          </Link>
                          <Link
                            href="/categories"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                              pathname === "/categories"
                                ? "bg-[#f2f2f2] text-[#20509E] dark:bg-gray-800 dark:text-white font-medium"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            <LayoutGrid className="h-5 w-5" />
                            <span>Categorías</span>
                          </Link>
                          <Link
                            href="/promos"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                              pathname === "/promos"
                                ? "bg-[#f2f2f2] text-[#20509E] dark:bg-gray-800 dark:text-white font-medium"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            <Tag className="h-5 w-5" />
                            <span>Promos</span>
                          </Link>
                          <Link
                            href="/orders"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                              pathname === "/orders"
                                ? "bg-[#f2f2f2] text-[#20509E] dark:bg-gray-800 dark:text-white font-medium"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            <Package className="h-5 w-5" />
                            <span>Mi pedido</span>
                          </Link>
                          <Link
                            href="/about"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                              pathname === "/about"
                                ? "bg-[#f2f2f2] text-[#20509E] dark:bg-gray-800 dark:text-white font-medium"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            <Info className="h-5 w-5" />
                            <span>Nosotros</span>
                          </Link>
                          <Link
                            href="/contact"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                              pathname === "/contact"
                                ? "bg-[#f2f2f2] text-[#20509E] dark:bg-gray-800 dark:text-white font-medium"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            <MessageSquare className="h-5 w-5" />
                            <span>Contacto</span>
                          </Link>
                        </nav>
                      </div>

                      {/* Mi cuenta - sección */}
                      <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="px-2 mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Mi cuenta</h3>
                        <nav className="flex flex-col gap-1">
                          <Link
                            href="/account"
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <User className="h-5 w-5" />
                            <span>Perfil</span>
                          </Link>
                          <Link
                            href="/wishlists"
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Heart className="h-5 w-5" />
                            <span>Mis listas</span>
                          </Link>
                          <Link
                            href="/notifications"
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Bell className="h-5 w-5" />
                            <span>Notificaciones</span>
                            <span className="ml-auto bg-[#ffff1a] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              3
                            </span>
                          </Link>
                        </nav>
                      </div>

                      {/* Contenido adicional para demostrar scroll */}
                      <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="px-2 mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Categorías populares
                        </h3>
                        <nav className="flex flex-col gap-1">
                          <Link
                            href="/categories/lacteos"
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <span>Lácteos</span>
                          </Link>
                          <Link
                            href="/categories/frutas-verduras"
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <span>Frutas y verduras</span>
                          </Link>
                          <Link
                            href="/categories/carnes"
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <span>Carnes</span>
                          </Link>
                          <Link
                            href="/categories/bebidas"
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <span>Bebidas</span>
                          </Link>
                          <Link
                            href="/categories/licores"
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <span>Licores</span>
                          </Link>
                        </nav>
                      </div>
                    </div>

                    {/* Contacto - footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                      <div className="flex flex-col gap-3 text-sm">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-[#20509E] dark:text-gray-400" />
                          <span>+57 (601) 745-7000</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-[#20509E] dark:text-gray-400" />
                          <span>ventas@envax.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-[#20509E] dark:text-gray-400" />
                          <span>Calle 12 # 68-55, Bogotá</span>
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
            )}

            {/* Barra de búsqueda expandida para móvil cuando está abierta */}
            {isSearchOpen && (
              <div className="flex-1 md:hidden">
                <SearchBar placeholder="Buscar en envax.com" darkMode={true} />
              </div>
            )}

            {/* Barra de búsqueda para escritorio - siempre visible en escritorio */}
            <div className="flex-1 max-w-4xl mx-4 hidden md:block">
              <SearchBar placeholder="Buscar en envax.com" darkMode={true} />
            </div>

            {/* Iconos de usuario - estilo Éxito */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Icono de búsqueda para móvil - ahora junto a los demás iconos */}
              <Button variant="ghost" size="icon" className="text-white md:hidden" onClick={toggleSearch}>
                <Search className="h-6 w-6" />
              </Button>

              {/* Ubicación - estilo Éxito con Modal */}
              {/* 3. Modificar el botón de ubicación para mostrar la información correcta */}
              {/* Reemplazar el botón de ubicación existente con este */}
              <button
                onClick={() => {
                  // Always use the local state to open the modal directly
                  setIsDeliveryModalOpen(true)
                }}
                className="hidden lg:flex items-center mr-2 text-sm cursor-pointer hover:text-gray-200"
                aria-label="Cambiar ubicación de entrega"
              >
                <MapPin className="h-5 w-5 mr-1" />
                <div className="flex flex-col">
                  <span className="text-xs">Entrega en:</span>
                  <span className="font-medium">
                    {localDeliveryInfo.type === "tienda"
                      ? localDeliveryInfo.storeAddress || "Calle 31#15-09, Centro"
                      : localDeliveryInfo.selectedAddress?.address || "Calle 123 #45-67, Bucaramanga"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>

              {/* Iconos reorganizados: cuenta (extremo derecho), notificaciones, carrito */}
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

              <Link href="/wishlists" className="flex flex-col items-center">
                <div className="relative">
                  <Heart className="h-6 w-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#ffff1a] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-xs hidden md:block">Mis listas</span>
              </Link>

              {/* Botón del carrito */}
              <button onClick={toggleCart} className="flex flex-col items-center">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#ffff1a] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                <span className="text-xs hidden md:block">Carrito</span>
              </button>
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

      {/* Modal de opciones de entrega */}
      <DeliveryOptionsModal isOpen={isDeliveryModalOpen} onClose={() => setIsDeliveryModalOpen(false)} />

      {/* Carrito lateral */}
      {cartOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setCartOpen(false)} />

          {/* Sidebar del carrito */}
          <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col">
            {/* Encabezado */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">Agregados al carrito</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Cerrar carrito"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mensaje informativo */}
            {cart?.length > 0 && (
              <div className="bg-[#FFFF1A] p-3 mx-4 my-3 rounded-md flex items-start">
                <Info className="h-5 w-5 text-gray-800 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-800">
                  Los descuentos serán visualizados al seleccionar el método de pago
                </p>
              </div>
            )}

            {/* Contenido del carrito */}
            <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-180px)]">
              {cart?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
                  <Button asChild className="bg-[#004a93] hover:bg-[#0071bc]" onClick={() => setCartOpen(false)}>
                    <Link href="/shop">Ver Tienda</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.variant}`} className="flex border-b pb-4">
                      {/* Imagen del producto */}
                      <div className="relative h-20 w-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                      </div>

                      {/* Información del producto */}
                      <div className="ml-3 flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                        <p className="text-xs text-gray-500 uppercase">{item.brand}</p>
                        <div className="mt-1">
                          <span className="font-bold text-base">{formatCurrency(item.price)}</span>
                        </div>
                      </div>

                      {/* Controles de cantidad */}
                      <div className="flex flex-col items-end justify-between ml-2">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-[#e30613] p-1"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="flex items-center border rounded-md bg-gray-50">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded-l-md"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                          <span className="text-xs text-gray-500 mr-1">und.</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded-r-md"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer con subtotal y botones */}
            {cart?.length > 0 && (
              <div className="border-t p-4 bg-white">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-lg">Subtotal:</span>
                  <span className="font-bold text-xl">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                  <span>Productos en carrito:</span>
                  <span className="font-medium">{totalProductCount} unidades</span>
                </div>

                <Button
                  className="w-full mb-2 bg-[#F47B20] hover:bg-[#e06a10] text-white font-medium py-3 h-auto"
                  onClick={() => {
                    setCartOpen(false)
                    router.push("/checkout")
                  }}
                >
                  Ver carrito / Ir a pagar
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-[#004a93] text-[#004a93] font-medium"
                  onClick={() => {
                    setCartOpen(false)
                    router.push("/shop")
                  }}
                >
                  Seguir comprando
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  )
}
