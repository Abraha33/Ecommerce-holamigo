"use client"

import { motion } from "framer-motion"
import { Target, Eye, Heart } from "lucide-react"

export function MissionVisionSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Nuestra Misión y Visión</h2>
          <div className="h-1 w-20 bg-green-600 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Misión */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-800">Misión</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              Proporcionar productos ecológicos y biodegradables de alta calidad que contribuyan a la preservación del
              medio ambiente, ofreciendo alternativas sostenibles para el empaque y almacenamiento, mientras educamos y
              concientizamos a nuestros clientes sobre la importancia del cuidado ambiental.
            </p>
          </motion.div>

          {/* Visión */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-800">Visión</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              Ser la empresa líder en Colombia en la distribución de productos ecológicos y biodegradables, reconocida
              por nuestra innovación, calidad y compromiso con la sostenibilidad, contribuyendo significativamente a la
              construcción de un futuro más verde y responsable.
            </p>
          </motion.div>
        </div>

        {/* Valores */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">Nuestros Valores</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-lg mb-2">Sostenibilidad</h4>
                <p className="text-green-100">Compromiso con el planeta</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Calidad</h4>
                <p className="text-green-100">Productos de excelencia</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Innovación</h4>
                <p className="text-green-100">Soluciones del futuro</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
