"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

// Definir tipos para las subcategorías
interface SubcategoryItem {
  slug: string
  title: string
}

interface Category {
  slug: string
  title: string
  icon: React.ReactNode
}

// Iconos SVG para las categorías
const CategoryIcons = {
  Computer: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  ),
  Tablet: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>
  ),
  Printer: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 6 2 18 2 18 9"></polyline>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
      <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
  ),
  Phone: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>
  ),
  Keyboard: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
      <path d="M6 8h.01"></path>
      <path d="M10 8h.01"></path>
      <path d="M14 8h.01"></path>
      <path d="M18 8h.01"></path>
      <path d="M6 12h.01"></path>
      <path d="M10 12h.01"></path>
      <path d="M14 12h.01"></path>
      <path d="M18 12h.01"></path>
      <path d="M6 16h12"></path>
    </svg>
  ),
  Game: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" y1="12" x2="10" y2="12"></line>
      <line x1="8" y1="10" x2="8" y2="14"></line>
      <line x1="15" y1="13" x2="15.01" y2="13"></line>
      <line x1="18" y1="11" x2="18.01" y2="11"></line>
      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
    </svg>
  ),
  Sports: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  ),
  Watch: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="7"></circle>
      <polyline points="12 9 12 12 13.5 13.5"></polyline>
      <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path>
    </svg>
  ),
  Headphone: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
    </svg>
  ),
}

// Datos de categorías
const categoriesData: Category[] = [
  {
    slug: "computer-laptop",
    title: "Computer & Laptop",
    icon: CategoryIcons.Computer,
  },
  {
    slug: "tablets-ipad",
    title: "Tablets & iPad",
    icon: CategoryIcons.Tablet,
  },
  {
    slug: "printer-cameras",
    title: "Printer & Cameras",
    icon: CategoryIcons.Printer,
  },
  {
    slug: "smart-phones",
    title: "Smart Phones",
    icon: CategoryIcons.Phone,
  },
  {
    slug: "keyboard-mouse",
    title: "Keyboard & Mouse",
    icon: CategoryIcons.Keyboard,
  },
  {
    slug: "video-games",
    title: "Video Games",
    icon: CategoryIcons.Game,
  },
  {
    slug: "sports-outdoors",
    title: "Sports & Outdoors",
    icon: CategoryIcons.Sports,
  },
  {
    slug: "smart-watch",
    title: "Smart Watch",
    icon: CategoryIcons.Watch,
  },
  {
    slug: "headphone-audios",
    title: "Headphone & Audios",
    icon: CategoryIcons.Headphone,
  },
]

// Datos de subcategorías
const subcategoriesData = {
  "laptop-computers": [
    { slug: "computers", title: "Computers" },
    { slug: "desktops-monitors", title: "Desktops & Monitors" },
    { slug: "hard-drives-memory", title: "Hard Drives & Memory Cards" },
    { slug: "printers-ink", title: "Printers & Ink" },
    { slug: "gaming-accessories", title: "Gaming Accessories" },
    { slug: "audio-video-cables", title: "Audio & Video Cables" },
  ],
  cameras: [
    { slug: "digital-cameras", title: "Digital Cameras" },
    { slug: "professional-slr", title: "Professional & SLR Cameras" },
    { slug: "camcorders-video", title: "Camcorders & Video Cameras" },
    { slug: "camera-lenses", title: "Camera Lenses & Accessories" },
    { slug: "cctv-cameras", title: "CCTV Cameras" },
    { slug: "other-accessories", title: "Other Accessories" },
  ],
  "prime-videos": [
    { slug: "unlocked-phones", title: "Unlocked Phones" },
    { slug: "phone-cellphone", title: "Phone & Cellphone" },
    { slug: "cellphone-charges", title: "Cellphone Charges" },
    { slug: "printers-supplies", title: "Printers & Supplies" },
  ],
}

interface CategoryMenuProps {
  onClose?: () => void
}

