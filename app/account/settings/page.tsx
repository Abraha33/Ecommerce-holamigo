"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Globe, Bell, Lock, Moon, Sun, Smartphone, Mail, ShieldAlert, Trash2 } from "lucide-react"
import AccountSidebar from "@/components/account-sidebar"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    twoFactorAuth: true,
    language: "es",
    autoLogin: false,
    dataCollection: true,
  })

  const handleToggle = (setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
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
          <div className="flex-1 space-y-6">
            {/* Apariencia */}
            <Card className="p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Apariencia</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {settings.darkMode ? <Moon className="text-indigo-600" /> : <Sun className="text-amber-500" />}
                    <div>
                      <h3 className="font-medium">Modo oscuro</h3>
                      <p className="text-sm text-gray-500">Cambia la apariencia de la aplicación</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleToggle("darkMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="text-blue-500" />
                    <div>
                      <h3 className="font-medium">Idioma</h3>
                      <p className="text-sm text-gray-500">Español (Colombia)</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Cambiar
                  </Button>
                </div>
              </div>
            </Card>

            {/* Notificaciones */}
            <Card className="p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Notificaciones</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="text-blue-500" />
                    <div>
                      <h3 className="font-medium">Notificaciones por correo</h3>
                      <p className="text-sm text-gray-500">Recibe actualizaciones en tu correo electrónico</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleToggle("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="text-amber-500" />
                    <div>
                      <h3 className="font-medium">Notificaciones push</h3>
                      <p className="text-sm text-gray-500">Recibe notificaciones en tu navegador</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleToggle("pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="text-green-500" />
                    <div>
                      <h3 className="font-medium">Notificaciones SMS</h3>
                      <p className="text-sm text-gray-500">Recibe mensajes de texto con actualizaciones</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleToggle("smsNotifications", checked)}
                  />
                </div>
              </div>
            </Card>

            {/* Seguridad */}
            <Card className="p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Seguridad</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="text-green-500" />
                    <div>
                      <h3 className="font-medium">Autenticación de dos factores</h3>
                      <p className="text-sm text-gray-500">Añade una capa extra de seguridad a tu cuenta</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleToggle("twoFactorAuth", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="text-blue-500" />
                    <div>
                      <h3 className="font-medium">Inicio de sesión automático</h3>
                      <p className="text-sm text-gray-500">Mantener sesión iniciada en este dispositivo</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.autoLogin}
                    onCheckedChange={(checked) => handleToggle("autoLogin", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trash2 className="text-red-500" />
                    <div>
                      <h3 className="font-medium">Eliminar cuenta</h3>
                      <p className="text-sm text-gray-500">Eliminar permanentemente tu cuenta y todos tus datos</p>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm">
                    Eliminar
                  </Button>
                </div>
              </div>
            </Card>

            {/* Privacidad */}
            <Card className="p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Privacidad</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="text-purple-500" />
                    <div>
                      <h3 className="font-medium">Recopilación de datos</h3>
                      <p className="text-sm text-gray-500">
                        Permitir la recopilación de datos para mejorar el servicio
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.dataCollection}
                    onCheckedChange={(checked) => handleToggle("dataCollection", checked)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button className="bg-blue-600 hover:bg-blue-700">Guardar cambios</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
