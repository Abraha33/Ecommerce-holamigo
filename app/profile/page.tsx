"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProfileService, type ProfileData } from "@/lib/profile-service"
import PersonalInfoForm from "./personal-info-form"
import SecurityForm from "./security-form"
import NotificationsForm from "./notifications-form"
import ProfilePictureUploader from "./profile-picture-uploader"
import AddressesTab from "./addresses-tab"

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("personal")
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/profile")
      return
    }

    const fetchProfile = async () => {
      if (!user) return

      setIsLoading(true)
      const { data, error } = await ProfileService.getProfile()

      if (error) {
        toast({
          title: "Error",
          description: `Failed to load profile: ${error}`,
          variant: "destructive",
        })
      } else if (data) {
        setProfile(data)
      }

      setIsLoading(false)
    }

    fetchProfile()
  }, [user, authLoading, router, toast])

  const handleProfileUpdate = async (updatedProfile: Partial<ProfileData>) => {
    if (!profile) return

    const { success, error } = await ProfileService.updateProfile(updatedProfile)

    if (success) {
      // Update the local profile state with the new data
      setProfile({ ...profile, ...updatedProfile })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } else {
      toast({
        title: "Update failed",
        description: error || "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Profile not available</CardTitle>
            <CardDescription>Please log in to view and manage your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login?redirect=/profile")}>Log in</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile sidebar with avatar and quick info */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <ProfilePictureUploader
                  currentUrl={profile.avatar_url || ""}
                  onUploadComplete={(url) => {
                    if (url) {
                      setProfile({ ...profile, avatar_url: url })
                    }
                  }}
                />
                <h2 className="text-xl font-semibold mt-4">{profile.full_name || "Usuario"}</h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                {profile.job_title && profile.company && (
                  <p className="text-sm mt-1">
                    {profile.job_title} at {profile.company}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area with tabs */}
        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="addresses">Direcciones</TabsTrigger>
              <TabsTrigger value="security">Seguridad</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Actualiza tu información personal y detalles de contacto.</CardDescription>
                </CardHeader>
                <CardContent>
                  <PersonalInfoForm profile={profile} onSubmit={handleProfileUpdate} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Direcciones</CardTitle>
                  <CardDescription>Administra tus direcciones de envío y facturación.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AddressesTab userId={user.id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Seguridad</CardTitle>
                  <CardDescription>Actualiza tu correo electrónico y contraseña.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SecurityForm email={profile.email} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Preferencias de Notificaciones</CardTitle>
                  <CardDescription>Configura cómo y cuándo quieres recibir notificaciones.</CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationsForm
                    preferences={profile.preferences || {}}
                    onSubmit={(preferences) => {
                      ProfileService.updateNotificationPreferences(preferences).then(({ success, error }) => {
                        if (success) {
                          setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, ...preferences },
                          })
                          toast({
                            title: "Preferencias actualizadas",
                            description: "Tus preferencias de notificaciones han sido actualizadas.",
                          })
                        } else {
                          toast({
                            title: "Error",
                            description: error || "No se pudieron actualizar las preferencias",
                            variant: "destructive",
                          })
                        }
                      })
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
