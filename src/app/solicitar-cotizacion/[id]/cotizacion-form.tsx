"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, MapPin, Loader2, Users, MessageSquare, User, Flag, Mail, Phone, Check } from "lucide-react"
import { createBooking } from "@/lib/crear-reserva"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface TourData {
  name: string
  ubicacion: string
}

interface FormularioReservaProps {
  token: string
  user: any
  tourData: TourData | null
  tourId: number
}

interface FormData {
  nombreCompleto: string
  nacionalidad: string
  email: string
  telefono: string
  fechaViaje: Date | null
  mensaje: string
  tipoGrupo: string
  adultos: number
  ninos: number
  bebes: number
}

interface BookingData {
  tourId: string
  tourName: string
  tourLocation: string
  selectedDate: string | null
  adultsCount: number
  childrenCount: number
  totalPrice: number
}

export default function FormularioReserva({ token, user, tourData, tourId }: FormularioReservaProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Inicializar el formulario con los datos del usuario
  const [formData, setFormData] = useState<FormData>({
    nombreCompleto: user?.data?.firstName + " " + user?.data?.lastName || "",
    nacionalidad: user?.data?.Nationality || "",
    email: user?.data?.email || "",
    telefono: user?.data?.Phone || "",
    fechaViaje: null,
    mensaje: "",
    tipoGrupo: "solo",
    adultos: 1,
    ninos: 0,
    bebes: 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Cargar datos de reserva de sessionStorage
  useEffect(() => {
    const storedData = sessionStorage.getItem("tourBookingData")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setBookingData(parsedData)

        // Actualizar el formulario con los datos de la reserva
        setFormData((prev) => ({
          ...prev,
          // Convertir la fecha ISO string a objeto Date si existe
          fechaViaje: parsedData.selectedDate ? new Date(parsedData.selectedDate) : null,
          adultos: parsedData.adultsCount || 1,
          ninos: parsedData.childrenCount || 0,
          tipoGrupo:
            parsedData.adultsCount > 1 || parsedData.childrenCount > 0
              ? parsedData.childrenCount > 0
                ? "familia"
                : "dosPersonas"
              : "solo",
        }))
      } catch (error) {
        console.error("Error al parsear datos de reserva:", error)
      }
    }
  }, [])

  const validateForm = () => {
    let isValid = true
    const newErrors: Record<string, string> = {}

    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = "El nombre completo es obligatorio."
      isValid = false
    }
    if (!formData.nacionalidad.trim()) {
      newErrors.nacionalidad = "La nacionalidad es obligatoria."
      isValid = false
    }

    if (!formData.fechaViaje) {
      newErrors.fechaViaje = "La fecha de viaje es obligatoria."
      isValid = false
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const sixMonthsLater = new Date()
      sixMonthsLater.setMonth(today.getMonth() + 6)
      sixMonthsLater.setHours(23, 59, 59, 999)

      if (formData.fechaViaje < today) {
        newErrors.fechaViaje = "La fecha de viaje no puede ser anterior a hoy."
        isValid = false
      } else if (formData.fechaViaje > sixMonthsLater) {
        newErrors.fechaViaje = "La fecha de viaje no puede ser posterior a 6 meses desde hoy."
        isValid = false
      }
    }

    if ((formData.tipoGrupo === "familia" || formData.tipoGrupo === "grupo") && formData.adultos === 0) {
      newErrors.adultos = "Debe haber al menos un adulto en el grupo."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return
    setErrors({})

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const bookingResult = await createBooking(
        token,
        user.data.documentId,
        tourId,
        formData.fechaViaje?.toISOString() ?? "",
        formData.mensaje,
      )
      

      if (!bookingResult.data?.id) {
        throw new Error("Error al crear la reserva")
      }
      const emailResponse = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          tourData,
          isTourPersonalizado: false, // Explícitamente indicar que NO es un tour personalizado
        }),
      })

      if (!emailResponse.ok) {
        const emailResult = await emailResponse.json()
        throw new Error(emailResult.error || "Error al enviar el correo electrónico")
      }

      setShowSuccessModal(true)

      // Limpiar los datos de reserva de sessionStorage
      sessionStorage.removeItem("tourBookingData")
    } catch (error) {
      console.error("Error en handleSubmit:", error)
      setErrors({
        form: error instanceof Error ? error.message : "Ocurrió un error al procesar su solicitud.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleConfirmAndRedirect = () => {
    router.push("/")
  }

  // Función para deshabilitar fechas pasadas
  const disabledDates = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Confirma tu Reserva</h1>

      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6" role="alert">
          <strong className="font-medium">Error:</strong>
          <span className="block sm:inline ml-1">{errors.form}</span>
        </div>
      )}

      {/* Resumen de la reserva - Diseño mejorado */}
      <div className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="inline-block w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm flex items-center justify-center mr-2">
            1
          </span>
          Resumen de tu reserva
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">{tourData?.name}</h3>
                <p className="text-gray-600 text-sm">{tourData?.ubicacion}</p>
              </div>
            </div>

            {bookingData && (
              <div className="space-y-2 mt-4 pl-2 border-l-2 border-green-200">
                <div className="flex items-center text-gray-700">
                  <CalendarIcon className="w-5 h-5 mr-2 text-green-500" />
                  <span>
                    {formData.fechaViaje
                      ? format(formData.fechaViaje, "d 'de' MMMM, yyyy", { locale: es })
                      : "Fecha no seleccionada"}
                  </span>
                </div>

                <div className="flex items-center text-gray-700">
                  <Users className="w-5 h-5 mr-2 text-green-500" />
                  <span>
                    {formData.adultos} {formData.adultos === 1 ? "adulto" : "adultos"}
                    {formData.ninos > 0 && `, ${formData.ninos} ${formData.ninos === 1 ? "niño" : "niños"}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b border-gray-100">Precio total</h3>
            {bookingData && (
              <>
                <div className="flex justify-between mb-2 text-gray-600">
                  <span>Adultos ({bookingData.adultsCount})</span>
                  <span className="font-medium">
                    $
                    {Math.round(
                      bookingData.adultsCount *
                        (bookingData.totalPrice / (bookingData.adultsCount + (bookingData.childrenCount || 0))),
                    )}{" "}
                    MXN
                  </span>
                </div>

                {bookingData.childrenCount > 0 && (
                  <div className="flex justify-between mb-2 text-gray-600">
                    <span>Niños ({bookingData.childrenCount})</span>
                    <span className="font-medium">
                      $
                      {Math.round(
                        bookingData.childrenCount *
                          ((bookingData.totalPrice / (bookingData.adultsCount + bookingData.childrenCount)) * 0.7),
                      )}{" "}
                      MXN
                    </span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-green-600">${bookingData.totalPrice} MXN</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">Impuestos incluidos</p>
              </>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Personal - Diseño mejorado */}
        <section className="p-5 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="inline-block w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm flex items-center justify-center mr-2">
              2
            </span>
            Información Personal
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="nombreCompleto" className="text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                Nombre completo
              </Label>
              {errors.nombreCompleto && <p className="text-red-600 text-xs mt-1">{errors.nombreCompleto}</p>}
              <Input
                id="nombreCompleto"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleChange}
                className="mt-1 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <Label htmlFor="nacionalidad" className="text-gray-700 flex items-center">
                <Flag className="w-4 h-4 mr-2 text-gray-500" />
                Nacionalidad o lugar de residencia
              </Label>
              {errors.nacionalidad && <p className="text-red-600 text-xs mt-1">{errors.nacionalidad}</p>}
              <Input
                id="nacionalidad"
                name="nacionalidad"
                value={formData.nacionalidad}
                onChange={handleChange}
                className="mt-1 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                Correo electrónico
              </Label>
              <div className="mt-1 p-2 bg-gray-100 rounded border border-gray-200 text-gray-600">{formData.email}</div>
              <p className="text-xs text-gray-500 mt-1">No se puede modificar</p>
            </div>

            <div>
              <Label htmlFor="telefono" className="text-gray-700 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                Teléfono (opcional)
              </Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                className="mt-1 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
                placeholder="+52 123 456 7890"
              />
            </div>
          </div>
        </section>

        {/* Fecha de viaje */}
        <section className="p-5 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="inline-block w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm flex items-center justify-center mr-2">
              3
            </span>
            Fecha de Viaje
          </h3>

          <div className="space-y-2">
            <Label htmlFor="fechaViaje" className="text-gray-700">
              Selecciona la fecha de tu viaje
            </Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border border-gray-300 hover:bg-gray-50",
                    !formData.fechaViaje && "text-gray-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.fechaViaje ? (
                    format(formData.fechaViaje, "PPP", { locale: es })
                  ) : (
                    <span>Selecciona una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white border border-gray-200 shadow-lg rounded-md"
                align="start"
                sideOffset={4}
              >
                <div className="p-3 bg-white">
                  <Calendar
                    mode="single"
                    selected={formData.fechaViaje || undefined}
                    onSelect={(date) => {
                      setFormData((prev) => ({ ...prev, fechaViaje: date || null }))
                      setCalendarOpen(false)
                      if (errors.fechaViaje) {
                        setErrors((prev) => ({ ...prev, fechaViaje: "" }))
                      }
                    }}
                    disabled={disabledDates}
                    initialFocus
                    locale={es}
                    fromDate={new Date()}
                    className="bg-white rounded-md border-none"
                  />
                </div>
              </PopoverContent>
            </Popover>
            {errors.fechaViaje && <p className="text-red-600 text-xs mt-1">{errors.fechaViaje}</p>}
          </div>
        </section>

        {/* Mensaje adicional - Diseño mejorado */}
        <section className="p-5 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="inline-block w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm flex items-center justify-center mr-2">
              4
            </span>
            Mensaje adicional
          </h3>

          <div>
            <Label htmlFor="mensaje" className="text-gray-700 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
              Mensaje o requerimientos especiales
            </Label>
            <Textarea
              id="mensaje"
              name="mensaje"
              rows={4}
              value={formData.mensaje}
              onChange={handleChange}
              className="mt-1 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
              placeholder="¿Tienes alguna solicitud especial o pregunta para el operador del tour?"
            />
          </div>
        </section>

        {/* Nota informativa */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <p className="text-sm text-blue-700">
            Al confirmar tu reserva, recibirás un correo electrónico con los detalles y el contrato.
          </p>
        </div>

        {/* Botón de confirmación */}
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors text-lg py-5 rounded-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Procesando su reserva...
            </>
          ) : (
            "Confirmar Reserva"
          )}
        </Button>
      </form>

      {/* Modal de éxito - Diseño mejorado */}
      <Dialog open={showSuccessModal} onOpenChange={() => {}}>
        <DialogContent
          className="bg-white rounded-lg shadow-lg max-w-md mx-auto p-0 overflow-hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="bg-green-50 p-4 text-center">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-green-800">¡Reserva Exitosa!</DialogTitle>
          </div>

          <div className="p-6 text-center">
            <p className="text-gray-700 mb-6">
              Su reserva se ha enviado correctamente. En breve le enviaremos por correo electrónico la información y el
              contrato.
            </p>

            <DialogFooter className="flex justify-center">
              <Button
                onClick={handleConfirmAndRedirect}
                className="bg-green-600 hover:bg-green-700 text-white transition-colors py-2 px-8 rounded-lg cursor-pointer"
              >
                Volver al inicio
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
