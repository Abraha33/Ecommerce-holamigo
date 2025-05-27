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
import Image from "next/image"
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
  // Precargar recursos críticos
  const criticalResources = ["/fonts/inter.woff2", "/colorful-supermarket.png"]
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Inyectamos las variables de entorno como variables globales */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__SUPABASE_URL = "${process.env.NEXT_PUBLIC_SUPABASE_URL}";
              window.__SUPABASE_ANON_KEY = "${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}";
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Detectar dispositivos móviles
              const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
              document.documentElement.classList.toggle('is-mobile', isMobile);
              
              // Detectar conexión lenta
              if ('connection' in navigator) {
                const connection = navigator.connection;
                if (connection && (connection.effectiveType === '2g' || connection.saveData)) {
                  document.documentElement.classList.add('slow-connection');
                }
              }
              
              // Optimizar carga de recursos
              function loadDeferredResources() {
                window.addEventListener('load', () => {
                  setTimeout(() => {
                    const deferredScripts = document.querySelectorAll('script[data-defer="true"]');
                    deferredScripts.forEach(script => {
                      const newScript = document.createElement('script');
                      Array.from(script.attributes).forEach(attr => {
                        if (attr.name !== 'data-defer') {
                          newScript.setAttribute(attr.name, attr.value);
                        }
                      });
                      script.parentNode?.replaceChild(newScript, script);
                    });
                  }, 1000);
                });
              }
              
              loadDeferredResources();
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
                            <Suspense>
                              <div className="overflow-x-hidden w-full max-w-[100vw]">{children}</div>
                            </Suspense>
                            <div
                              id="order-creation-overlay"
                              className="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center"
                            >
                              <div className="bg-white rounded-xl p-6 max-w-md mx-auto shadow-xl">
                                <div className="flex flex-col items-center justify-center text-center">
                                  <div className="w-32 h-32 mb-4 relative">
                                    <Image
                                      src="/delivery-bottle.png"
                                      alt="Entrega"
                                      width={120}
                                      height={120}
                                      className="object-contain"
                                    />
                                  </div>
                                  <h2 className="text-xl font-bold mb-2">ESTAMOS CREANDO</h2>
                                  <h3 className="text-xl font-bold mb-6">TU ORDEN</h3>
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="bg-blue-100 p-1 rounded">
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M19 9.5H16V3.5H8V9.5H5L12 16.5L19 9.5ZM5 18.5V20.5H19V18.5H5Z"
                                          fill="#0066CC"
                                        />
                                      </svg>
                                    </div>
                                    <span className="font-medium">Entrega estimada: 11 - 17 min</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div
                                      id="order-progress-bar"
                                      className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                                      style={{ width: "0%" }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
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
          <script
            dangerouslySetInnerHTML={{
              __html: `
                document.addEventListener('DOMContentLoaded', function() {
                  // Función para mostrar el overlay de creación de pedido
                  window.showOrderCreationOverlay = function() {
                    const overlay = document.getElementById('order-creation-overlay');
                    const progressBar = document.getElementById('order-progress-bar');
                    
                    if (overlay && progressBar) {
                      overlay.classList.remove('hidden');
                      
                      let progress = 0;
                      const interval = setInterval(() => {
                        progress += 5;
                        progressBar.style.width = progress + '%';
                        
                        if (progress >= 100) {
                          clearInterval(interval);
                          setTimeout(() => {
                            overlay.classList.add('hidden');
                            window.location.href = '/orders/latest';
                          }, 500);
                        }
                      }, 150);
                    }
                  };
                });
              `,
            }}
          />
        </AuthProvider>
      </body>
      <Analytics />
    </html>
  )
}
