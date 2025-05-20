"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Instagram } from "lucide-react"

export default function Footer() {
  const pathname = usePathname()

  // Simplified version for specific pages
  if (pathname === "/orders/latest" || pathname === "/checkout/confirmation") {
    return (
      <footer className="bg-blue-950 py-4 text-center">
        <p className="text-gray-300 text-xs">TODOS LOS DERECHOS RESERVADOS @ 2025</p>
      </footer>
    )
  }

  // Full footer for other pages
  return (
    <footer id="main-footer" className="bg-blue-950 text-white">
      {/* Top navigation */}
      <div className="border-b border-blue-900">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-wrap justify-center gap-8 text-sm">
            <Link href="/" className="hover:text-blue-300 transition-colors">
              INICIO
            </Link>
            <Link href="/terms" className="hover:text-blue-300 transition-colors">
              TÉRMINOS Y CONDICIONES
            </Link>
            <Link href="/politica-datos" className="hover:text-blue-300 transition-colors">
              POLÍTICA DE DATOS
            </Link>
            <Link href="/cookies" className="hover:text-blue-300 transition-colors">
              POLÍTICA DE COOKIES
            </Link>
            <Link href="/contact" className="hover:text-blue-300 transition-colors">
              CONTACTO
            </Link>
          </nav>
        </div>
      </div>

      {/* Address and contact */}
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="mb-2">Envax - Calle 31#15-19, piso 1, Bucaramanga, Santander - Colombia</p>
        <p className="mb-4">Contáctanos: +57 319 210 24 38 - 670 55 56</p>

        {/* Social media icons */}
        <div className="flex justify-center gap-4 mb-6">
          <a
            href="https://wa.me/573192102438"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 transition-colors p-2 rounded-full"
            aria-label="WhatsApp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
              <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
              <path d="M13.5 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
              <path d="M9 13.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5Z" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/envax.santander.3"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 transition-colors p-2 rounded-full"
            aria-label="Facebook"
          >
            <Facebook size={20} />
          </a>
          <a
            href="https://www.instagram.com/desechables.envax/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-600 hover:bg-pink-700 transition-colors p-2 rounded-full"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-blue-950 py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>TODOS LOS DERECHOS RESERVADOS @ 2025</p>
          <div className="mt-2 text-xs text-gray-400">
            <Link href="/politica-datos" className="hover:text-blue-300 transition-colors mx-2">
              Política de Datos Personales
            </Link>
            |
            <Link href="/terms" className="hover:text-blue-300 transition-colors mx-2">
              Términos y Condiciones
            </Link>
            |
            <Link href="/cookies" className="hover:text-blue-300 transition-colors mx-2">
              Política de Cookies
            </Link>
          </div>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/573192102438?text=Hola%2C%20estoy%20interesado%20en%20sus%20productos.%20%C2%BFPodr%C3%ADa%20darme%20m%C3%A1s%20informaci%C3%B3n%3F"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 flex items-center z-[100] group"
        aria-label="Contactar por WhatsApp"
        title="Contactar por WhatsApp"
      >
        <div className="bg-green-500 p-5 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-105 active:scale-95">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="white"
            stroke="currentColor"
            strokeWidth="0"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path
              fill="white"
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
            />
          </svg>
        </div>
        <div className="bg-white text-gray-800 py-3 px-5 rounded-l-full rounded-r-sm shadow-lg mr-1 opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all duration-300 transform -translate-x-5 group-hover:translate-x-0">
          <span className="font-medium whitespace-nowrap text-lg">¿Necesitas ayuda?</span>
        </div>
      </a>
    </footer>
  )
}
