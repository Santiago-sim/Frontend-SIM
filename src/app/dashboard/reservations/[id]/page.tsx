"use client"

import { useState, useEffect, use } from "react"
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Save,
  Download,
  ArrowLeft,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getUserReservationById } from "@/app/data/services-reserva/get-reserva"
import { updateReservationWithSignedContract } from "@/app/data/services-reserva/update-reserva"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import ContractSigner from "@/components/components-reservations/contract-signer"
import { getUserMe } from "@/app/data/services-documents/get-user-file"
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
  contractSigned?: {
    id: string
    documentId: string
    url: string
    name: string
  } | null
}

export default function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Extraer el ID de manera segura
  const { id } = use(params)

  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSigning, setIsSigning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signedContract, setSignedContract] = useState<File | null>(null)
  const [signedContractPreview, setSignedContractPreview] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Función para cargar los datos de la reserva
    const fetchReservation = async () => {
      try {
        setIsLoading(true)

        // Obtener el ID del usuario
        const userData = await getUserMe()
        const userId = userData.data.documentId

        // Obtener los datos de la reserva
        const data = await getUserReservationById(id, userId)

        if (data) {
          setReservation(data)
        } else {
          setError("No se pudo cargar la reserva")
        }
      } catch (err) {
        setError("Error al cargar la reserva")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    // Llamar a la función para cargar los datos
    fetchReservation()
  }, [id])

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

  const handleContractSigned = (signedFile: File, previewUrl: string) => {
    setSignedContract(signedFile)
    setSignedContractPreview(previewUrl)
    setIsSigning(false)
  }

  const handleSubmitSignedContract = () => {
    if (!signedContract || !reservation) return

    setIsSubmitting(true)

    // Enviar el contrato firmado
    const submitContract = async () => {
      try {
        const userData = await getUserMe()
        const userId = userData.data.documentId
        const success = await updateReservationWithSignedContract(reservation.id, userId, signedContract)

        if (success) {
          setSubmitSuccess(true)

          // Actualizar la reserva con la información del contrato firmado
          setReservation((prev) => {
            if (!prev) return null
            return {
              ...prev,
              contractSigned: {
                id: "temp-id",
                documentId: "temp-doc-id",
                url: signedContractPreview || "",
                name: `contrato-firmado-${reservation.id}.pdf`,
              },
            }
          })
        } else {
          setError("No se pudo actualizar la reserva con el contrato firmado")
        }
      } catch (err) {
        setError("Error al enviar el contrato firmado")
        console.error(err)
      } finally {
        setIsSubmitting(false)
      }
    }

    submitContract()
  }

  const handleDownloadContract = (url: string, filename: string) => {
    if (!url) return

    setIsDownloading(true)

    // Descargar el contrato
    const download = async () => {
      try {
        await downloadFile(url, filename)
      } catch (err) {
        setError("Error al descargar el contrato")
        console.error(err)
      } finally {
        setIsDownloading(false)
      }
    }

    download()
  }

  const goBack = () => {
    router.push("/dashboard/reservations")
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={goBack} className="mr-4 cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-xl font-medium text-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Detalles de Reserva
          </h1>
        </div>
        <Card className="border-l-4 border-l-blue-500">
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
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={goBack} className="mr-4 cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-xl font-medium text-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Detalles de Reserva
          </h1>
        </div>

        <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error || "No se encontró la reserva solicitada"}</AlertDescription>
        </Alert>

        <Button onClick={goBack} className="bg-blue-500 hover:bg-blue-600 cursor-pointer">
          Volver a Mis Reservas
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={goBack} className="mr-4 cursor-pointer">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-xl font-medium text-gray-800 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Detalles de Reserva #{reservation.id}
        </h1>
      </div>

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {submitSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            ¡El contrato firmado ha sido enviado con éxito! Un administrador revisará tu reserva pronto.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-l-4 border-l-blue-500 mb-6 hover:shadow-md transition-shadow duration-200">
        <CardHeader>
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
          <CardDescription>Información de la reserva</CardDescription>
        </CardHeader>
        <CardContent>
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
                  <span>{reservation.tourId.ubicacion}</span>
                </div>
              </>
            )}
          </div>

          {reservation.message && (
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Mensaje:</h4>
              <p className="text-gray-600">{reservation.message}</p>
            </div>
          )}

          {reservation.tourId && (
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Detalles del Tour:</h4>
              <p className="text-gray-600 mb-2">{reservation.tourId.descripcion}</p>
              <p className="text-gray-800 font-medium">Precio: ${reservation.tourId.precio.toFixed(2)} USD</p>
            </div>
          )}
        </CardContent>
      </Card>

      {reservation.contractGenerated ? (
        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              Contrato
            </CardTitle>
            <CardDescription>Visualiza y firma tu contrato</CardDescription>
          </CardHeader>
          <CardContent>
            {isSigning ? (
              <ContractSigner
                contractUrl={reservation.contractGenerated.url}
                onContractSigned={handleContractSigned}
                onCancel={() => setIsSigning(false)}
              />
            ) : signedContract && signedContractPreview ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md mb-4">
                  <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Contrato Firmado
                  </h4>
                  <p className="text-gray-600 mb-3">
                    Has firmado el contrato correctamente. Ahora puedes enviarlo para completar tu reserva.
                  </p>
                </div>

                <div className="aspect-[3/4] w-full bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border mb-4">
                  <iframe
                    src={signedContractPreview}
                    className="w-full h-full"
                    title="Contrato firmado"
                    style={{ minHeight: "500px" }}
                  />
                </div>

                <Button
                  className="bg-green-500 hover:bg-green-600 cursor-pointer"
                  onClick={handleSubmitSignedContract}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Enviar Contrato Firmado
                    </>
                  )}
                </Button>
              </div>
            ) : submitSuccess && reservation.contractSigned ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md mb-4">
                  <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Contrato Enviado
                  </h4>
                  <p className="text-gray-600 mb-3">
                    El contrato firmado ha sido enviado con éxito. Un administrador revisará tu reserva pronto.
                  </p>
                </div>

                <div className="aspect-[3/4] w-full bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border mb-4">
                  <iframe
                    src={reservation.contractSigned.url}
                    className="w-full h-full"
                    title="Contrato firmado"
                    style={{ minHeight: "500px" }}
                  />
                </div>

                <Button
                  variant="outline"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                  onClick={() =>
                    handleDownloadContract(reservation.contractSigned!.url, `contrato-firmado-${reservation.id}.pdf`)
                  }
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Descargando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Contrato Firmado
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-[3/4] w-full bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border">
                  <iframe
                    src={reservation.contractGenerated.url}
                    className="w-full h-full"
                    title="Contrato"
                    style={{ minHeight: "500px" }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                    onClick={() =>
                      handleDownloadContract(reservation.contractGenerated!.url, `contrato-${reservation.id}.pdf`)
                    }
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Descargando...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Descargar Contrato
                      </>
                    )}
                  </Button>
                  <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer" onClick={() => setIsSigning(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Firmar Contrato
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <XCircle className="h-5 w-5 text-yellow-500" />
              Contrato Pendiente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 p-4 rounded-md">
              <h4 className="font-medium text-yellow-700 mb-2">Contrato en Proceso</h4>
              <p className="text-gray-600">
                El contrato para esta reserva aún no ha sido generado. Nuestro equipo lo generará pronto. Una vez
                generado, podrás visualizarlo, firmarlo y enviarlo desde esta página.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
