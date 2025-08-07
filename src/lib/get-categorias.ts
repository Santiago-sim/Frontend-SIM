import { query } from "./strapi"

interface CategoriaData {
  documentId: string
  Nombre: string
}

export async function getCategorias() {
  try {
    const response = (await query("categorias?fields[0]=documentId&fields[1]=Nombre", {
      //cache: "no-store",
      tags: ["categorias-nav"],
    })) as { data: CategoriaData[] }

    if (!response?.data) {
      throw new Error("Datos no encontrados")
    }

    return response.data.map((categoria) => ({
      id: categoria.documentId,
      name: categoria.Nombre,
    }))
  } catch (error) {
    console.error("Error en getCategorias:", error)
    return []
  }
}
