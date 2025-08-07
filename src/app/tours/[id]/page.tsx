// Modificación en page.tsx
"use client"
import { Suspense, useEffect, useState, use } from "react"
import { getTour } from "@/lib/get-tour"
import { notFound, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Clock, MapPin, Star, Check, X, AlertTriangle, Heart, Share2, Calendar, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, isBefore, startOfToday } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { StrapiContentRenderer } from "@/components/StrapiContentRenderer"
import { StrapiBlock } from "@/types/strapi"

// Importamos el Dialog para el modal de carga
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

const Footer = dynamic(() => import("@/components/Footer"))

interface PageProps {
  params: Promise<{ id: string }>
}

interface TourData {
  documentId: string
  name: string
  description: string
  longDescription: string
  price: number
  priceChildren?: number
  duration: string
  includes: StrapiBlock[] | null
  notIncludes: StrapiBlock[] | null
  recommendations: StrapiBlock[] | null
  image: string
  ubicacion: string
}

const LoadingSkeleton = () => (
  <div className="min-h-screen animate-pulse bg-gray-100">
    <div className="h-[400px] bg-gray-200" />
    <div className="container mx-auto px-4 -mt-20">
      <div className="h-40 bg-gray-200 rounded-lg shadow-lg" />
    </div>
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="h-8 w-64 bg-gray-200 mb-4 rounded" />
          <div className="h-24 bg-gray-200 rounded mb-6" />
          <div className="h-12 bg-gray-200 rounded mb-4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
        <div>
          <div className="h-80 bg-gray-200 rounded shadow-lg" />
        </div>
      </div>
    </div>
  </div>
)

// Componente modal de carga
const LoadingModal = ({ open }: { open: boolean }) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-lg">
      <DialogTitle className="text-lg font-semibold mb-4">Cargando...</DialogTitle>
        <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
        <h3 className="text-xl font-semibold text-center">Procesando su solicitud</h3>
        <p className="text-gray-500 text-center mt-2">
          Por favor espere mientras preparamos su cotización...
        </p>
      </DialogContent>
    </Dialog>
  )
}

