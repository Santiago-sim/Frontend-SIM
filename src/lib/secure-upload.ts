import { getStrapiURL } from "@/lib/utils"
import { z } from "zod"

// Validación estricta de archivos
const FileSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(["application/pdf", "image/jpeg", "image/png", "image/jpg"]),
  size: z.number().max(5_000_000), // 5MB
  lastModified: z.number().optional(),
})

type DocumentType = "Visa" | "Pasaporte"

/**
 * Sube un archivo de forma segura a Strapi
 * @param token Token de autenticación JWT
 * @param file Archivo a subir
 * @param field Campo al que pertenece (Visa o Pasaporte)
 * @returns Objeto con id del archivo o error
 */
export async function secureFileUpload(
  token: string,
  file: File,
  field: DocumentType,
): Promise<{ id?: number; error?: string }> {
  try {
    // Validación del lado del cliente
    const validatedFile = FileSchema.safeParse({
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    })

    if (!validatedFile.success) {
      return { error: "Tipo de archivo o tamaño no válido" }
    }

    const formData = new FormData()
    formData.append("files", file)

    // Estos campos pueden variar según la configuración de tu Strapi
    // Asegúrate de que coincidan con lo que espera tu backend
    formData.append("ref", "api::file-user.file-user")
    formData.append("field", field)
    formData.append("path", "secure-documents")

    const url = new URL("/api/upload", getStrapiURL())
    console.log("Uploading to:", url.toString())

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    // Log para depuración
    console.log("Upload response status:", response.status)

    if (!response.ok) {
      let errorMessage = "Upload failed"
      try {
        const errorData = await response.json()
        console.error("Upload Error:", errorData)
        errorMessage = errorData.error?.message || errorMessage
      } catch (e) {
        console.error("Error parsing error response:", e)
      }
      return { error: errorMessage }
    }

    let data
    try {
      data = await response.json()
      console.log("Upload response data:", data)
    } catch (e) {
      console.error("Error parsing response:", e)
      return { error: "Invalid response from server" }
    }

    // Manejar diferentes formatos de respuesta de Strapi
    if (Array.isArray(data) && data.length > 0 && data[0].id) {
      return { id: data[0].id }
    } else if (data && data.id) {
      return { id: data.id }
    } else {
      console.error("Invalid response format:", data)
      return { error: "Invalid response format from server" }
    }
  } catch (error) {
    console.error("Secure Upload Error:", error)
    return {
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

/**
 * Elimina un archivo de Strapi
 * @param token Token de autenticación JWT
 * @param fileId ID del archivo a eliminar
 * @returns Objeto indicando éxito o error
 */
export async function deleteFile(
  token: string,
  fileId: string | number,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!fileId) {
      return { success: false, error: "No file ID provided" }
    }

    const url = new URL(`/api/upload/files/${fileId}`, getStrapiURL())
    console.log("Deleting file:", url.toString())

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("Delete response status:", response.status)

    if (!response.ok) {
      let errorMessage = "Delete failed"
      try {
        const error = await response.json()
        console.error("Delete Error:", error)
        errorMessage = error.error?.message || errorMessage
      } catch (e) {
        console.error("Error parsing error response:", e)
      }
      return { success: false, error: errorMessage }
    }

    return { success: true }
  } catch (error) {
    console.error("Delete File Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    }
  }
}
