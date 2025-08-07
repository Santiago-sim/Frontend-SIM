/**
 * Obtiene el token JWT desde las cookies del cliente
 * @returns Token JWT o cadena vacía si no se encuentra
 */
export function getAuthToken(): string {
    if (typeof document === "undefined") {
      return "" // Estamos en el servidor
    }
  
    try {
      // Buscar en cookies
      const cookies = document.cookie.split(";")
      console.log("Cookies disponibles:", cookies)
  
      const jwtCookie = cookies.find((cookie) => cookie.trim().startsWith("jwt="))
      if (jwtCookie) {
        const token = jwtCookie.split("=")[1].trim()
        console.log("Token encontrado en cookies (primeros 10 caracteres):", token.substring(0, 10) + "...")
        return token
      }
  
      // Alternativa: buscar en localStorage
      const localToken = localStorage.getItem("jwt")
      if (localToken) {
        console.log("Token encontrado en localStorage (primeros 10 caracteres):", localToken.substring(0, 10) + "...")
        return localToken
      }
  
      // Alternativa: buscar en sessionStorage
      const sessionToken = sessionStorage.getItem("jwt")
      if (sessionToken) {
        console.log("Token encontrado en sessionStorage (primeros 10 caracteres):", sessionToken.substring(0, 10) + "...")
        return sessionToken
      }
  
      // Buscar otras posibles cookies de autenticación
      const possibleAuthCookies = ["token", "auth", "authToken", "authorization"]
      for (const cookieName of possibleAuthCookies) {
        const cookie = cookies.find((c) => c.trim().startsWith(`${cookieName}=`))
        if (cookie) {
          const token = cookie.split("=")[1].trim()
          console.log(
            `Token encontrado en cookie ${cookieName} (primeros 10 caracteres):`,
            token.substring(0, 10) + "...",
          )
          return token
        }
      }
  
      console.warn("No se encontró token de autenticación")
      return ""
    } catch (error) {
      console.error("Error al obtener token de autenticación:", error)
      return ""
    }
  }
  
  /**
   * Verifica si el usuario está autenticado
   * @returns true si el usuario está autenticado, false en caso contrario
   */
  export function isAuthenticated(): boolean {
    return !!getAuthToken()
  }
  
  /**
   * Función para depurar problemas de autenticación
   * Muestra información detallada sobre el estado de autenticación
   */
  export function debugAuthentication() {
    console.group("Depuración de autenticación")
  
    try {
      // Verificar token
      const token = getAuthToken()
      console.log("¿Se encontró token?", !!token)
  
      if (token) {
        // Analizar el token JWT (solo para depuración)
        try {
          const tokenParts = token.split(".")
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]))
            console.log("Información del token:", {
              exp: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : "No disponible",
              iat: payload.iat ? new Date(payload.iat * 1000).toLocaleString() : "No disponible",
              id: payload.id || "No disponible",
              expirado: payload.exp ? Date.now() >= payload.exp * 1000 : "No se puede determinar",
            })
          } else {
            console.log("El token no parece ser un JWT válido")
          }
        } catch (e) {
          console.log("No se pudo analizar el token JWT:", e)
        }
      }
  
      // Verificar cookies disponibles
      console.log("Todas las cookies:", document.cookie)
  
      // Verificar localStorage
      console.log("Elementos en localStorage:", Object.keys(localStorage))
  
      // Verificar sessionStorage
      console.log("Elementos en sessionStorage:", Object.keys(sessionStorage))
    } catch (error) {
      console.error("Error durante la depuración:", error)
    }
  
    console.groupEnd()
  }
  