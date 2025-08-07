import { getStrapiURL } from "@/lib/utils";
import { getAuthToken } from "../services/get-token";

// Interfaces para tipar las respuestas
interface FileMedia {
  id: number;
  url: string;
  name?: string;
  documentId?: string; // Added documentId to the FileMedia interface
}
interface User {
  id: number;
  username: string;
  email: string;
  documentId?: string; // Added documentId to the User interface
}


interface UserFile {
  User?: User | null;
  Visa?: FileMedia | null;
  Pasaporte?: FileMedia | null;
}

interface UserFileResponse {
  ok: boolean;
  data: any;
  error: any;
}

/**
 * Obtiene los datos del usuario actual con su ID de documento
 * @returns Objeto con datos del usuario y su ID de documento
 */
export async function getUserMe(): Promise<UserFileResponse> {
  const baseUrl = getStrapiURL();

  const url = new URL(
    "/api/users/me?fields[0]=username&fields[1]=email&fields[2]=documentId",
    baseUrl
  );

  const authToken = await getAuthToken();
  //console.log("Token de autenticación:", authToken);
  if (!authToken)
    return {
      ok: false,
      data: null,
      error: "No se encontró token de autenticación",
    };

  try {
    const response = await fetch(url.href, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        ok: false,
        data: null,
        error: errorData.error || "Error al obtener datos del usuario",
      };
    }

    const data = await response.json();
    return { ok: true, data: data, error: null };
  } catch (error) {
    console.error("Error obteniendo datos del usuario en  get user:", error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtiene los detalles del archivo de usuario por ID
 * @param id ID del documento de usuario
 * @returns Objeto con datos del archivo de usuario
 */
export async function getUserMeWithFiles(): Promise<UserFileResponse> {
  const baseUrl = getStrapiURL();

  // Modificamos la URL para obtener todos los datos necesarios, incluyendo URLs de archivos
  const url = new URL(
    '/api/users/me?fields[0]=username&fields[1]=email&fields[2]=documentId&populate[Visa][fields][0]=url&populate[Visa][fields][1]=name&populate[Pasaporte][fields][0]=url&populate[Pasaporte][fields][1]=name',
    baseUrl
  );

  const authToken = await getAuthToken();
  if (!authToken)
    return {
      ok: false,
      data: null,
      error: "No se encontró token de autenticación",
    };

  try {
    const response = await fetch(url.href, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        ok: false,
        data: null,
        error: errorData.error || "Error al obtener archivo de usuario",
      };
    }

    const responseData = await response.json();

    // Inicializamos vacío
    const transformedData: UserFile = {
      User: {
        id: responseData.id,
        username: responseData.username,
        email: responseData.email,
        documentId: responseData.documentId,
      },
      Visa: null,
      Pasaporte: null,
    };

    // Si existe directamente Visa, lo mapeamos
    if (responseData.Visa) {
      transformedData.Visa = {
        id: responseData.Visa.id,
        documentId: responseData.documentId,
        url: responseData.Visa.url,
        name: responseData.Visa.name,
      };
    }

    // Lo mismo para Pasaporte
    if (responseData.Pasaporte) {
      transformedData.Pasaporte = {
        id: responseData.Pasaporte.id,
        documentId: responseData.documentId,
        url: responseData.Pasaporte.url,
        name: responseData.Pasaporte.name,
      };
    }
    return { ok: true, data: transformedData, error: null };
  } catch (error) {
    console.error("Error obteniendo archivo de usuario:", error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Verifica si un usuario tiene documentos subidos
 * @param userId ID del usuario
 * @returns Objeto indicando si tiene documentos y cuáles
 */
export async function checkUserDocuments(userId: string): Promise<{
  hasDocuments: boolean;
  hasVisa: boolean;
  hasPassport: boolean;
  documentId: string | null;
}> {
  try {
    // Obtener datos del usuario
    const userData = await getUserMe();

    if (!userData.ok || !userData.data) {
      return {
        hasDocuments: false,
        hasVisa: false,
        hasPassport: false,
        documentId: null,
      };
    }

    const documentId = userData.data.File_id?.documentId || null;

    // Si no hay ID de documento, no tiene documentos
    if (!documentId) {
      return {
        hasDocuments: false,
        hasVisa: false,
        hasPassport: false,
        documentId: null,
      };
    }

    // Obtener detalles de los documentos
    const fileData = await getUserMeWithFiles();

    if (!fileData.ok || !fileData.data) {
      return {
        hasDocuments: false,
        hasVisa: false,
        hasPassport: false,
        documentId,
      };
    }

    const hasVisa = !!fileData.data.Visa;
    const hasPassport = !!fileData.data.Pasaporte;

    return {
      hasDocuments: hasVisa || hasPassport,
      hasVisa,
      hasPassport,
      documentId,
    };
  } catch (error) {
    console.error("Error verificando documentos del usuario:", error);
    return {
      hasDocuments: false,
      hasVisa: false,
      hasPassport: false,
      documentId: null,
    };
  }
}
