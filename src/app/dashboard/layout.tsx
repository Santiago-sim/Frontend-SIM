import { getUserMeLoader } from "@/app/data/services/get-user-me-loader"
import DashboardClient from "./dashboard-client"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

export default async function DashboardLayout({
  children,
}: {
  readonly children: ReactNode
}) {
  const user = await getUserMeLoader()

  if (!user.ok) redirect("/login")

  return <DashboardClient userData={user.data}>{children}</DashboardClient>
}