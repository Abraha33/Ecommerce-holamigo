import { NextResponse } from "next/server"
import { createTestUser, type UserProfile } from "@/lib/create-test-user"

export async function POST(request: Request) {
  try {
    const { profileType } = await request.json()
    const result = await createTestUser(profileType as UserProfile)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error en la API:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}
