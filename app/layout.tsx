import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/components/cart-provider"
// Importar el componente PersistentCartSidebar
import { PersistentCartSidebar } from "@/components/persistent-cart-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EcoPlast - Sustainable Plastic Solutions",
  description: "Quality eco-friendly plastic products for your needs",
    generator: 'v0.dev'
}

// Actualizar el RootLayout para incluir el carrito persistente
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <div className="flex flex-1">
                <main className="flex-1 pr-72">{children}</main>
                <PersistentCartSidebar />
              </div>
              <Footer />
            </div>
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