export default function CategoryMenu({ onClose }: CategoryMenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Manejar clic en categoría
  const handleCategoryClick = (categorySlug: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedCategory(categorySlug)
  }

  // Manejar navegación
  const handleNavigate = (e: React.MouseEvent, url: string) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(url)
    setSelectedCategory(null)
  }

  // Cerrar menú
  const handleClose = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  // Efecto para cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setSelectedCategory(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Promoción destacada
  const featuredPromo = {
    brand: "APPLE",
    title: 'Super Sale MacBook Pro 15.6"',
    price: "$950.99",
    image: "/placeholder-wyfnw.png",
    link: "/shop/macbook-pro",
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Menú de escritorio */}
      <div className="relative z-10">
        {/* Botón del menú */}
        <Button
          ref={buttonRef}
          className="flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-700 px-4 py-2 h-auto"
          onClick={() => setSelectedCategory(selectedCategory ? null : "computer-laptop")}
          aria-expanded={!!selectedCategory}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Menú desplegable */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full z-50 flex shadow-xl rounded-b-lg bg-white overflow-hidden border border-gray-100 mt-0 w-[1200px]"
              style={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              {/* Panel izquierdo - Categorías */}
              <motion.div
                className="w-[280px] border-r border-gray-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {categoriesData.map((category) => (
                  <motion.div
                    key={category.slug}
                    className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                      selectedCategory === category.slug ? "bg-gray-50" : ""
                    }`}
                    onClick={(e) => handleCategoryClick(category.slug, e)}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="w-6 h-6 flex items-center justify-center mr-3 text-gray-600">{category.icon}</span>
                    <span className="flex-1 text-gray-800">{category.title}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Panel central - Subcategorías */}
              <motion.div
                className="flex-1 p-6 grid grid-cols-2 gap-x-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="mb-8">
                  <motion.h3
                    className="font-bold text-lg mb-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    Laptop & Computers
                  </motion.h3>
                  <motion.ul
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4, staggerChildren: 0.05 }}
                  >
                    {subcategoriesData["laptop-computers"].map((item, index) => (
                      <motion.li
                        key={item.slug}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                      >
                        <Link
                          href={`/categories/${selectedCategory}/${item.slug}`}
                          className="text-sm hover:text-blue-600 transition-colors"
                          onClick={(e) => handleNavigate(e, `/categories/${selectedCategory}/${item.slug}`)}
                        >
                          {item.title}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
                <div className="mb-8">
                  <motion.h3
                    className="font-bold text-lg mb-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    Cameras
                  </motion.h3>
                  <motion.ul
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4, staggerChildren: 0.05 }}
                  >
                    {subcategoriesData["cameras"].map((item, index) => (
                      <motion.li
                        key={item.slug}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                      >
                        <Link
                          href={`/categories/${selectedCategory}/${item.slug}`}
                          className="text-sm hover:text-blue-600 transition-colors"
                          onClick={(e) => handleNavigate(e, `/categories/${selectedCategory}/${item.slug}`)}
                        >
                          {item.title}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
                <div className="mb-8">
                  <motion.h3
                    className="font-bold text-lg mb-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    Laptop & Computers
                  </motion.h3>
                  <motion.ul
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4, staggerChildren: 0.05 }}
                  >
                    {subcategoriesData["laptop-computers"].map((item, index) => (
                      <motion.li
                        key={`second-${item.slug}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                      >
                        <Link
                          href={`/categories/${selectedCategory}/${item.slug}`}
                          className="text-sm hover:text-blue-600 transition-colors"
                          onClick={(e) => handleNavigate(e, `/categories/${selectedCategory}/${item.slug}`)}
                        >
                          {item.title}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
                <div className="mb-8">
                  <motion.h3
                    className="font-bold text-lg mb-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    Prime Videos
                  </motion.h3>
                  <motion.ul
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4, staggerChildren: 0.05 }}
                  >
                    {subcategoriesData["prime-videos"].map((item, index) => (
                      <motion.li
                        key={item.slug}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                      >
                        <Link
                          href={`/categories/${selectedCategory}/${item.slug}`}
                          className="text-sm hover:text-blue-600 transition-colors"
                          onClick={(e) => handleNavigate(e, `/categories/${selectedCategory}/${item.slug}`)}
                        >
                          {item.title}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </motion.div>

              {/* Panel derecho - Promoción destacada */}
              <motion.div
                className="w-[300px] p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <motion.div
                  className="bg-gray-900 rounded-lg p-5 text-white"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-yellow-400 font-medium text-sm">{featuredPromo.brand}</span>
                  <h3 className="text-xl font-bold mt-1 mb-2">{featuredPromo.title}</h3>
                  <p className="mb-4">
                    <span className="text-sm">Just from: </span>
                    <motion.span
                      className="text-yellow-400 text-2xl font-bold"
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    >
                      {featuredPromo.price}
                    </motion.span>
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href={featuredPromo.link}
                      className="inline-block bg-white text-black font-medium px-6 py-2 rounded-full hover:bg-yellow-400 hover:text-gray-900 transition-colors duration-300"
                      onClick={(e) => handleNavigate(e, featuredPromo.link)}
                    >
                      Shop Now
                    </Link>
                  </motion.div>
                  <motion.div
                    className="mt-4 relative h-[200px] overflow-hidden rounded-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Image
                      src={featuredPromo.image || "/placeholder.svg"}
                      alt={featuredPromo.title}
                      fill
                      className="object-contain transition-transform duration-700 hover:scale-110"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menú móvil */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white mr-2"
            aria-label="Abrir menú de categorías"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="p-0 w-[90vw] sm:w-[350px] flex flex-col overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Encabezado del menú */}
            <div className="bg-[#e74c3c] text-white p-4 flex items-center justify-between">
              <h2 className="font-medium text-lg flex items-center">
                <Menu className="h-5 w-5 mr-2" />
                Product Categories
              </h2>
            </div>

            {/* Lista de categorías */}
            <div className="flex-grow overflow-y-auto">
              <div className="py-2">
                {categoriesData.map((category) => (
                  <motion.div key={category.slug} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="flex items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                      onClick={(e) => {
                        handleNavigate(e, `/categories/${category.slug}`)
                        setIsOpen(false)
                      }}
                    >
                      <span className="w-6 h-6 flex items-center justify-center mr-3 text-gray-600">
                        {category.icon}
                      </span>
                      <span className="flex-1 text-gray-800">{category.title}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export { CategoryMenu }
