// Interfaces para los datos de noticias
export interface Article {
    article_id: string
    title: string
    link: string
    keywords: string[] | null
    creator: string[] | null
    description: string | null
    pubDate: string
    image_url: string | null
    source_id: string
    source_name: string
    source_icon: string | null
    language: string
    country: string[]
    category: string[]
  }
  
  export interface NewsResponse {
    status: string
    totalResults?: number
    results?: Article[]
    nextPage?: string
    error?: string
  }
  
  /**
   * Obtiene las últimas noticias de México en la categoría top
   */
  export async function getLatestNews(): Promise<NewsResponse> {
    try {
      // La API key ahora está segura en el servidor
      const apiKey = process.env.NEWSDATA_API_KEY
  
      if (!apiKey) {
        console.error("API key no configurada en variables de entorno")
        return {
          status: "error",
          error: "Configuración del servidor incompleta. Contacte al administrador.",
        }
      }
  
      const apiUrl = `https://newsdata.io/api/1/latest?country=mx&category=entertainment&apikey=${apiKey}`
      const response = await fetch(apiUrl, {
        next: { revalidate: 3600 }, // Revalidar cada hora
      })
  
      if (!response.ok) {
        let errorMsg = `Error HTTP: ${response.status}`
        try {
          const errorData = await response.json()
          errorMsg = `API Error: ${errorData?.results?.message || errorMsg}`
        } catch (jsonError) {
          /* Ignorar error de parseo de JSON */
        }
  
        return {
          status: "error",
          error: errorMsg,
        }
      }
  
      const data = await response.json()
  
      if (data.status === "success" && data.results) {
        return {
          status: "success",
          totalResults: data.totalResults || data.results.length,
          results: data.results,
          nextPage: data.nextPage || null,
        }
      } else {
        return {
          status: "error",
          error: data.results
            ? (data.results as any).message
            : "La API no devolvió un estado de éxito o faltan resultados.",
        }
      }
    } catch (err: any) {
      console.error("Error al obtener las últimas noticias:", err)
      return {
        status: "error",
        error: err.message || "Ocurrió un error inesperado al cargar las noticias.",
      }
    }
  }
  
  /**
   * Busca noticias por palabra clave
   */
  export async function searchNews(query: string): Promise<NewsResponse> {
    try {
      const apiKey = process.env.NEWSDATA_API_KEY
  
      if (!apiKey) {
        return {
          status: "error",
          error: "Configuración del servidor incompleta. Contacte al administrador.",
        }
      }
  
      const apiUrl = `https://newsdata.io/api/1/news?country=mx&q=${encodeURIComponent(query)}&apikey=${apiKey}`
      const response = await fetch(apiUrl)
  
      if (!response.ok) {
        return {
          status: "error",
          error: `Error HTTP: ${response.status}`,
        }
      }
  
      const data = await response.json()
  
      if (data.status === "success" && data.results) {
        return {
          status: "success",
          totalResults: data.totalResults || data.results.length,
          results: data.results,
          nextPage: data.nextPage || null,
        }
      } else {
        return {
          status: "error",
          error: "No se encontraron resultados para esta búsqueda.",
        }
      }
    } catch (err: any) {
      console.error("Error al buscar noticias:", err)
      return {
        status: "error",
        error: err.message || "Ocurrió un error inesperado al buscar noticias.",
      }
    }
  }
  
  /**
   * Carga la siguiente página de resultados
   */
  export async function loadNextPage(nextPageToken: string): Promise<NewsResponse> {
    try {
      const apiKey = process.env.NEWSDATA_API_KEY
  
      if (!apiKey) {
        return {
          status: "error",
          error: "Configuración del servidor incompleta. Contacte al administrador.",
        }
      }
  
      const apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&page=${nextPageToken}`
      const response = await fetch(apiUrl)
  
      if (!response.ok) {
        return {
          status: "error",
          error: `Error HTTP: ${response.status}`,
        }
      }
  
      const data = await response.json()
  
      if (data.status === "success" && data.results) {
        return {
          status: "success",
          totalResults: data.totalResults || data.results.length,
          results: data.results,
          nextPage: data.nextPage || null,
        }
      } else {
        return {
          status: "error",
          error: "No se pudieron cargar más resultados.",
        }
      }
    } catch (err: any) {
      console.error("Error al cargar la siguiente página:", err)
      return {
        status: "error",
        error: err.message || "Ocurrió un error inesperado al cargar más noticias.",
      }
    }
  }
  