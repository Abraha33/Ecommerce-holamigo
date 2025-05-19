import { put, list, del } from "@vercel/blob"
import { nanoid } from "nanoid"

export type UploadResult = {
  url: string
  success: boolean
  error?: string
}

/**
 * Sube una imagen al almacenamiento Blob de Vercel
 */
export async function uploadImage(file: File, folder = "products"): Promise<UploadResult> {
  try {
    // Generar un nombre único para el archivo
    const filename = `${folder}/${nanoid()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`

    // Subir el archivo a Vercel Blob
    const { url } = await put(filename, file, {
      access: "public",
      addRandomSuffix: false, // Usamos nuestro propio ID único
    })

    return { url, success: true }
  } catch (error: any) {
    console.error("Error al subir imagen:", error)
    return {
      url: "",
      success: false,
      error: error.message || "Error al subir la imagen",
    }
  }
}

/**
 * Obtiene una lista de imágenes de un folder específico
 */
export async function listImages(prefix = "products/"): Promise<string[]> {
  try {
    const { blobs } = await list({ prefix })
    return blobs.map((blob) => blob.url)
  } catch (error) {
    console.error("Error al listar imágenes:", error)
    return []
  }
}

/**
 * Elimina una imagen del almacenamiento Blob
 */
export async function deleteImage(url: string): Promise<boolean> {
  try {
    await del(url)
    return true
  } catch (error) {
    console.error("Error al eliminar imagen:", error)
    return false
  }
}
