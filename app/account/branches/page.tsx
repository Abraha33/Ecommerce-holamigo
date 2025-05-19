"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, MapPin, Phone, Building, Trash2, Edit } from "lucide-react"
import AccountSidebar from "@/components/account-sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Datos de ejemplo
const branches = [
  {
    id: 1,
    name: "Sede Principal",
    address: "Calle 123 #45-67, Bogotá",
    phone: "601 234 5678",
    type: "Oficina",
  },
  {
    id: 2,
    name: "Sucursal Norte",
    address: "Avenida 7 #82-30, Bogotá",
    phone: "601 987 6543",
    type: "Almacén",
  },
]

// Esquema de validación con Zod
const branchFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  city: z.string().min(3, "La ciudad debe tener al menos 3 caracteres"),
  phone: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 caracteres")
    .regex(/^[0-9 ]+$/, "El teléfono solo debe contener números y espacios"),
  type: z.string({
    required_error: "Debe seleccionar un tipo de sucursal",
  }),
})

type BranchFormValues = z.infer<typeof branchFormSchema>

export default function BranchesPage() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [showAddBranchModal, setShowAddBranchModal] = useState(false)

  // Configuración del formulario con validaciones
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      phone: "",
      type: "",
    },
  })

  const handleDelete = (id: number) => {
    // Aquí iría la lógica para eliminar la sucursal
    console.log(`Eliminando sucursal ${id}`)
    toast({
      title: "Sucursal eliminada",
      description: "La sucursal ha sido eliminada correctamente",
    })
    setShowDeleteConfirm(null)
  }

  const onSubmit = (data: BranchFormValues) => {
    console.log("Datos del formulario:", data)
    // Aquí iría la lógica para agregar la sucursal
    toast({
      title: "Sucursal agregada",
      description: "La sucursal ha sido agregada exitosamente",
    })
    setShowAddBranchModal(false)
    form.reset()
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
                <h2 className="text-xl font-semibold text-gray-800">Sucursales</h2>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => setShowAddBranchModal(true)}
                >
                  <PlusCircle size={16} className="mr-2" /> Añadir sucursal
                </Button>
              </div>

              {/* Lista de sucursales */}
              <div className="space-y-4">
                {branches.map((branch) => (
                  <Card
                    key={branch.id}
                    className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6 relative">
                      {showDeleteConfirm === branch.id && (
                        <div className="absolute inset-0 bg-white bg-opacity-95 rounded-lg flex flex-col items-center justify-center p-4 z-10">
                          <p className="text-center mb-4">¿Estás seguro de que deseas eliminar esta sucursal?</p>
                          <div className="flex gap-3">
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(branch.id)}
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

                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{branch.name}</h3>
                          <div className="space-y-2 text-gray-600">
                            <div className="flex items-center">
                              <MapPin size={16} className="mr-2 text-gray-400" />
                              <span>{branch.address}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone size={16} className="mr-2 text-gray-400" />
                              <span>{branch.phone}</span>
                            </div>
                            <div className="flex items-center">
                              <Building size={16} className="mr-2 text-gray-400" />
                              <span>{branch.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowDeleteConfirm(branch.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal para agregar sucursal con validaciones */}
      <Dialog open={showAddBranchModal} onOpenChange={setShowAddBranchModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agregar nueva sucursal</DialogTitle>
            <DialogDescription>
              Complete los datos de la nueva sucursal. Todos los campos marcados con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Sede Principal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Calle 123 #45-67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Bucaramanga" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 601 234 5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="office">Oficina</SelectItem>
                        <SelectItem value="store">Almacén</SelectItem>
                        <SelectItem value="warehouse">Bodega</SelectItem>
                        <SelectItem value="factory">Fábrica</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddBranchModal(false)
                    form.reset()
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar sucursal</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
