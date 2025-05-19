import { getProductBySlug } from "@/lib/product-service"
import { ProductDetailClient } from "./product-detail-client"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 60 // Revalidate every 60 seconds

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
