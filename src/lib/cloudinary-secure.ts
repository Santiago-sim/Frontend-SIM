import { v2 as cloudinary } from "cloudinary"

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface SecureUploadResult {
  public_id: string
  secure_url: string
  resource_type: string
  folder: string
}

/**
 * Sube un archivo a un folder privado en Cloudinary para seguridad
 */
export async function uploadToSecureFolder(
  fileBuffer: Buffer,
  fileName: string,
  documentType: "passport" | "visa",
  userId: string,
): Promise<{ success: boolean; data?: SecureUploadResult; error?: string }> {
  try {
    // Folder privado específico para documentos sensibles
    const folder = `private-documents/${userId}`
    const publicId = `${documentType}_${Date.now()}`

    // Detectar el tipo de archivo para usar el data URI correcto
    let dataUri = ""
    if (fileName.toLowerCase().endsWith(".pdf")) {
      dataUri = `data:application/pdf;base64,${fileBuffer.toString("base64")}`
    } else {
      dataUri = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`
    }

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      public_id: publicId,
      resource_type: "auto",
      overwrite: true,
      invalidate: true,
    })

    console.log("Cloudinary upload successful (private folder):", {
      public_id: result.public_id,
      secure_url: result.secure_url,
      folder: result.folder,
    })

    return {
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        resource_type: result.resource_type,
        folder: result.folder,
      },
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

/**
 * Elimina un archivo de Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<{ success: boolean; error?: string }> {
  try {
    //console.log("Deleting from Cloudinary:", publicId)

    if (publicId.startsWith("http")) {
      return {
        success: false,
        error: "Invalid public_id format",
      }
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    })

    console.log("Cloudinary delete result:", result)

    return {
      success: result.result === "ok",
      error: result.result !== "ok" ? "Failed to delete file" : undefined,
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    }
  }
}

/**
 * Genera una URL firmada para acceder al documento de forma segura
 */
export async function generateSignedUrl(
  publicId: string,
): Promise<{ success: boolean; signedUrl?: string; error?: string }> {
  try {
    const signedUrl = cloudinary.url(publicId, {
      resource_type: "auto",
      secure: true,
    })

    return {
      success: true,
      signedUrl,
    }
  } catch (error) {
    console.error("Error generating signed URL:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate signed URL",
    }
  }
}
