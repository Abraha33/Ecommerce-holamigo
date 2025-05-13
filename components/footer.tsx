"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()

  // Versión simplificada para la página de orders/latest
  if (pathname === "/orders/latest") {
    return (
      <footer className="bg-gray-100 py-4 text-center">
        <p className="text-gray-600 text-sm">@Derechos reservados</p>
      </footer>
    )
  }

  // Footer original para el resto de páginas
  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="relative h-10 w-40 mb-4">
              <Image src="/eco-plast-logo-concept.png" alt="EcoPlast Logo" fill className="object-contain" />
            </div>
            <p className="text-gray-600 mb-4">
              Providing sustainable plastic solutions for a greener future. Quality products for all your needs.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-500 hover:text-green-600">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-green-600">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-green-600">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-green-600">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-green-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-green-600">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-green-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-green-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-green-600">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-600">123 Green Street, Eco City, EC 12345</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-600">info@ecoplast.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">Subscribe to our newsletter to receive updates and special offers.</p>
            <div className="flex gap-2">
              <Input placeholder="Your email" type="email" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} EcoPlast. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="text-gray-600 hover:text-green-600 text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-600 hover:text-green-600 text-sm">
                Terms of Service
              </Link>
              <Link href="/shipping-policy" className="text-gray-600 hover:text-green-600 text-sm">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
