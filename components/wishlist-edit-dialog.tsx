"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useWishlist } from "@/components/wishlist-provider"
import { useToast } from "@/components/ui/use-toast"
import {
  Heart,
  ShoppingBag,
  Star,
  Bookmark,
  Gift,
  Package,
  ShoppingCart,
  Tag,
  Sparkles,
  Award,
  ThumbsUp,
} from "lucide-react"

const AVAILABLE_ICONS = [
  { name: "heart", component: Heart },
  { name: "star", component: Star },
  { name: "bookmark", component: Bookmark },
  { name: "gift", component: Gift },
  { name: "package", component: Package },
  { name: "shopping-bag", component: ShoppingBag },
  { name: "shopping-cart", component: ShoppingCart },
  { name: "tag", component: Tag },
  { name: "sparkles", component: Sparkles },
  { name: "award", component: Award },
  { name: "thumbs-up", component: ThumbsUp },
]

interface WishlistEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  wishlistId?: string // If provided, we're editing an existing wishlist
}

export function WishlistEditDialog({ open, onOpenChange, wishlistId }: WishlistEditDialogProps) {
  const { createWishlist, updateWishlist, getWishlistById } = useWishlist()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("shopping-bag")
  const [isValid, setIsValid] = useState(false)

  // Load existing wishlist data if editing
  useEffect(() => {
    if (open && wishlistId) {
      const wishlist = getWishlistById(wishlistId)
      if (wishlist) {
        setName(wishlist.name)
        setDescription(wishlist.description)
        setSelectedIcon(wishlist.icon)
      }
    } else if (open) {
      // Reset form for new wishlist
      setName("")
      setDescription("")
      setSelectedIcon("shopping-bag")
    }
  }, [open, wishlistId, getWishlistById])

  // Validate form
  useEffect(() => {
    setIsValid(name.trim().length > 0)
  }, [name])

  const handleSubmit = () => {
    if (!isValid) return

    try {
      if (wishlistId) {
        // Update existing wishlist
        updateWishlist(wishlistId, name, selectedIcon, description)
        toast({
          title: "Lista actualizada",
          description: `La lista "${name}" ha sido actualizada correctamente.`,
        })
      } else {
        // Create new wishlist
        const newId = createWishlist(name, selectedIcon, description)
        toast({
          title: "Lista creada",
          description: `La lista "${name}" ha sido creada correctamente.`,
        })
      }
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la lista.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{wishlistId ? "Editar lista" : "Crear nueva lista"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre de la lista*</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Compra negocio, Compra semanal..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el propósito de esta lista..."
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label>Ícono</Label>
            <div className="grid grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map(({ name, component: Icon }) => (
                <Button
                  key={name}
                  type="button"
                  variant={selectedIcon === name ? "default" : "outline"}
                  className={`h-10 w-10 p-0 ${selectedIcon === name ? "bg-orange-400" : ""}`}
                  onClick={() => setSelectedIcon(name)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid} className="bg-orange-400 hover:bg-orange-500">
            {wishlistId ? "Guardar cambios" : "Crear lista"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
