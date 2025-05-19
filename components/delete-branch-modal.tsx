"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@/lib/supabase"

interface DeleteBranchModalProps {
  isOpen: boolean
  onClose: () => void
  branchId: string
  branchName: string
  onDeleted: () => void
}

export function DeleteBranchModal({ isOpen, onClose, branchId, branchName, onDeleted }: DeleteBranchModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      // Delete the branch from the database
      const { error } = await supabase.from("branches").delete().eq("id", branchId)

      if (error) throw error

      toast({
        title: "Sucursal eliminada",
        description: `La sucursal ${branchName} ha sido eliminada correctamente.`,
      })

      onDeleted()
      onClose()
    } catch (error) {
      console.error("Error deleting branch:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la sucursal. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar sucursal</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar la sucursal {branchName}? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Eliminando..." : "Eliminar sucursal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