export default function TourPage({ params }: PageProps) {
  const router = useRouter()
  const [tour, setTour] = useState<TourData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [adultsCount, setAdultsCount] = useState(1)
  const [childrenCount, setChildrenCount] = useState(0)
  // Nuevo estado para controlar la carga al solicitar cotización
  const [isSubmitting, setIsSubmitting] = useState(false)
  const resolvedParams = use(params)
  const { id } = resolvedParams

  useEffect(() => {
    const fetchTour = async () => {
      setIsLoading(true)
      try {
        const tourData = await getTour(id) as TourData
        if (!tourData) {
          notFound()
        } else {
          setTour(tourData)
        }
      } catch (error) {
        console.error("Error fetching tour:", error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }
    fetchTour()
  }, [id])

  if (isLoading) return <LoadingSkeleton />
  if (!tour) return notFound()

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  // Calcular el precio total basado en la selección
  const calculateTotal = () => {
    let total = adultsCount * tour.price
    if (tour.priceChildren && childrenCount > 0) {
      total += childrenCount * tour.priceChildren
    }
    return total
  }

  // Función para deshabilitar fechas pasadas
  const disabledDates = (date: Date) => {
    return isBefore(date, startOfToday())
  }

  // Manejar la solicitud de cotización
  const handleRequestQuote = () => {
    // Activar el estado de carga
    setIsSubmitting(true)

    // Guardar los datos seleccionados en sessionStorage para pasarlos a la página de cotización
    sessionStorage.setItem(
      "tourBookingData",
      JSON.stringify({
        tourId: id,
        tourName: tour.name,
        tourLocation: tour.ubicacion,
        selectedDate: selectedDate ? selectedDate.toISOString() : null,
        adultsCount,
        childrenCount,
        totalPrice: calculateTotal(),
      }),
    )

    // Simular un pequeño retraso para mejor UX (500ms)
    // Esto asegura que el modal de carga sea visible al menos por un momento
    setTimeout(() => {
      // Navegar a la página de solicitud de cotización
      router.push(`/solicitar-cotizacion/${id}`)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal de carga */}
      <LoadingModal open={isSubmitting} />

      {/* Hero Section - Altura reducida */}
      <div className="relative h-[550px] w-full">
        <img src={tour.image || "/placeholder.com"} alt={tour.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4 text-sm breadcrumbs relative z-10 -mt-[500px] text-white">
        <Link href="/" className="hover:underline">
          Inicio
        </Link>
        <span className="mx-2">{">"}</span>
        <Link href="/tours" className="hover:underline">
          Tours
        </Link>
        <span className="mx-2">{">"}</span>
        <span>{tour.name}</span>
      </div>

      {/* Tour Title Card */}
      <div className="container mx-auto px-4 relative z-10 mt-[400px]">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{tour.name}</h1>
              <div className="flex items-center mt-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">5.0 (24 reseñas)</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-1" />
                <span>{tour.ubicacion}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-end">
              <div className="text-3xl font-bold text-green-600">${tour.price} MXN</div>
              <div className="text-gray-500">por persona</div>
              {tour.priceChildren && <div className="text-sm text-gray-500 mt-1">Niños: ${tour.priceChildren} MXN</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Tour Details */}
          <div className="md:col-span-2">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Duración</div>
                    <div className="font-medium">{tour.duration}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Ubicación</div>
                    <div className="font-medium">{tour.ubicacion}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500">Ideal para</div>
                    <div className="font-medium">Todas las edades</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tour Content Tabs */}
            <Tabs defaultValue="descripcion" className="mb-8">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                <TabsTrigger value="incluye">Incluye</TabsTrigger>
                <TabsTrigger value="no-incluye">No Incluye</TabsTrigger>
                <TabsTrigger value="recomendaciones">Recomendaciones</TabsTrigger>
              </TabsList>

              <TabsContent value="descripcion" className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Acerca de este tour</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">{tour.description}</p>
                  {tour.longDescription && <p className="text-gray-700">{tour.longDescription}</p>}
                </div>
              </TabsContent>

              <TabsContent value="incluye" className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">¿Qué incluye?</h2>
                <ul className="space-y-2">
                  <StrapiContentRenderer content={tour.includes} />
                </ul>
              </TabsContent>

              <TabsContent value="no-incluye" className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">¿Qué no incluye?</h2>
                <ul className="space-y-2">
                  <StrapiContentRenderer content={tour.notIncludes} />
                </ul>
              </TabsContent>

              <TabsContent value="recomendaciones" className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Recomendaciones</h2>
                <ul className="space-y-2">
                  <StrapiContentRenderer content={tour.recommendations} />
                </ul>
              </TabsContent>
            </Tabs>

            {/* Location with Google Maps */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(tour.ubicacion)}`}
                  allowFullScreen
                  title={`Mapa de ${tour.name}`}
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right Column - Booking & Info */}
          <div>
            {/* Booking Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Reserva este tour</h2>

              {/* Calendario mejorado con estilos corregidos */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Fecha</label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border border-gray-300 hover:bg-gray-50",
                        !selectedDate && "text-gray-500",
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border border-gray-200 shadow-lg rounded-md"
                    align="start"
                    sideOffset={4}
                  >
                    <div className="p-3 bg-white">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate || undefined}
                        onSelect={(date) => {
                          setSelectedDate(date || null)
                          setCalendarOpen(false)
                        }}
                        disabled={disabledDates}
                        initialFocus
                        locale={es}
                        fromDate={new Date()} // Solo permite fechas desde hoy
                        className="bg-white rounded-md border-none"
                        styles={{
                          head_cell: { width: "100%" },
                          cell: { width: "40px", height: "40px" },
                          button: { width: "100%", height: "100%" },
                          nav_button_previous: { width: "32px", height: "32px" },
                          nav_button_next: { width: "32px", height: "32px" },
                          caption: { padding: "16px" },
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                {!selectedDate && <p className="text-xs text-gray-500 mt-1">Selecciona una fecha para tu visita</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Personas</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 text-xs mb-1">Adultos</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={adultsCount}
                      onChange={(e) => setAdultsCount(Number.parseInt(e.target.value))}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-xs mb-1">Niños</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(Number.parseInt(e.target.value))}
                    >
                      {[...Array(11)].map((_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Precio por adulto</span>
                  <span className="font-medium">${tour.price} MXN</span>
                </div>
                {tour.priceChildren && childrenCount > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Precio por niño</span>
                    <span className="font-medium">${tour.priceChildren} MXN</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-green-600">${calculateTotal()} MXN</span>
                </div>
              </div>

              {/* Botón modificado para mostrar estado de carga */}
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium mb-3"
                onClick={handleRequestQuote}
                disabled={!selectedDate || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Solicitar cotización"
                )}
              </Button>

              <div className="mt-4 text-center">
                <button className="text-gray-500 text-sm flex items-center justify-center mx-auto hover:text-gray-700">
                  <Share2 className="h-4 w-4 mr-1" />
                  Compartir este tour
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Tours Section */}
      {/*<div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Tours similares que podrían interesarte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Placeholder for related tours 
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">Tour relacionado {i + 1}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Ubicación</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm text-gray-500">4 horas</span>
                    </div>
                    <div className="font-bold text-green-600">$1,200 MXN</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>*/}

      <Suspense fallback={<div>Cargando...</div>}>
        <Footer />
      </Suspense>
    </div>
  )
}