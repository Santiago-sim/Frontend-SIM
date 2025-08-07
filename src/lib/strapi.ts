// lib/strapi.ts
const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_HOST
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN

type QueryOptions = {
  cache?: RequestCache
  tags?: string[]
  headers?: Record<string, string>
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export async function query(
  url: string,
  options: QueryOptions = {},
  method: HttpMethod = "GET",
  body?: string | FormData,
) {
  if (!STRAPI_HOST) {
    throw new Error("STRAPI_HOST no está definido en las variables de entorno")
  }

  if (!STRAPI_TOKEN) {
    throw new Error("STRAPI_TOKEN no está definido en las variables de entorno")
  }

  const { cache = "no-store", tags, headers = {} } = options

  try {
    // Preparar las opciones de fetch
    const fetchOptions: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        ...headers,
      },
      cache,
      next: {
        tags,
      },
    }

    // Añadir el Content-Type solo si no es FormData
    if (!(body instanceof FormData)) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        "Content-Type": "application/json",
      }
    }

    // Añadir el body solo para métodos que no sean GET
    if (method !== "GET" && body) {
      fetchOptions.body = body
    }

    const response = await fetch(`${STRAPI_HOST}/api/${url}`, fetchOptions)

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error en query:", error)
    throw error
  }
}

// Función auxiliar para mantener compatibilidad con código existente
export async function queryGet(url: string, options: QueryOptions = {}) {
  return query(url, options)
}
