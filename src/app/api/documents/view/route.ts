import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { generateSignedUrl } from "@/lib/cloudinary-secure"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("jwt")?.value

    if (!authToken) {
      return NextResponse.json({ error: "No authentication token found" }, { status: 401 })
    }

    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json({ error: "Public ID is required" }, { status: 400 })
    }

    // Generar URL directa simple
    const result = await generateSignedUrl(publicId)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to generate URL" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      signedUrl: result.signedUrl,
    })
  } catch (error) {
    console.error("View document error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
