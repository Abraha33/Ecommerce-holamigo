"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/autoplay"

interface CategoryItem {
  id: string
  name: string
  image: string
  href: string
}

interface CategoryNavigationProps {
  categories: CategoryItem[]
}

export function CategoryNavigation({ categories }: CategoryNavigationProps) {
  // Estilos personalizados para Swiper
  useEffect(() => {
    // Añadir estilos personalizados para los controles de Swiper
    const style = document.createElement("style")
    style.innerHTML = `
    .swiper-button-next:after, .swiper-button-prev:after {
      font-size: 16px;
      font-weight: bold;
    }
    .swiper-pagination-bullet-active {
      background-color: #3b82f6;
    }
    .swiper-pagination-bullet {
      transition: all 0.3s ease;
    }
    .category-swiper {
      padding: 0 30px;
      margin: 0 -2px;
    }
    @media (min-width: 640px) {
      .category-swiper {
        margin: 0 -3px;
      }
    }
    .category-name {
      width: 7rem;
      display: block;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media (min-width: 768px) {
      .category-name {
        width: 8rem;
      }
    }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Mapeo de categorías a imágenes específicas
  const getCategoryImage = (categoryName: string) => {
    const categoryImages: Record<string, string> = {
      Insuperables: "/categories/insuperables.png",
      "Oferta Estrella": "/categories/oferta-estrella.png",
      Lácteos: "/categories/lacteos.png",
      Aseo: "/categories/aseo.png",
      Licores: "/categories/licores.png",
      Cosméticos: "/categories/cosmeticos.png",
      Bebidas: "/categories/bebidas.png",
      "Frutas y Verduras": "/categories/frutas-verduras.png",
      Carnes: "/categories/carnes.png",
      Delicatessen: "/categories/delicatessen.png",
      Snacks: "/categories/snack.png",
      "Bebidas Hidratantes": "/categories/bebidas-hidratantes.png",
      Mascotas: "/categories/mascotas.png",
      "Materas y Plantas": "/categories/materas-plantas.png",
      "Herramientas para Jardín": "/categories/herramientas-jardin.png",
      "Deportes y Recreación": "/categories/deportes-recreacion.png",
      "Decoración de Jardín": "/categories/decoracion-jardin.png",
      "Muebles de Exterior": "/categories/muebles-exterior.png",
      "Asadores y BBQ": "/categories/asadores-bbq.png",
      "Camping y Piscinas": "/categories/camping-piscinas.png",
      "Ver Todo": "/categories/ver-todo.png",
    }

    // Return a placeholder image with the category name if the specific image is not found
    return (
      categoryImages[categoryName] || `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(categoryName)}`
    )
  }

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4 pt-6">
          <h2 className="text-2xl font-semibold text-gray-800">Explorar categorías</h2>
          <Link href="/categories" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
            Ver todas
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="relative pb-8">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={2}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={{
              el: ".swiper-pagination",
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 6,
              },
              1280: {
                slidesPerView: 8,
              },
            }}
            className="!overflow-visible"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id} className="!h-auto">
                <Link href={category.href} className="flex flex-col items-center group">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-2 transition-all duration-300 shadow-sm border-2 border-gray-100 group-hover:border-blue-200 group-hover:shadow-md">
                    <Image
                      src={category.image || getCategoryImage(category.name)}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 80px, 96px"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="text-sm font-medium text-center text-gray-800 group-hover:text-blue-600 transition-colors duration-300 max-w-[100px] truncate">
                    {category.name}
                  </span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="swiper-button-prev !w-8 !h-8 !rounded-full !bg-white !shadow-md !text-gray-700 !left-0 md:!left-2 !after:text-xs"></button>
          <button className="swiper-button-next !w-8 !h-8 !rounded-full !bg-white !shadow-md !text-gray-700 !right-0 md:!right-2 !after:text-xs"></button>
          <div className="swiper-pagination !bottom-[-20px]"></div>
        </div>
      </div>
    </div>
  )
}
