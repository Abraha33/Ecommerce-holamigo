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

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EcoPlast - Sustainable Plastic Solutions",
  description: "Quality eco-friendly plastic products for your needs",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LoadingProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <div className="flex flex-1">
                  <main className="flex-1">{children}</main>
                  <PersistentCartSidebar />
                </div>
                <Footer />
              </div>
              <Toaster />
              <LoadingOverlay />
            </CartProvider>
          </LoadingProvider>
        </ThemeProvider>
        <LoaderStyles />
      </body>
    </html>
  )
}
