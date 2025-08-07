// lib/get-tour.ts
'use server';

import { query } from './strapi';

export async function getTour(documentId: string) {
  try {
    const queryString = `tours?filters[documentId][$eq]=${documentId}&populate[Image][fields][0]=url`;
    
    const response = await query(queryString, {
      cache: 'no-store',
      tags: [`tour-${documentId}`]
    });

    if (!response?.data || response.data.length === 0) {
      throw new Error('Tour no encontrado');
    }
    
    const tour = response.data[0];
    
    return {
      id: tour.id,
      documentId: tour.documentId,
      name: tour.nombre,
      description: tour.descripcion,
      longDescription: tour.descripcion_larga,
      price: tour.precio,
      priceChildren: tour.precio_ninos,
      duration: `${Math.round(tour.duracion_min / 60)} horas`,
      includes: tour.incluye,
      notIncludes: tour.no_incluye,
      recommendations: tour.recomendaciones,
      image: tour.Image.url,
      ubicacion: tour.ubicacion
    };
  } catch (error) {
    console.error('Error en getTour:', error);
    return null;
  }
}