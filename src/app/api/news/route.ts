import { getLatestNews, searchNews, loadNextPage } from "@/app/data/services/news-service"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const nextPage = searchParams.get("page")

  let response

  if (nextPage) {
    // Cargar siguiente página
    response = await loadNextPage(nextPage)
  } else if (query) {
    // Buscar por palabra clave
    response = await searchNews(query)
  } else {
    // Obtener últimas noticias
    response = await getLatestNews()
  }

  return NextResponse.json(response)
}
