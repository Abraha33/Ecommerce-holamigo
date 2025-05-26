import { TestUserCreator } from "@/components/test-user-creator"

export default function TestUserPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Creación de Usuarios de Prueba</h1>
      <p className="text-center mb-8 text-gray-600 max-w-2xl mx-auto">
        Esta herramienta te permite crear diferentes tipos de usuarios de prueba para simular diversos escenarios en la
        plataforma de e-commerce.
      </p>
      <TestUserCreator />
    </div>
  )
}
