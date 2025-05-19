"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, MapPin, Plus, Edit, Trash2 } from "lucide-react"
import { createClientComponentClient } from "@/lib/supabase"

type Address = {
  id: string
  name: string
  recipient: string
  address: string
  neighborhood: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
  is_default: boolean
  additional_info?: string
}

type AddressesTabProps = {
  userId: string
}

export default function AddressesTab({ userId }: AddressesTabProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", userId)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setAddresses(data || [])
      } catch (error) {
        console.error("Error fetching addresses:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las direcciones",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAddresses()
  }, [userId, toast])

  const handleSetDefault = async (addressId: string) => {
    try {
      const supabase = createClientComponentClient()

      // First, set all addresses to non-default
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId)

      // Then set the selected address as default
      const { error } = await supabase.from("addresses").update({ is_default: true }).eq("id", addressId)

      if (error) {
        throw error
      }

      // Update local state
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          is_default: addr.id === addressId,
        })),
      )

      toast({
        title: "Dirección actualizada",
        description: "La dirección ha sido establecida como predeterminada",
      })
    } catch (error) {
      console.error("Error setting default address:", error)
      toast({
        title: "Error",
        description: "No se pudo establecer la dirección como predeterminada",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta dirección?")) {
      return
    }

    try {
      const supabase = createClientComponentClient()
      const { error } = await supabase.from("addresses").delete().eq("id", addressId)

      if (error) {
        throw error
      }

      // Update local state
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId))

      toast({
        title: "Dirección eliminada",
        description: "La dirección ha sido eliminada correctamente",
      })
    } catch (error) {
      console.error("Error deleting address:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la dirección",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Mis direcciones</h3>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Añadir dirección
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No tienes direcciones guardadas</h3>
          <p className="text-gray-500 mb-4">Añade una dirección para agilizar tus compras</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Añadir mi primera dirección
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className="p-4 relative">
              {address.is_default && (
                <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                  Predeterminada
                </span>
              )}

              <div className="mb-4 mt-2">
                <h4 className="font-medium">{address.name}</h4>
                <p className="text-sm text-gray-500">{address.recipient}</p>
              </div>

              <div className="space-y-1 text-sm mb-4">
                <p>{address.address}</p>
                {address.neighborhood && <p>{address.neighborhood}</p>}
                <p>
                  {address.city}, {address.state} {address.postal_code}
                </p>
                <p>{address.country}</p>
                <p className="mt-2">{address.phone}</p>
                {address.additional_info && <p className="text-gray-500 italic mt-2">{address.additional_info}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>

                {!address.is_default && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Establecer como predeterminada
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 flex items-center"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
