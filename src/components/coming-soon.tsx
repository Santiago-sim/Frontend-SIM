import type React from "react"
import Link from "next/link"
import { CalendarClock, ArrowLeft, Construction } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ComingSoonProps {
  title: string
  description?: string
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  title,
  description = "Estamos trabajando para ofrecerte una experiencia increíble. Esta sección estará disponible muy pronto.",
}) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-22 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-md w-full mx-auto text-center space-y-8">
        {/* Icono animado */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Construction className="h-12 w-12 text-green-600" />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{title}</h1>
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <CalendarClock className="h-5 w-5" />
            <span className="font-medium">Próximamente</span>
          </div>
          <p className="text-gray-600 max-w-sm mx-auto">{description}</p>
        </div>

        {/* Tarjeta de información */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">¿Qué puedes hacer mientras tanto?</h3>
          <ul className="text-left text-gray-600 space-y-2 mb-4">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Explorar nuestros tours disponibles</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Contactar con nuestro equipo para más información</span>
            </li>
            {/*<li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Suscribirte para recibir notificaciones cuando esté disponible</span>
            </li>*/}
          </ul>

          <div className="pt-4 border-t border-gray-100">
            <Link href="/" passHref>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>

        {/* Notificación */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md">
          <p className="text-sm text-green-700">
            ¿Quieres ser el primero en saber cuando esté disponible? Contáctanos en{" "}
            <a href="mailto:contacto@sitiosdeinteresmexico.com" className="font-medium underline">
              contacto@sitiosdeinteresmexico.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon
