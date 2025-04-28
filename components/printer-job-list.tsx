"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, AlertTriangle, CheckCircle } from "lucide-react"

type JobType = "document" | "order" | "return" | "report"

interface Job {
  id: string
  name: string
  type: JobType
  status: "pending" | "processing" | "completed" | "failed"
  priority: "low" | "normal" | "high" | "urgent"
  submittedAt: string
  pages: number
  printerName: string
}

interface PrinterJobListProps {
  jobs: Job[]
  title: string
}

export function PrinterJobList({ jobs, title }: PrinterJobListProps) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "processing":
        return <FileText className="h-4 w-4 text-blue-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusName = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "processing":
        return "Procesando"
      case "completed":
        return "Completado"
      case "failed":
        return "Fallido"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No hay trabajos en este almacén</div>
        ) : (
          <div className="divide-y">
            {jobs.map((job) => (
              <div key={job.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  {getJobTypeIcon(job.type)}
                  <div className="ml-3">
                    <div className="font-medium">{job.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {getJobTypeName(job.type)} • {job.printerName} • {job.pages} páginas
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(job.status)}>
                    {getStatusIcon(job.status)}
                    <span className="ml-1">{getStatusName(job.status)}</span>
                  </Badge>
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
