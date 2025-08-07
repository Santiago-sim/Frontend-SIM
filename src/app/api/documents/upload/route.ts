import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { uploadToSecureFolder } from "@/lib/cloudinary-secure"
import { z } from "zod"
import { getStrapiURL } from "@/lib/utils"

const UploadSchema = z.object({
  userId: z.string().min(1),
  documentType: z.enum(["passport", "visa"]),
  replaceDocumentId: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("jwt")?.value

    if (!authToken) {
      return NextResponse.json({ error: "No authentication token found" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string
    const documentType = formData.get("documentType") as "passport" | "visa"
    const replaceDocumentId = formData.get("replaceDocumentId") as string | null

    console.log("Form data received:", { userId, documentType, replaceDocumentId, fileSize: file?.size })

    // Validación
    const validatedData = UploadSchema.safeParse({
      userId: userId || "",
      documentType,
      replaceDocumentId: replaceDocumentId === "null" || replaceDocumentId === "" ? null : replaceDocumentId,
    })

    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error.errors)
      return NextResponse.json(
        {
          error: "Invalid form data",
          details: validatedData.error.errors,
        },
        { status: 400 },
      )
    }

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validar tipo y tamaño de archivo
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, JPEG, PNG, and JPG are allowed." },
        { status: 400 },
      )
    }

    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    // Convertir archivo a buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    // 1. Subir a Cloudinary (folder privado para seguridad)
    const uploadResult = await uploadToSecureFolder(fileBuffer, file.name, documentType, userId)

    if (!uploadResult.success) {
      return NextResponse.json({ error: uploadResult.error || "Upload failed" }, { status: 500 })
    }

    console.log("Cloudinary upload successful, public_id:", uploadResult.data!.public_id)

    // 2. Subir archivo TAMBIÉN a Strapi para tener una URL simple de visualización
    const strapiFormData = new FormData()
    strapiFormData.append("files", file)

    const uploadResponse = await fetch(`${getStrapiURL()}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: strapiFormData,
    })

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json()
      console.error("Failed to upload file to Strapi:", errorData)
      return NextResponse.json({ error: "Failed to create reference in Strapi" }, { status: 500 })
    }

    const uploadData = await uploadResponse.json()
    const strapiFileId = uploadData[0]?.id

    if (!strapiFileId) {
      return NextResponse.json({ error: "Failed to get file ID from Strapi" }, { status: 500 })
    }

    console.log("Strapi file created with ID:", strapiFileId)

    // 3. Actualizar el campo del usuario en Strapi con ambas referencias
    const fieldName = documentType === "passport" ? "Pasaporte" : "Visa"
    const cloudinaryPublicIdFieldName =
      documentType === "passport" ? "passportCloudinaryPublicId" : "visaCloudinaryPublicId"

    const updateUserResponse = await fetch(`${getStrapiURL()}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [fieldName]: strapiFileId, // Referencia al archivo en Strapi (para visualización fácil)
        [cloudinaryPublicIdFieldName]: uploadResult.data!.public_id, // Public ID de Cloudinary (para seguridad/backup)
      }),
    })

    if (!updateUserResponse.ok) {
      const errorData = await updateUserResponse.json()
      console.error("Failed to update user document field in Strapi:", errorData)
      return NextResponse.json({ error: "Failed to update user document" }, { status: 500 })
    }

    console.log("User document field and Cloudinary public ID updated successfully.")

    // Log de seguridad para auditoría
    console.log("SECURITY LOG - Document uploaded:", {
      userId,
      documentType,
      cloudinaryPublicId: uploadResult.data!.public_id,
      strapiFileId,
      timestamp: new Date().toISOString(),
      fileSize: file.size,
      fileName: file.name,
    })

    return NextResponse.json({
      success: true,
      message: `${documentType === "passport" ? "Pasaporte" : "Visa"} uploaded successfully`,
      fileId: strapiFileId,
      cloudinaryPublicId: uploadResult.data!.public_id,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
