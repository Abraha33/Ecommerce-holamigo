"use client"

import { useEffect, useState } from "react"
import { useLoading } from "@/contexts/loading-context"
import { useLoadingState } from "@/hooks/use-loading-state"
import { LoadingSection } from "@/components/ui/loading-section"
import { LoadingTable } from "@/components/ui/loading-table"
import { LoadingButton } from "@/components/ui/loading-button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Printer, RefreshCw, Settings, Building2, FileText, LayoutDashboard } from "lucide-react"
import { WarehouseFloorPlan } from "@/components/warehouse-floor-plan"
import { WarehouseSelector } from "@/components/warehouse-selector"
import { PrinterJobList } from "@/components/printer-job-list"
import { PrinterDetailsDialog } from "@/components/printer-details-dialog"
import { warehouses, getPrintersByWarehouse, getJobsByWarehouse, type Printer as PrinterType } from "@/data/mock-data"

// Simulación de API
const fetchDashboardData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: {
          totalPrinters: 12,
          activePrinters: 8,
          pendingJobs: 24,
          completedJobs: 156,
        },
        recentJobs: [
          { id: 1, name: "Informe mensual", printer: "HP LaserJet Pro", status: "Completado", date: "2023-05-15" },
          { id: 2, name: "Factura #1234", printer: "Epson WorkForce", status: "En cola", date: "2023-05-16" },
          { id: 3, name: "Presentación Q2", printer: "Brother MFC", status: "Imprimiendo", date: "2023-05-16" },
        ],
      })
    }, 2000)
  })
}

