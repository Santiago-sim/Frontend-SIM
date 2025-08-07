import { getStrapiURL } from "@/lib/utils"

/**
 * Obtiene los documentos del usuario directamente desde /api/users/me
 */
export async function getUserDocuments(token: string): Promise<{ success: boolean; documents?: any; error?: string }> {
  try {
    // Incluimos los campos personalizados de Cloudinary para backup/seguridad
    const url = new URL(
      `/api/users/me?fields[0]=username&fields[1]=email&fields[2]=documentId&fields[3]=passportCloudinaryPublicId&fields[4]=visaCloudinaryPublicId&populate[Visa][fields][0]=url&populate[Visa][fields][1]=name&populate[Visa][fields][2]=createdAt&populate[Pasaporte][fields][0]=url&populate[Pasaporte][fields][1]=name&populate[Pasaporte][fields][2]=createdAt`,
      getStrapiURL(),
    )

    //console.log("Fetching user documents from:", url.toString())

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Error response:", errorData)
      return {
        success: false,
        error: errorData.error?.message || "Failed to get user documents",
      }
    }

    const result = await response.json()
    //console.log("User documents response (raw):", JSON.stringify(result, null, 2))

    // Log de seguridad para auditoría
    console.log("SECURITY LOG - Documents accessed:", {
      userId: result.id,
      timestamp: new Date().toISOString(),
      hasPassport: !!result.Pasaporte,
      hasVisa: !!result.Visa,
    })

    return {
      success: true,
      documents: {
        userId: result.id.toString(),
        passport_document: result.Pasaporte
          ? {
              id: result.Pasaporte.id,
              cloudinary_public_id: result.passportCloudinaryPublicId, // Para backup/seguridad
              strapi_url: result.Pasaporte.url, // Para visualización fácil
              file_name: result.Pasaporte.name,
              upload_date: result.Pasaporte.createdAt || new Date().toISOString(),
              status: "pending",
            }
          : null,
        visa_document: result.Visa
          ? {
              id: result.Visa.id,
              cloudinary_public_id: result.visaCloudinaryPublicId, // Para backup/seguridad
              strapi_url: result.Visa.url, // Para visualización fácil
              file_name: result.Visa.name,
              upload_date: result.Visa.createdAt || new Date().toISOString(),
              status: "pending",
            }
          : null,
      },
    }
  } catch (error) {
    console.error("Error in getUserDocuments:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Elimina el documento del usuario (establece el campo a null)
 */
export async function removeUserDocument(
  token: string,
  userId: string,
  documentType: "passport" | "visa",
): Promise<{ success: boolean; error?: string }> {
  try {
    const fieldName = documentType === "passport" ? "Pasaporte" : "Visa"
    const cloudinaryPublicIdFieldName =
      documentType === "passport" ? "passportCloudinaryPublicId" : "visaCloudinaryPublicId"

    // Log de seguridad para auditoría
    console.log("SECURITY LOG - Document deletion requested:", {
      userId,
      documentType,
      timestamp: new Date().toISOString(),
    })

    const url = new URL(`/api/users/${userId}`, getStrapiURL())

    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [fieldName]: null, // Elimina la referencia al archivo de Strapi
        [cloudinaryPublicIdFieldName]: null, // Elimina el public_id de Cloudinary
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error?.message || "Failed to remove user document",
      }
    }

    console.log("SECURITY LOG - Document deletion completed:", {
      userId,
      documentType,
      timestamp: new Date().toISOString(),
    })

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
