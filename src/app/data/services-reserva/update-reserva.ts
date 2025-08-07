"use server"

import { revalidateTag } from "next/cache"

// URL base de Strapi como fallback en caso de que la variable de entorno no esté definida
const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_HOST || "http://127.0.0.1:1337"

export async function updateReservationWithSignedContract(
  reservationId: string,
  userId: string,
  signedContract: File,
): Promise<boolean> {
  try {
    console.log("Iniciando actualización de reserva con contrato firmado")
    //console.log("URL de Strapi:", STRAPI_BASE_URL)

    // 1. Convertir el archivo a FormData para subirlo
    const formData = new FormData()
    formData.append("files", signedContract)
    formData.append("ref", "api::reserva.reserva")
    formData.append("refId", reservationId)
    formData.append("field", "contrato_firmado")

    // 2. Subir el archivo firmado a Strapi
    const uploadUrl = `${STRAPI_BASE_URL}/api/upload`
    //console.log("URL de subida:", uploadUrl)

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
      // No incluimos headers de autenticación para evitar problemas de CORS
      // La configuración de Strapi debe permitir subidas públicas para este endpoint
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error("Error al subir el contrato firmado:", errorText)
      throw new Error(`Error al subir el contrato firmado: ${errorText}`)
    }

    const uploadData = await uploadResponse.json()
    //console.log("Contrato firmado subido correctamente:", uploadData)

    // 3. Actualizar la reserva para marcarla como firmada
    const updateData = {
      data: {
        documentoFirmado: true,
        // Si hay un ID de archivo en la respuesta, lo usamos
        contrato_firmado: uploadData[0]?.id,
      },
    }

    // Usar la ruta personalizada que hemos creado para actualizar la reserva
    const updateUrl = `${STRAPI_BASE_URL}/api/reservas/${reservationId}/signed-contract`
    //console.log("URL de actualización:", updateUrl)

    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error("Error al actualizar la reserva:", errorText)
      throw new Error(`Error al actualizar la reserva: ${errorText}`)
    }

    // 4. Revalidar la caché para este usuario
    revalidateTag(`user-reservations-${userId}`)
    revalidateTag(`user-reservation-${reservationId}`)

    return true
  } catch (error) {
    console.error("Error en updateReservationWithSignedContract:", error)
    return false
  }
}

// Función para combinar un PDF con una firma
export async function getSignedContractPreview(contractUrl: string, signatureImageData: string): Promise<string> {
  try {
    // En un entorno real, aquí combinaríamos el PDF con la firma
    // Para este ejemplo, simplemente devolvemos la URL del contrato original
    // En producción, deberías usar una biblioteca como pdf-lib para modificar el PDF

    // Simulamos un retraso para dar la impresión de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Devolvemos la URL del contrato original como fallback
    // En una implementación real, esto sería la URL del nuevo PDF con la firma
    return contractUrl
  } catch (error) {
    console.error("Error al generar vista previa del contrato firmado:", error)
    throw error
  }
}
