"use server"

import { secureFileUpload, deleteFile } from "@/lib/secure-upload"
import { upsertUserFile } from "@/lib/file-user-service"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { z } from "zod"

// Esquema de validación para el formulario
const DocumentFormSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(["Visa", "Pasaporte"]),
  prevDocumentId: z.string().optional(),
})

/**
 * Acción del servidor para subir documentos
 * @param prevState Estado previo del formulario
 * @param formData Datos del formulario
 * @returns Objeto con mensaje y estado de éxito
 */
export async function uploadDocument(
  prevState: any,
  formData: FormData,
): Promise<{ message: string; success: boolean; error?: string }> {
  const cookiesStore = await cookies()
  const authToken = cookiesStore.get("jwt")?.value

  try {
    // Validación de autenticación
    if (!authToken) {
      return { message: "No se encontró el token de autenticación", success: false }
    }

    // Extraer y validar datos del formulario
    const rawData = {
      userId: formData.get("userId")?.toString() || "",
      type: formData.get("type")?.toString() as "Visa" | "Pasaporte",
      prevDocumentId: formData.get("prevDocumentId")?.toString(),
    }

    const validatedData = DocumentFormSchema.safeParse(rawData)
    if (!validatedData.success) {
      return {
        message: "Datos del formulario inválidos",
        success: false,
        error: validatedData.error.message,
      }
    }

    const { userId, type, prevDocumentId } = validatedData.data
    const file = formData.get("file") as File

    if (!file || file.size === 0) {
      return { message: "No se proporcionó un archivo válido", success: false }
    }

    // Eliminar documento anterior si existe
    if (prevDocumentId) {
      await deleteFile(authToken, prevDocumentId)
    }

    // 1. Subir archivo de forma segura
    const uploadResult = await secureFileUpload(authToken, file, type)
    if (uploadResult.error) {
      return { message: uploadResult.error, success: false }
    }

    // 2. Actualizar registro de usuario
    const updateResult = await upsertUserFile(authToken, userId, {
      [type]: uploadResult.id,
    })

    if (updateResult.error) {
      return { message: updateResult.error, success: false }
    }

    // 3. Revalidar caché
    revalidatePath("/dashboard/documents")

    return {
      message: `${type} subido exitosamente`,
      success: true,
    }
  } catch (error) {
    console.error("Document Upload Error:", error)
    return {
      message: error instanceof Error ? error.message : "Error desconocido",
      success: false,
    }
  }
}

/**
 * Acción del servidor para eliminar documentos
 * @param prevState Estado previo del formulario
 * @param formData Datos del formulario
 * @returns Objeto con mensaje y estado de éxito
 */
export async function deleteDocument(
  prevState: any,
  formData: FormData,
): Promise<{ message: string; success: boolean }> {
  const cookiesStore = await cookies()
  const authToken = cookiesStore.get("jwt")?.value

  try {
    if (!authToken) {
      return { message: "No se encontró el token de autenticación", success: false }
    }

    const userId = formData.get("userId")?.toString()
    const documentType = formData.get("type") as "Visa" | "Pasaporte"
    const fileId = formData.get("fileId")?.toString()

    if (!userId || !documentType || !fileId) {
      return { message: "Datos incompletos", success: false }
    }

    // 1. Eliminar el archivo
    const deleteResult = await deleteFile(authToken, fileId)
    if (!deleteResult.success) {
      return { message: deleteResult.error || "Error al eliminar el archivo", success: false }
    }

    // 2. Actualizar el registro de usuario (establecer el campo a null)
    const updateResult = await upsertUserFile(authToken, userId, {
      [documentType]: null,
    })

    if (updateResult.error) {
      return { message: updateResult.error, success: false }
    }

    // 3. Revalidar caché
    revalidatePath("/dashboard/documents")

    return {
      message: `${documentType} eliminado exitosamente`,
      success: true,
    }
  } catch (error) {
    console.error("Document Delete Error:", error)
    return {
      message: error instanceof Error ? error.message : "Error desconocido",
      success: false,
    }
  }
}
