"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Minus, X, ChevronLeft, ChevronRight, Clock, Star } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// Tipo para los tours
export interface Tour {
  documentId: string
  categorias: { Nombre: string }[]
  nombre: string
  descripcion: string
  duracion_min: number
  Image: { url: string }
}

// Tipo para las categorías
export interface Category {
  id: string
  name: string
}

interface TourGalleryProps {
  tours: Tour[]
  categories: Category[]
  title?: string
}

export default function TourGallery({ tours, categories, title = "Tours de México" }: TourGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedTour, setSelectedTour] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  // Filtrar tours por categoría
  const filteredTours = activeCategory
    ? tours.filter((tour) => tour.categorias.some((cat) => cat.Nombre === activeCategory))
    : tours

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Función para cambiar el zoom
  const handleZoom = (direction: "in" | "out") => {
    if (direction === "in" && zoomLevel < 1.5) {
      setZoomLevel((prev) => prev + 0.1)
    } else if (direction === "out" && zoomLevel > 0.5) {
      setZoomLevel((prev) => prev - 0.1)
    }
  }

  // Modificar la función navigateTour para que respete el filtro de categoría activo
  // Reemplazar la función navigateTour actual con esta versión mejorada:

  // Función para navegar entre tours respetando el filtro de categoría
  const navigateTour = (direction: "next" | "prev") => {
    if (selectedTour === null) return

    // Usar los tours filtrados por categoría en lugar de todos los tours
    const toursToNavigate = filteredTours
    const currentIndex = toursToNavigate.findIndex((tour) => tour.documentId === selectedTour)
    let newIndex

    if (direction === "next") {
      newIndex = (currentIndex + 1) % toursToNavigate.length
    } else {
      newIndex = (currentIndex - 1 + toursToNavigate.length) % toursToNavigate.length
    }

    setSelectedTour(toursToNavigate[newIndex].documentId)
  }

  // Formatear duración
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours} ${hours === 1 ? "hora" : "horas"}${mins > 0 ? ` ${mins} min` : ""}` : `${mins} min`
  }

  // Función para determinar si un tour es destacado (para demostración)
  const isFeatured = (tourId: string): boolean => {
    // Simulamos que algunos tours son destacados (en producción esto vendría de la API)
    return tourId.charCodeAt(0) % 3 === 0
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Espacio para el navbar principal */}
      <div className="h-[120px] md:h-[100px]"></div>

      {/* Filtros de categoría */}
      <div className="sticky top-[100px] z-40 bg-white border-b border-gray-200 py-3 px-6 shadow-sm">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2 md:mb-0">{title}</h1>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Button
              variant="ghost"
              size="sm"
              className={`text-sm px-3 py-1 ${!activeCategory ? "bg-green-50 text-green-600" : "text-gray-500"}`}
              onClick={() => setActiveCategory(null)}
            >
              Todos
            </Button>

            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                size="sm"
                className={`text-sm px-3 py-1 ${
                  activeCategory === category.name ? "bg-green-50 text-green-600" : "text-gray-500"
                }`}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}

            <div className="flex gap-2 ml-auto md:ml-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => handleZoom("out")}
                aria-label="Alejar"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => handleZoom("in")}
                aria-label="Acercar"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Galería principal de tours */}
      <main className="container mx-auto pt-8 pb-12 px-4 md:px-8">
        {/* Título de categoría activa */}
        {activeCategory && (
          <div className="mb-6">
            <h2 className="text-xl text-gray-700 font-medium">
              Tours: <span className="text-green-600">{activeCategory}</span>
            </h2>
            <p className="text-gray-500 text-sm">
              Mostrando {filteredTours.length} tours en la categoría {activeCategory}
            </p>
          </div>
        )}

        {/* Grid de tours */}
        <AnimatePresence>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center top" }}
          >
            {filteredTours.map((tour) => (
              <motion.div
                key={tour.documentId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer group"
                onClick={() => setSelectedTour(tour.documentId)}
              >
                <div className="relative overflow-hidden h-[160px]">
                  <img
                    src={tour.Image.url || "/placeholder.svg?height=300&width=400"}
                    alt={tour.nombre}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=300&width=400"
                      e.currentTarget.alt = "Imagen no disponible"
                    }}
                  />
                  {/*{isFeatured(tour.documentId) && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full shadow-md flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-white" />
                      Destacado
                    </div>
                  )}*/}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full bg-white/90 hover:bg-white text-gray-800 text-xs"
                    >
                      Ver detalles
                    </Button>
                  </div>
                </div>
                <div className="p-3 flex flex-col justify-between h-[140px]">
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                      {tour.nombre}
                    </h3>
                    {tour.descripcion && <p className="text-gray-600 text-xs line-clamp-2">{tour.descripcion}</p>}
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center text-xs text-gray-500 mb-1.5">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(tour.duracion_min)}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tour.categorias.slice(0, 2).map((cat, idx) => (
                        <span
                          key={idx}
                          className="inline-block text-[10px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded-full"
                        >
                          {cat.Nombre}
                        </span>
                      ))}
                      {tour.categorias.length > 2 && (
                        <span className="inline-block text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          +{tour.categorias.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Mensaje si no hay resultados */}
        {filteredTours.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron tours en esta categoría.</p>
            <Button variant="outline" className="mt-4" onClick={() => setActiveCategory(null)}>
              Ver todos los tours
            </Button>
          </motion.div>
        )}
      </main>

      {/* Modal de tour a pantalla completa */}
      <AnimatePresence>
        {selectedTour !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setSelectedTour(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl mx-auto bg-white rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedTour(null)
                }}
                className="absolute top-4 right-4 z-50 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              {tours.find((tour) => tour.documentId === selectedTour) && (
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/2 h-[300px] md:h-auto">
                    <img
                      src={
                        tours.find((tour) => tour.documentId === selectedTour)?.Image.url ||
                        "/placeholder.svg?height=600&width=800" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={tours.find((tour) => tour.documentId === selectedTour)?.nombre || ""}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=600&width=800"
                        e.currentTarget.alt = "Imagen no disponible"
                      }}
                    />
                    {/*{isFeatured(selectedTour) && (
                      <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full shadow-md flex items-center">
                        <Star className="w-4 h-4 mr-1.5 fill-white" />
                        Tour Destacado
                      </div>
                    )}*/}
                  </div>

                  <div className="p-6 md:p-8 w-full md:w-1/2 flex flex-col">
                    <div className="flex-grow">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tours
                          .find((tour) => tour.documentId === selectedTour)
                          ?.categorias.map((cat, idx) => (
                            <span
                              key={idx}
                              className="inline-block text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full"
                            >
                              {cat.Nombre}
                            </span>
                          ))}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                        {tours.find((tour) => tour.documentId === selectedTour)?.nombre}
                      </h2>
                      <div className="flex items-center text-gray-600 mb-4">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          Duración:{" "}
                          {formatDuration(tours.find((tour) => tour.documentId === selectedTour)?.duracion_min || 0)}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="text-sm font-semibold mb-2">Descripción del tour</h3>
                        <p className="text-gray-700 text-sm">
                          {tours.find((tour) => tour.documentId === selectedTour)?.descripcion}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <Link
                        href={`/tours/${selectedTour}`}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Ver detalles completos
                      </Link>
                      {/*<Link
                        href={`/tours/${selectedTour}/cotizar`}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors"
                      >
                        Solicitar cotización
                      </Link>*/}
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute inset-y-0 left-0 flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-4 rounded-full bg-white/90 text-gray-800 shadow-md hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateTour("prev")
                  }}
                  aria-label="Tour anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="mr-4 rounded-full bg-white/90 text-gray-800 shadow-md hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateTour("next")
                  }}
                  aria-label="Tour siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {/*<footer className="bg-gray-100 text-gray-600 py-6 text-center border-t border-gray-200">
        <p className="text-sm">&copy; 2024 México Inmersivo. Todos los derechos reservados.</p>
      </footer>*/}
    </div>
  )
}
