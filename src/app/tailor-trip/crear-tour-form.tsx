"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  CalendarIcon,
  Loader2,
  MessageSquare,
  User,
  Flag,
  Mail,
  Phone,
  Check,
  Building,
  Plane,
  Train,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormularioCrearTourProps {
  token: string
  user: any
}

interface FormData {
  nombreCompleto: string
  nacionalidad: string
  email: string
  telefono: string
  fechaSalida: Date | null
  estanciaViaje: string
  ciudadInicio: string
  vueloReservado: boolean
  tipoHotel: string
  tipoTransporte: string
  descripcionViaje: string
  tipoGrupo: string
  adultos: number
  ninos: number
  bebes: number
}

export default function FormularioCrearTour({ token, user }: FormularioCrearTourProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Inicializar el formulario con los datos del usuario
  const [formData, setFormData] = useState<FormData>({
    nombreCompleto: user?.data?.firstName + " " + user?.data?.lastName || "",
    nacionalidad: user?.data?.Nationality || "",
    email: user?.data?.email || "",
    telefono: user?.data?.Phone || "",
    fechaSalida: null,
    estanciaViaje: "",
    ciudadInicio: "",
    vueloReservado: false,
    tipoHotel: "",
    tipoTransporte: "",
    descripcionViaje: "",
    tipoGrupo: "solo",
    adultos: 1,
    ninos: 0,
    bebes: 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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

    if (!formData.fechaSalida) {
      newErrors.fechaSalida = "La fecha de salida es obligatoria."
      isValid = false
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const sixMonthsLater = new Date()
      sixMonthsLater.setMonth(today.getMonth() + 6)
      sixMonthsLater.setHours(23, 59, 59, 999)

      if (formData.fechaSalida < today) {
        newErrors.fechaSalida = "La fecha de salida no puede ser anterior a hoy."
        isValid = false
      } else if (formData.fechaSalida > sixMonthsLater) {
        newErrors.fechaSalida = "La fecha de salida no puede ser posterior a 6 meses desde hoy."
        isValid = false
      }
    }

    if (!formData.estanciaViaje.trim()) {
      newErrors.estanciaViaje = "La estancia de viaje es obligatoria."
      isValid = false
    }

    if (!formData.ciudadInicio.trim()) {
      newErrors.ciudadInicio = "La ciudad de inicio es obligatoria."
      isValid = false
    }

    if (!formData.tipoHotel) {
      newErrors.tipoHotel = "Debe seleccionar un tipo de hotel."
      isValid = false
    }

    if (!formData.tipoTransporte) {
      newErrors.tipoTransporte = "Debe seleccionar un tipo de transporte."
      isValid = false
    }

    if (!formData.descripcionViaje.trim()) {
      newErrors.descripcionViaje = "La descripción del viaje es obligatoria."
      isValid = false
    }

    if (formData.tipoGrupo === "familia" && formData.adultos === 0) {
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
      // Aquí se implementaría la lógica similar a createBooking
      // Por ahora solo enviamos el email
      const emailResponse = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          tourData: null, // No hay tour específico en este caso
          isTourPersonalizado: true, // Asegurarnos de que esto sea explícitamente true
        }),
      })

      if (!emailResponse.ok) {
        const emailResult = await emailResponse.json()
        throw new Error(emailResult.error || "Error al enviar el correo electrónico")
      }

      setShowSuccessModal(true)
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

  const handleNumberChange = (name: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Resetear valores relacionados con el tipo de grupo
    if (name === "tipoGrupo") {
      if (value === "solo") {
        setFormData((prev) => ({
          ...prev,
          adultos: 1,
          ninos: 0,
          bebes: 0,
        }))
      } else if (value === "dosPersonas") {
        setFormData((prev) => ({
          ...prev,
          adultos: 2,
          ninos: 0,
          bebes: 0,
        }))
      }
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      vueloReservado: checked,
    }))
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
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Crear Tour Personalizado</h1>

      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6" role="alert">
          <strong className="font-medium">Error:</strong>
          <span className="block sm:inline ml-1">{errors.form}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Número de pasajeros */}
        <section className="p-5 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="inline-block w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm flex items-center justify-center mr-2">
              1
            </span>
            Número de pasajeros
          </h3>

          <div className="space-y-4">
            <RadioGroup
              value={formData.tipoGrupo}
              onValueChange={(value) => handleRadioChange("tipoGrupo", value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solo" id="solo" />
                <Label htmlFor="solo">Solo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dosPersonas" id="dosPersonas" />
                <Label htmlFor="dosPersonas">Dos personas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="familia" id="familia" />
                <Label htmlFor="familia">Familia</Label>
              </div>
            </RadioGroup>

            {formData.tipoGrupo === "familia" && (
              <div className="mt-4 pl-6 border-l-2 border-green-200 space-y-4">
                <div>
                  <Label htmlFor="adultos" className="block text-sm font-medium text-gray-700 mb-1">
                    Adultos
                  </Label>
                  <Select
                    value={formData.adultos.toString()}
                    onValueChange={(value) => handleNumberChange("adultos", Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar número de adultos" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.adultos && <p className="text-red-600 text-xs mt-1">{errors.adultos}</p>}
                </div>

                <div>
                  <Label htmlFor="ninos" className="block text-sm font-medium text-gray-700 mb-1">
                    Niños (2-11 años)
                  </Label>
                  <Select
                    value={formData.ninos.toString()}
                    onValueChange={(value) => handleNumberChange("ninos", Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar número de niños" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(11)].map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bebes" className="block text-sm font-medium text-gray-700 mb-1">
                    Bebés (0-2 años)
                  </Label>
                  <Select
                    value={formData.bebes.toString()}
                    onValueChange={(value) => handleNumberChange("bebes", Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar número de bebés" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(6)].map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Detalles de viaje */}
        <section className="p-5 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="inline-block w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm flex items-center justify-center mr-2">
              2
            </span>
            Detalles de viaje
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="fechaSalida" className="text-gray-700">
                Fecha de salida
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border border-gray-300 hover:bg-gray-50",
                      !formData.fechaSalida && "text-gray-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.fechaSalida ? (
                      format(formData.fechaSalida, "PPP", { locale: es })
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
                      selected={formData.fechaSalida || undefined}
                      onSelect={(date) => {
                        setFormData((prev) => ({ ...prev, fechaSalida: date || null }))
                        setCalendarOpen(false)
                        if (errors.fechaSalida) {
                          setErrors((prev) => ({ ...prev, fechaSalida: "" }))
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
              {errors.fechaSalida && <p className="text-red-600 text-xs mt-1">{errors.fechaSalida}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estanciaViaje" className="text-gray-700">
                Estancia de viaje (días)
              </Label>
              <Input
                id="estanciaViaje"
                name="estanciaViaje"
                type="number"
                min="1"
                max="90"
                value={formData.estanciaViaje}
                onChange={handleChange}
                className="mt-1 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
                placeholder="Ej: 7"
              />
              {errors.estanciaViaje && <p className="text-red-600 text-xs mt-1">{errors.estanciaViaje}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ciudadInicio" className="text-gray-700">
                Ciudad donde empieza el viaje
              </Label>
              <Input
                id="ciudadInicio"
                name="ciudadInicio"
                value={formData.ciudadInicio}
                onChange={handleChange}
                className="mt-1 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500"
                placeholder="Ej: Ciudad de México"
              />
              {errors.ciudadInicio && <p className="text-red-600 text-xs mt-1">{errors.ciudadInicio}</p>}
            </div>

            <div className="space-y-2 flex items-center">
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox
                  id="vueloReservado"
                  checked={formData.vueloReservado}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="vueloReservado" className="text-gray-700">
                  Ya está reservado su vuelo internacional
                </Label>
              </div>
            </div>
          </div>
        </section>

        {/* Hotel */}
        <section className="p-5 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="inline-block w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm flex items-center justify-center mr-2">
              3
            </span>
            Hotel
          </h3>

          <RadioGroup
            value={formData.tipoHotel}
            onValueChange={(value) => handleRadioChange("tipoHotel", value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5estrellas" id="5estrellas" />
              <Label htmlFor="5estrellas" className="flex items-center">
                <Building className="w-4 h-4 mr-2 text-yellow-500" />5 estrellas
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4estrellas" id="4estrellas" />
              <Label htmlFor="4estrellas" className="flex items-center">
                <Building className="w-4 h-4 mr-2 text-blue-500" />4 estrellas
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3estrellas" id="3estrellas" />
              <Label htmlFor="3estrellas" className="flex items-center">
                <Building className="w-4 h-4 mr-2 text-green-500" />3 estrellas
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reservadoPorCuenta" id="reservadoPorCuenta" />
              <Label htmlFor="reservadoPorCuenta" className="flex items-center">
                <Building className="w-4 h-4 mr-2 text-gray-500" />
                Reservado por su cuenta
              </Label>
            </div>
          </RadioGroup>
          {errors.tipoHotel && <p className="text-red-600 text-xs mt-1">{errors.tipoHotel}</p>}
        </section>

        {/* Transporte */}
        <section className="p-5 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="inline-block w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm flex items-center justify-center mr-2">
              4
            </span>
            Transporte
          </h3>

          <RadioGroup
            value={formData.tipoTransporte}
            onValueChange={(value) => handleRadioChange("tipoTransporte", value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="vuelo" id="vuelo" />
              <Label htmlFor="vuelo" className="flex items-center">
                <Plane className="w-4 h-4 mr-2 text-blue-500" />
                Vuelo
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="vueloTren" id="vueloTren" />
              <Label htmlFor="vueloTren" className="flex items-center">
                <div className="flex items-center">
                  <Plane className="w-4 h-4 mr-1 text-blue-500" />
                  <span className="mx-1">+</span>
                  <Train className="w-4 h-4 ml-1 text-green-500" />
                </div>
                <span className="ml-2">Vuelo + Tren</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reservadoPorCuenta" id="transporteReservadoPorCuenta" />
              <Label htmlFor="transporteReservadoPorCuenta" className="flex items-center">
                <Plane className="w-4 h-4 mr-2 text-gray-500" />
                Reservado por su cuenta
              </Label>
            </div>
          </RadioGroup>
          {errors.tipoTransporte && <p className="text-red-600 text-xs mt-1">{errors.tipoTransporte}</p>}
        </section>

        {/* Adonde viaja */}
        <section className="p-5 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="inline-block w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm flex items-center justify-center mr-2">
              5
            </span>
            Adonde viaja
          </h3>

          <div className="space-y-2">
            <Label htmlFor="descripcionViaje" className="text-gray-700 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
              Díganos a donde quiere viajar, sus intereses y otras necesidades
            </Label>
            <Textarea
              id="descripcionViaje"
              name="descripcionViaje"
              rows={4}
              value={formData.descripcionViaje}
              onChange={handleChange}
              className="mt-1 bg-white border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
              placeholder="Describa los lugares que desea visitar, actividades de interés, preferencias gastronómicas, etc."
            />
            {errors.descripcionViaje && <p className="text-red-600 text-xs mt-1">{errors.descripcionViaje}</p>}
          </div>
        </section>

        {/* Información del contacto */}
        <section className="p-5 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="inline-block w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm flex items-center justify-center mr-2">
              6
            </span>
            Información del contacto
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

        {/* Nota informativa */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <p className="text-sm text-blue-700">
            Al enviar este formulario, nuestro equipo diseñará un tour personalizado según sus preferencias y se pondrá
            en contacto con usted.
          </p>
        </div>

        {/* Botón de envío */}
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors text-lg py-5 rounded-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Procesando su solicitud...
            </>
          ) : (
            "Enviar"
          )}
        </Button>
      </form>

      {/* Modal de éxito */}
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
            <DialogTitle className="text-xl font-semibold text-green-800">¡Solicitud Enviada!</DialogTitle>
          </div>

          <div className="p-6 text-center">
            <p className="text-gray-700 mb-6">
              Su solicitud de tour personalizado se ha enviado correctamente. Nuestro equipo se pondrá en contacto con
              usted en las próximas 24-48 horas para discutir los detalles.
            </p>

            <DialogFooter className="flex justify-center">
              <Button
                onClick={handleConfirmAndRedirect}
                className="bg-green-600 hover:bg-green-700 text-white transition-colors py-2 px-8 rounded-lg"
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
