"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

interface CategoryItem {
  id: string
  name: string
  image: string
  href: string
}

interface CategoryCirclesProps {
  title?: string
  categories: CategoryItem[]
}

export function CategoryCircles({ title = "Compra por categorías", categories }: CategoryCirclesProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-bold text-[#004a93] mb-4">{title}</h2>
          <div className="h-1 w-20 bg-[#004a93] rounded-full"></div>
        </div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={item}>
              <Link
                href={category.href}
                className="flex flex-col items-center group"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <motion.div
                  className="relative w-36 h-36 rounded-full bg-[#004a93] overflow-hidden mb-4 shadow-md"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(0, 74, 147, 0.4)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-[#004a93] rounded-full p-1">
                    <div className="relative w-full h-full rounded-full bg-white overflow-hidden">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-contain p-3 transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  {hoveredCategory === category.id && (
                    <motion.div
                      className="absolute inset-0 bg-[#004a93]/20 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span className="text-white font-bold text-sm bg-[#004a93]/80 px-3 py-1 rounded-full">
                        Ver más
                      </span>
                    </motion.div>
                  )}
                </motion.div>
                <motion.span
                  className="text-center font-medium text-gray-800 transition-colors duration-300 group-hover:text-[#004a93]"
                  whileHover={{ scale: 1.05 }}
                >
                  {category.name}
                </motion.span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-12">
          <Link href="/categories">
            <motion.button
              className="px-6 py-3 bg-[#004a93] text-white rounded-full font-semibold shadow-md hover:bg-[#003a73] transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver todas las categorías
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  )
}
