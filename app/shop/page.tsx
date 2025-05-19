import { getProducts } from "@/lib/product-service"
import { ShopClient } from "./shop-client"

export const dynamic = "force-dynamic"
export const revalidate = 60 // Revalidate every 60 seconds

export default async function ShopPage() {
  const products = await getProducts()

  return <ShopClient initialProducts={products} />
}
