import { Loader } from "@/components/ui/loader"

export function LoadingExample() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Ejemplos de Loaders</h2>

      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Colores</h3>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Loader color="blue" />
              <span className="text-sm">Azul (Default)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Loader color="red" />
              <span className="text-sm">Rojo</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-[#004a93] p-4 rounded">
              <Loader color="white" />
              <span className="text-sm text-white">Blanco</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Tamaños</h3>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Loader size="small" />
              <span className="text-sm">Pequeño</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Loader size="medium" />
              <span className="text-sm">Mediano (Default)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Loader size="large" />
              <span className="text-sm">Grande</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Ejemplos de uso</h3>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 border p-3 rounded">
              <Loader size="small" color="blue" />
              <span>Cargando datos...</span>
            </div>

            <button className="bg-[#004a93] text-white px-4 py-2 rounded flex items-center gap-2">
              <Loader size="small" color="white" />
              <span>Procesando</span>
            </button>

            <div className="flex flex-col items-center justify-center border rounded p-8 w-40 h-40">
              <Loader size="large" />
              <span className="mt-4 text-sm text-center">Cargando productos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