export default function DashboardPage() {
  const { startLoading, stopLoading, setLoadingMessage } = useLoading()
  const { isLoading: isStatsLoading, withLoading: withStatsLoading } = useLoadingState()
  const { isLoading: isJobsLoading, withLoading: withJobsLoading } = useLoadingState()
  const { isLoading: isRefreshLoading, withLoading: withRefreshLoading } = useLoadingState()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(warehouses[0].id)
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterType | null>(null)
  const [printerDialogOpen, setPrinterDialogOpen] = useState(false)

  const loadDashboardData = async () => {
    try {
      startLoading()
      setLoadingMessage("Cargando datos del dashboard...")

      const data = await fetchDashboardData()
      setDashboardData(data)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      stopLoading()
    }
  }

  const refreshStats = async () => {
    await withStatsLoading(
      new Promise((resolve) => {
        setTimeout(() => {
          setDashboardData((prev) => ({
            ...prev,
            stats: {
              ...prev.stats,
              pendingJobs: prev.stats.pendingJobs + 2,
              completedJobs: prev.stats.completedJobs + 3,
            },
          }))
          resolve(null)
        }, 1500)
      }),
    )
  }

  const refreshJobs = async () => {
    await withJobsLoading(
      new Promise((resolve) => {
        setTimeout(() => {
          setDashboardData((prev) => ({
            ...prev,
            recentJobs: [
              { id: 4, name: "Contrato nuevo", printer: "Canon PIXMA", status: "En cola", date: "2023-05-17" },
              ...prev.recentJobs.slice(0, 2),
            ],
          }))
          resolve(null)
        }, 2000)
      }),
    )
  }

  const refreshAll = async () => {
    await withRefreshLoading(loadDashboardData())
  }

  const handlePrinterSelect = (printer: PrinterType) => {
    setSelectedPrinter(printer)
    setPrinterDialogOpen(true)
  }

  const handleWarehouseSelect = (warehouseId: string) => {
    setSelectedWarehouseId(warehouseId)
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const jobsTableColumns = ["ID", "Nombre", "Impresora", "Estado", "Fecha", "Acciones"]
  const selectedWarehouse = warehouses.find((w) => w.id === selectedWarehouseId)!
  const warehousePrinters = getPrintersByWarehouse(selectedWarehouseId)
  const warehouseJobs = getJobsByWarehouse(selectedWarehouseId)

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#20509E]">PrintFlow Manager Dashboard</h1>
        <LoadingButton
          isLoading={isRefreshLoading}
          onClick={refreshAll}
          variant="outline"
          className="border-[#20509E] text-[#20509E]"
          loaderColor="primary"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar Todo
        </LoadingButton>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <LayoutDashboard className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="printers" className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            Impresoras
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Trabajos
          </TabsTrigger>
          <TabsTrigger value="warehouses" className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            Vista de Almacenes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <LoadingSection isLoading={isStatsLoading} message="Actualizando estadísticas...">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total de Impresoras</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#20509E]">{dashboardData?.stats?.totalPrinters || 0}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Impresoras Activas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#20509E]">{dashboardData?.stats?.activePrinters || 0}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Trabajos Pendientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#CDA22A]">{dashboardData?.stats?.pendingJobs || 0}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Trabajos Completados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">{dashboardData?.stats?.completedJobs || 0}</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end mb-4">
              <Button onClick={refreshStats} className="bg-[#20509E] hover:bg-[#184589]">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar Estadísticas
              </Button>
            </div>
          </LoadingSection>

          <LoadingSection isLoading={isJobsLoading} message="Actualizando trabajos recientes...">
            <Card>
              <CardHeader>
                <CardTitle>Trabajos Recientes</CardTitle>
                <CardDescription>Los últimos trabajos de impresión enviados al sistema.</CardDescription>
              </CardHeader>
              <CardContent>
                <LoadingTable isLoading={false} columns={jobsTableColumns}>
                  {dashboardData?.recentJobs?.map((job) => (
                    <tr key={job.id}>
                      <td>{job.id}</td>
                      <td>{job.name}</td>
                      <td>{job.printer}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            job.status === "Completado"
                              ? "bg-green-100 text-green-800"
                              : job.status === "En cola"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td>{job.date}</td>
                      <td>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </LoadingTable>
              </CardContent>
              <CardFooter>
                <Button onClick={refreshJobs} className="bg-[#20509E] hover:bg-[#184589]">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar Trabajos
                </Button>
              </CardFooter>
            </Card>
          </LoadingSection>
        </TabsContent>

        <TabsContent value="printers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Impresoras</CardTitle>
              <CardDescription>Administra las impresoras conectadas al sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md">Impresora {index + 1}</CardTitle>
                        <Printer className="h-5 w-5 text-[#20509E]" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">Modelo: HP LaserJet Pro {1000 + index * 100}</p>
                      <p className="text-sm text-gray-500">IP: 192.168.1.{100 + index}</p>
                      <p className="text-sm text-gray-500">Estado: {index % 3 === 0 ? "Inactiva" : "Activa"}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cola de Trabajos</CardTitle>
              <CardDescription>Administra los trabajos de impresión en cola.</CardDescription>
            </CardHeader>
            <CardContent>
              <LoadingTable
                isLoading={false}
                columns={["ID", "Nombre", "Impresora", "Estado", "Prioridad", "Acciones"]}
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>Documento {index + 1}</td>
                    <td>Impresora {(index % 3) + 1}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          index % 4 === 0
                            ? "bg-green-100 text-green-800"
                            : index % 4 === 1
                              ? "bg-yellow-100 text-yellow-800"
                              : index % 4 === 2
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {index % 4 === 0
                          ? "Completado"
                          : index % 4 === 1
                            ? "En cola"
                            : index % 4 === 2
                              ? "Imprimiendo"
                              : "Error"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          index % 3 === 0
                            ? "bg-gray-100 text-gray-800"
                            : index % 3 === 1
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {index % 3 === 0 ? "Normal" : index % 3 === 1 ? "Alta" : "Urgente"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                          Cancelar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </LoadingTable>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <WarehouseSelector
                warehouses={warehouses}
                selectedWarehouseId={selectedWarehouseId}
                onWarehouseSelect={handleWarehouseSelect}
              />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <WarehouseFloorPlan
                warehouse={{
                  ...selectedWarehouse,
                  printers: warehousePrinters,
                }}
                onPrinterSelect={handlePrinterSelect}
              />

              <PrinterJobList jobs={warehouseJobs} title={`Trabajos en ${selectedWarehouse.name}`} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <PrinterDetailsDialog printer={selectedPrinter} open={printerDialogOpen} onOpenChange={setPrinterDialogOpen} />
    </div>
  )
}
