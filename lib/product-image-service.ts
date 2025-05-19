import { put, list, del } from "@vercel/blob"

export type ImageType = "main" | "thumbnail" | "gallery"

export type ProductImageUploadResult = {
  url: string
  success: boolean
  type: ImageType
  error?: string
}

/**
 * Sube una imagen de producto a Vercel Blob con la estructura adecuada
 */
export async function uploadProductImage(
  file: File,
  productId: string | number,
  type: ImageType = "gallery",
  galleryIndex?: number,
): Promise<ProductImageUploadResult> {
  try {
    // Crear la estructura de carpetas por producto
    const productFolder = `products/${productId}`

    // Determinar el nombre del archivo según el tipo
    let filename: string

    if (type === "main") {
      filename = `${productFolder}/main.${getFileExtension(file.name)}`
    } else if (type === "thumbnail") {
      filename = `${productFolder}/thumbnail.${getFileExtension(file.name)}`
    } else {
      // Para imágenes de galería, usar un índice o generar uno
      const index = galleryIndex !== undefined ? galleryIndex : await getNextGalleryIndex(productFolder)
      filename = `${productFolder}/gallery-${index}.${getFileExtension(file.name)}`
    }

    // Subir el archivo a Vercel Blob
    const { url } = await put(filename, file, {
      access: "public",
      addRandomSuffix: false, // Usamos nuestra propia estructura
    })

    return { url, success: true, type }
  } catch (error: any) {
    console.error("Error al subir imagen de producto:", error)
    return {
      url: "",
      success: false,
      type,
      error: error.message || "Error al subir la imagen",
    }
  }
}

/**
 * Obtiene todas las imágenes de un producto
 */
export async function getProductImages(productId: string | number): Promise<{
  main?: string
  thumbnail?: string
  gallery: string[]
}> {
  try {
    const prefix = `products/${productId}/`
    const { blobs } = await list({ prefix })

    // Organizar las imágenes por tipo
    const result = {
      main: undefined as string | undefined,
      thumbnail: undefined as string | undefined,
      gallery: [] as string[],
    }

    blobs.forEach((blob) => {
      const filename = blob.url.split("/").pop() || ""

      if (filename.startsWith("main")) {
        result.main = blob.url
      } else if (filename.startsWith("thumbnail")) {
        result.thumbnail = blob.url
      } else if (filename.startsWith("gallery-")) {
        result.gallery.push(blob.url)
      }
    })

    // Ordenar las imágenes de la galería por su índice
    result.gallery.sort((a, b) => {
      const indexA = Number.parseInt(a.split("gallery-")[1]?.split(".")[0] || "0")
      const indexB = Number.parseInt(b.split("gallery-")[1]?.split(".")[0] || "0")
      return indexA - indexB
    })

    return result
  } catch (error) {
    console.error("Error al obtener imágenes del producto:", error)
    return { gallery: [] }
  }
}

/**
 * Elimina una imagen de producto
 */
export async function deleteProductImage(url: string): Promise<boolean> {
  try {
    await del(url)
    return true
  } catch (error) {
    console.error("Error al eliminar imagen:", error)
    return false
  }
}

/**
 * Elimina todas las imágenes de un producto
 */
export async function deleteAllProductImages(productId: string | number): Promise<boolean> {
  try {
    const prefix = `products/${productId}/`
    const { blobs } = await list({ prefix })

    // Eliminar cada imagen
    const deletePromises = blobs.map((blob) => del(blob.url))
    await Promise.all(deletePromises)

    return true
  } catch (error) {
    console.error("Error al eliminar imágenes del producto:", error)
    return false
  }
}

// Funciones auxiliares

/**
 * Obtiene la extensión de un archivo
 */
function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "jpg"
}

/**
 * Obtiene el siguiente índice disponible para imágenes de galería
 */
async function getNextGalleryIndex(productFolder: string): Promise<number> {
  try {
    const { blobs } = await list({ prefix: `${productFolder}/gallery-` })

    if (blobs.length === 0) return 1

    // Encontrar el índice más alto actual
    const indices = blobs.map((blob) => {
      const filename = blob.url.split("/").pop() || ""
      const match = filename.match(/gallery-(\d+)/)
      return match ? Number.parseInt(match[1]) : 0
    })

    return Math.max(...indices) + 1
  } catch (error) {
    console.error("Error al obtener el siguiente índice de galería:", error)
    return Date.now() // Fallback a timestamp como índice
  }
}
