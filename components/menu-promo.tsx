"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

interface MenuPromoProps {
  title: string
  subtitle: string
  price: string
  image: string
  link: string
}

export function MenuPromo({ title, subtitle, price, image, link }: MenuPromoProps) {
  return (
    <motion.div
      className="bg-gray-50 rounded-lg overflow-hidden h-full"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <span className="text-xs font-medium text-[#1e3a8a]">{title}</span>
        <h3 className="text-lg font-bold mt-1 mb-2">{subtitle}</h3>
        <p className="mb-3">
          <span className="text-sm">Desde: </span>
          <motion.span
            className="text-[#1e3a8a] text-xl font-bold"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            {price}
          </motion.span>
        </p>
        <Link
          href={link}
          className="inline-block bg-[#1e3a8a] hover:bg-[#152a61] text-white rounded-full px-4 py-2 text-sm transition-colors"
        >
          Ver Ahora
        </Link>
      </div>
      <div className="relative h-[150px] w-full">
        <Image
          src={image || "/placeholder.svg"}
          alt={subtitle}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
    </motion.div>
  )
}
