import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Sobre Holamigo</h1>

        <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden">
          <Image
            src="/sustainable-living-banner.png"
            alt="Holamigo - Comprometidos con la sostenibilidad"
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none mb-10">
          <p className="lead text-xl text-gray-700">
            En Holamigo, estamos comprometidos con ofrecer productos de calidad a precios accesibles, mientras cuidamos
            del medio ambiente y apoyamos a nuestras comunidades locales.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-ecoplast-blue">Nuestra Historia</h2>
          <p>
            Fundada en 2015, Holamigo nació con la visión de transformar la experiencia de compra en Colombia. Lo que
            comenzó como una pequeña tienda familiar ha crecido hasta convertirse en un referente del comercio
            minorista, manteniendo siempre nuestros valores de cercanía, calidad y compromiso con nuestros clientes.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-ecoplast-blue">Nuestra Misión</h2>
          <p>
            Facilitar el acceso a productos de calidad a precios justos, creando una experiencia de compra excepcional
            que combine lo mejor del comercio tradicional con la innovación tecnológica.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-ecoplast-blue">Nuestra Visión</h2>
          <p>
            Ser reconocidos como el aliado preferido de las familias colombianas, ofreciendo soluciones que mejoren su
            calidad de vida y contribuyan a un futuro más sostenible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-3 text-ecoplast-blue">Calidad Garantizada</h3>
              <p className="text-gray-600">
                Seleccionamos cuidadosamente cada producto para asegurar que cumpla con nuestros estándares de calidad.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-3 text-ecoplast-blue">Precios Justos</h3>
              <p className="text-gray-600">
                Trabajamos directamente con proveedores para eliminar intermediarios y ofrecer los mejores precios.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-3 text-ecoplast-blue">Compromiso Ambiental</h3>
              <p className="text-gray-600">
                Implementamos prácticas sostenibles en toda nuestra operación para reducir nuestro impacto ambiental.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Nuestro Equipo</h2>
          <p className="text-center mb-8">
            Detrás de Holamigo hay un equipo apasionado de profesionales comprometidos con brindarte la mejor
            experiencia de compra.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "María Rodríguez", role: "CEO & Fundadora" },
              { name: "Carlos Gómez", role: "Director Comercial" },
              { name: "Ana Martínez", role: "Gerente de Operaciones" },
              { name: "Juan Pérez", role: "Jefe de Tecnología" },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl text-gray-500">{member.name.charAt(0)}</span>
                </div>
                <h4 className="font-bold">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-4">Contáctanos</h2>
          <p className="mb-6">¿Tienes preguntas o comentarios? Estamos aquí para ayudarte.</p>
          <div className="space-y-2">
            <p>
              <strong>Dirección:</strong> Calle Principal #123, Bogotá, Colombia
            </p>
            <p>
              <strong>Teléfono:</strong> (601) 123-4567
            </p>
            <p>
              <strong>Email:</strong> contacto@holamigo.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
