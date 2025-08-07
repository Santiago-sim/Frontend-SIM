import { query } from "./strapi";

interface DestinationData {
    documentId: string;
    Name: string;
}

export async function getDestinationsNav() {
    try {
        const response = await query('destinos?fields[0]=documentId&fields[1]=Name', {
            cache: 'no-store',
            tags: ['destinations-nav']
        }) as { data: DestinationData[] };

        if (!response?.data) {
            throw new Error('Datos no encontrados');
        }

        return response.data.map(destination => ({
            id: destination.documentId,
            name: destination.Name
        }));

    } catch (error) {
        console.error('Error en getDestinationsNav:', error);
        return [];
    }
}