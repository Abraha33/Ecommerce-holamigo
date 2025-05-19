"use server"

import { createServerComponentClient } from "@/lib/supabase"

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

export async function getProducts(): Promise<Product[]> {
  const supabase = createServerComponentClient()

  try {
    // First, fetch all products
    const { data: products, error } = await supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) throw error
    if (!products) return []

    // Get unique category and brand IDs
    const categoryIds = [...new Set(products.filter((p) => p.category_id).map((p) => p.category_id))]
    const brandIds = [...new Set(products.filter((p) => p.brand_id).map((p) => p.brand_id))]

    // Fetch categories and brands in bulk
    const [categoriesResponse, brandsResponse] = await Promise.all([
      categoryIds.length > 0
        ? supabase.from("categories").select("*").in("id", categoryIds)
        : { data: [], error: null },
      brandIds.length > 0 ? supabase.from("brands").select("*").in("id", brandIds) : { data: [], error: null },
    ])

    if (categoriesResponse.error) console.error("Error fetching categories:", categoriesResponse.error)
    if (brandsResponse.error) console.error("Error fetching brands:", brandsResponse.error)

    // Create lookup maps for categories and brands
    const categoriesMap = new Map((categoriesResponse.data || []).map((category) => [category.id, category]))
    const brandsMap = new Map((brandsResponse.data || []).map((brand) => [brand.id, brand]))

    // Attach categories and brands to products
    return products.map((product) => ({
      ...product,
      category: product.category_id ? categoriesMap.get(product.category_id) || null : null,
      brand: product.brand_id ? brandsMap.get(product.brand_id) || null : null,
    }))
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = createServerComponentClient()

  try {
    // First, fetch featured products
    const { data: products, error } = await supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    if (!products) return []

    // Get unique category and brand IDs
    const categoryIds = [...new Set(products.filter((p) => p.category_id).map((p) => p.category_id))]
    const brandIds = [...new Set(products.filter((p) => p.brand_id).map((p) => p.brand_id))]

    // Fetch categories and brands in bulk
    const [categoriesResponse, brandsResponse] = await Promise.all([
      categoryIds.length > 0
        ? supabase.from("categories").select("*").in("id", categoryIds)
        : { data: [], error: null },
      brandIds.length > 0 ? supabase.from("brands").select("*").in("id", brandIds) : { data: [], error: null },
    ])

    if (categoriesResponse.error) console.error("Error fetching categories:", categoriesResponse.error)
    if (brandsResponse.error) console.error("Error fetching brands:", brandsResponse.error)

    // Create lookup maps for categories and brands
    const categoriesMap = new Map((categoriesResponse.data || []).map((category) => [category.id, category]))
    const brandsMap = new Map((brandsResponse.data || []).map((brand) => [brand.id, brand]))

    // Attach categories and brands to products
    return products.map((product) => ({
      ...product,
      category: product.category_id ? categoriesMap.get(product.category_id) || null : null,
      brand: product.brand_id ? brandsMap.get(product.brand_id) || null : null,
    }))
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createServerComponentClient()

  try {
    // First, fetch the product
    const { data: product, error } = await supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .single()

    if (error) {
      if (error.code === "PGRST116") return null // Product not found
      throw error
    }
    if (!product) return null

    // Fetch category and brand if they exist
    const [categoryResponse, brandResponse] = await Promise.all([
      product.category_id
        ? supabase.from("categories").select("*").eq("id", product.category_id).single()
        : { data: null, error: null },
      product.brand_id
        ? supabase.from("brands").select("*").eq("id", product.brand_id).single()
        : { data: null, error: null },
    ])

    if (categoryResponse.error && categoryResponse.error.code !== "PGRST116") {
      console.error("Error fetching category:", categoryResponse.error)
    }
    if (brandResponse.error && brandResponse.error.code !== "PGRST116") {
      console.error("Error fetching brand:", brandResponse.error)
    }

    // Return product with category and brand
    return {
      ...product,
      category: categoryResponse.data || null,
      brand: brandResponse.data || null,
    }
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function getProductsByCategory(categorySlug: string, limit = 12): Promise<Product[]> {
  const supabase = createServerComponentClient()

  try {
    // First get the category ID from the slug
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single()

    if (categoryError || !category) {
      console.error("Error fetching category:", categoryError)
      return []
    }

    // Then fetch products with that category ID
    const { data: products, error } = await supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("category_id", category.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    if (!products) return []

    // Get unique brand IDs
    const brandIds = [...new Set(products.filter((p) => p.brand_id).map((p) => p.brand_id))]

    // Fetch brands in bulk
    const brandsResponse =
      brandIds.length > 0 ? await supabase.from("brands").select("*").in("id", brandIds) : { data: [], error: null }

    if (brandsResponse.error) console.error("Error fetching brands:", brandsResponse.error)

    // Create lookup map for brands
    const brandsMap = new Map((brandsResponse.data || []).map((brand) => [brand.id, brand]))

    // Attach category and brands to products
    return products.map((product) => ({
      ...product,
      category,
      brand: product.brand_id ? brandsMap.get(product.brand_id) || null : null,
    }))
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}

export async function getProductsByBrand(brandSlug: string, limit = 12): Promise<Product[]> {
  const supabase = createServerComponentClient()

  try {
    // First get the brand ID from the slug
    const { data: brand, error: brandError } = await supabase.from("brands").select("*").eq("slug", brandSlug).single()

    if (brandError || !brand) {
      console.error("Error fetching brand:", brandError)
      return []
    }

    // Then fetch products with that brand ID
    const { data: products, error } = await supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("brand_id", brand.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    if (!products) return []

    // Get unique category IDs
    const categoryIds = [...new Set(products.filter((p) => p.category_id).map((p) => p.category_id))]

    // Fetch categories in bulk
    const categoriesResponse =
      categoryIds.length > 0
        ? await supabase.from("categories").select("*").in("id", categoryIds)
        : { data: [], error: null }

    if (categoriesResponse.error) console.error("Error fetching categories:", categoriesResponse.error)

    // Create lookup map for categories
    const categoriesMap = new Map((categoriesResponse.data || []).map((category) => [category.id, category]))

    // Attach categories and brand to products
    return products.map((product) => ({
      ...product,
      category: product.category_id ? categoriesMap.get(product.category_id) || null : null,
      brand,
    }))
  } catch (error) {
    console.error("Error fetching products by brand:", error)
    return []
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  const supabase = createServerComponentClient()

  try {
    // First, search for products
    const { data: products, error } = await supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("is_active", true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,sku.ilike.%${query}%`)
      .order("created_at", { ascending: false })

    if (error) throw error
    if (!products) return []

    // Get unique category and brand IDs
    const categoryIds = [...new Set(products.filter((p) => p.category_id).map((p) => p.category_id))]
    const brandIds = [...new Set(products.filter((p) => p.brand_id).map((p) => p.brand_id))]

    // Fetch categories and brands in bulk
    const [categoriesResponse, brandsResponse] = await Promise.all([
      categoryIds.length > 0
        ? supabase.from("categories").select("*").in("id", categoryIds)
        : { data: [], error: null },
      brandIds.length > 0 ? supabase.from("brands").select("*").in("id", brandIds) : { data: [], error: null },
    ])

    if (categoriesResponse.error) console.error("Error fetching categories:", categoriesResponse.error)
    if (brandsResponse.error) console.error("Error fetching brands:", brandsResponse.error)

    // Create lookup maps for categories and brands
    const categoriesMap = new Map((categoriesResponse.data || []).map((category) => [category.id, category]))
    const brandsMap = new Map((brandsResponse.data || []).map((brand) => [brand.id, brand]))

    // Attach categories and brands to products
    return products.map((product) => ({
      ...product,
      category: product.category_id ? categoriesMap.get(product.category_id) || null : null,
      brand: product.brand_id ? brandsMap.get(product.brand_id) || null : null,
    }))
  } catch (error) {
    console.error("Error searching products:", error)
    return []
  }
}

export async function getCategories(parentId: string | null = null): Promise<Category[]> {
  const supabase = createServerComponentClient()

  try {
    const query = supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (parentId === null) {
      query.is("parent_id", null)
    } else {
      query.eq("parent_id", parentId)
    }

    const { data: categories, error } = await query

    if (error) throw error
    return categories || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getBrands(): Promise<Brand[]> {
  const supabase = createServerComponentClient()

  try {
    const { data: brands, error } = await supabase
      .from("brands")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true })

    if (error) throw error
    return brands || []
  } catch (error) {
    console.error("Error fetching brands:", error)
    return []
  }
}
