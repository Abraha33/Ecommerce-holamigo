"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { ProfileService } from "@/lib/profile-service"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const emailSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido"),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "La confirmación debe tener al menos 8 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type SecurityFormProps = {
  email: string
}

export default function SecurityForm({ email }: SecurityFormProps) {
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const { toast } = useToast()

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: email || "",
    },
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const handleEmailSubmit = async (data: z.infer<typeof emailSchema>) => {
    if (data.email === email) {
      toast({
        title: "Sin cambios",
        description: "El correo electrónico es el mismo que el actual.",
      })
      return
    }

    setIsUpdatingEmail(true)
    try {
      const { success, error } = await ProfileService.updateEmail(data.email)

      if (success) {
        toast({
          title: "Correo electrónico actualizado",
          description: "Se ha enviado un enlace de confirmación a tu nuevo correo electrónico.",
        })
      } else {
        toast({
          title: "Error",
          description: error || "No se pudo actualizar el correo electrónico",
          variant: "destructive",
        })
      }
    } finally {
      setIsUpdatingEmail(false)
    }
  }

  const handlePasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    setIsUpdatingPassword(true)
    try {
      const { success, error } = await ProfileService.updatePassword(data.newPassword)

      if (success) {
        toast({
          title: "Contraseña actualizada",
          description: "Tu contraseña ha sido actualizada correctamente.",
        })
        passwordForm.reset({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast({
          title: "Error",
          description: error || "No se pudo actualizar la contraseña",
          variant: "destructive",
        })
      }
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cambiar correo electrónico</CardTitle>
          <CardDescription>
            Actualiza tu dirección de correo electrónico. Recibirás un enlace de confirmación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isUpdatingEmail}>
                {isUpdatingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar correo electrónico"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cambiar contraseña</CardTitle>
          <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña actual</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-4" />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      Mínimo 8 caracteres. Usa una combinación de letras, números y símbolos.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar nueva contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isUpdatingPassword}>
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar contraseña"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
