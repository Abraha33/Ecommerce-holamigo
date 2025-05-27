"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Search, UserPlus, Edit, Mail, Phone } from "lucide-react"
import Image from "next/image"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "customer" | "admin" | "moderator"
  status: "active" | "inactive" | "suspended"
  registrationDate: string
  lastLogin: string
  orders: number
  totalSpent: number
  avatar?: string
  address: string
}

const mockUsers: User[] = [
  {
    id: "USR-001",
    name: "María García",
    email: "maria@email.com",
    phone: "+57 300 123 4567",
    role: "customer",
    status: "active",
    registrationDate: "2023-12-15",
    lastLogin: "2024-01-15",
    orders: 12,
    totalSpent: 450000,
    address: "Calle 123 #45-67, Bogotá",
  },
  {
    id: "USR-002",
    name: "Carlos López",
    email: "carlos@email.com",
    phone: "+57 301 234 5678",
    role: "customer",
    status: "active",
    registrationDate: "2023-11-20",
    lastLogin: "2024-01-14",
    orders: 8,
    totalSpent: 320000,
    address: "Carrera 45 #12-34, Medellín",
  },
  {
    id: "USR-003",
    name: "Ana Rodríguez",
    email: "ana@email.com",
    phone: "+57 302 345 6789",
    role: "moderator",
    status: "active",
    registrationDate: "2023-10-10",
    lastLogin: "2024-01-13",
    orders: 15,
    totalSpent: 680000,
    address: "Avenida 68 #23-45, Cali",
  },
  {
    id: "USR-004",
    name: "Luis Martínez",
    email: "luis@email.com",
    phone: "+57 303 456 7890",
    role: "customer",
    status: "inactive",
    registrationDate: "2023-09-05",
    lastLogin: "2023-12-20",
    orders: 3,
    totalSpent: 125000,
    address: "Calle 50 #78-90, Barranquilla",
  },
  {
    id: "USR-005",
    name: "Sofia Hernández",
    email: "sofia@email.com",
    phone: "+57 304 567 8901",
    role: "customer",
    status: "suspended",
    registrationDate: "2023-08-15",
    lastLogin: "2024-01-05",
    orders: 2,
    totalSpent: 89000,
    address: "Carrera 15 #34-56, Cartagena",
  },
]

const roleColors = {
  customer: "bg-blue-100 text-blue-800",
  admin: "bg-purple-100 text-purple-800",
  moderator: "bg-green-100 text-green-800",
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-red-100 text-red-800",
}

const roleLabels = {
  customer: "Cliente",
  admin: "Administrador",
  moderator: "Moderador",
}

const statusLabels = {
  active: "Activo",
  inactive: "Inactivo",
  suspended: "Suspendido",
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { toast } = useToast()

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const updateUserStatus = (userId: string, newStatus: User["status"]) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
    toast({
      title: "Estado actualizado",
      description: `El usuario ha sido actualizado a ${statusLabels[newStatus]}`,
    })
  }

  const viewUserDetails = (user: User) => {
    setSelectedUser(user)
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra todos los usuarios de la plataforma</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>Añade un nuevo usuario al sistema</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" placeholder="Nombre del usuario" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@ejemplo.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="+57 300 123 4567" />
                </div>
                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Cliente</SelectItem>
                      <SelectItem value="moderator">Moderador</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" placeholder="Dirección completa" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    setIsCreateOpen(false)
                    toast({
                      title: "Usuario creado",
                      description: "El nuevo usuario ha sido creado exitosamente",
                    })
                  }}
                >
                  Crear Usuario
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="customer">Cliente</SelectItem>
                <SelectItem value="moderator">Moderador</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
                <SelectItem value="suspended">Suspendido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Usuarios Activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{users.filter((u) => u.role === "customer").length}</div>
            <p className="text-xs text-muted-foreground">Clientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
            <p className="text-xs text-muted-foreground">Administradores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{users.filter((u) => u.status === "suspended").length}</div>
            <p className="text-xs text-muted-foreground">Suspendidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios ({filteredUsers.length})</CardTitle>
          <CardDescription>Lista de todos los usuarios registrados en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Usuario</th>
                  <th className="text-left p-4 font-medium">Contacto</th>
                  <th className="text-left p-4 font-medium">Rol</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-left p-4 font-medium">Pedidos</th>
                  <th className="text-left p-4 font-medium">Total Gastado</th>
                  <th className="text-left p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          {user.avatar ? (
                            <Image
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground font-mono">{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={roleColors[user.role]}>{roleLabels[user.role]}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={statusColors[user.status]}>{statusLabels[user.status]}</Badge>
                    </td>
                    <td className="p-4 text-center font-medium">{user.orders}</td>
                    <td className="p-4 font-medium">${user.totalSpent.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => viewUserDetails(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Select
                          value={user.status}
                          onValueChange={(value) => updateUserStatus(user.id, value as User["status"])}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Activo</SelectItem>
                            <SelectItem value="inactive">Inactivo</SelectItem>
                            <SelectItem value="suspended">Suspendido</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalles del usuario */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
            <DialogDescription>Información completa y configuración del usuario</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xl font-medium">{selectedUser.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Teléfono</Label>
                  <p className="text-sm">{selectedUser.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Rol</Label>
                  <Badge className={roleColors[selectedUser.role]}>{roleLabels[selectedUser.role]}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado</Label>
                  <Badge className={statusColors[selectedUser.status]}>{statusLabels[selectedUser.status]}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fecha de Registro</Label>
                  <p className="text-sm">{selectedUser.registrationDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Último Acceso</Label>
                  <p className="text-sm">{selectedUser.lastLogin}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Dirección</Label>
                <p className="text-sm">{selectedUser.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Total de Pedidos</Label>
                  <p className="text-lg font-bold">{selectedUser.orders}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Gastado</Label>
                  <p className="text-lg font-bold">${selectedUser.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
