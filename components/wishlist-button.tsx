"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState } from "react"
import { ListPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface WishlistButtonProps {
  productId: number
  productName: string
  variant?: "icon" | "full"
  className?: string
}

export function WishlistButton({ productId, productName, variant = "icon", className = "" }: WishlistButtonProps) {
  const [open, setOpen] = useState(false)
  const [selectedList, setSelectedList] = useState("")
  const [newListName, setNewListName] = useState("")
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const { toast } = useToast()

  // Mock wishlist data
  const wishlists = [
    { id: "1", name: "Compra negocio", productCount: 12 },
    { id: "2", name: "Productos favoritos", productCount: 5 },
  ]

  const handleAddToWishlist = () => {
    if (isCreatingNew && newListName) {
      // Logic to create new list and add product
      toast({
        title: "Lista creada",
        description: `${productName} agregado a "${newListName}"`,
      })
    } else if (selectedList) {
      // Logic to add to existing list
      const list = wishlists.find((list) => list.id === selectedList)
      toast({
        title: "Producto agregado",
        description: `${productName} agregado a "${list?.name}"`,
      })
    }

    setOpen(false)
    setNewListName("")
    setIsCreatingNew(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="outline"
            size="icon"
            className={`hover:text-[#004a93] border border-gray-300 bg-white shadow-sm ${className}`}
            aria-label="Agregar a lista de mercado"
          >
            <ListPlus className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        ) : (
          <Button
            variant="outline"
            className={`flex items-center gap-2 border-[#004a93] text-[#004a93] bg-white shadow-sm ${className}`}
          >
            <ListPlus className="h-4 w-4" />
            Agregar a lista
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar a lista</DialogTitle>
          <DialogDescription>
            Selecciona una lista existente o crea una nueva para guardar este producto.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={isCreatingNew ? "new" : selectedList}
            onValueChange={(value) => {
              if (value === "new") {
                setIsCreatingNew(true)
                setSelectedList("")
              } else {
                setIsCreatingNew(false)
                setSelectedList(value)
              }
            }}
          >
            {wishlists.map((list) => (
              <div key={list.id} className="flex items-center space-x-2 mb-2 border rounded-md p-3">
                <RadioGroupItem value={list.id} id={`list-${list.id}`} />
                <Label htmlFor={`list-${list.id}`} className="flex-1 cursor-pointer">
                  <div className="font-medium">{list.name}</div>
                  <div className="text-sm text-muted-foreground">{list.productCount} productos</div>
                </Label>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#004a93]" title="Ver lista">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#004a93]" title="Editar lista">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#e30613]" title="Eliminar lista">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value="new" id="new-list" />
              <Label htmlFor="new-list" className="flex-1 cursor-pointer">
                <div className="font-medium">Crear nueva lista</div>
              </Label>
            </div>
          </RadioGroup>

          {isCreatingNew && (
            <div className="mt-4">
              <Label htmlFor="list-name">Nombre de la lista</Label>
              <Input
                id="list-name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Ej: Mi lista de compras"
                className="mt-1"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleAddToWishlist}
            disabled={(isCreatingNew && !newListName) || (!isCreatingNew && !selectedList)}
            className="bg-[#004a93] hover:bg-[#0071bc]"
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
