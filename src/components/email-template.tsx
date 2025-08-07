import type * as React from "react";

interface FormData {
  nombreCompleto: string;
  email: string;
  telefono: string;
  fechaViaje?: string;
  fechaSalida?: string;
  mensaje?: string;
  tipoGrupo: string;
  vueloReservado?: string | boolean;
  adultos: string | number;
  ninos: string | number;
  bebes?: string | number;
  estanciaViaje?: string;
  ciudadInicio?: string;
  tipoHotel?: string;
  tipoTransporte?: string;
  descripcionViaje?: string;
  nacionalidad?: string;
}

interface TourData {
  name: string;
  ubicacion: string;
}

interface EmailTemplateProps {
  formData: FormData;
  tourData: TourData | null;
  isAdminView?: boolean;
  isTourPersonalizado?: boolean;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  formData,
  tourData,
  isAdminView = false,
  isTourPersonalizado = false,
}) => {
  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Obtener la fecha correcta
  const getFecha = () => {
    if (isTourPersonalizado) {
      return formData.fechaSalida
        ? formatDate(formData.fechaSalida)
        : "No especificada";
    } else {
      return formData.fechaViaje
        ? formatDate(formData.fechaViaje)
        : "No especificada";
    }
  };

  // Calcular total de viajeros
  const totalViajeros =
    Number.parseInt(formData.adultos?.toString() || "0") +
    Number.parseInt(formData.ninos?.toString() || "0") +
    Number.parseInt(formData.bebes?.toString() || "0");

  // Obtener el título
  const getTitulo = () => {
    if (isTourPersonalizado) {
      return "Tour Personalizado";
    } else if (tourData) {
      return tourData.name;
    } else {
      return "Solicitud de Tour";
    }
  };

  // Obtener ubicación
  const getUbicacion = () => {
    if (isTourPersonalizado) {
      return formData.ciudadInicio || "No especificada";
    } else if (tourData) {
      return tourData.ubicacion;
    } else {
      return "No especificada";
    }
  };

  // CLIENTE EMAIL VIEW
  if (!isAdminView) {
    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        width="100%"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
          borderCollapse: "collapse",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Encabezado */}
        <tr>
          <td
            align="center"
            style={{
              padding: "25px 20px",
              borderBottom: "3px solid #4CAF50",
              backgroundColor: "#f8f8f8",
            }}
          >
            <img
              src="https://res.cloudinary.com/dlnbptbof/image/upload/v1740590379/logo_fc186a5949.png"
              alt="Sitios de interés México"
              width="120"
              style={{ marginBottom: "15px" }}
            />
            <h1
              style={{
                fontSize: "24px",
                color: "#2E7D32",
                margin: "0",
                fontWeight: "600",
              }}
            >
              {isTourPersonalizado
                ? "Confirmación de Tour Personalizado"
                : `Confirmación de Reserva: ${tourData?.name}`}
            </h1>
          </td>
        </tr>

        {/* Mensaje de bienvenida */}
        <tr>
          <td style={{ padding: "25px 20px", lineHeight: "1.5" }}>
            <p
              style={{
                fontSize: "16px",
                color: "#333333",
                margin: "0 0 15px 0",
              }}
            >
              Hola{" "}
              <span style={{ fontWeight: "bold" }}>
                {formData.nombreCompleto}
              </span>
              ,
            </p>
            <p style={{ fontSize: "16px", color: "#333333", margin: "0" }}>
              {isTourPersonalizado
                ? "Hemos recibido tu solicitud para un tour personalizado. Nuestro equipo revisará los detalles y se pondrá en contacto contigo en las próximas 24-48 horas."
                : `Hemos recibido tu solicitud de reserva para ${tourData?.name}. Nuestro equipo revisará los detalles y se pondrá en contacto contigo en las próximas 24 horas.`}
            </p>
          </td>
        </tr>

        {/* Resumen de solicitud */}
        <tr>
          <td style={{ padding: "0 20px 20px" }}>
            <table
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              {/* Encabezado del resumen */}
              <tr>
                <td
                  style={{
                    padding: "15px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                  }}
                >
                  <h2
                    style={{ fontSize: "18px", margin: "0", fontWeight: "600" }}
                  >
                    Resumen de tu solicitud
                  </h2>
                </td>
              </tr>

              {/* Contenido del resumen */}
              <tr>
                <td style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
                  {/* Título del tour */}
                  <h3
                    style={{
                      fontSize: "17px",
                      color: "#2E7D32",
                      margin: "0 0 15px 0",
                      fontWeight: "600",
                      borderBottom: "1px solid #e0e0e0",
                      paddingBottom: "8px",
                    }}
                  >
                    {getTitulo()}
                  </h3>

                  {/* Detalles del tour */}
                  <table
                    cellPadding="8"
                    cellSpacing="0"
                    border={0}
                    width="100%"
                    style={{ marginBottom: "20px" }}
                  >
                    <tr>
                      <td
                        width="40%"
                        style={{
                          color: "#666666",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        {isTourPersonalizado ? "Tipo:" : "Tour:"}
                      </td>
                      <td style={{ color: "#333333", fontSize: "14px" }}>
                        {isTourPersonalizado
                          ? "Tour Personalizado"
                          : tourData?.name}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          color: "#666666",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        {isTourPersonalizado
                          ? "Ciudad de inicio:"
                          : "Ubicación:"}
                      </td>
                      <td style={{ color: "#333333", fontSize: "14px" }}>
                        {getUbicacion()}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          color: "#666666",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        {isTourPersonalizado
                          ? "Fecha de salida:"
                          : "Fecha de viaje:"}
                      </td>
                      <td style={{ color: "#333333", fontSize: "14px" }}>
                        {getFecha()}
                      </td>
                    </tr>
                    {isTourPersonalizado && formData.estanciaViaje && (
                      <tr>
                        <td
                          style={{
                            color: "#666666",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          Duración:
                        </td>
                        <td style={{ color: "#333333", fontSize: "14px" }}>
                          {formData.estanciaViaje} días
                        </td>
                      </tr>
                    )}
                  </table>

                  {/* Detalles del viajero */}
                  <h3
                    style={{
                      fontSize: "17px",
                      color: "#2E7D32",
                      margin: "0 0 15px 0",
                      fontWeight: "600",
                      borderBottom: "1px solid #e0e0e0",
                      paddingBottom: "8px",
                    }}
                  >
                    Detalles del viajero
                  </h3>

                  <table
                    cellPadding="8"
                    cellSpacing="0"
                    border={0}
                    width="100%"
                    style={{ marginBottom: isTourPersonalizado ? "20px" : "0" }}
                  >
                    <tr>
                      <td
                        width="40%"
                        style={{
                          color: "#666666",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Tipo de grupo:
                      </td>
                      <td
                        style={{
                          color: "#333333",
                          fontSize: "14px",
                          textTransform: "capitalize",
                        }}
                      >
                        {formData.tipoGrupo}
                      </td>
                    </tr>
                    {(formData.tipoGrupo === "familia" ||
                      formData.tipoGrupo === "grupo") && (
                      <>
                        <tr>
                          <td
                            style={{
                              color: "#666666",
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                          >
                            Adultos:
                          </td>
                          <td style={{ color: "#333333", fontSize: "14px" }}>
                            {formData.adultos}
                          </td>
                        </tr>
                        {Number.parseInt(formData.ninos.toString()) > 0 && (
                          <tr>
                            <td
                              style={{
                                color: "#666666",
                                fontSize: "14px",
                                fontWeight: "500",
                              }}
                            >
                              Niños:
                            </td>
                            <td style={{ color: "#333333", fontSize: "14px" }}>
                              {formData.ninos}
                            </td>
                          </tr>
                        )}
                        {isTourPersonalizado &&
                          formData.bebes !== undefined &&
                          Number.parseInt(formData.bebes.toString()) > 0 && (
                            <tr>
                              <td
                                style={{
                                  color: "#666666",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                }}
                              >
                                Bebés:
                              </td>
                              <td
                                style={{ color: "#333333", fontSize: "14px" }}
                              >
                                {formData.bebes}
                              </td>
                            </tr>
                          )}
                      </>
                    )}
                  </table>

                  {/* Preferencias - Solo para tour personalizado */}
                  {isTourPersonalizado && (
                    <>
                      <h3
                        style={{
                          fontSize: "17px",
                          color: "#2E7D32",
                          margin: "0 0 15px 0",
                          fontWeight: "600",
                          borderBottom: "1px solid #e0e0e0",
                          paddingBottom: "8px",
                        }}
                      >
                        Preferencias
                      </h3>

                      <table
                        cellPadding="8"
                        cellSpacing="0"
                        border={0}
                        width="100%"
                        style={{
                          marginBottom:
                            formData.mensaje || formData.descripcionViaje
                              ? "20px"
                              : "0",
                        }}
                      >
                        {formData.tipoHotel && (
                          <tr>
                            <td
                              width="40%"
                              style={{
                                color: "#666666",
                                fontSize: "14px",
                                fontWeight: "500",
                              }}
                            >
                              Hotel:
                            </td>
                            <td style={{ color: "#333333", fontSize: "14px" }}>
                              {formData.tipoHotel === "5estrellas"
                                ? "5 Estrellas"
                                : formData.tipoHotel === "4estrellas"
                                  ? "4 Estrellas"
                                  : formData.tipoHotel === "3estrellas"
                                    ? "3 Estrellas"
                                    : "Reservado por cuenta propia"}
                            </td>
                          </tr>
                        )}
                        {formData.tipoTransporte && (
                          <tr>
                            <td
                              style={{
                                color: "#666666",
                                fontSize: "14px",
                                fontWeight: "500",
                              }}
                            >
                              Transporte:
                            </td>
                            <td style={{ color: "#333333", fontSize: "14px" }}>
                              {formData.tipoTransporte === "vuelo"
                                ? "Vuelo"
                                : formData.tipoTransporte === "vueloTren"
                                  ? "Vuelo + Tren"
                                  : "Reservado por cuenta propia"}
                            </td>
                          </tr>
                        )}
                        {(typeof formData.vueloReservado === "string" ||
                          typeof formData.vueloReservado === "boolean") && (
                          <tr>
                            <td
                              style={{
                                color: "#666666",
                                fontSize: "14px",
                                fontWeight: "500",
                              }}
                            >
                              Vuelo internacional:
                            </td>
                            <td style={{ color: "#333333", fontSize: "14px" }}>
                              {formData.vueloReservado === "si" ||
                              formData.vueloReservado === true
                                ? "Ya reservado"
                                : "No reservado"}
                            </td>
                          </tr>
                        )}
                      </table>
                    </>
                  )}

                  {/* Mensaje o descripción del viaje */}
                  {(formData.mensaje || formData.descripcionViaje) && (
                    <>
                      <h3
                        style={{
                          fontSize: "17px",
                          color: "#2E7D32",
                          margin: "0 0 15px 0",
                          fontWeight: "600",
                          borderBottom: "1px solid #e0e0e0",
                          paddingBottom: "8px",
                        }}
                      >
                        {isTourPersonalizado
                          ? "Descripción del viaje"
                          : "Mensaje adicional"}
                      </h3>
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          padding: "12px",
                          border: "1px solid #e0e0e0",
                          fontSize: "14px",
                          color: "#333333",
                          borderRadius: "4px",
                          lineHeight: "1.5",
                        }}
                      >
                        {isTourPersonalizado
                          ? formData.descripcionViaje
                          : formData.mensaje}
                      </div>
                    </>
                  )}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        {/* Próximos pasos */}
        <tr>
          <td style={{ padding: "0 20px 30px" }}>
            <table
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <tr>
                <td
                  style={{
                    padding: "15px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                  }}
                >
                  <h2
                    style={{ fontSize: "18px", margin: "0", fontWeight: "600" }}
                  >
                    Próximos pasos
                  </h2>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
                  <p
                    style={{
                      fontSize: "15px",
                      color: "#333333",
                      margin: "0 0 15px 0",
                      lineHeight: "1.5",
                    }}
                  >
                    {isTourPersonalizado
                      ? "Nuestro equipo diseñará un itinerario personalizado basado en tus preferencias y se pondrá en contacto contigo en las próximas 24-48 horas."
                      : "Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo en las próximas 24 horas para confirmar los detalles de tu reserva."}
                  </p>
                  <div
                    style={{
                      backgroundColor: "#e8f5e9",
                      padding: "15px",
                      border: "1px solid #c8e6c9",
                      fontSize: "15px",
                      color: "#2E7D32",
                      borderRadius: "4px",
                      lineHeight: "1.5",
                    }}
                  >
                    Si tienes alguna pregunta mientras tanto, puedes responder
                    directamente a este correo o llamarnos al{" "}
                    <a
                      href="tel:+525568888686"
                      style={{
                        color: "#2E7D32",
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                    >
                      +52 55 6888 8686
                    </a>
                    .
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        {/* Pie de página */}
        <tr>
          <td
            align="center"
            style={{
              padding: "20px",
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#f8f8f8",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#666666",
                margin: "0 0 10px 0",
              }}
            >
              © {new Date().getFullYear()} Sitios de Interés México. Todos los
              derechos reservados.
            </p>
            <p style={{ margin: "0" }}>
              <a
                href="https://sitiosdeinteresmexico.com"
                style={{
                  color: "#4CAF50",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                sitiosdeinteresmexico.com
              </a>
              <span style={{ color: "#cccccc", padding: "0 8px" }}>|</span>
              <a
                href="mailto:contacto@sitiosdeinteresmexico.com"
                style={{
                  color: "#4CAF50",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                contacto@sitiosdeinteresmexico.com
              </a>
            </p>
          </td>
        </tr>
      </table>
    );
  }

  // ADMIN EMAIL VIEW
  return (
    <table
      cellPadding="0"
      cellSpacing="0"
      border={0}
      width="100%"
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        borderCollapse: "collapse",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Encabezado administrativo */}
      <tr>
        <td
          style={{
            padding: "15px 20px",
            borderBottom: "2px solid #2196F3",
            backgroundColor: "#f5f5f5",
          }}
        >
          <table cellPadding="0" cellSpacing="0" border={0} width="100%">
            <tr>
              <td>
                <table cellPadding="0" cellSpacing="0" border={0}>
                  <tr>
                    <td style={{ verticalAlign: "middle" }}>
                      <img
                        src="https://res.cloudinary.com/dlnbptbof/image/upload/v1740590379/logo_fc186a5949.png"
                        alt="Sitios de interés México"
                        width="130"
                      />
                    </td>
                    <td
                      style={{ verticalAlign: "middle", paddingLeft: "15px" }}
                    >
                      <span
                        style={{
                          fontSize: "16px",
                          color: "#333333",
                          fontWeight: "bold",
                        }}
                      >
                        Panel de Administración
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
              <td align="right">
                <span
                  style={{
                    backgroundColor: "#e3f2fd",
                    color: "#1565C0",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    display: "inline-block",
                  }}
                >
                  Nueva Solicitud
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Información principal */}
      <tr>
        <td style={{ padding: "20px" }}>
          <h1
            style={{
              fontSize: "22px",
              color: "#1565C0",
              margin: "0 0 8px 0",
              fontWeight: "600",
            }}
          >
            {isTourPersonalizado
              ? "Nueva Solicitud de Tour Personalizado"
              : `Nueva Solicitud de Reserva: ${tourData?.name}`}
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#666666",
              margin: "0",
              backgroundColor: "#f5f5f5",
              padding: "6px 10px",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            Recibida: {new Date().toLocaleDateString()}{" "}
            {new Date().toLocaleTimeString()} • ID: SIM-
            {Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0")}
          </p>
        </td>
      </tr>

      {/* Acciones rápidas */}
      <tr>
        <td style={{ padding: "0 20px 20px" }}>
          <a
            href={`mailto:${formData.email}`}
            style={{
              display: "inline-block",
              backgroundColor: "#1976D2",
              color: "white",
              padding: "10px 16px",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
              marginRight: "12px",
            }}
          >
            Responder por Email
          </a>
          {formData.telefono && (
            <a
              href={`tel:${formData.telefono}`}
              style={{
                display: "inline-block",
                backgroundColor: "#00897B",
                color: "white",
                padding: "10px 16px",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Llamar al Cliente
            </a>
          )}
        </td>
      </tr>

      {/* Información del cliente */}
      <tr>
        <td style={{ padding: "0 20px 15px" }}>
          <table
            cellPadding="0"
            cellSpacing="0"
            border={0}
            width="100%"
            style={{
              borderRadius: "6px",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <tr>
              <td
                style={{
                  padding: "12px 15px",
                  backgroundColor: "#1976D2",
                  color: "white",
                }}
              >
                <h2
                  style={{ fontSize: "16px", margin: "0", fontWeight: "600" }}
                >
                  Información del Cliente
                </h2>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "15px", backgroundColor: "#f9f9f9" }}>
                <table cellPadding="6" cellSpacing="0" border={0} width="100%">
                  <tr>
                    <td
                      width="40%"
                      style={{
                        color: "#666666",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      Nombre:
                    </td>
                    <td
                      style={{
                        color: "#333333",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {formData.nombreCompleto}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        color: "#666666",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      Email:
                    </td>
                    <td style={{ color: "#333333", fontSize: "14px" }}>
                      <a
                        href={`mailto:${formData.email}`}
                        style={{
                          color: "#1976D2",
                          textDecoration: "none",
                          fontWeight: "500",
                        }}
                      >
                        {formData.email}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        color: "#666666",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      Teléfono:
                    </td>
                    <td style={{ color: "#333333", fontSize: "14px" }}>
                      <a
                        href={`tel:${formData.telefono}`}
                        style={{
                          color: "#1976D2",
                          textDecoration: "none",
                          fontWeight: "500",
                        }}
                      >
                        {formData.telefono}
                      </a>
                    </td>
                  </tr>
                  {formData.nacionalidad && (
                    <tr>
                      <td
                        style={{
                          color: "#666666",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Nacionalidad:
                      </td>
                      <td style={{ color: "#333333", fontSize: "14px" }}>
                        {formData.nacionalidad}
                      </td>
                    </tr>
                  )}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Detalles del tour */}
      <tr>
        <td style={{ padding: "0 20px 15px" }}>
          <table
            cellPadding="0"
            cellSpacing="0"
            border={0}
            width="100%"
            style={{
              borderRadius: "6px",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <tr>
              <td
                style={{
                  padding: "12px 15px",
                  backgroundColor: "#1976D2",
                  color: "white",
                }}
              >
                <h2
                  style={{ fontSize: "16px", margin: "0", fontWeight: "600" }}
                >
                  {isTourPersonalizado
                    ? "Detalles del Tour Personalizado"
                    : "Detalles del Tour"}
                </h2>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "15px", backgroundColor: "#f9f9f9" }}>
                <table cellPadding="6" cellSpacing="0" border={0} width="100%">
                  <tr>
                    <td
                      width="40%"
                      style={{
                        color: "#666666",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {isTourPersonalizado ? "Tipo:" : "Tour:"}
                    </td>
                    <td style={{ color: "#333333", fontSize: "14px" }}>
                      {isTourPersonalizado
                        ? "Tour Personalizado"
                        : tourData?.name}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        color: "#666666",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {isTourPersonalizado ? "Ciudad de inicio:" : "Ubicación:"}
                    </td>
                    <td style={{ color: "#333333", fontSize: "14px" }}>
                      {getUbicacion()}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        color: "#666666",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {isTourPersonalizado
                        ? "Fecha de salida:"
                        : "Fecha de viaje:"}
                    </td>
                    <td style={{ color: "#333333", fontSize: "14px" }}>
                      {getFecha()}
                    </td>
                  </tr>
                  {isTourPersonalizado && formData.estanciaViaje && (
                    <tr>
                      <td
                        style={{
                          color: "#666666",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Duración:
                      </td>
                      <td style={{ color: "#333333", fontSize: "14px" }}>
                        {formData.estanciaViaje} días
                      </td>
                    </tr>
                  )}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Detalles del viaje */}
      <tr>
        <td style={{ padding: "0 20px 15px" }}>
          <table
            cellPadding="0"
            cellSpacing="0"
            border={0}
            width="100%"
            style={{
              borderRadius: "6px",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <tr>
              <td
                style={{
                  padding: "12px 15px",
                  backgroundColor: "#1976D2",
                  color: "white",
                }}
              >
                <h2
                  style={{ fontSize: "16px", margin: "0", fontWeight: "600" }}
                >
                  Detalles del Viaje
                </h2>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "15px", backgroundColor: "#f9f9f9" }}>
                <table cellPadding="6" cellSpacing="0" border={0} width="100%">
                  <tr>
                    <td
                      width="40%"
                      style={{
                        color: "#666666",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      Tipo de grupo:
                    </td>
                    <td
                      style={{
                        color: "#333333",
                        fontSize: "14px",
                        textTransform: "capitalize",
                      }}
                    >
                      {formData.tipoGrupo}
                    </td>
                  </tr>
                  {(formData.tipoGrupo === "familia" ||
                    formData.tipoGrupo === "grupo") && (
                    <>
                      <tr>
                        <td
                          style={{
                            color: "#666666",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          Adultos:
                        </td>
                        <td style={{ color: "#333333", fontSize: "14px" }}>
                          {formData.adultos}
                        </td>
                      </tr>
                      {Number.parseInt(formData.ninos.toString()) > 0 && (
                        <tr>
                          <td
                            style={{
                              color: "#666666",
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                          >
                            Niños:
                          </td>
                          <td style={{ color: "#333333", fontSize: "14px" }}>
                            {formData.ninos}
                          </td>
                        </tr>
                      )}
                      {isTourPersonalizado &&
                        formData.bebes !== undefined &&
                        Number.parseInt(formData.bebes.toString()) > 0 && (
                          <tr>
                            <td
                              style={{
                                color: "#666666",
                                fontSize: "14px",
                                fontWeight: "500",
                              }}
                            >
                              Bebés:
                            </td>
                            <td style={{ color: "#333333", fontSize: "14px" }}>
                              {formData.bebes}
                            </td>
                          </tr>
                        )}
                      <tr>
                        <td
                          style={{
                            color: "#666666",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          Total viajeros:
                        </td>
                        <td
                          style={{
                            color: "#333333",
                            fontSize: "14px",
                            fontWeight: "bold",
                            backgroundColor: "#e3f2fd",
                            padding: "6px 10px",
                            borderRadius: "4px",
                            display: "inline-block",
                          }}
                        >
                          {totalViajeros}
                        </td>
                      </tr>
                    </>
                  )}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Preferencias - Solo para tour personalizado */}
      {isTourPersonalizado && (
        <tr>
          <td style={{ padding: "0 20px 15px" }}>
            <table
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              style={{
                borderRadius: "6px",
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              <tr>
                <td
                  style={{
                    padding: "12px 15px",
                    backgroundColor: "#1976D2",
                    color: "white",
                  }}
                >
                  <h2
                    style={{ fontSize: "16px", margin: "0", fontWeight: "600" }}
                  >
                    Preferencias
                  </h2>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "15px", backgroundColor: "#f9f9f9" }}>
                  <table
                    cellPadding="6"
                    cellSpacing="0"
                    border={0}
                    width="100%"
                  >
                    {formData.tipoHotel && (
                      <tr>
                        <td
                          width="40%"
                          style={{
                            color: "#666666",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          Hotel:
                        </td>
                        <td style={{ color: "#333333", fontSize: "14px" }}>
                          {formData.tipoHotel === "5estrellas"
                            ? "5 Estrellas"
                            : formData.tipoHotel === "4estrellas"
                              ? "4 Estrellas"
                              : formData.tipoHotel === "3estrellas"
                                ? "3 Estrellas"
                                : "Reservado por cuenta propia"}
                        </td>
                      </tr>
                    )}
                    {formData.tipoTransporte && (
                      <tr>
                        <td
                          style={{
                            color: "#666666",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          Transporte:
                        </td>
                        <td style={{ color: "#333333", fontSize: "14px" }}>
                          {formData.tipoTransporte === "vuelo"
                            ? "Vuelo"
                            : formData.tipoTransporte === "vueloTren"
                              ? "Vuelo + Tren"
                              : "Reservado por cuenta propia"}
                        </td>
                      </tr>
                    )}
                    {(typeof formData.vueloReservado === "string" ||
                      typeof formData.vueloReservado === "boolean") && (
                      <tr>
                        <td
                          style={{
                            color: "#666666",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          Vuelo internacional:
                        </td>
                        <td style={{ color: "#333333", fontSize: "14px" }}>
                          {formData.vueloReservado === "si" ||
                          formData.vueloReservado === true
                            ? "Ya reservado"
                            : "No reservado"}
                        </td>
                      </tr>
                    )}
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      )}

      {/* Mensaje o descripción del viaje */}
      {(formData.mensaje || formData.descripcionViaje) && (
        <tr>
          <td style={{ padding: "0 20px 15px" }}>
            <table
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              style={{
                borderRadius: "6px",
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              <tr>
                <td
                  style={{
                    padding: "12px 15px",
                    backgroundColor: "#1976D2",
                    color: "white",
                  }}
                >
                  <h2
                    style={{ fontSize: "16px", margin: "0", fontWeight: "600" }}
                  >
                    {isTourPersonalizado
                      ? "Descripción del viaje"
                      : "Mensaje adicional"}
                  </h2>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "15px", backgroundColor: "#f9f9f9" }}>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      padding: "12px",
                      border: "1px solid #e0e0e0",
                      fontSize: "14px",
                      color: "#333333",
                      borderRadius: "4px",
                      lineHeight: "1.5",
                    }}
                  >
                    {isTourPersonalizado
                      ? formData.descripcionViaje
                      : formData.mensaje}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      )}

      {/* Pie de página administrativo */}
      <tr>
        <td
          style={{
            padding: "20px",
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#f5f5f5",
          }}
        >
          <table cellPadding="0" cellSpacing="0" border={0} width="100%">
            <tr>
              <td style={{ fontSize: "12px", color: "#666666" }}>
                Sistema de Administración • Sitios de Interés México
              </td>
              <td align="right">
                <a
                  href="https://strapi-server-app-sim.onrender.com/admin"
                  style={{
                    color: "#1976D2",
                    textDecoration: "none",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  Ir al Panel de Administración
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  );
};
