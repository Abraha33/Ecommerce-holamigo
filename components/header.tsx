"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useTheme } from "next-themes"
import {
  User,
  ChevronDown,
  ShoppingCart,
  Search,
  Heart,
  X,
  Info,
  Trash2,
  Minus,
  Plus,
  Phone,
  Settings,
  Wrench,
  Menu,
  Bell,
} from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { useWishlist } from "@/components/wishlist-provider"
import { DeliveryOptionsModal } from "@/components/delivery-options-modal"
import { useDelivery } from "@/contexts/delivery-context"
import type { DeliveryInfo } from "@/types"
import { useAuth } from "@/components/auth-provider"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { MainNavigation } from "@/components/main-navigation"
import { CategorySidebar } from "@/components/category-sidebar"

// Add this type at the top of the file, after other imports
type Address = {
  id: string
  name: string
  address: string
  city: string
  isDefault: boolean
}

// Sample categories data - replace with actual data from your API
const categoriesData = [
  { name: "Insuperables", slug: "insuperables", icon: null },
  { name: "Oferta Estrella", slug: "oferta-estrella", icon: null },
  { name: "Lácteos", slug: "lacteos", icon: null },
  { name: "Aseo", slug: "aseo", icon: null },
  { name: "Licores", slug: "licores", icon: null },
  { name: "Cosméticos", slug: "cosmeticos", icon: null },
  { name: "Bebidas", slug: "bebidas", icon: null },
  { name: "Frutas y Verduras", slug: "frutas-verduras", icon: null },
  { name: "Carnes", slug: "carnes", icon: null },
  { name: "Delicatessen", slug: "delicatessen", icon: null },
  { name: "Snacks", slug: "snacks", icon: null },
  { name: "Bebidas Hidratantes", slug: "bebidas-hidratantes", icon: null },
]

// Subcategorías para cada categoría
const subcategoriesData: Record<string, { name: string; slug: string }[]> = {
  insuperables: [
    { name: "Ofertas Semanales", slug: "ofertas-semanales" },
    { name: "Liquidación", slug: "liquidacion" },
    { name: "Ofertas del Día", slug: "ofertas-del-dia" },
    { name: "Últimas Unidades", slug: "ultimas-unidades" },
  ],
  lacteos: [
    { name: "Leche", slug: "leche" },
    { name: "Yogurt", slug: "yogurt" },
    { name: "Quesos", slug: "quesos" },
  ],
  aseo: [
    { name: "Limpieza del Hogar", slug: "limpieza-hogar" },
    { name: "Cuidado Personal", slug: "cuidado-personal" },
  ],
  licores: [
    { name: "Vinos", slug: "vinos" },
    { name: "Cervezas", slug: "cervezas" },
    { name: "Destilados", slug: "destilados" },
  ],
  // Añadir más subcategorías según sea necesario
}

