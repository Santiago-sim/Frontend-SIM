import { getUserMeLoader } from "@/app/data/services/get-user-me-loader"
import { DashboardForm } from "@/components/forms/profile-form"
import { UserCircle2, MapPin, Compass, Clock } from "lucide-react"

export default async function AccountRoute() {
  const user = await getUserMeLoader()
  const userData = user.data
  const userImage = userData?.image

  return (
    <div className="grid gap-6">

      {/* Main Form */}
      <div>
        <DashboardForm data={userData} />
      </div>
    </div>
  )
}

