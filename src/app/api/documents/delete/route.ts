import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { deleteFromCloudinary } from "@/lib/cloudinary-secure"
import { removeUserDocument, getUserDocuments } from "@/lib/document-service"
import { getStrapiURL } from "@/lib/utils"

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("jwt")?.value

    if (!authToken) {
      return NextResponse.json({ error: "No authentication token found" }, { status: 401 })
    }

    const { documentType, userId } = await request.json()

    if (!documentType || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Obtener los documentos actuales del usuario
    const documentsResult = await getUserDocuments(authToken)

    if (!documentsResult.success) {
      return NextResponse.json({ error: "Failed to get user documents" }, { status: 500 })
    }

    const documentField = documentType === "passport" ? "passport_document" : "visa_document"
    const document = documentsResult.documents?.[documentField]

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Eliminar de Cloudinary si existe el public_id (backup seguro)
    if (document.cloudinary_public_id && !document.cloudinary_public_id.startsWith("http")) {
      const deleteResult = await deleteFromCloudinary(document.cloudinary_public_id)
      if (!deleteResult.success) {
        console.error("Failed to delete from Cloudinary:", deleteResult.error)
      } else {
        console.log("SECURITY LOG - Cloudinary file deleted:", {
          userId,
          documentType,
          cloudinaryPublicId: document.cloudinary_public_id,
          timestamp: new Date().toISOString(),
        })
      }
    }

    // Eliminar el archivo de Strapi (la referencia principal)
    const deleteFileResponse = await fetch(`${getStrapiURL()}/api/upload/files/${document.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    if (!deleteFileResponse.ok) {
      console.error("Failed to delete file from Strapi Media Library")
    } else {
      console.log("SECURITY LOG - Strapi file deleted:", {
        userId,
        documentType,
        strapiFileId: document.id,
        timestamp: new Date().toISOString(),
      })
    }

    // Actualizar el campo del usuario a null (referencia y public_id de Cloudinary)
    const updateResult = await removeUserDocument(authToken, userId, documentType)

    if (!updateResult.success) {
      return NextResponse.json({ error: updateResult.error || "Failed to update user document" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `${documentType === "passport" ? "Pasaporte" : "Visa"} eliminado exitosamente`,
    })
  } catch (error) {
    console.error("Delete document error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
