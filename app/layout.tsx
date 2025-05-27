import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/components/cart-provider"
import { PersistentCartSidebar } from "@/components/persistent-cart-sidebar"
import { LoaderStyles } from "@/components/ui/loader"
import { LoadingProvider } from "@/contexts/loading-context"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { TourProvider } from "@/contexts/tour-context"
import { SiteTour } from "@/components/site-tour"
import { TourButton } from "@/components/tour-button"
import { WishlistProvider } from "@/components/wishlist-provider"
import { ScrollToTopButton } from "@/components/scroll-to-top-button"
import { DeliveryProvider } from "@/contexts/delivery-context"
import { AuthProvider } from "@/components/auth-provider"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { EnvScript } from "./env-script"
import { SupabaseErrorFallback } from "@/components/supabase-error-fallback"
import { ViewportMeta } from "@/components/viewport-meta"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Envax - Soluciones Ecológicas",
  description: "Productos ecológicos de calidad para tus necesidades",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__SUPABASE_URL = "${process.env.NEXT_PUBLIC_SUPABASE_URL || ""}";
              window.__SUPABASE_ANON_KEY = "${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}";
            `,
          }}
        />
        <ViewportMeta />
      </head>
      <body className={inter.className}>
        <EnvScript />
        <SupabaseErrorFallback />
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <DeliveryProvider>
              <LoadingProvider>
                <CartProvider>
                  <WishlistProvider>
                    <TourProvider>
                      <div className="flex min-h-screen flex-col">
                        <Header />
                        <div className="flex flex-1">
                          <main className="flex-1 relative">
                            <Suspense fallback={<div>Loading...</div>}>
                              <div className="overflow-x-hidden w-full max-w-[100vw]">{children}</div>
                            </Suspense>
                          </main>
                          <PersistentCartSidebar />
                        </div>
                        <MobileBottomNav />
                        <Footer />
                      </div>
                      <ScrollToTopButton />
                      <Toaster />
                      <LoadingOverlay />
                      <SiteTour />
                      <TourButton />
                    </TourProvider>
                  </WishlistProvider>
                </CartProvider>
              </LoadingProvider>
            </DeliveryProvider>
          </ThemeProvider>
          <LoaderStyles />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
