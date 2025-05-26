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

// Utilizaremos la estructura de categorías existente en el proyecto
interface Category {
  id: string
  name: string
  slug: string
  image_url?: string
  icon?: string
  is_active: boolean
  parent_id?: string | null
  display_order: number
}

interface CategorySliderProps {
  categories?: Category[]
}

// Categorías por defecto para mostrar cuando no se proporcionen suficientes
const defaultCategories: Category[] = [
  {
    id: "1",
    name: "Frutas y Verduras",
    slug: "frutas-verduras",
    image_url: "/categories/frutas-verduras.png",
    is_active: true,
    display_order: 1,
  },
  {
    id: "2",
    name: "Lácteos",
    slug: "lacteos",
    image_url: "/categories/lacteos.png",
    is_active: true,
    display_order: 2,
  },
  {
    id: "3",
    name: "Carnes",
    slug: "carnes",
    image_url: "/categories/carnes.png",
    is_active: true,
    display_order: 3,
  },
  {
    id: "4",
    name: "Bebidas",
    slug: "bebidas",
    image_url: "/categories/bebidas.png",
    is_active: true,
    display_order: 4,
  },
  {
    id: "5",
    name: "Aseo",
    slug: "aseo",
    image_url: "/categories/aseo.png",
    is_active: true,
    display_order: 5,
  },
  {
    id: "6",
    name: "Licores",
    slug: "licores",
    image_url: "/categories/licores.png",
    is_active: true,
    display_order: 6,
  },
  {
    id: "7",
    name: "Cosméticos",
    slug: "cosmeticos",
    image_url: "/categories/cosmeticos.png",
    is_active: true,
    display_order: 7,
  },
  {
    id: "8",
    name: "Snacks",
    slug: "snack",
    image_url: "/categories/snack.png",
    is_active: true,
    display_order: 8,
  },
  {
    id: "9",
    name: "Delicatessen",
    slug: "delicatessen",
    image_url: "/categories/delicatessen.png",
    is_active: true,
    display_order: 9,
  },
  {
    id: "10",
    name: "Bebidas Hidratantes",
    slug: "bebidas-hidratantes",
    image_url: "/categories/bebidas-hidratantes.png",
    is_active: true,
    display_order: 10,
  },
  {
    id: "11",
    name: "Muebles Exterior",
    slug: "muebles-exterior",
    image_url: "/categories/muebles-exterior.png",
    is_active: true,
    display_order: 11,
  },
  {
    id: "12",
    name: "Asadores BBQ",
    slug: "asadores-bbq",
    image_url: "/categories/asadores-bbq.png",
    is_active: true,
    display_order: 12,
  },
  {
    id: "13",
    name: "Camping y Piscinas",
    slug: "camping-piscinas",
    image_url: "/categories/camping-piscinas.png",
    is_active: true,
    display_order: 13,
  },
  {
    id: "14",
    name: "Mascotas",
    slug: "mascotas",
    image_url: "/categories/mascotas.png",
    is_active: true,
    display_order: 14,
  },
  {
    id: "15",
    name: "Materas y Plantas",
    slug: "materas-plantas",
    image_url: "/categories/materas-plantas.png",
    is_active: true,
    display_order: 15,
  },
  {
    id: "16",
    name: "Herramientas de Jardín",
    slug: "herramientas-jardin",
    image_url: "/categories/herramientas-jardin.png",
    is_active: true,
    display_order: 16,
  },
  {
    id: "17",
    name: "Deportes y Recreación",
    slug: "deportes-recreacion",
    image_url: "/categories/deportes-recreacion.png",
    is_active: true,
    display_order: 17,
  },
  {
    id: "18",
    name: "Decoración de Jardín",
    slug: "decoracion-jardin",
    image_url: "/categories/decoracion-jardin.png",
    is_active: true,
    display_order: 18,
  },
  {
    id: "19",
    name: "Panadería",
    slug: "panaderia",
    image_url: "/panaderia-fresca.png",
    is_active: true,
    display_order: 19,
  },
  {
    id: "20",
    name: "Congelados",
    slug: "congelados",
    image_url: "/frozen-foods.png",
    is_active: true,
    display_order: 20,
  },
  {
    id: "21",
    name: "Electrónica",
    slug: "electronica",
    image_url: "/electronica-gadgets.png",
    is_active: true,
    display_order: 21,
  },
  {
    id: "22",
    name: "Ver Todo",
    slug: "ver-todo",
    image_url: "/categories/ver-todo.png",
    is_active: true,
    display_order: 22,
  },
]

export default function CategorySlider({ categories = [] }: CategorySliderProps) {
  // Combinar las categorías proporcionadas con las predeterminadas si hay menos de 10
  const displayCategories =
    categories.length >= 10
      ? categories
      : [...categories, ...defaultCategories.filter((dc) => !categories.some((c) => c.slug === dc.slug))]

  // Estilos personalizados para Swiper
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
      .swiper-button-next:after, .swiper-button-prev:after {
        font-size: 16px;
        font-weight: bold;
      }
      .swiper-pagination-bullet-active {
        background-color: #1e3a8a;
      }
      .swiper-pagination-bullet {
        transition: all 0.3s ease;
      }
      .category-swiper .swiper-wrapper {
        align-items: center;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="my-4 sm:my-6 md:my-8 bg-white rounded-lg sm:rounded-xl shadow-sm py-4 sm:py-6 overflow-hidden">
      <div className="w-full mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Explorar categorías</h2>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={2}
            slidesPerView={1}
            loop={true}
            centeredSlides={false}
            grabCursor={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={800}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={{
              el: ".swiper-pagination",
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 3,
                spaceBetween: 5,
              },
              520: {
                slidesPerView: 4,
                spaceBetween: 5,
              },
              768: {
                slidesPerView: 5,
                spaceBetween: 5,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 5,
              },
            }}
            className="category-swiper"
          >
            {displayCategories.map((category) => (
              <SwiperSlide key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="flex flex-col items-center flex-shrink-0 group transition-all duration-300 max-w-[90px] md:max-w-[110px]"
                >
                  <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden mb-1 transition-all duration-500 shadow-md border-2 border-gray-100 group-hover:border-blue-200 group-hover:shadow-lg">
                    <Image
                      src={category.image_url || `/placeholder.svg?height=200&width=200&query=${category.name}`}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="eager"
                      sizes="(max-width: 768px) 96px, 128px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="w-full text-center">
                    <span className="text-center text-xs md:text-sm font-medium transition-all duration-300 group-hover:text-blue-600 line-clamp-2">
                      {category.name}
                    </span>
                    <span className="block h-0.5 bg-blue-400 rounded-full mx-auto mt-1 transition-all duration-500 w-0 group-hover:w-12"></span>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Controles de navegación */}
          <div className="swiper-button-prev !w-10 !h-10 !rounded-full !bg-white !shadow-md !text-gray-700 !left-0 !after:text-sm"></div>
          <div className="swiper-button-next !w-10 !h-10 !rounded-full !bg-white !shadow-md !text-gray-700 !right-0 !after:text-sm"></div>

          {/* Paginación */}
          <div className="swiper-pagination !bottom-0 !mt-4"></div>
        </div>
      </div>
    </div>
  )
}
