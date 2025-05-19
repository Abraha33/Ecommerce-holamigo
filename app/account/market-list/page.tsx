"use client"
import { useState } from "react"
import { ShoppingCart, Eye, PlusCircle, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import AccountSidebar from "@/components/account-sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo
const initialMarketLists = [
  {
    id: 1,
    name: "Mi lista de compras",
    products: 0,
    lastUpdated: "5/14/2025",
  },
]

export default function MarketListPage() {
  const { signOut } = useAuth()
  const [marketLists, setMarketLists] = useState(initialMarketLists)
  const [showNewListModal, setShowNewListModal] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const { toast } = useToast()

  const handleCreateList = () => {
    if (!newListName.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la lista no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    const newList = {
      id: Date.now(),
      name: newListName.trim(),
      products: 0,
      lastUpdated: new Date().toLocaleDateString(),
    }

    setMarketLists([...marketLists, newList])
    setNewListName("")
    setShowNewListModal(false)

    toast({
      title: "Lista creada",
      description: "Tu nueva lista de compras ha sido creada exitosamente",
    })
  }

  const handleDeleteList = (id: number) => {
    setMarketLists(marketLists.filter((list) => list.id !== id))
    setShowDeleteConfirm(null)

    toast({
      title: "Lista eliminada",
      description: "La lista ha sido eliminada correctamente",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner superior */}
      <div className="bg-red-100 text-red-600 py-3 px-4 text-center font-semibold">¡ERES UN CLIENTE MAYORISTA!</div>

      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar compartido */}
          <AccountSidebar />

          {/* Contenido principal */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Mis listas de mercado</h2>
                <div className="flex gap-2">
                  <Button variant="outline" className="text-blue-600 border-blue-200">
                    <Eye size={16} className="mr-2" /> Ver todas mis listas
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowNewListModal(true)}>
                    <PlusCircle size={16} className="mr-2" /> Nueva lista
                  </Button>
                </div>
              </div>

              {/* Lista de mercado */}
              <div className="space-y-4">
                {marketLists.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes listas de compras</h3>
                    <p className="text-gray-500 mb-4">Crea tu primera lista para organizar tus compras.</p>
                    <Button onClick={() => setShowNewListModal(true)} className="bg-blue-600 hover:bg-blue-700">
                      <PlusCircle className="mr-2 h-4 w-4" /> Crear lista de compras
                    </Button>
                  </div>
                ) : (
                  marketLists.map((list) => (
                    <div key={list.id} className="border rounded-lg p-4 relative">
                      {showDeleteConfirm === list.id && (
                        <div className="absolute inset-0 bg-white bg-opacity-95 rounded-lg flex flex-col items-center justify-center p-4 z-10">
                          <p className="text-center mb-4">¿Estás seguro de que deseas eliminar esta lista?</p>
                          <div className="flex gap-3">
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteList(list.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </Button>
                            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-medium text-blue-600">{list.name}</h3>
                          <p className="text-sm text-gray-500">
                            {list.products} productos • Actualizada: {list.lastUpdated}
                          </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-2">
                          <Button variant="outline" className="text-blue-600 border-blue-200">
                            <Edit size={16} className="mr-2" /> Editar
                          </Button>
                          <Button
                            variant="outline"
                            className="text-red-600 border-red-200"
                            onClick={() => setShowDeleteConfirm(list.id)}
                          >
                            <Trash2 size={16} className="mr-2" /> Eliminar
                          </Button>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <ShoppingCart size={16} className="mr-2" /> Añadir al carrito
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear nueva lista */}
      <Dialog open={showNewListModal} onOpenChange={setShowNewListModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear nueva lista de compras</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="list-name" className="text-right">
                Nombre
              </Label>
              <Input
                id="list-name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="col-span-3"
                placeholder="Ej: Lista semanal"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNewListName("")
                setShowNewListModal(false)
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateList}>Crear lista</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
