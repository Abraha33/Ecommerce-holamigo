"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#1e3a8a] text-white">
      {/* Top navigation */}
      <div className="border-b border-blue-900">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex justify-center gap-2 md:gap-4 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-blue-300 transition-colors px-2">
              INICIO
            </Link>
            <Link href="/shop" className="hover:text-blue-300 transition-colors px-2">
              TIENDA
            </Link>
            <Link href="/categories" className="hover:text-blue-300 transition-colors px-2">
              CATEGORÍAS
            </Link>
            <Link href="/promos" className="hover:text-blue-300 transition-colors px-2">
              PROMOCIONES
            </Link>
            <Link href="/contact" className="hover:text-blue-300 transition-colors px-2">
              CONTACTO
            </Link>
            <Link href="/about" className="hover:text-blue-300 transition-colors px-2">
              NOSOTROS
            </Link>
            <Link href="/terms" className="hover:text-blue-300 transition-colors px-2">
              TÉRMINOS
            </Link>
            <Link href="/privacy" className="hover:text-blue-300 transition-colors px-2">
              PRIVACIDAD
            </Link>
          </nav>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image src="/envaxlogo-gold.png" alt="Envax Logo" width={40} height={40} />
              <span className="text-xl font-bold">Envax</span>
            </div>
            <p className="text-blue-200 text-sm">
              Soluciones ecológicas de calidad para un futuro sostenible. Comprometidos con el medio ambiente y la
              innovación.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-blue-200">
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Mi Cuenta
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Mis Pedidos
                </Link>
              </li>
              <li>
                <Link href="/wishlists" className="hover:text-white transition-colors">
                  Lista de Deseos
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Ayuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categorías</h3>
            <ul className="space-y-2 text-blue-200">
              <li>
                <Link href="/categories/lacteos" className="hover:text-white transition-colors">
                  Lácteos
                </Link>
              </li>
              <li>
                <Link href="/categories/frutas-verduras" className="hover:text-white transition-colors">
                  Frutas y Verduras
                </Link>
              </li>
              <li>
                <Link href="/categories/carnes" className="hover:text-white transition-colors">
                  Carnes
                </Link>
              </li>
              <li>
                <Link href="/categories/bebidas" className="hover:text-white transition-colors">
                  Bebidas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <div className="space-y-3 text-blue-200">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+57 319 210 2438</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@envax.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Bogotá, Colombia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-blue-200">
            <p>&copy; 2024 Envax. Todos los derechos reservados.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link href="/terms" className="hover:text-white transition-colors">
                Términos de Servicio
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
