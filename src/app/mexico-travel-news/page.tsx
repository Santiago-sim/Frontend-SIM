import Link from "next/link"
import ArticleCard from "@/components/news/ArticleCard"
import { AlertTriangle, Search, ServerCrash, Rss } from "lucide-react"
import { getLatestNews } from "@/app/data/services/news-service"

export default async function NewsPage() {
  const newsData = await getLatestNews()

  // Si hay un error
  if (newsData.status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-white text-center p-4">
        <ServerCrash className="w-16 h-16 mx-auto text-red-400 mb-6" />
        <h2 className="text-3xl font-bold text-red-800 mb-4">¡Ups! Algo salió mal</h2>
        <p className="text-red-600 max-w-md mx-auto mb-8">
          No pudimos cargar las últimas noticias. Por favor, inténtalo de nuevo más tarde.
        </p>
        <p className="text-sm text-gray-500 mb-8">Detalle: {newsData.error}</p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Search className="w-4 h-4 mr-2" /> Volver al inicio
        </Link>
      </div>
    )
  }

  const articles = newsData.results || []
  const totalResults = newsData.totalResults || 0

  // Si no hay resultados
  if (articles.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white text-center p-4">
        <AlertTriangle className="w-16 h-16 mx-auto text-yellow-400 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">No se encontraron noticias</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          No hay noticias disponibles para mostrar en esta categoría por el momento.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Search className="w-4 h-4 mr-2" /> Explorar otras secciones
        </Link>
      </div>
    )
  }

  // Renderizado principal con resultados
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-600 to-cyan-800 py-20 text-white">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Rss className="w-16 h-16 mx-auto mb-4 text-cyan-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Últimas Noticias de México (Top)</h1>
            <p className="text-lg text-cyan-100 mb-8">Mantente informado con los titulares más recientes.</p>
            <div className="flex justify-center">
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
                <span>
                  Mostrando {articles.length} de {totalResults} noticias
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Noticias */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.article_id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Sección Footer */}
      <section className="bg-gray-100 py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">Noticias proporcionadas por Newsdata.io.</p>
          <Link href="/" className="text-emerald-600 hover:text-emerald-800 mt-2 inline-block">
            Volver a la página principal
          </Link>
        </div>
      </section>
    </div>
  )
}
