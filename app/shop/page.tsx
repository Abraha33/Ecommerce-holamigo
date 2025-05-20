"use client"

import { getProducts } from "@/lib/product-service"
import { ShopClient } from "./shop-client"

export const dynamic = "force-dynamic"
export const revalidate = 60 // Revalidate every 60 seconds

export default async function ShopPage() {
  try {
    const products = await getProducts()

    return <ShopClient initialProducts={products} />
  } catch (error) {
    console.error("Error in ShopPage:", error)
    // Retornamos un componente de error amigable
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-4">No se pudieron cargar los productos</h1>
        <p className="mb-4">
          Lo sentimos, hubo un problema al cargar los productos. Por favor, intenta nuevamente más tarde.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    )
  }
}
