'use server';

import { query } from './strapi';

interface Tour {
  documentId: string;
  name: string;
  description: string;
  duration: string;
  image: string;
}

// Actualizamos el tipo de retorno para incluir el nombre del destino
interface DestinationToursResponse {
  tours: Tour[] | null;
  destinationName: string | null;
}

export async function getDestinationTours(destinationId: string): Promise<DestinationToursResponse> {
  try {
    // Primer fetch: Obtener el nombre del destino
    const destinationQuery = `destinos?fields[0]=Name&filters[documentId][$eq]=${destinationId}`;
    const destinationResponse = await query(destinationQuery, {
      cache: 'no-store',
      tags: [`destination-${destinationId}`]
    });

    if (!destinationResponse?.data || destinationResponse.data.length === 0) {
      throw new Error('Destino no encontrado');
    }

    const destinationName = destinationResponse.data[0].Name;

    // Segundo fetch: Obtener los tours del destino
    const toursQuery = `tours?fields[0]=documentId&fields[1]=nombre&fields[2]=descripcion&fields[3]=duracion_min&populate[Image][fields][0]=url&filters[destino][Name][$eq]=${destinationName}`;
    
    const toursResponse = await query(toursQuery, {
      cache: 'no-store',
      tags: [`tours-${destinationName}`]
    });

    if (!toursResponse?.data) {
      throw new Error('Tours no encontrados');
    }

    // Transformar los datos de los tours
    const tours = toursResponse.data.map((tour: any) => ({
      documentId: tour.documentId,
      name: tour.nombre,
      description: tour.descripcion,
      duration: `${Math.round(tour.duracion_min / 60)} horas`,
      image: tour.Image.url,
    }));

    return { 
      tours,
      destinationName
    };

  } catch (error) {
    console.error('Error en getDestinationTours:', error);
    return { 
      tours: null,
      destinationName: null 
    };
  }
}