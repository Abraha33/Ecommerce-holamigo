"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { ListPlus, Plus, Check, Trash2, Eye, Edit } from "lucide-react"
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
  productImage?: string
  productPrice?: number
  variant?: "icon" | "full"
  className?: string
}

interface WishlistItem {
  id: string
  name: string
  productCount: number
  date: string
  products: {
    id: number
    name: string
    price: number
    image: string
    quantity: number
  }[]
}

export function WishlistButton({
  productId,
  productName,
  productImage = "/placeholder.svg",
  productPrice = 0,
  variant = "icon",
  className = "",
}: WishlistButtonProps) {
  const [open, setOpen] = useState(false)
  const [selectedList, setSelectedList] = useState("")
  const [newListName, setNewListName] = useState("")
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [isEditingList, setIsEditingList] = useState<string | null>(null)
  const [editListName, setEditListName] = useState("")
  const [wishlists, setWishlists] = useState<WishlistItem[]>([])
  const { toast } = useToast()

  // Cargar listas desde localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLists = localStorage.getItem("wishlists")
      if (savedLists) {
        try {
          setWishlists(JSON.parse(savedLists))
        } catch (e) {
          console.error("Error parsing wishlists from localStorage", e)
        }
      }
    }
  }, [open])

  const handleAddToWishlist = () => {
    if (isCreatingNew && newListName.trim()) {
      // Crear una nueva lista con el producto
      const newList = {
        id: `list-${Date.now()}`,
        name: newListName,
        date: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
        productCount: 1,
        products: [
          {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1,
          },
        ],
      }

      const updatedLists = [...wishlists, newList]
      setWishlists(updatedLists)

      // Guardar en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("wishlists", JSON.stringify(updatedLists))
      }

      toast({
        title: "Lista creada",
        description: `${productName} agregado a "${newListName}"`,
        className: "max-w-xs",
      })
    } else if (selectedList) {
      // Añadir a una lista existente
      const updatedLists = wishlists.map((list) => {
        if (list.id === selectedList) {
          // Verificar si el producto ya existe en la lista
          const productExists = list.products.some((p) => p.id === productId)

          if (productExists) {
            toast({
              title: "Producto ya existe",
              description: `${productName} ya está en "${list.name}"`,
              className: "max-w-xs",
            })
            return list
          }

          const updatedProducts = [
            ...list.products,
            {
              id: productId,
              name: productName,
              price: productPrice,
              image: productImage,
              quantity: 1,
            },
          ]

          return {
            ...list,
            products: updatedProducts,
            productCount: updatedProducts.length,
          }
        }
        return list
      })

      setWishlists(updatedLists)

      // Guardar en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("wishlists", JSON.stringify(updatedLists))
      }

      const list = wishlists.find((list) => list.id === selectedList)
      toast({
        title: "Producto agregado",
        description: `${productName} agregado a "${list?.name}"`,
        className: "max-w-xs",
      })
    }

    setOpen(false)
    setNewListName("")
    setIsCreatingNew(false)
    setSelectedList("")
  }

  const handleEditList = (listId: string) => {
    const list = wishlists.find((l) => l.id === listId)
    if (list) {
      setIsEditingList(listId)
      setEditListName(list.name)
    }
  }

  const handleSaveListName = () => {
    if (isEditingList && editListName.trim()) {
      const updatedLists = wishlists.map((list) => (list.id === isEditingList ? { ...list, name: editListName } : list))

      setWishlists(updatedLists)

      // Guardar en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("wishlists", JSON.stringify(updatedLists))
      }

      toast({
        title: "Lista actualizada",
        description: `Nombre cambiado a "${editListName}"`,
        className: "max-w-xs",
      })

      setIsEditingList(null)
      setEditListName("")
    }
  }

  const handleDeleteList = (listId: string) => {
    const updatedLists = wishlists.filter((list) => list.id !== listId)
    setWishlists(updatedLists)

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlists", JSON.stringify(updatedLists))
    }

    toast({
      title: "Lista eliminada",
      description: "La lista ha sido eliminada",
      className: "max-w-xs",
    })

    if (selectedList === listId) {
      setSelectedList("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="outline"
            size="icon"
            className={`hover:text-[#004a93] border border-gray-300 bg-white shadow-sm rounded-full ${className}`}
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
                  {isEditingList === list.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editListName}
                        onChange={(e) => setEditListName(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600"
                        onClick={handleSaveListName}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="font-medium">{list.name}</div>
                      <div className="text-sm text-muted-foreground">{list.productCount} productos</div>
                    </>
                  )}
                </Label>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#004a93]" title="Ver lista">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#004a93]"
                    title="Editar lista"
                    onClick={() => handleEditList(list.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#e30613]"
                    title="Eliminar lista"
                    onClick={() => handleDeleteList(list.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value="new" id="new-list" />
              <Label htmlFor="new-list" className="flex-1 cursor-pointer">
                <div className="font-medium flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Crear nueva lista
                </div>
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
                autoFocus
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
            disabled={(isCreatingNew && !newListName.trim()) || (!isCreatingNew && !selectedList)}
            className="bg-[#004a93] hover:bg-[#0071bc]"
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
