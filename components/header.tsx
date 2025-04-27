"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/components/cart-provider"
import { Search, ShoppingCart, Menu, Phone, Mail, User, MapPin, List } from "lucide-react"

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Productos", href: "/products" },
  { name: "Categorías", href: "/categories" },
  { name: "Nosotros", href: "/about" },
  { name: "Contacto", href: "/contact" },
]

export default function Header() {
  const pathname = usePathname()
  const { cart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top bar */}
      <div className="bg-[#004a93] text-white py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>+57 (601) 745-7000</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>ventas@ecoplast.com</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Calle 12 # 68-55, Bogotá</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/account/login" className="hover:underline">
              Iniciar sesión
            </Link>
            <span>|</span>
            <Link href="/account/register" className="hover:underline">
              Registrarse
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className={`bg-white border-b transition-shadow ${isScrolled ? "shadow-md" : ""}`}>
        <div className="container mx-auto px-4 pr-72">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-12 w-48">
                <Image src="/ecoplast-logo.png" alt="EcoPlast Logo" fill className="object-contain" priority />
              </div>
            </Link>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="¿Qué estás buscando?"
                  className="w-full pr-10 border-[#004a93] rounded-full"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#004a93]" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href="/account" className="p-2 hidden md:flex items-center">
                <User className="h-5 w-5 text-[#004a93]" />
              </Link>

              <Link href="/wishlists" className="p-2 hidden md:flex items-center">
                <div className="relative h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <List className="h-5 w-5 text-[#004a93]" />
                </div>
              </Link>

              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="flex flex-col gap-6 mt-6">
                    <div className="relative h-10 w-40 mx-auto">
                      <Image src="/ecoplast-logo.png" alt="EcoPlast Logo" fill className="object-contain" />
                    </div>

                    <div className="relative w-full">
                      <Input
                        type="search"
                        placeholder="¿Qué estás buscando?"
                        className="w-full pr-10 border-[#004a93] rounded-full"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#004a93]" />
                    </div>

                    <nav className="flex flex-col gap-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`px-2 py-2 rounded-md ${
                            pathname === item.href ? "bg-[#f2f2f2] text-[#004a93] font-medium" : "hover:bg-muted"
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </nav>

                    <div className="flex flex-col gap-2 mt-4">
                      <Link href="/account/login" className="px-2 py-2 hover:bg-muted rounded-md">
                        Iniciar sesión
                      </Link>
                      <Link href="/account/register" className="px-2 py-2 hover:bg-muted rounded-md">
                        Registrarse
                      </Link>
                    </div>

                    <div className="mt-auto pt-6 border-t">
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[#004a93]" />
                          <span>+57 (601) 745-7000</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-[#004a93]" />
                          <span>ventas@ecoplast.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#004a93]" />
                          <span>Calle 12 # 68-55, Bogotá</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex w-full border-t border-b pr-72">
            <nav className="flex items-center flex-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-6 py-3 text-sm font-medium relative transition-all ${
                    pathname === item.href
                      ? "text-[#004a93] bg-blue-50 border-b-2 border-[#004a93] shadow-sm"
                      : "text-gray-700 hover:text-[#004a93] hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <Link href="/cart" className="bg-[#004a93] text-white py-3 px-6 flex items-center">
              <div className="relative h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-2">
                <ShoppingCart className="h-5 w-5" />
              </div>
              Mi Carrito ({cartItemsCount > 0 ? `$${cartItemsCount}00` : "$0"})
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
