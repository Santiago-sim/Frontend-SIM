"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserCircle2,
  FileText,
  User,
  Settings,
  Menu,
  ChevronRight,
  MapPin,
  Clock,
  Compass,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navigationItems = [
  { title: "Información de mi cuenta", icon: User, href: "/dashboard/account" },
  { title: "Mis reservas", icon: FileText, href: "/dashboard/reservations" },
  { title: "Mis documentos", icon: FileCheck2, href: "/dashboard/documents" },
  { title: "Contraseña", icon: Settings, href: "/dashboard/password" },
];


function NavigationLinks({ pathname }: { pathname: string }) {
  return (
    <>
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center px-6 py-4 hover:bg-blue-50 transition-colors ${
            pathname === item.href
              ? "border-l-4 border-[rgb(2,136,209)] bg-blue-50"
              : "bg-white"
          }`}
        >
          <item.icon
            className={`h-5 w-5 ${
              pathname === item.href
                ? "text-[rgb(2, 136, 209)]"
                : "text-gray-600"
            }`}
          />
          <span
            className={`ml-3 ${
              pathname === item.href
                ? "text-[rgb(2, 136, 209)]"
                : "text-gray-800"
            }`}
          >
            {item.title}
          </span>
        </Link>
      ))}
    </>
  );
}

function NavigationBreadcrumb({ pathname }: { pathname: string }) {
  const currentPage =
    navigationItems.find((item) => item.href === pathname)?.title ||
    "Dashboard";

  return (
    <nav className="flex items-center text-xs px-4 py-2">
      <Link
        href="/dashboard/account"
        className="text-blue-500 hover:text-blue-600 transition-colors"
      >
        Inicio
      </Link>
      <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
      <span className="text-gray-600 whitespace-nowrap">{currentPage}</span>
    </nav>
  );
}

function MobileUserInfo({ userData }: { userData: any }) {
  const userImage = userData?.image;

  return (
    <div className="p-4 border-b">
      <div className="flex flex-col items-center text-center">
        <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-3">
          {userImage ? (
            <img
              src={userImage}
              alt={userData?.firstName || "Usuario"}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <UserCircle2 className="h-14 w-14 text-blue-500" />
          )}
        </div>
        <h3 className="font-bold text-lg">
          {userData?.firstName || ""} {userData?.lastName || ""}
        </h3>
        <p className="text-gray-600 text-sm mb-3">{userData?.email || ""}</p>
      </div>
    </div>
  );
}

export default function DashboardClient({
  children,
  userData,
}: {
  readonly children: React.ReactNode;
  readonly userData: any;
}) {
  const pathname = usePathname();
  const userImage = userData?.image;

  const getActiveTab = () => {
    if (pathname?.includes("/dashboard/account")) return "personal";
    if (pathname?.includes("/dashboard/preferences")) return "preferences";
    return "personal";
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[64px] md:pt-[50px]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-[50px] left-0 right-0 h-16 bg-white border-b z-40 flex items-center px-4 shadow-sm">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6 text-gray-800" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 bg-white">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <nav className="flex flex-col h-full">
              <MobileUserInfo userData={userData} />
              <NavigationLinks pathname={pathname} />
            </nav>
          </SheetContent>
        </Sheet>
        <div className="ml-4">
          <NavigationBreadcrumb pathname={pathname} />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Right Sidebar (Desktop) */}
          <aside className="hidden lg:block w-[280px] bg-white shadow-sm rounded-lg order-1 lg:order-1 sticky top-[70px] self-start">
            <NavigationBreadcrumb pathname={pathname} />
            <div className="p-6 border-b">
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt={userData?.firstName || "Usuario"}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle2 className="h-16 w-16 text-blue-500" />
                  )}
                </div>
                <h3 className="font-bold text-xl">
                  {userData?.firstName || ""} {userData?.lastName || ""}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {userData?.email || ""}
                </p>

                <div className="w-full space-y-3 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-700">
                      {userData?.Nationality || "Nacionalidad no especificada"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-700">Miembro desde 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Compass className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-700">0 tours completados</span>
                  </div>
                </div>
              </div>
            </div>
            <NavigationLinks pathname={pathname} />
          </aside>
          <main className="flex-1 order-2 lg:order-1 mt-4 lg:mt-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
