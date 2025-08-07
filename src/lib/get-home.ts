// lib/get-home.ts
import { query } from "./strapi";

export async function getHome() {
  try {
    const response = await query("home", {
      cache: 'no-store',
      tags: ['home']
    });

    //console.log('Respuesta de Strapi:', response);

    if (!response?.data) {
      throw new Error('Datos no encontrados');
    }

    return {
      ...response.data,
      id: response.data.id || 0
    };
  } catch (error) {
    console.error('Error en getHome:', error);
    return {
      title: 'Sitios de Interés México',
      id: 0
    };
  }
}