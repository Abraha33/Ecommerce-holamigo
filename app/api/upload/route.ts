import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { nanoid } from "nanoid"

export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData()
  const file = formData.get("file") as File
  const folder = (formData.get("folder") as string) || "products"

  if (!file) {
    return NextResponse.json({ error: "No se ha proporcionado ningún archivo" }, { status: 400 })
  }

  try {
    // Generar un nombre único para el archivo
    const filename = `${folder}/${nanoid()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`

    // Subir el archivo a Vercel Blob
    const { url } = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error("Error al subir archivo:", error)
    return NextResponse.json({ error: "Error al procesar la subida del archivo" }, { status: 500 })
  }
}

export const runtime = "nodejs"
