"use server"

import { query } from "../../../lib/strapi"

interface Reservation {
  id: string
  documentId: string
  date: string
  message: string
  tourId: {
    id: string
    documentId: string
    nombre: string
    descripcion: string
    precio: number
    ubicacion: string
    duracion_min: number
  } | null
  contractGenerated: {
    id: string
    documentId: string
    url: string
    name: string
  } | null
}

export async function getUserReservations(userId: string): Promise<Reservation[]> {
  try {
    const queryString = `reservas?populate[tour_id][fields][0]=id&populate[tour_id][fields][1]=documentId&populate[tour_id][fields][2]=nombre&populate[tour_id][fields][3]=descripcion&populate[tour_id][fields][4]=precio&populate[tour_id][fields][5]=ubicacion&populate[tour_id][fields][6]=duracion_min&populate[contrato_generado][fields][0]=id&populate[contrato_generado][fields][1]=documentId&populate[contrato_generado][fields][2]=url&populate[contrato_generado][fields][3]=name&filters[users_permissions_user][documentId][$eq]=${userId}`

    const response = await query(queryString, {
      cache: "no-store",
      tags: [`user-reservations-${userId}`],
    })

    if (!response?.data || response.data.length === 0) {
      return []
    }

    const reservations = response.data.map((reservation: any) => ({
      id: reservation.id,
      documentId: reservation.documentId,
      date: reservation.Fecha,
      message: reservation.Mensaje,
      tourId: reservation.tour_id
        ? {
            id: reservation.tour_id.id,
            documentId: reservation.tour_id.documentId,
            nombre: reservation.tour_id.nombre,
            descripcion: reservation.tour_id.descripcion,
            precio: reservation.tour_id.precio,
            ubicacion: reservation.tour_id.ubicacion,
            duracion_min: reservation.tour_id.duracion_min,
          }
        : null,
      contractGenerated: reservation.contrato_generado
        ? {
            id: reservation.contrato_generado.id,
            documentId: reservation.contrato_generado.documentId,
            url: reservation.contrato_generado.url,
            name: reservation.contrato_generado.name,
          }
        : null,
    }))

    return reservations
  } catch (error) {
    console.error("Error en getUserReservations:", error)
    throw error
  }
}

export async function getUserReservationById(reservationId: string, userId: string): Promise<Reservation | null> {
  try {
    const queryString = `reservas/${reservationId}?populate[tour_id][fields][0]=id&populate[tour_id][fields][1]=documentId&populate[tour_id][fields][2]=nombre&populate[tour_id][fields][3]=descripcion&populate[tour_id][fields][4]=precio&populate[tour_id][fields][5]=ubicacion&populate[tour_id][fields][6]=duracion_min&populate[contrato_generado][fields][0]=id&populate[contrato_generado][fields][1]=documentId&populate[contrato_generado][fields][2]=url&populate[contrato_generado][fields][3]=name&filters[users_permissions_user][documentId][$eq]=${userId}`

    const response = await query(queryString, {
      cache: "no-store",
      tags: [`user-reservation-${reservationId}`],
    })

    if (!response?.data) {
      return null
    }

    const reservation = response.data

    return {
      id: reservation.id,
      documentId: reservation.documentId,
      date: reservation.Fecha,
      message: reservation.Mensaje,
      tourId: reservation.tour_id
        ? {
            id: reservation.tour_id.id,
            documentId: reservation.tour_id.documentId,
            nombre: reservation.tour_id.nombre,
            descripcion: reservation.tour_id.descripcion,
            precio: reservation.tour_id.precio,
            ubicacion: reservation.tour_id.ubicacion,
            duracion_min: reservation.tour_id.duracion_min,
          }
        : null,
      contractGenerated: reservation.contrato_generado
        ? {
            id: reservation.contrato_generado.id,
            documentId: reservation.contrato_generado.documentId,
            url: reservation.contrato_generado.url,
            name: reservation.contrato_generado.name,
          }
        : null,
    }
  } catch (error) {
    console.error("Error en getUserReservationById:", error)
    return null
  }
}
