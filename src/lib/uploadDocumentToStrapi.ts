// Tipos para los documentos
export type DocumentType = "passport" | "visa"
export type DocumentStatus = "pending" | "uploaded" | "approved" | "rejected"

export interface Document {
  type: DocumentType
  name: string
  message: string
  status: DocumentStatus
  file?: File
  url?: string
  uploadedAt?: string
}

// Función para obtener los documentos iniciales
export function getInitialDocuments(): Document[] {
  return [
    {
      type: "passport",
      name: "Pasaporte",
      message:
        "Sube una copia de tu pasaporte vigente. Asegúrate que sea legible y que muestre claramente tus datos personales.",
      status: "pending",
    },
    {
      type: "visa",
      name: "Visa",
      message:
        "Sube una copia de tu visa vigente. Asegúrate que sea legible y que muestre claramente la fecha de vencimiento.",
      status: "pending",
    },
  ]
}

// Función para obtener la fecha actual formateada
export function getCurrentFormattedDate(): string {
  const now = new Date()
  return now.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Esta función es un placeholder, ya que ahora usamos las server actions
export async function uploadDocumentToStrapi(file: File, type: DocumentType) {
  // Esta función ya no se usa directamente, pero la mantenemos para compatibilidad
  console.warn("Esta función está obsoleta. Use las server actions en su lugar.")

  // Simulamos una respuesta exitosa
  return {
    success: true,
    url: URL.createObjectURL(file),
  }
}

