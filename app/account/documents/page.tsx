"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Download, Eye, Calendar, FileIcon } from "lucide-react"
import AccountSidebar from "@/components/account-sidebar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

// Datos de ejemplo
const documents = [
  {
    id: 1,
    name: "Factura #INV-2023-001",
    type: "invoice",
    date: "15 Abr 2023",
    size: "245 KB",
    status: "Pagada",
    items: [
      { id: 1, name: "Producto A", quantity: 2, price: 50000, total: 100000 },
      { id: 2, name: "Producto B", quantity: 1, price: 75000, total: 75000 },
    ],
    subtotal: 175000,
    tax: 33250,
    total: 208250,
    paymentMethod: "Tarjeta de crédito",
    invoiceNumber: "INV-2023-001",
  },
  {
    id: 2,
    name: "Factura electrónica #FE-2023-045",
    type: "electronic",
    date: "10 Mar 2023",
    size: "1.2 MB",
    status: "Pagada",
    items: [{ id: 1, name: "Servicio Premium", quantity: 1, price: 120000, total: 120000 }],
    subtotal: 120000,
    tax: 22800,
    total: 142800,
    paymentMethod: "Transferencia bancaria",
    invoiceNumber: "FE-2023-045",
    cufe: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
  },
  {
    id: 3,
    name: "Factura #INV-2023-078",
    type: "invoice",
    date: "05 Feb 2023",
    size: "320 KB",
    status: "Pagada",
    items: [
      { id: 1, name: "Producto C", quantity: 3, price: 35000, total: 105000 },
      { id: 2, name: "Producto D", quantity: 2, price: 45000, total: 90000 },
      { id: 3, name: "Producto E", quantity: 1, price: 60000, total: 60000 },
    ],
    subtotal: 255000,
    tax: 48450,
    total: 303450,
    paymentMethod: "Efectivo",
    invoiceNumber: "INV-2023-078",
  },
  {
    id: 4,
    name: "Factura electrónica #FE-2023-102",
    type: "electronic",
    date: "28 Abr 2023",
    size: "268 KB",
    status: "Pendiente",
    items: [{ id: 1, name: "Producto F", quantity: 1, price: 180000, total: 180000 }],
    subtotal: 180000,
    tax: 34200,
    total: 214200,
    paymentMethod: "Pendiente",
    invoiceNumber: "FE-2023-102",
    cufe: "z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0",
  },
]

