import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { v2 as cloudinary } from "cloudinary"

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("jwt")?.value

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get("publicId")

    if (!publicId) {
      return NextResponse.json({ error: "Public ID is required" }, { status: 400 })
    }

    console.log("Proxying document:", publicId)

    try {
      // Generar URL directa de Cloudinary
      const directUrl = cloudinary.url(publicId, {
        resource_type: "auto",
        secure: true,
      })

      console.log("Fetching from:", directUrl)

      // Hacer fetch del archivo desde Cloudinary
      const response = await fetch(directUrl)

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }

      // Obtener el contenido del archivo
      const fileBuffer = await response.arrayBuffer()
      const contentType = response.headers.get("content-type") || "application/octet-stream"

      console.log("File fetched successfully, content-type:", contentType)

      // Devolver el archivo con headers apropiados
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "private, max-age=3600",
          "Content-Disposition": "inline",
        },
      })
    } catch (fetchError) {
      console.error("Error fetching file:", fetchError)
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