// Actualizar el array de navegación para incluir el enlace a Promos
const navigation = [
  { name: "Inicio", href: "/inicio", icon: <Menu className="w-5 h-5" /> },
  // { name: "Nosotros", href: "/about", icon: <FileText className="w-5 h-5" /> },
  { name: "Tienda", href: "/shop", icon: <ShoppingCart className="w-5 h-5" /> },
  { name: "Promos", href: "/promos", icon: <Settings className="w-5 h-5" /> },
  { name: "Categorías", href: "/categories", icon: <Menu className="w-5 h-5" /> },
  { name: "Contacto", href: "/contact", icon: <Phone className="w-5 h-5" /> },
  { name: "Mi pedido", href: "/orders", icon: <Wrench className="w-5 h-5" /> },
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
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const categoryMenuRef = useRef<HTMLDivElement>(null)
  const { deliveryInfo = { type: "sprint" }, openDeliveryModal } = useDelivery()
  const { user } = useAuth()
  const [persistentUsername, setPersistentUsername] = useState<string>("")
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [flashMessage, setFlashMessage] = useState(
    '⚡ FLASH SALE: 40% DESCUENTO EN PRODUCTOS SELECCIONADOS | USA CÓDIGO "FLASH40"',
  )

  // Número de teléfono para WhatsApp
  const phoneNumber = "+573192102438"
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, "")}`

  // Nuevo estado para el diálogo de edición de nombre
  const [isEditNameDialogOpen, setIsEditNameDialogOpen] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState("")

  // Update the useState for localDeliveryInfo to include selectedAddress
  const [localDeliveryInfo, setLocalDeliveryInfo] = useState<DeliveryInfo & { selectedAddress?: Address }>({
    type: "sprint",
  })

  const cartItemsCount = cart ? cart.length : 0
  const totalProductCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0
  const { wishlistCount } = useWishlist()

  // Función para extraer solo la dirección principal (sin la ciudad o detalles después de la coma)
  const getMainAddress = (fullAddress: string) => {
    return fullAddress.split(",")[0].trim()
  }

  // Asegurarse de que el componente está montado para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Rotación de mensajes flash
  useEffect(() => {
    const messages = [
      '⚡ FLASH SALE: 40% DESCUENTO EN PRODUCTOS SELECCIONADOS | USA CÓDIGO "FLASH40"',
      "🚚 ENVÍO GRATIS en pedidos superiores a $50.000",
      "🎁 COMPRA HOY y recibe un regalo sorpresa con tu pedido",
    ]

    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % messages.length
      setFlashMessage(messages[index])
    }, 5000)

    return () => clearInterval(interval)
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

  useEffect(() => {
    // Función para actualizar el nombre de usuario en el estado y localStorage
    const updateUsername = async () => {
      if (user) {
        try {
          // Primero, intentar obtener el perfil del usuario desde la base de datos
          const { data: userProfile, error } = await supabase
            .from("user_profiles")
            .select("full_name")
            .eq("id", user.id)
            .single()

          // Si hay un perfil y tiene un nombre, usarlo
          if (userProfile && userProfile.full_name) {
            setPersistentUsername(userProfile.full_name.split(" ")[0]) // Solo el primer nombre
            localStorage.setItem("username", userProfile.full_name.split(" ")[0])
            return
          }

          // Si no hay perfil o no tiene nombre, usar los metadatos o el email
          const displayName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.user_metadata?.preferred_username ||
            user.email?.split("@")[0] ||
            "Usuario"

          // Extraer solo el primer nombre
          const firstName = displayName.split(" ")[0]

          // Guardar en localStorage y actualizar el estado
          localStorage.setItem("username", firstName)
          setPersistentUsername(firstName)

          // Si no hay perfil, intentar crearlo
          if (error && error.code === "PGRST116") {
            await supabase.from("user_profiles").upsert({
              id: user.id,
              email: user.email,
              full_name: displayName,
              updated_at: new Date().toISOString(),
              last_sign_in_at: new Date().toISOString(),
            })
          }

          console.log("Nombre de usuario actualizado:", firstName)
        } catch (error) {
          console.error("Error al obtener/actualizar el nombre de usuario:", error)

          // Fallback a localStorage si hay un error
          const savedUsername = localStorage.getItem("username")
          if (savedUsername) {
            setPersistentUsername(savedUsername)
          } else {
            // Último recurso: usar el email o un valor predeterminado
            const fallbackName = user.email?.split("@")[0] || "Usuario"
            localStorage.setItem("username", fallbackName)
            setPersistentUsername(fallbackName)
          }
        }
      } else {
        // Si no hay usuario, intentar recuperar de localStorage
        const savedUsername = localStorage.getItem("username")
        if (savedUsername) {
          setPersistentUsername(savedUsername)
        }
      }
    }

    // Ejecutar al montar el componente y cuando cambie el usuario
    updateUsername()

    // Configurar un listener para cambios en el usuario
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event)
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        updateUsername()
      } else if (event === "SIGNED_OUT") {
        localStorage.removeItem("username")
        setPersistentUsername("")
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [user, supabase])

  // Cerrar el menú de categorías cuando se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false)
        setSelectedCategory(null)
      }
    }

    // Solo añadir el listener si el menú está abierto
    if (isCategoryMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isCategoryMenuOpen, categoryMenuRef])

  // Función para manejar el cambio de nombre de usuario
  const handleDisplayNameChange = async () => {
    if (!newDisplayName.trim()) {
      toast({
        title: "Error",
        description: "El nombre no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    try {
      // Actualizar el nombre en la base de datos
      const { error } = await supabase
        .from("user_profiles")
        .update({ full_name: newDisplayName.trim(), updated_at: new Date().toISOString() })
        .eq("id", user?.id)

      if (error) {
        throw error
      }

      // Actualizar el nombre en los metadatos del usuario
      await supabase.auth.updateUser({
        data: { full_name: newDisplayName.trim() },
      })

      // Actualizar el estado y localStorage
      const firstName = newDisplayName.trim().split(" ")[0]
      setPersistentUsername(firstName)
      localStorage.setItem("username", firstName)

      toast({
        title: "Nombre actualizado",
        description: "Tu nombre de usuario ha sido actualizado correctamente",
      })

      setIsEditNameDialogOpen(false)
    } catch (error) {
      console.error("Error al actualizar el nombre:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el nombre de usuario",
        variant: "destructive",
      })
    }
  }

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

  // Función para alternar el menú de categorías
  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen)
    setSelectedCategory(null)
  }

  // Función para manejar el hover en una categoría
  const handleCategoryHover = (slug: string) => {
    setSelectedCategory(slug)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <header
      className={`md:fixed relative top-0 z-40 w-full bg-white transition-all duration-300 ease-in-out ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      {/* Barra superior - estilo Druco */}
      <div className={`bg-[#1e3a8a] text-white ${isScrolled ? "py-1" : "py-2"} px-4 transition-all duration-300`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="hidden md:flex space-x-6">
            <Link href="/help" className="text-sm hover:text-gray-300 transition-colors">
              Ayuda
            </Link>
            {/* <Link href="/about" className="text-sm hover:text-gray-300 transition-colors">
              Nosotros
            </Link> */}
            <Link href="/contact" className="text-sm hover:text-gray-300 transition-colors">
              Contacto
            </Link>
            <Link href="/blog" className="text-sm hover:text-gray-300 transition-colors">
              Blog
            </Link>
          </div>

          <div className="flex-1 text-center overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-sm font-medium">{flashMessage}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm mr-2">Español</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-2">COP</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Barra principal - estilo mejorado */}
      <div className={`bg-white border-b ${isScrolled ? "shadow-sm" : ""} transition-all duration-300`}>
        {/* Barra de información de entrega */}
        <div className="bg-gray-100 py-2 border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsDeliveryModalOpen(true)}
                className="flex items-center text-sm text-gray-700 hover:text-[#1e3a8a]"
              >
                <span className="font-medium mr-2">ENTREGA EN:</span>
                <span className="text-[#1e3a8a]">
                  {localDeliveryInfo.selectedAddress?.address
                    ? getMainAddress(localDeliveryInfo.selectedAddress.address)
                    : "Seleccionar dirección"}
                </span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>

              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm">
                  <span className="text-gray-700">Tipo de entrega:</span>
                  <span className="ml-1 font-medium text-[#1e3a8a]">
                    {localDeliveryInfo.type === "sprint" ? "Express" : "Programada"}
                  </span>
                </div>

                {localDeliveryInfo.scheduledDate && (
                  <div className="flex items-center text-sm">
                    <span className="text-gray-700">Fecha:</span>
                    <span className="ml-1 font-medium text-[#1e3a8a]">
                      {new Date(localDeliveryInfo.scheduledDate).toLocaleDateString("es-CO")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`container mx-auto px-4`}>
          <div
            className={`flex items-center justify-between md:justify-start ${isScrolled ? "h-16" : "h-20"} py-4 transition-all duration-300`}
          >
            {/* Hamburger menu for categories sidebar - Solo visible en desktop */}
            <div className="hidden md:flex items-center">
              <CategorySidebar className="text-base" />
            </div>

            {/* Logo - Centrado en móviles */}
            <Link
              href="/inicio"
              className="flex items-center mr-6 md:mr-6 absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none"
            >
              <div className="relative h-12 w-12 mr-2">
                <Image src={logoSrc || "/placeholder.svg"} alt="Envax Logo" fill className="object-contain" />
              </div>
              <span className="text-2xl font-bold">Envax</span>
            </Link>

            {/* Selector de categorías y barra de búsqueda - DISEÑO MEJORADO */}
            <div className="hidden md:flex h-12 items-stretch mr-4 rounded-md flex-1 max-w-2xl shadow-sm overflow-hidden border border-gray-200">
              {/* Selector de categorías con fondo azul */}
              <div className="relative group h-full" ref={categoryMenuRef}>
                <button
                  onClick={toggleCategoryMenu}
                  className="flex items-center h-full px-4 py-2 bg-[#1e3a8a] text-white rounded-l-md"
                  aria-haspopup="true"
                  aria-expanded={isCategoryMenuOpen}
                >
                  <span className="text-sm font-medium whitespace-nowrap">Categorías</span>
                  <ChevronDown className="h-4 w-4 ml-2 opacity-80" />
                </button>

                {/* Menú desplegable de categorías con subcategorías */}
                {isCategoryMenuOpen && (
                  <div className="absolute left-0 mt-1 w-[600px] bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 flex">
                    {/* Columna de categorías */}
                    <div className="w-1/3 border-r border-gray-200">
                      {categoriesData.map((category, index) => (
                        <div
                          key={index}
                          className={`block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                            selectedCategory === category.slug ? "bg-gray-100 text-blue-600" : "text-gray-700"
                          }`}
                          onMouseEnter={() => handleCategoryHover(category.slug)}
                          onClick={() => {
                            router.push(`/categories/${category.slug}`)
                            setIsCategoryMenuOpen(false)
                            setSelectedCategory(null)
                          }}
                        >
                          {category.name}
                        </div>
                      ))}
                    </div>

                    {/* Columna de subcategorías */}
                    <div className="w-2/3 p-2">
                      {selectedCategory && subcategoriesData[selectedCategory] ? (
                        <div>
                          <h3 className="font-medium text-sm text-gray-900 mb-2 px-2">
                            Subcategorías de {categoriesData.find((c) => c.slug === selectedCategory)?.name}
                          </h3>
                          <div className="grid grid-cols-2 gap-1">
                            {subcategoriesData[selectedCategory].map((subcat, idx) => (
                              <Link
                                key={idx}
                                href={`/categories/${selectedCategory}/${subcat.slug}`}
                                className="px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
                                onClick={() => {
                                  setIsCategoryMenuOpen(false)
                                  setSelectedCategory(null)
                                }}
                              >
                                {subcat.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm text-gray-500">
                          Selecciona una categoría para ver sus subcategorías
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Barra de búsqueda con fondo blanco y texto negro */}
              <div className="flex-1 flex items-center h-full border-l border-gray-200">
                <div className="w-full px-4 py-2">
                  <SearchBar placeholder="¿Qué estás buscando hoy?" darkMode={false} />
                </div>
              </div>

              <Button className="h-full rounded-l-none bg-[#ffc107] hover:bg-[#e0a800] text-black px-4">
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Información de contacto */}
            <div className="hidden lg:flex items-center ml-auto mr-8">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-blue-700 transition-colors"
              >
                <Phone className="h-10 w-10 p-2 bg-[#f8f9fa] rounded-full text-[#1e3a8a] mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Llámanos al</p>
                  <p className="font-bold text-lg">{phoneNumber}</p>
                </div>
              </a>
            </div>

            {/* Iconos de usuario */}
            <div className="flex items-center gap-6 ml-auto">
              {/* Hamburger menu para móviles */}
              <div className="md:hidden">
                <CategorySidebar className="text-2xl" />
              </div>
              {/* En móviles, solo mostrar wishlist y carrito */}
              <div className="md:flex items-center gap-6 hidden">
                {/* Notifications icon */}
                <Link href="/account/notifications" className="flex flex-col items-center">
                  <div className="relative">
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-[#1e3a8a] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  </div>
                  <span className="text-xs mt-1 hidden md:block">Alertas</span>
                </Link>
                {/* Cuenta de usuario */}
                <div className="relative group">
                  <Link href={user ? "/account" : "/login"} className="flex flex-col items-center">
                    <User className="h-6 w-6" />
                    <span className="text-xs mt-1 hidden md:block">
                      {persistentUsername ? persistentUsername : user ? "Mi perfil" : "Mi cuenta"}
                    </span>
                  </Link>

                  {/* Menú desplegable para cambiar nombre */}
                  {user && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">Hola, {persistentUsername}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Mi cuenta
                      </Link>
                      <button
                        onClick={() => {
                          setNewDisplayName(persistentUsername)
                          setIsEditNameDialogOpen(true)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cambiar nombre
                      </button>
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut()
                          localStorage.removeItem("username")
                          setPersistentUsername("")
                          router.push("/shop")
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Wishlist - visible en todos los dispositivos */}
              <Link href="/wishlists" className="flex flex-col items-center">
                <div className="relative">
                  <Heart className="h-6 w-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#1e3a8a] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1 hidden md:block">Favoritos</span>
              </Link>

              {/* Carrito - visible en todos los dispositivos */}
              <Link
                href="/shop"
                onClick={(e) => {
                  e.preventDefault()
                  toggleCart()
                }}
                className="flex flex-col items-center"
              >
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#1e3a8a] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1 hidden md:block">{formatCurrency(subtotal)}</span>
              </Link>

              {/* Botón de menú móvil con icono más grande */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación principal con mega menús */}
      <MainNavigation />

      {/* Menú móvil */}
      {isMobileMenuOpen && false && (
        <div className="md:hidden bg-white border-b shadow-md">
          <div className="container mx-auto py-2">
            <nav className="flex flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-3 flex items-center text-sm font-medium transition-colors duration-200 hover:text-[#1e3a8a] ${
                    pathname === item.href ? "text-[#1e3a8a] font-bold" : "text-gray-700"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
              <div className="px-4 py-3">
                <SearchBar placeholder="Buscar productos..." darkMode={false} />
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Barra de búsqueda expandida para móvil cuando está abierta */}
      <div
        className={`md:hidden bg-white p-4 border-b shadow-sm transition-all duration-300 ease-in-out ${
          isSearchOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <SearchBar placeholder="Search for products..." darkMode={false} />
      </div>

      {/* Modal de opciones de entrega */}
      <DeliveryOptionsModal isOpen={isDeliveryModalOpen} onClose={() => setIsDeliveryModalOpen(false)} />

      {/* Diálogo para editar el nombre de usuario */}
      <Dialog open={isEditNameDialogOpen} onOpenChange={setIsEditNameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cambiar nombre de usuario</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                className="col-span-3"
                placeholder="Ingresa tu nombre de usuario"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditNameDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDisplayNameChange}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Carrito lateral con animación */}
      {cartOpen && (
        <>
          {/* Overlay con animación de fade */}
          <div
            className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
            onClick={() => setCartOpen(false)}
            style={{ animation: "fadeIn 0.3s ease-out" }}
          />

          {/* Sidebar del carrito con animación de slide */}
          <div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out"
            style={{ animation: "slideInRight 0.3s ease-out" }}
          >
            {/* Encabezado */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">Agregados al carrito</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                aria-label="Cerrar carrito"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mensaje informativo */}
            {cart?.length > 0 && (
              <div
                className="bg-[#FFFF1A] p-3 mx-4 my-3 rounded-md flex items-start transition-all duration-300 ease-in-out"
                style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}
              >
                <Info className="h-5 w-5 text-gray-800 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-800">
                  Los descuentos serán visualizados al seleccionar el método de pago
                </p>
              </div>
            )}

            {/* Contenido del carrito */}
            <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-180px)]">
              {cart?.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-full text-center transition-opacity duration-300 ease-in-out"
                  style={{ animation: "fadeIn 0.5s ease-out" }}
                >
                  <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
                  <Button
                    asChild
                    className="bg-[#1e3a8a] hover:bg-[#152a61] transition-colors duration-200"
                    onClick={() => setCartOpen(false)}
                  >
                    <Link href="/shop">Ver Tienda</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div
                      key={`${item.id}-${item.variant}`}
                      className="flex border-b pb-4 transition-all duration-300 ease-in-out"
                      style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}
                    >
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
                          className="text-gray-400 hover:text-[#e74c3c] p-1 transition-colors duration-200"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="flex items-center border rounded-md bg-gray-50">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded-l-md transition-colors duration-200"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                          <span className="text-xs text-gray-500 mr-1">und.</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded-r-md transition-colors duration-200"
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
              <div
                className="border-t p-4 bg-white transition-all duration-300 ease-in-out"
                style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-lg">Subtotal:</span>
                  <span className="font-bold text-xl">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                  <span>Productos en carrito:</span>
                  <span className="font-medium">{totalProductCount} unidades</span>
                </div>

                <Button
                  className="w-full mb-2 bg-[#1e3a8a] hover:bg-[#152a61] text-white font-medium py-3 h-auto transition-colors duration-200"
                  onClick={() => {
                    setCartOpen(false)
                    router.push("/checkout")
                  }}
                >
                  Ver carrito / Ir a pagar
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 font-medium transition-colors duration-200"
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

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }

        /* Añadir padding al contenido principal para compensar el header fijo solo en pantallas md y superiores */
        @media (min-width: 768px) {
          main {
            padding-top: 180px; /* Ajusta este valor según la altura total del header */
          }
        }
      `}</style>
    </header>
  )
}
