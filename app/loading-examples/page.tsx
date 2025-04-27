"use client"

import { useState } from "react"
import { useLoading } from "@/contexts/loading-context"
import { useLoadingState } from "@/hooks/use-loading-state"
import { LoadingButton } from "@/components/ui/loading-button"
import { LoadingSection } from "@/components/ui/loading-section"
import { LoadingTable } from "@/components/ui/loading-table"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoadingExamplesPage() {
  const { startLoading, stopLoading, setLoadingMessage } = useLoading()
  const { isLoading: isSectionLoading, withLoading: withSectionLoading } = useLoadingState()
  const { isLoading: isButtonLoading, withLoading: withButtonLoading } = useLoadingState()
  const { isLoading: isTableLoading, withLoading: withTableLoading } = useLoadingState()
  const [activeTab, setActiveTab] = useState("global")

  const simulateGlobalLoading = () => {
    startLoading()
    setLoadingMessage("Cargando datos globales...")
    setTimeout(() => {
      stopLoading()
    }, 3000)
  }

  const simulateSectionLoading = async () => {
    await withSectionLoading(
      new Promise((resolve) => {
        setTimeout(resolve, 3000)
      }),
    )
  }

  const simulateButtonLoading = async () => {
    await withButtonLoading(
      new Promise((resolve) => {
        setTimeout(resolve, 2000)
      }),
    )
  }

  const simulateTableLoading = async () => {
    await withTableLoading(
      new Promise((resolve) => {
        setTimeout(resolve, 4000)
      }),
    )
  }

  const tableColumns = ["ID", "Nombre", "Estado", "Fecha", "Acciones"]

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#20509E]">Ejemplos de Indicadores de Carga</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="global">Carga Global</TabsTrigger>
          <TabsTrigger value="section">Carga de Sección</TabsTrigger>
          <TabsTrigger value="button">Botones con Carga</TabsTrigger>
          <TabsTrigger value="skeleton">Esqueletos y Tablas</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Indicador de Carga Global</CardTitle>
              <CardDescription>
                Muestra un overlay de carga en toda la aplicación para operaciones que afectan a múltiples componentes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                El indicador de carga global es útil para operaciones que afectan a toda la aplicación, como la
                inicialización de datos, cambios de página o envío de formularios importantes.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={simulateGlobalLoading} className="bg-[#20509E] hover:bg-[#184589]">
                Mostrar Carga Global
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="section" className="space-y-6">
          <LoadingSection isLoading={isSectionLoading} message="Cargando datos de la sección...">
            <Card>
              <CardHeader>
                <CardTitle>Indicador de Carga de Sección</CardTitle>
                <CardDescription>
                  Muestra un indicador de carga solo en una sección específica de la página.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Este tipo de indicador es útil cuando solo una parte de la página está cargando datos, permitiendo que
                  el usuario siga interactuando con el resto de la interfaz.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={simulateSectionLoading} className="bg-[#20509E] hover:bg-[#184589]">
                  Cargar Sección
                </Button>
              </CardFooter>
            </Card>
          </LoadingSection>
        </TabsContent>

        <TabsContent value="button" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Botones con Estado de Carga</CardTitle>
              <CardDescription>
                Botones que muestran un indicador de carga mientras se procesa la acción.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Los botones con estado de carga proporcionan retroalimentación inmediata al usuario cuando se realiza
                una acción, como enviar un formulario o realizar una operación asíncrona.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <LoadingButton
                  isLoading={isButtonLoading}
                  loadingText="Procesando..."
                  onClick={simulateButtonLoading}
                  className="bg-[#20509E] hover:bg-[#184589]"
                >
                  Guardar Cambios
                </LoadingButton>

                <LoadingButton
                  isLoading={isButtonLoading}
                  onClick={simulateButtonLoading}
                  variant="outline"
                  className="border-[#20509E] text-[#20509E]"
                  loaderColor="primary"
                >
                  Actualizar
                </LoadingButton>

                <LoadingButton
                  isLoading={isButtonLoading}
                  onClick={simulateButtonLoading}
                  variant="destructive"
                  className="bg-[#CDA22A]"
                >
                  Eliminar
                </LoadingButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skeleton" className="space-y-6">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Esqueletos de Carga</CardTitle>
              <CardDescription>Muestran la estructura de los componentes mientras se cargan los datos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <SkeletonCard />
                <SkeletonCard rows={2} />
                <SkeletonCard rows={4} />
              </div>
              <Button onClick={simulateTableLoading} className="bg-[#20509E] hover:bg-[#184589]">
                Recargar Esqueletos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tablas con Estado de Carga</CardTitle>
              <CardDescription>Tablas que muestran un indicador de carga mientras se cargan los datos.</CardDescription>
            </CardHeader>
            <CardContent>
              <LoadingTable
                isLoading={isTableLoading}
                loadingMessage="Cargando datos de la tabla..."
                columns={tableColumns}
                skeletonRows={3}
              >
                {Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>Producto {index + 1}</td>
                    <td>Activo</td>
                    <td>2023-05-{index + 10}</td>
                    <td>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </LoadingTable>
              <div className="mt-4">
                <Button onClick={simulateTableLoading} className="bg-[#20509E] hover:bg-[#184589]">
                  Cargar Datos de Tabla
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
