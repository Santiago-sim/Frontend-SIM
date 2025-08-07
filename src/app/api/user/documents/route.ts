import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserDocuments } from "@/lib/document-service"
import { str } from "ajv"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("jwt")?.value

    if (!authToken) {
      return NextResponse.json({ error: "No authentication token found" }, { status: 401 })
    }

    // Obtener documentos del usuario usando la función corregida
    const documentsResult = await getUserDocuments(authToken)

    if (!documentsResult.success) {
      return NextResponse.json(
        {
          error: documentsResult.error || "Failed to load documents",
        },
        { status: 500 },
      )
    }

    // Transformar los datos para el frontend
    const transformedDocuments = {
      passport_document: documentsResult.documents?.passport_document
        ? {
            id: documentsResult.documents.passport_document.id,
            type: "passport" as const,
            name: "Pasaporte",
            status: documentsResult.documents.passport_document.status || "pending",
            cloudinary_public_id: documentsResult.documents.passport_document.cloudinary_public_id,
            file_name: documentsResult.documents.passport_document.file_name,
            upload_date: documentsResult.documents.passport_document.upload_date,
            strapi_url: documentsResult.documents.passport_document.strapi_url,
          }
        : null,
      visa_document: documentsResult.documents?.visa_document
        ? {
            id: documentsResult.documents.visa_document.id,
            type: "visa" as const,
            name: "Visa",
            status: documentsResult.documents.visa_document.status || "pending",
            cloudinary_public_id: documentsResult.documents.visa_document.cloudinary_public_id,
            file_name: documentsResult.documents.visa_document.file_name,
            upload_date: documentsResult.documents.visa_document.upload_date,
            strapi_url: documentsResult.documents.visa_document.strapi_url,
          }
        : null,
    }

    return NextResponse.json({
      success: true,
      userId: documentsResult.documents?.userId || "",
      documents: transformedDocuments,
    })
  } catch (error) {
    console.error("Get user documents error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
