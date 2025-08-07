import { getUserMeLoader } from "@/app/data/services/get-user-me-loader"
import { getAuthToken } from "@/app/data/services/get-token"
import FormularioCrearTour from "./crear-tour-form"

export default async function CrearTourPage() {
  const user = await getUserMeLoader()
  const token = (await getAuthToken()) || ""

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto md:w-3/4 lg:w-2/3">
        <FormularioCrearTour token={token} user={user} />
      </div>
    </div>
  )
}
