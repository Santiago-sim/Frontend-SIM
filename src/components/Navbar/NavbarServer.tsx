import { getUserMeLoader } from "@/app/data/services/get-user-me-loader";
import Navbar from "./NavbarClient";
import { getDestinationsNav } from '@/lib/get-destinations-nav';
import { UserResponse } from '@/types/navbar';

export async function NavbarServer() {
  const user = await getUserMeLoader() as UserResponse;
  const destinations = await getDestinationsNav();

  const navData = {
    logoText: {
      id: 1,
      text: "Sitios de interés en México",
      url: "/"
    },
    ctaButton: {
      id: 1,
      text: "Iniciar Sesión",
      url: "/signin"
    }
  };

  return (
    <Navbar 
      destinations={destinations || []}
      data={navData}
      initialUser={user}
    />
  );
}