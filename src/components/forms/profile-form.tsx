"use client"

import { cn } from "@/lib/utils"
import { useActionState } from "react"
import { updateProfileAction } from "@/app/data/actions/profile-actions"
import { countries } from "@/constants/countries"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { StrapiErrors } from "@/components/custom/strapi-errors"
import { SubmitButton } from "../custom/submit-button"
import { User, Phone, Mail, Globe, Check } from "lucide-react"

const INITIAL_STATE = {
  data: null,
  strapiErrors: null,
  message: null,
}

interface DashboardFormProps {
  id: string
  email: string
  firstName: string
  lastName: string
  Phone: string
  Nationality: string
}

export function DashboardForm({
  data,
  className,
}: {
  readonly data: DashboardFormProps
  readonly className?: string
}) {
  const updateDashboardWithId = updateProfileAction.bind(null, data.id)

  const [formState, formAction] = useActionState(updateDashboardWithId, INITIAL_STATE)

  return (
    <div className={cn("bg-white p-6 rounded-lg border shadow-sm", className)}>
      <h1 className="text-xl font-medium text-gray-800 mb-6 flex items-center gap-2">
        <User className="h-5 w-5 text-blue-500" />
        Información de mi cuenta
      </h1>

      <form action={formAction} className="space-y-6">
        {/* Email Field - Read Only */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label htmlFor="email" className="min-w-[120px] font-medium text-gray-700 flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              Email:
            </Label>
            <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200 text-gray-700 w-full">
              {data?.email || "Correo no disponible"}
            </div>
          </div>
          <p className="text-xs text-gray-500 ml-0 sm:ml-[120px]">
            Tu correo electrónico es tu identificador único y no puede ser modificado.
          </p>
        </div>

        {/* First Name Field */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label htmlFor="firstName" className="min-w-[120px] font-medium text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              Nombre:
            </Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={data?.firstName || ""}
              className="bg-blue-50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              placeholder="Ingresa tu nombre"
            />
          </div>
        </div>

        {/* Last Name Field */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label htmlFor="lastName" className="min-w-[120px] font-medium text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              Apellido:
            </Label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={data?.lastName || ""}
              className="bg-blue-50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              placeholder="Ingresa tu apellido"
            />
          </div>
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label htmlFor="phone" className="min-w-[120px] font-medium text-gray-700 flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-500" />
              Teléfono:
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={data?.Phone || ""}
              className="bg-blue-50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              placeholder="Ingresa tu número telefónico"
            />
          </div>
          <p className="text-xs text-gray-500 ml-0 sm:ml-[120px]">
            Te contactaremos a este número para confirmar tus reservaciones.
          </p>
        </div>

        {/* Nationality Field */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label htmlFor="nationality" className="min-w-[120px] font-medium text-gray-700 flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              Nacionalidad:
            </Label>
            {/* Make nationality select background a solid color*/}
            <Select name="nationality" defaultValue={data?.Nationality || ""}>
              <SelectTrigger className="bg-blue-50 border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                <SelectValue placeholder="Selecciona un país" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]" >
                {countries.map((country) => (
                  <SelectItem key={country} value={country} className="hover:bg-blue-50">
                    {country}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start gap-2">
            <Checkbox id="receiveInfo" name="receiveInfo" defaultChecked={true} className="mt-1" />
            <div>
              <Label htmlFor="receiveInfo" className="font-medium text-gray-700">
                Recibir información de viajes
              </Label>
              <p className="text-sm text-gray-500">
                Me gustaría recibir información sobre ofertas especiales, nuevos destinos y promociones exclusivas.
              </p>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        <StrapiErrors error={formState?.strapiErrors} />

        {/* Success Message */}
        {formState?.message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2">
            <Check className="h-5 w-5" />
            {formState.message}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <SubmitButton
            text="Guardar cambios"
            loadingText="Guardando..."
            loading={formState?.pending}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6"
          />
        </div>
      </form>
    </div>
  )
}