export default function DocumentsPage() {
  const [filter, setFilter] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null)
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false)
  const [changeRequestReason, setChangeRequestReason] = useState("")

  const filteredDocuments = filter ? documents.filter((doc) => doc.type === filter) : documents

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document)
  }

  const handleSubmitChangeRequest = () => {
    if (!changeRequestReason.trim()) {
      toast({
        title: "Error",
        description: "Por favor, indica el motivo de la solicitud de cambio",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Solicitud enviada",
      description: "Tu solicitud de cambio de factura ha sido enviada correctamente",
    })
    setShowChangeRequestModal(false)
    setChangeRequestReason("")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="bg-gradient-to-r from-red-100 to-red-50 text-red-600 py-3 px-4 text-center font-semibold shadow-sm">
        ¡ERES UN CLIENTE MAYORISTA!
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar compartido */}
          <AccountSidebar />

          {/* Contenido principal */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Mis facturas</h2>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => setShowChangeRequestModal(true)}
                >
                  Solicitar cambio de factura
                </Button>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={filter === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(null)}
                  className={filter === null ? "bg-blue-600" : ""}
                >
                  Todas
                </Button>
                <Button
                  variant={filter === "invoice" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("invoice")}
                  className={filter === "invoice" ? "bg-blue-600" : ""}
                >
                  Facturas
                </Button>
                <Button
                  variant={filter === "electronic" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("electronic")}
                  className={filter === "electronic" ? "bg-blue-600" : ""}
                >
                  Facturas electrónicas
                </Button>
              </div>

              {/* Lista de documentos */}
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-lg ${
                            doc.type === "invoice"
                              ? "bg-blue-100"
                              : doc.type === "electronic"
                                ? "bg-purple-100"
                                : "bg-green-100"
                          }`}
                        >
                          <FileIcon
                            size={24}
                            className={
                              doc.type === "invoice"
                                ? "text-blue-600"
                                : doc.type === "electronic"
                                  ? "text-purple-600"
                                  : "text-green-600"
                            }
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{doc.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {doc.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText size={14} />
                              {doc.size}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                doc.status === "Pagada"
                                  ? "bg-green-100 text-green-700"
                                  : doc.status === "Pendiente"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {doc.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200"
                          onClick={() => handleViewDocument(doc)}
                        >
                          <Eye size={16} className="mr-1" /> Ver
                        </Button>
                        <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                          <Download size={16} className="mr-1" /> Descargar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {filteredDocuments.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay facturas</h3>
                    <p className="text-gray-500 mb-4">No se encontraron facturas con los filtros seleccionados.</p>
                    <Button onClick={() => setFilter(null)} className="bg-blue-600 hover:bg-blue-700">
                      Ver todas las facturas
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para ver detalle de factura */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Detalle de factura</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="py-4">
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{selectedDocument.name}</h3>
                    <p className="text-sm text-gray-500">Fecha: {selectedDocument.date}</p>
                  </div>
                  <Badge
                    className={
                      selectedDocument.status === "Pagada"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    }
                  >
                    {selectedDocument.status}
                  </Badge>
                </div>
                {selectedDocument.type === "electronic" && (
                  <div className="mt-2 text-xs text-gray-500">
                    <p>CUFE: {selectedDocument.cufe}</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Detalles de la compra</h4>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Producto
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Cantidad
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Precio
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedDocument.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(selectedDocument.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA (19%):</span>
                  <span>{formatCurrency(selectedDocument.tax)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedDocument.total)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-gray-600">Método de pago:</span>
                  <span>{selectedDocument.paymentMethod}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDocument(null)}>
              Cerrar
            </Button>
            <Button>Descargar PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para solicitar cambio de factura */}
      <Dialog open={showChangeRequestModal} onOpenChange={setShowChangeRequestModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Solicitar cambio de factura
            </DialogTitle>
            <DialogDescription>
              Completa el formulario para solicitar un cambio en alguna de tus facturas.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Tabs defaultValue="reason">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reason">Motivo</TabsTrigger>
                <TabsTrigger value="invoice">Factura</TabsTrigger>
              </TabsList>
              <TabsContent value="reason" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="reason" className="text-sm font-medium">
                    Motivo de la solicitud *
                  </label>
                  <select
                    id="reason"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    value={changeRequestReason}
                    onChange={(e) => setChangeRequestReason(e.target.value)}
                  >
                    <option value="">Selecciona un motivo</option>
                    <option value="error-data">Error en los datos fiscales</option>
                    <option value="missing-items">Productos faltantes</option>
                    <option value="wrong-price">Precio incorrecto</option>
                    <option value="duplicate">Factura duplicada</option>
                    <option value="other">Otro motivo</option>
                  </select>
                </div>
                {changeRequestReason === "other" && (
                  <div className="space-y-2">
                    <label htmlFor="custom-reason" className="text-sm font-medium">
                      Especifica el motivo *
                    </label>
                    <textarea
                      id="custom-reason"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-[100px]"
                      placeholder="Describe detalladamente el motivo de tu solicitud..."
                    ></textarea>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="invoice" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="invoice" className="text-sm font-medium">
                    Selecciona la factura *
                  </label>
                  <select id="invoice" className="w-full border border-gray-300 rounded-md p-2 text-sm">
                    <option value="">Selecciona una factura</option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} - {doc.date}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="additional-info" className="text-sm font-medium">
                    Información adicional
                  </label>
                  <textarea
                    id="additional-info"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-[100px]"
                    placeholder="Proporciona cualquier información adicional que pueda ser útil..."
                  ></textarea>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangeRequestModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitChangeRequest}>Enviar solicitud</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
