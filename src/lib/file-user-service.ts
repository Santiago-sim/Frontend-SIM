import { getStrapiURL } from "@/lib/utils"
import { z } from "zod"

// Esquema de validación seguro para documentos
const FileUserSchema = z.object({
  Visa: z.number().nullable().optional(),
  Pasaporte: z.number().nullable().optional(),
  users_permissions_user: z.string(),
})

// Tipo para TypeScript
export type FileUser = z.infer<typeof FileUserSchema>

/**
 * Busca un registro de userFile para un usuario específico
 * @param token Token de autenticación JWT
 * @param userId ID del usuario
 * @returns Objeto con id y datos del userFile si existe
 */
export async function findUserFile(token: string, userId: string): Promise<{ id?: string; data?: FileUser }> {
  const url = new URL(
    `/api/file-users?filters[users_permissions_user][id][$eq]=${encodeURIComponent(userId)}&populate=*`,
    getStrapiURL(),
  )

  console.log("Finding user file:", url.toString())

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    console.log("Find user file response status:", response.status)

    if (!response.ok) {
      let errorMessage = "Error fetching user file"
      try {
        const errorData = await response.json()
        console.error("Error fetching user file:", errorData)
        errorMessage = errorData.error?.message || errorMessage
      } catch (e) {
        console.error("Error parsing error response:", e)
      }
      throw new Error(errorMessage)
    }

    let responseData
    try {
      responseData = await response.json()
      console.log("Find user file response data:", responseData)
    } catch (e) {
      console.error("Error parsing response:", e)
      return {}
    }

    // Manejar diferentes formatos de respuesta de Strapi
    if (responseData && responseData.data) {
      return responseData.data && responseData.data.length > 0
        ? { id: responseData.data[0].id, data: responseData.data[0].attributes }
        : {}
    } else {
      console.error("Invalid response format:", responseData)
      return {}
    }
  } catch (error) {
    console.error("Error in findUserFile:", error)
    return {}
  }
}

/**
 * Crea o actualiza un registro de userFile
 * @param token Token de autenticación JWT
 * @param userId ID del usuario
 * @param fileData Datos del archivo (Visa y/o Pasaporte)
 * @returns Objeto con datos o error
 */
export async function upsertUserFile(
  token: string,
  userId: string,
  fileData: Partial<FileUser>,
): Promise<{ data?: any; error?: string }> {
  try {
    console.log("Upserting user file for user:", userId, "with data:", fileData)

    // Validación estricta del lado del servidor
    const validatedData = FileUserSchema.parse({
      ...fileData,
      users_permissions_user: userId,
    })

    // Buscar si ya existe un registro para este usuario
    const existingFile = await findUserFile(token, userId)
    console.log("Existing file:", existingFile)

    const method = existingFile.id ? "PUT" : "POST"
    const endpoint = existingFile.id ? `/api/file-users/${existingFile.id}` : "/api/file-users"

    const url = new URL(endpoint, getStrapiURL())
    console.log(`${method} request to:`, url.toString())

    // Estructura de datos para Strapi v4
    const requestBody = {
      data: validatedData,
    }

    console.log("Request body:", JSON.stringify(requestBody, null, 2))

    const response = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
    })

    console.log("Upsert response status:", response.status)

    if (!response.ok) {
      let errorMessage = "Server error"
      try {
        const errorData = await response.json()
        console.error("Strapi Error:", errorData)
        errorMessage = errorData.error?.message || errorMessage
      } catch (e) {
        console.error("Error parsing error response:", e)
      }
      return { error: errorMessage }
    }

    let responseData
    try {
      responseData = await response.json()
      console.log("Upsert response data:", responseData)
    } catch (e) {
      console.error("Error parsing response:", e)
      return { error: "Invalid response from server" }
    }

    return { data: responseData }
  } catch (error) {
    console.error("Error in upsertUserFile:", error)
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Elimina un registro de userFile
 * @param token Token de autenticación JWT
 * @param fileId ID del registro a eliminar
 * @returns Booleano indicando éxito
 */
export async function deleteUserFile(token: string, fileId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const url = new URL(`/api/file-users/${fileId}`, getStrapiURL())
    console.log("Deleting user file:", url.toString())

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("Delete user file response status:", response.status)

    if (!response.ok) {
      let errorMessage = "Error deleting file"
      try {
        const errorData = await response.json()
        console.error("Delete Error:", errorData)
        errorMessage = errorData.error?.message || errorMessage
      } catch (e) {
        console.error("Error parsing error response:", e)
      }
      return { success: false, error: errorMessage }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteUserFile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
