import { EmailTemplate } from "@/components/email-template"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { formData, isTourPersonalizado } = await request.json()

    // Configuración común
    const domain = "sitiosdeinteresmexico.com" // Tu dominio verificado
    const fromAddress = `Sitios Interés México <admin@${domain}>`

    // Función para formatear fecha
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    }

    // Calcular total de viajeros
    const totalViajeros =
      Number.parseInt(formData.adultos || "0") +
      Number.parseInt(formData.ninos || "0") +
      Number.parseInt(formData.bebes || "0")

    // Crear asunto específico para tour personalizado
    const subject = `🌮 Nueva Solicitud de Tour Personalizado - ${formData.nombreCompleto}`

    // Enviar email al administrador
    const adminEmail = await resend.emails.send({
      from: fromAddress,
      to: process.env.ADMIN_EMAIL || "neueskodent@gmail.com",
      subject: subject,
      react: await EmailTemplate({
        formData,
        tourData: null,
        isAdminView: true,
        isTourPersonalizado: true,
      }),
      text: `Nueva solicitud de tour personalizado de ${formData.nombreCompleto}. Fecha de salida: ${formatDate(formData.fechaSalida)}. Contacto: ${formData.email}, ${formData.telefono}.`,
    })

    if (adminEmail.error) {
      console.error("Error email admin:", adminEmail.error)
      throw new Error("Falló email admin")
    }

    // Enviar email al cliente
    const customerEmail = await resend.emails.send({
      from: fromAddress,
      to: formData.email,
      subject: `✅ Confirmación de Solicitud - Tour Personalizado`,
      react: await EmailTemplate({
        formData,
        tourData: null,
        isAdminView: false,
        isTourPersonalizado: true,
      }),
      text: `Hemos recibido su solicitud de tour personalizado. Fecha de salida: ${formatDate(formData.fechaSalida)}. Nos pondremos en contacto con usted en las próximas 24-48 horas.`,
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
