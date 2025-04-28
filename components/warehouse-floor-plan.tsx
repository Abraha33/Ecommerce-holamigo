"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Printer, AlertTriangle, CheckCircle, Clock, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

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
}

interface WarehouseData {
  id: string
  name: string
  printers: PrinterData[]
  dimensions: { width: number; height: number }
}

interface WarehouseFloorPlanProps {
  warehouse: WarehouseData
  onPrinterSelect: (printer: PrinterData) => void
}

export function WarehouseFloorPlan({ warehouse, onPrinterSelect }: WarehouseFloorPlanProps) {
  const [hoveredPrinter, setHoveredPrinter] = useState<string | null>(null)

  const getStatusColor = (status: PrinterStatus) => {
    switch (status) {
      case "idle":
        return "bg-green-100 border-green-300"
      case "printing":
        return "bg-blue-100 border-blue-300"
      case "error":
        return "bg-red-100 border-red-300"
      case "maintenance":
        return "bg-yellow-100 border-yellow-300"
      case "offline":
        return "bg-gray-100 border-gray-300"
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

  const getJobTypeIcon = (type: JobType) => {
    switch (type) {
      case "document":
        return <span className="text-blue-600">📄</span>
      case "order":
        return <span className="text-green-600">📦</span>
      case "return":
        return <span className="text-red-600">↩️</span>
      case "report":
        return <span className="text-purple-600">📊</span>
    }
  }

  const getPendingJobsCount = (printer: PrinterData) => {
    return printer.jobs.filter((job) => job.status === "pending").length
  }

  const getProcessingJobsCount = (printer: PrinterData) => {
    return printer.jobs.filter((job) => job.status === "processing").length
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-gray-50">
        <CardTitle className="flex items-center justify-between">
          <span>{warehouse.name}</span>
          <Badge variant="outline" className="ml-2">
            {warehouse.printers.length} impresoras
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div
          className="relative bg-gray-50 border border-dashed border-gray-300 rounded-lg"
          style={{
            width: "100%",
            height: "500px",
            backgroundImage: 'url("/warehouse-grid.png")',
            backgroundSize: "20px 20px",
            backgroundRepeat: "repeat",
          }}
        >
          {warehouse.printers.map((printer) => (
            <div
              key={printer.id}
              className={cn(
                "absolute flex flex-col items-center cursor-pointer transition-all duration-200",
                hoveredPrinter === printer.id ? "z-10 scale-105" : "z-0",
              )}
              style={{
                left: `${(printer.position.x / warehouse.dimensions.width) * 100}%`,
                top: `${(printer.position.y / warehouse.dimensions.height) * 100}%`,
              }}
              onClick={() => onPrinterSelect(printer)}
              onMouseEnter={() => setHoveredPrinter(printer.id)}
              onMouseLeave={() => setHoveredPrinter(null)}
            >
              <div
                className={cn(
                  "relative p-3 rounded-lg border-2 shadow-md",
                  getStatusColor(printer.status),
                  hoveredPrinter === printer.id ? "shadow-lg" : "",
                )}
                style={{ width: "120px", height: "80px" }}
              >
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-primary">{printer.id}</Badge>
                </div>
                <div className="flex flex-col h-full justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs truncate">{printer.name}</span>
                    {getStatusIcon(printer.status)}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {printer.jobs.slice(0, 3).map((job) => (
                      <span key={job.id} title={job.name}>
                        {getJobTypeIcon(job.type)}
                      </span>
                    ))}
                    {printer.jobs.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{printer.jobs.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-1 text-xs">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {getPendingJobsCount(printer)}
                    </span>
                    <span className="flex items-center">
                      <Printer className="h-3 w-3 mr-1" />
                      {getProcessingJobsCount(printer)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-1 text-xs font-medium">{printer.model}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
