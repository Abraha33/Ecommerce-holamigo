"use server"

import { createServerSupabaseClient, createDirectServerClient } from "./supabase-server"

export type ProductImage = {
  id: string
  url: string
  alt_text: string
  is_primary: boolean
  display_order: number
}

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  image_url: string | null
}

export type Brand = {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  sale_price: number | null
  sku: string | null
  stock: number | null
  is_active: boolean
  is_featured: boolean
  is_new: boolean
  is_sale: boolean
  category_id: string | null
  brand_id: string | null
  category?: Category | null
  brand?: Brand | null
  images: ProductImage[]
}

// Datos de fallback para usar cuando hay errores de conexión
const fallbackProducts: Product[] = [
  {
    id: "fallback-1",
    name: "Producto de ejemplo 1",
    slug: "producto-ejemplo-1",
    description: "Este es un producto de ejemplo que se muestra cuando hay problemas de conexión.",
    price: 19.99,
    sale_price: null,
    sku: "FALLBACK001",
    stock: 10,
    is_active: true,
    is_featured: true,
    is_new: true,
    is_sale: false,
    category_id: null,
    brand_id: null,
    images: [],
  },
  {
    id: "fallback-2",
    name: "Producto de ejemplo 2",
    slug: "producto-ejemplo-2",
    description: "Este es otro producto de ejemplo para mostrar cuando hay problemas de conexión.",
    price: 29.99,
    sale_price: 24.99,
    sku: "FALLBACK002",
    stock: 5,
    is_active: true,
    is_featured: true,
    is_new: false,
    is_sale: true,
    category_id: null,
    brand_id: null,
    images: [],
  },
]

export async function getProducts(): Promise<Product[]> {
  try {
    // Intentamos primero con el cliente normal
    const supabase = createServerSupabaseClient()

    // Verificamos la conexión antes de hacer la consulta principal
    const { error: connectionError } = await supabase.from("products").select("count").limit(1)

    if (connectionError) {
      console.error("Error de conexión a Supabase:", connectionError)

      // Intentamos con el cliente directo como alternativa
      const directClient = createDirectServerClient()
      const { data: products, error } = await directClient
        .from("products")
        .select("*, images:product_images(*)")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching products with direct client:", error)
        return fallbackProducts // Retornamos datos de fallback
      }

      return products || fallbackProducts
    }

    // Si la conexión es exitosa, procedemos con la consulta normal
    const { data: products, error } = await supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return fallbackProducts // Retornamos datos de fallback
    }

    return products || fallbackProducts
  } catch (error) {
    console.error("Error in getProducts:", error)
    return fallbackProducts // Retornamos datos de fallback en caso de error
  }
}

// El resto de las funciones se mantienen igual pero con manejo de errores mejorado
// y retorno de datos de fallback cuando sea necesario

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const supabase = createServerSupabaseClient()

    const { data: products, error } = await supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching featured products:", error)
      return fallbackProducts.filter((p) => p.is_featured).slice(0, limit)
    }

    return products || fallbackProducts.filter((p) => p.is_featured).slice(0, limit)
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error)
    return fallbackProducts.filter((p) => p.is_featured).slice(0, limit)
  }
}

// Las demás funciones se mantienen igual pero con manejo de errores mejorado
