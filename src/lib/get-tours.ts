import { query } from "./strapi"

interface TourData {
  id: number
  documentId: string
  categoria: string
  nombre: string
  descripcion: string
  duracion_min: number
  Image: {
    url: string
  }
}

interface StrapiResponse {
  data: TourData[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export type TourWithCategory = {
  documentId: string
  categorias: { Nombre: string }[] // Updated to reflect the correct structure
  nombre: string
  descripcion: string
  duracion_min: number
  Image: { url: string }
}

interface StrapiResponseWithCategory {
  data: TourWithCategory[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface PaginatedToursResponse {
  tours: {
    documentId: string
    name: string
    description: string
    duration: string
    image: string
  }[]
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

export async function getTours(page = 1, pageSize = 3): Promise<PaginatedToursResponse> {
  try {
    const queryString = `tours?pagination[page]=${page}&pagination[pageSize]=${pageSize}&fields[0]=nombre&fields[1]=descripcion&fields[2]=duracion_min&fields[3]=documentId&populate[Image][fields][0]=url`

    const response = (await query(queryString, {
      cache: "no-store",
      tags: ["tours"],
    })) as StrapiResponse

    if (!response?.data) {
      throw new Error("Datos no encontrados")
    }

    return {
      tours: response.data.map((tour) => ({
        documentId: tour.documentId,
        name: tour.nombre,
        description: tour.descripcion,
        duration: `${Math.round(tour.duracion_min / 60)} horas`,
        image: tour.Image?.url ?? "",
      })),
      pagination: response.meta.pagination,
    }
  } catch (error) {
    console.error("Error en getTours:", error)
    return {
      tours: [],
      pagination: {
        page: 1,
        pageSize: pageSize,
        pageCount: 0,
        total: 0,
      },
    }
  }
}

export async function getAllTours(): Promise<TourWithCategory[]> {
  try {
    // Query optimizado
    const queryParams = [
      "fields[0]=nombre",
      "fields[1]=documentId",
      "fields[2]=descripcion",
      "fields[3]=duracion_min",
      "populate[Image][fields][0]=url",
      "populate[categorias][fields][0]=Nombre", // <- Solo el nombre de categorías
    ].join("&")

    const response = (await query(`tours?${queryParams}`, {
      //cache: "no-store",
      tags: ["tours"],
    })) as StrapiResponseWithCategory

    if (!response?.data) {
      throw new Error("Datos no encontrados")
    }

    // Mapeo optimizado
    return response.data.map((tour) => ({
      documentId: tour.documentId,
      categorias: tour.categorias?.map((c) => ({ Nombre: c.Nombre })) || [], // Estructura corregida
      nombre: tour.nombre,
      descripcion: tour.descripcion,
      duracion_min: tour.duracion_min,
      Image: { url: tour.Image?.url ?? "" },
    }))
  } catch (error) {
    console.error("Error en getAllTours:", error)
    return []
  }
}
