import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { WhatsAppSupport } from "@/components/whatsapp-support"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { CartProvider } from "@/components/cart-provider"
import { WishlistProvider } from "@/components/wishlist-provider"
import { AuthProvider } from "@/components/auth-provider"
import { DeliveryProvider } from "@/contexts/delivery-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <DeliveryProvider>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                  <div className="min-h-screen bg-background">
                    <Header />
                    <main>{children}</main>
                    <Footer />
                    <WhatsAppSupport />
                    <MobileBottomNav />
                  </div>
                  <Toaster />
                </ThemeProvider>
              </DeliveryProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
