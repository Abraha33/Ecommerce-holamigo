"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Printer, Info, FileText, Settings, AlertTriangle, CheckCircle, Clock, RotateCcw, Droplet } from "lucide-react"

type PrinterStatus = "idle" | "printing" | "error" | "maintenance" | "offline"
type JobType = "document" | "order" | "return" | "report"

interface PrinterJob {
  id: string
  name: string
  type: JobType
  status: "pending" | "processing" | "completed" | "failed"
  priority: "low" | "normal" | "high" | "urgent"
  submittedAt: string
  pages: number
}

interface PrinterData {
  id: string
  name: string
  model: string
  status: PrinterStatus
  jobs: PrinterJob[]
  position: { x: number; y: number }
  inkLevels?: {
    black: number
    cyan?: number
    magenta?: number
    yellow?: number
  }
  paperLevels?: {
    tray1: number
    tray2?: number
  }
  ipAddress?: string
  lastMaintenance?: string
  serialNumber?: string
}

interface PrinterDetailsDialogProps {
  printer: PrinterData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrinterDetailsDialog({ printer, open, onOpenChange }: PrinterDetailsDialogProps) {
  if (!printer) return null

  const getStatusColor = (status: PrinterStatus) => {
    switch (status) {
      case "idle":
        return "bg-green-100 text-green-800 border-green-200"
      case "printing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "offline":
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: PrinterStatus) => {
    switch (status) {
      case "idle":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "printing":
        return <Printer className="h-4 w-4 text-blue-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "maintenance":
        return <RotateCcw className="h-4 w-4 text-yellow-600" />
      case "offline":
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusName = (status: PrinterStatus) => {
    switch (status) {
      case "idle":
        return "Disponible"
      case "printing":
        return "Imprimiendo"
      case "error":
        return "Error"
      case "maintenance":
        return "Mantenimiento"
      case "offline":
        return "Desconectada"
    }
  }

  const getJobTypeIcon = (type: JobType) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4 text-blue-600" />
      case "order":
        return <span className="text-green-600">📦</span>
      case "return":
        return <span className="text-red-600">↩️</span>
      case "report":
        return <span className="text-purple-600">📊</span>
    }
  }

  const getJobTypeName = (type: JobType) => {
    switch (type) {
      case "document":
        return "Documento"
      case "order":
        return "Pedido"
      case "return":
        return "Devolución"
      case "report":
        return "Informe"
    }
  }

  const getPendingJobsCount = () => {
    return printer.jobs.filter((job) => job.status === "pending").length
  }

  const getProcessingJobsCount = () => {
    return printer.jobs.filter((job) => job.status === "processing").length
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Printer className="h-5 w-5 mr-2" />
            {printer.name}
            <Badge className={`ml-2 ${getStatusColor(printer.status)}`}>
              {getStatusIcon(printer.status)}
              <span className="ml-1">{getStatusName(printer.status)}</span>
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Modelo: {printer.model} | ID: {printer.id} | S/N: {printer.serialNumber || "N/A"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="queue">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="queue" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Cola de impresión
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              Estado
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{getPendingJobsCount()}</div>
                  <div className="text-xs text-muted-foreground">Pendientes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{getProcessingJobsCount()}</div>
                  <div className="text-xs text-muted-foreground">Procesando</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Añadir trabajo
              </Button>
            </div>

            <div className="border rounded-lg">
              <div className="p-3 border-b bg-muted/50">
                <div className="font-medium">Cola de trabajos</div>
              </div>
              <div className="divide-y">
                {printer.jobs.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No hay trabajos en cola</div>
                ) : (
                  printer.jobs.map((job) => (
                    <div key={job.id} className="p-3 hover:bg-muted/50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {getJobTypeIcon(job.type)}
                          <span className="ml-2 font-medium">{job.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {job.id}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={job.status === "pending" ? "outline" : "secondary"} className="text-xs">
                            {job.status === "pending" ? "Pendiente" : "Procesando"}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                        <div>
                          Tipo: {getJobTypeName(job.type)} | Páginas: {job.pages} | Enviado:{" "}
                          {new Date(job.submittedAt).toLocaleString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div>
                          Prioridad:{" "}
                          {job.priority === "normal"
                            ? "Normal"
                            : job.priority === "high"
                              ? "Alta"
                              : job.priority === "urgent"
                                ? "Urgente"
                                : "Baja"}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="font-medium flex items-center">
                  <Droplet className="h-4 w-4 mr-1 text-blue-600" />
                  Niveles de tinta
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Negro</span>
                      <span>{printer.inkLevels?.black || 0}%</span>
                    </div>
                    <Progress value={printer.inkLevels?.black || 0} className="h-2" />
                  </div>
                  {printer.inkLevels?.cyan !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cian</span>
                        <span>{printer.inkLevels.cyan}%</span>
                      </div>
                      <Progress value={printer.inkLevels.cyan} className="h-2" />
                    </div>
                  )}
                  {printer.inkLevels?.magenta !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Magenta</span>
                        <span>{printer.inkLevels.magenta}%</span>
                      </div>
                      <Progress value={printer.inkLevels.magenta} className="h-2" />
                    </div>
                  )}
                  {printer.inkLevels?.yellow !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Amarillo</span>
                        <span>{printer.inkLevels.yellow}%</span>
                      </div>
                      <Progress value={printer.inkLevels.yellow} className="h-2" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-gray-600" />
                  Niveles de papel
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Bandeja 1</span>
                      <span>{printer.paperLevels?.tray1 || 0}%</span>
                    </div>
                    <Progress value={printer.paperLevels?.tray1 || 0} className="h-2" />
                  </div>
                  {printer.paperLevels?.tray2 !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Bandeja 2</span>
                        <span>{printer.paperLevels.tray2}%</span>
                      </div>
                      <Progress value={printer.paperLevels.tray2} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-3 space-y-2">
              <div className="font-medium">Información adicional</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dirección IP:</span>
                  <span>{printer.ipAddress || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Último mantenimiento:</span>
                  <span>{printer.lastMaintenance || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trabajos completados:</span>
                  <span>{printer.jobs.filter((j) => j.status === "completed").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trabajos fallidos:</span>
                  <span>{printer.jobs.filter((j) => j.status === "failed").length}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="border rounded-lg p-3 space-y-3">
              <div className="font-medium">Configuración de la impresora</div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración general
                </Button>
                <Button variant="outline" className="justify-start">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Programar mantenimiento
                </Button>
                <Button variant="outline" className="justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Diagnóstico
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Historial de trabajos
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Importamos el componente MoreVertical que faltaba
import { MoreVertical } from "lucide-react"
