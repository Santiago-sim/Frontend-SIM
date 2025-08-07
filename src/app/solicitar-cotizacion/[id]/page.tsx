import { getUserMeLoader } from "@/app/data/services/get-user-me-loader"
import { getTour } from "@/lib/get-tour"
import FormularioReserva from "./cotizacion-form"
import { getAuthToken } from "@/app/data/services/get-token"

type tParams = Promise<{ id: string }>

export default async function SolicitarCotizacion(props: { params: tParams }) {
  const { id } = await props.params
  const user = await getUserMeLoader()
  const tourData = await getTour(id)
  const token = (await getAuthToken()) || ""

  if (!tourData) {
    throw new Error("Tour data not found")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto md:w-3/4 lg:w-2/3">
        <FormularioReserva token={token} user={user} tourData={tourData} tourId={tourData.id} />
      </div>
    </div>
  )
}
