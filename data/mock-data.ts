// Tipos
export type PrinterStatus = "idle" | "printing" | "error" | "maintenance" | "offline"
export type JobType = "document" | "order" | "return" | "report"

export interface Job {
  id: string
  name: string
  type: JobType
  status: "pending" | "processing" | "completed" | "failed"
  priority: "low" | "normal" | "high" | "urgent"
  submittedAt: string
  pages: number
  printerId: string
  printerName: string
}

export interface Printer {
  id: string
  name: string
  model: string
  status: PrinterStatus
  warehouseId: string
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

export interface Warehouse {
  id: string
  name: string
  printerCount: number
  dimensions: { width: number; height: number }
}

// Datos de ejemplo
export const warehouses: Warehouse[] = [
  {
    id: "wh-1",
    name: "Almacén Central",
    printerCount: 8,
    dimensions: { width: 100, height: 100 },
  },
  {
    id: "wh-2",
    name: "Almacén Norte",
    printerCount: 5,
    dimensions: { width: 80, height: 80 },
  },
  {
    id: "wh-3",
    name: "Almacén Sur",
    printerCount: 3,
    dimensions: { width: 60, height: 60 },
  },
]

export const printers: Printer[] = [
  // Almacén Central
  {
    id: "PR-001",
    name: "HP LaserJet Pro",
    model: "M404dn",
    status: "idle",
    warehouseId: "wh-1",
    position: { x: 20, y: 30 },
    inkLevels: { black: 75 },
    paperLevels: { tray1: 90 },
    ipAddress: "192.168.1.101",
    lastMaintenance: "2023-04-15",
    serialNumber: "VND3B12345",
  },
  {
    id: "PR-002",
    name: "Epson WorkForce",
    model: "WF-3720",
    status: "printing",
    warehouseId: "wh-1",
    position: { x: 60, y: 25 },
    inkLevels: { black: 45, cyan: 60, magenta: 55, yellow: 70 },
    paperLevels: { tray1: 30 },
    ipAddress: "192.168.1.102",
    lastMaintenance: "2023-03-22",
    serialNumber: "X4NJ567890",
  },
  {
    id: "PR-003",
    name: "Brother MFC",
    model: "L8900CDW",
    status: "error",
    warehouseId: "wh-1",
    position: { x: 40, y: 70 },
    inkLevels: { black: 10, cyan: 5, magenta: 15, yellow: 20 },
    paperLevels: { tray1: 0, tray2: 50 },
    ipAddress: "192.168.1.103",
    lastMaintenance: "2023-05-01",
    serialNumber: "U1CV987654",
  },
  {
    id: "PR-004",
    name: "Canon PIXMA",
    model: "TR8520",
    status: "maintenance",
    warehouseId: "wh-1",
    position: { x: 80, y: 50 },
    inkLevels: { black: 30, cyan: 40, magenta: 35, yellow: 25 },
    paperLevels: { tray1: 75 },
    ipAddress: "192.168.1.104",
    lastMaintenance: "2023-02-18",
    serialNumber: "KT7P123456",
  },
  {
    id: "PR-005",
    name: "HP OfficeJet",
    model: "Pro 9015",
    status: "idle",
    warehouseId: "wh-1",
    position: { x: 15, y: 85 },
    inkLevels: { black: 85, cyan: 80, magenta: 75, yellow: 90 },
    paperLevels: { tray1: 100, tray2: 100 },
    ipAddress: "192.168.1.105",
    lastMaintenance: "2023-04-30",
    serialNumber: "YR5T789012",
  },
  {
    id: "PR-006",
    name: "Xerox WorkCentre",
    model: "6515",
    status: "offline",
    warehouseId: "wh-1",
    position: { x: 90, y: 15 },
    inkLevels: { black: 0, cyan: 0, magenta: 0, yellow: 0 },
    paperLevels: { tray1: 0 },
    ipAddress: "192.168.1.106",
    lastMaintenance: "2023-01-15",
    serialNumber: "ZQ8W345678",
  },
  {
    id: "PR-007",
    name: "Lexmark CX",
    model: "522ade",
    status: "printing",
    warehouseId: "wh-1",
    position: { x: 50, y: 50 },
    inkLevels: { black: 65, cyan: 70, magenta: 60, yellow: 55 },
    paperLevels: { tray1: 45, tray2: 60 },
    ipAddress: "192.168.1.107",
    lastMaintenance: "2023-03-10",
    serialNumber: "PL3M901234",
  },
  {
    id: "PR-008",
    name: "Ricoh SP",
    model: "C261SFNw",
    status: "idle",
    warehouseId: "wh-1",
    position: { x: 30, y: 10 },
    inkLevels: { black: 90, cyan: 85, magenta: 95, yellow: 80 },
    paperLevels: { tray1: 70 },
    ipAddress: "192.168.1.108",
    lastMaintenance: "2023-05-05",
    serialNumber: "TH9B567890",
  },

  // Almacén Norte
  {
    id: "PR-009",
    name: "HP LaserJet",
    model: "Enterprise M507",
    status: "idle",
    warehouseId: "wh-2",
    position: { x: 25, y: 25 },
    inkLevels: { black: 80 },
    paperLevels: { tray1: 85, tray2: 90 },
    ipAddress: "192.168.2.101",
    lastMaintenance: "2023-04-20",
    serialNumber: "GF7D123456",
  },
  {
    id: "PR-010",
    name: "Epson EcoTank",
    model: "ET-4760",
    status: "printing",
    warehouseId: "wh-2",
    position: { x: 60, y: 30 },
    inkLevels: { black: 95, cyan: 90, magenta: 92, yellow: 88 },
    paperLevels: { tray1: 60 },
    ipAddress: "192.168.2.102",
    lastMaintenance: "2023-03-15",
    serialNumber: "JK2L789012",
  },
  {
    id: "PR-011",
    name: "Brother HL",
    model: "L3270CDW",
    status: "error",
    warehouseId: "wh-2",
    position: { x: 40, y: 60 },
    inkLevels: { black: 5, cyan: 0, magenta: 10, yellow: 15 },
    paperLevels: { tray1: 10 },
    ipAddress: "192.168.2.103",
    lastMaintenance: "2023-02-28",
    serialNumber: "MN5P345678",
  },
  {
    id: "PR-012",
    name: "Canon imageCLASS",
    model: "MF743Cdw",
    status: "idle",
    warehouseId: "wh-2",
    position: { x: 70, y: 50 },
    inkLevels: { black: 70, cyan: 65, magenta: 75, yellow: 60 },
    paperLevels: { tray1: 50, tray2: 40 },
    ipAddress: "192.168.2.104",
    lastMaintenance: "2023-05-02",
    serialNumber: "RS6T901234",
  },
  {
    id: "PR-013",
    name: "HP Color LaserJet",
    model: "Pro M255dw",
    status: "maintenance",
    warehouseId: "wh-2",
    position: { x: 15, y: 75 },
    inkLevels: { black: 40, cyan: 35, magenta: 30, yellow: 45 },
    paperLevels: { tray1: 25 },
    ipAddress: "192.168.2.105",
    lastMaintenance: "2023-01-25",
    serialNumber: "UV8W567890",
  },

  // Almacén Sur
  {
    id: "PR-014",
    name: "Epson Expression",
    model: "XP-7100",
    status: "idle",
    warehouseId: "wh-3",
    position: { x: 30, y: 30 },
    inkLevels: { black: 85, cyan: 80, magenta: 75, yellow: 90 },
    paperLevels: { tray1: 70 },
    ipAddress: "192.168.3.101",
    lastMaintenance: "2023-04-10",
    serialNumber: "XY9Z123456",
  },
  {
    id: "PR-015",
    name: "Brother MFC",
    model: "J5945DW",
    status: "printing",
    warehouseId: "wh-3",
    position: { x: 50, y: 40 },
    inkLevels: { black: 60, cyan: 55, magenta: 65, yellow: 50 },
    paperLevels: { tray1: 40, tray2: 30 },
    ipAddress: "192.168.3.102",
    lastMaintenance: "2023-03-05",
    serialNumber: "AB1C789012",
  },
  {
    id: "PR-016",
    name: "Canon MAXIFY",
    model: "GX7020",
    status: "offline",
    warehouseId: "wh-3",
    position: { x: 20, y: 60 },
    inkLevels: { black: 0, cyan: 0, magenta: 0, yellow: 0 },
    paperLevels: { tray1: 0 },
    ipAddress: "192.168.3.103",
    lastMaintenance: "2023-02-15",
    serialNumber: "DE3F345678",
  },
]

export const jobs: Job[] = [
  // Almacén Central
  {
    id: "JOB-001",
    name: "Informe mensual de ventas",
    type: "report",
    status: "pending",
    priority: "high",
    submittedAt: "2023-05-15T09:30:00",
    pages: 15,
    printerId: "PR-001",
    printerName: "HP LaserJet Pro",
  },
  {
    id: "JOB-002",
    name: "Factura #1234",
    type: "document",
    status: "processing",
    priority: "normal",
    submittedAt: "2023-05-15T10:15:00",
    pages: 2,
    printerId: "PR-002",
    printerName: "Epson WorkForce",
  },
  {
    id: "JOB-003",
    name: "Pedido #5678",
    type: "order",
    status: "pending",
    priority: "urgent",
    submittedAt: "2023-05-15T10:45:00",
    pages: 3,
    printerId: "PR-001",
    printerName: "HP LaserJet Pro",
  },
  {
    id: "JOB-004",
    name: "Devolución #9012",
    type: "return",
    status: "pending",
    priority: "normal",
    submittedAt: "2023-05-15T11:00:00",
    pages: 1,
    printerId: "PR-005",
    printerName: "HP OfficeJet",
  },
  {
    id: "JOB-005",
    name: "Presentación Q2",
    type: "document",
    status: "processing",
    priority: "high",
    submittedAt: "2023-05-15T11:30:00",
    pages: 25,
    printerId: "PR-007",
    printerName: "Lexmark CX",
  },
  {
    id: "JOB-006",
    name: "Contrato nuevo",
    type: "document",
    status: "pending",
    priority: "high",
    submittedAt: "2023-05-15T12:00:00",
    pages: 10,
    printerId: "PR-008",
    printerName: "Ricoh SP",
  },
  {
    id: "JOB-007",
    name: "Pedido #5679",
    type: "order",
    status: "pending",
    priority: "normal",
    submittedAt: "2023-05-15T12:15:00",
    pages: 2,
    printerId: "PR-001",
    printerName: "HP LaserJet Pro",
  },
  {
    id: "JOB-008",
    name: "Informe de gastos",
    type: "report",
    status: "pending",
    priority: "low",
    submittedAt: "2023-05-15T12:30:00",
    pages: 8,
    printerId: "PR-005",
    printerName: "HP OfficeJet",
  },

  // Almacén Norte
  {
    id: "JOB-009",
    name: "Inventario semanal",
    type: "report",
    status: "pending",
    priority: "normal",
    submittedAt: "2023-05-15T09:00:00",
    pages: 20,
    printerId: "PR-009",
    printerName: "HP LaserJet",
  },
  {
    id: "JOB-010",
    name: "Pedido #5680",
    type: "order",
    status: "processing",
    priority: "high",
    submittedAt: "2023-05-15T09:45:00",
    pages: 3,
    printerId: "PR-010",
    printerName: "Epson EcoTank",
  },
  {
    id: "JOB-011",
    name: "Devolución #9013",
    type: "return",
    status: "pending",
    priority: "normal",
    submittedAt: "2023-05-15T10:30:00",
    pages: 1,
    printerId: "PR-012",
    printerName: "Canon imageCLASS",
  },
  {
    id: "JOB-012",
    name: "Manual de usuario",
    type: "document",
    status: "pending",
    priority: "low",
    submittedAt: "2023-05-15T11:15:00",
    pages: 45,
    printerId: "PR-009",
    printerName: "HP LaserJet",
  },

  // Almacén Sur
  {
    id: "JOB-013",
    name: "Catálogo de productos",
    type: "document",
    status: "pending",
    priority: "normal",
    submittedAt: "2023-05-15T09:15:00",
    pages: 30,
    printerId: "PR-014",
    printerName: "Epson Expression",
  },
  {
    id: "JOB-014",
    name: "Pedido #5681",
    type: "order",
    status: "processing",
    priority: "urgent",
    submittedAt: "2023-05-15T10:00:00",
    pages: 2,
    printerId: "PR-015",
    printerName: "Brother MFC",
  },
  {
    id: "JOB-015",
    name: "Informe trimestral",
    type: "report",
    status: "pending",
    priority: "high",
    submittedAt: "2023-05-15T10:45:00",
    pages: 18,
    printerId: "PR-014",
    printerName: "Epson Expression",
  },
]

// Funciones auxiliares
export function getPrintersByWarehouse(warehouseId: string): Printer[] {
  return printers.filter((printer) => printer.warehouseId === warehouseId)
}

export function getJobsByWarehouse(warehouseId: string): Job[] {
  const warehousePrinterIds = printers
    .filter((printer) => printer.warehouseId === warehouseId)
    .map((printer) => printer.id)

  return jobs.filter((job) => warehousePrinterIds.includes(job.printerId))
}

export function getJobsByPrinter(printerId: string): Job[] {
  return jobs.filter((job) => job.printerId === printerId)
}
