"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  FileSignature,
  Download,
  Eye,
  Search,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getUserReservations } from "@/app/data/services-reserva/get-reserva"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserMe } from "@/app/data/services-documents/get-user-file"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { downloadFile } from "@/app/data/services-reserva/download-utils"

interface Reservation {
  id: string
  documentId: string
  date: string
  message: string
  tourId: {
    id: string
    documentId: string
    nombre: string
    descripcion: string
    precio: number
    ubicacion: string
    duracion_min: number
  } | null
  contractGenerated: {
    id: string
    documentId: string
    url: string
    name: string
  } | null
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  useEffect(() => {
    // Función para cargar las reservas
    const fetchReservations = async () => {
      try {
        setIsLoading(true)

        // Obtener el ID del usuario
        const userData = await getUserMe()
        const userId = userData.data.documentId

        // Obtener las reservas
        const data = await getUserReservations(userId)

        if (data) {
          setReservations(data)
          setFilteredReservations(data)
        } else {
          setError("No se pudieron cargar las reservas")
        }
      } catch (err) {
        setError("Error al cargar las reservas")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    // Llamar a la función para cargar las reservas
    fetchReservations()
  }, [])

  useEffect(() => {
    // Filtrar reservas basado en el término de búsqueda y la pestaña activa
    let filtered = [...reservations]

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (reservation) =>
          reservation.tourId?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.id.toString().includes(searchTerm),
      )
    }

    // Aplicar filtro de pestaña
    if (activeTab === "with-contract") {
      filtered = filtered.filter((reservation) => reservation.contractGenerated)
    } else if (activeTab === "pending-contract") {
      filtered = filtered.filter((reservation) => !reservation.contractGenerated)
    }

    setFilteredReservations(filtered)
  }, [searchTerm, activeTab, reservations])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours === 0) {
      return `${remainingMinutes} minutos`
    } else if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? "hora" : "horas"}`
    } else {
      return `${hours} ${hours === 1 ? "hora" : "horas"} y ${remainingMinutes} minutos`
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const viewReservationDetails = (reservationId: string) => {
    router.push(`/dashboard/reservations/${reservationId}`)
  }

  const handleDownloadContract = (url: string, filename: string) => {
    // Función para descargar el contrato
    const download = async () => {
      try {
        await downloadFile(url, filename)
      } catch (err) {
        console.error("Error al descargar el contrato:", err)
      }
    }

    download()
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h1 className="text-xl font-medium text-gray-800 mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Mis Reservas
        </h1>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Card key={i} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
                <Skeleton className="h-24 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-32 ml-auto" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h1 className="text-xl font-medium text-gray-800 mb-6 flex items-center gap-2">
        <FileText className="h-5 w-5 text-blue-500" />
        Mis Reservas
      </h1>

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {reservations.length === 0 && !error ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No tienes reservas</h3>
          <p className="text-gray-500 mb-6">Explora nuestros tours y realiza tu primera reserva.</p>
          <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer">Explorar Tours</Button>
        </div>
      ) : (
        <>
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre de tour, mensaje o ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="all" className="cursor-pointer">
                  Todas ({reservations.length})
                </TabsTrigger>
                <TabsTrigger value="with-contract" className="cursor-pointer">
                  Con Contrato ({reservations.filter((r) => r.contractGenerated).length})
                </TabsTrigger>
                <TabsTrigger value="pending-contract" className="cursor-pointer">
                  Pendientes ({reservations.filter((r) => !r.contractGenerated).length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {filteredReservations.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Filter className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No se encontraron resultados</h3>
              <p className="text-gray-500">Intenta con otros términos de búsqueda o filtros</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredReservations.map((reservation) => (
                <Card
                  key={reservation.id}
                  className={`border-l-4 ${
                    reservation.contractGenerated ? "border-l-green-500" : "border-l-blue-500"
                  } hover:shadow-md transition-shadow duration-200`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <CardTitle className="text-lg">
                        {reservation.tourId ? reservation.tourId.nombre : "Tour no especificado"}
                      </CardTitle>
                      <Badge
                        className={
                          reservation.contractGenerated
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        }
                      >
                        {reservation.contractGenerated ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Contrato Generado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pendiente de Contrato
                          </span>
                        )}
                      </Badge>
                    </div>
                    <CardDescription>Reserva #{reservation.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                        <span>{reservation.date ? formatDate(reservation.date) : "Fecha no especificada"}</span>
                      </div>
                      {reservation.tourId && (
                        <>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                            <span>{formatDuration(reservation.tourId.duracion_min)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                            <span className="truncate" title={reservation.tourId.ubicacion}>
                              {reservation.tourId.ubicacion}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {reservation.message && (
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Mensaje:</h4>
                        <p className="text-gray-600 line-clamp-2">{reservation.message}</p>
                      </div>
                    )}

                    {reservation.contractGenerated ? (
                      <div className="bg-blue-50 p-4 rounded-md">
                        <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Contrato Generado
                        </h4>
                        <p className="text-gray-600 mb-3">
                          El contrato para esta reserva ha sido generado. Puedes visualizarlo y firmarlo a continuación.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                            onClick={() => window.open(reservation.contractGenerated?.url, "_blank")}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Contrato
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                            onClick={() =>
                              reservation.contractGenerated &&
                              handleDownloadContract(
                                reservation.contractGenerated.url,
                                `contrato-${reservation.id}.pdf`,
                              )
                            }
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                            onClick={() => viewReservationDetails(reservation.documentId)}
                          >
                            <FileSignature className="h-4 w-4 mr-2" />
                            Firmar Contrato
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 p-4 rounded-md flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-yellow-700 mb-2">Contrato Pendiente</h4>
                          <p className="text-gray-600">
                            El contrato para esta reserva aún no ha sido generado. Nuestro equipo lo generará pronto.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 ml-auto cursor-pointer"
                      onClick={() => viewReservationDetails(reservation.documentId)}
                    >
                      Ver detalles
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
