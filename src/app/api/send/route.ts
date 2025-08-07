import { EmailTemplate } from "@/components/email-template"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { formData, tourData } = body

    // Determinar si es un tour personalizado basado en la presencia de tourData
    // Si tourData es null o undefined, es un tour personalizado
    const isTourPersonalizado = !tourData || body.isTourPersonalizado === true

    // Configuración común
    const domain = "sitiosdeinteresmexico.com" // Tu dominio verificado
    const fromAddress = `Sitios Interés México <admin@${domain}>`

    // Función para formatear fecha
    const formatDate = (dateString: string) => {
      if (!dateString) return "No especificada"
      const date = new Date(dateString)
      return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    }

    // Calcular total de viajeros
    const totalViajeros =
      Number.parseInt(formData.adultos?.toString() || "0") +
      Number.parseInt(formData.ninos?.toString() || "0") +
      Number.parseInt(formData.bebes?.toString() || "0")

    // Crear asunto específico según el tipo de solicitud
    const subject = isTourPersonalizado
      ? `🌮 Nueva Solicitud de Tour Personalizado - ${formData.nombreCompleto}`
      : `🌮 Nueva Solicitud de Reserva: ${tourData?.name} - ${formData.nombreCompleto}`

    // Enviar email al administrador
    const adminEmail = await resend.emails.send({
      from: fromAddress,
      to: process.env.ADMIN_EMAIL || "neueskodent@gmail.com",
      subject: subject,
      react: await EmailTemplate({
        formData,
        tourData,
        isAdminView: true,
        isTourPersonalizado,
      }),
      text: isTourPersonalizado
        ? `Nueva solicitud de tour personalizado de ${formData.nombreCompleto}. Fecha de salida: ${
            formData.fechaSalida ? formatDate(formData.fechaSalida) : "No especificada"
          }. Contacto: ${formData.email}, ${formData.telefono}.`
        : `Nueva solicitud de reserva para ${tourData?.name} de ${formData.nombreCompleto}. Fecha de viaje: ${
            formData.fechaViaje ? formatDate(formData.fechaViaje) : "No especificada"
          }. Contacto: ${formData.email}, ${formData.telefono}.`,
    })

    if (adminEmail.error) {
      console.error("Error email admin:", adminEmail.error)
      throw new Error("Falló email admin")
    }

    // Enviar email al cliente
    const customerEmail = await resend.emails.send({
      from: fromAddress,
      to: formData.email,
      subject: isTourPersonalizado
        ? `✅ Confirmación de Solicitud - Tour Personalizado`
        : `✅ Confirmación de Reserva - ${tourData?.name}`,
      react: await EmailTemplate({
        formData,
        tourData,
        isAdminView: false,
        isTourPersonalizado,
      }),
      text: isTourPersonalizado
        ? `Hemos recibido su solicitud de tour personalizado. Fecha de salida: ${
            formData.fechaSalida ? formatDate(formData.fechaSalida) : "No especificada"
          }. Nos pondremos en contacto con usted en las próximas 24-48 horas.`
        : `Hemos recibido su solicitud de reserva para ${tourData?.name}. Fecha de viaje: ${
            formData.fechaViaje ? formatDate(formData.fechaViaje) : "No especificada"
          }. Nos pondremos en contacto con usted en las próximas 24 horas.`,
    })

    if (customerEmail.error) {
      console.error("Error email cliente:", customerEmail.error)
      throw new Error("Falló email cliente")
    }

    return Response.json({
      success: true,
      adminId: adminEmail.data?.id,
      customerId: customerEmail.data?.id,
    })
  } catch (error) {
    console.error("Error general:", error)
    return Response.json({ error: "Error procesando solicitud" }, { status: 500 })
  }
}
