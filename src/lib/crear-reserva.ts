import { getStrapiURL } from "@/lib/utils";

interface BookingData {
  //falta agregar el TourID porque no se envia con la key correcta
  data: {
    users_permissions_user: string;
    tour_id: number;
    Fecha: string;
    Mensaje: string;
  };
}

export async function createBooking(
  token: string,
  userId: string,
  tourId: number,
  fecha: string,
  Mensaje: string
) {
  const url = new URL("/api/reservas", getStrapiURL());

  const bookingData: BookingData = {
    data: {
      users_permissions_user: userId,
      tour_id: tourId,
      Fecha: fecha,
      Mensaje: Mensaje,
    },
  };

  //console.log("Booking Data:", bookingData); // Verifica el contenido de bookingData

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const errorBody = await response.json(); // Leer el cuerpo del error
    console.error("Error de Strapi:", errorBody);
    throw new Error(errorBody.message || "Error creating booking");
  }

  return response.json();
}
