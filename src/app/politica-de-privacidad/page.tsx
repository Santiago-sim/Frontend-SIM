"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import LoadingPlane from "@/components/animation/LoadingPlane";
import { HeroSection } from "@/components/HeroSection";

const PrivacyPolicy: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingPlane />
      ) : (
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            {/* Hero Section Personalizada */}
            <section className="bg-gradient-to-b from-blue-900 to-blue-700 text-white py-20 px-4">
              <div className="container mx-auto max-w-4xl text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Política de Privacidad
                </h1>
                <p className="text-xl text-blue-100">
                  Tu seguridad y confianza son nuestra prioridad
                </p>
              </div>
            </section>

            {/* Contenido de la Política */}
            <div className="container mx-auto max-w-4xl py-12 px-4">
              <div className="prose lg:prose-lg text-gray-700">
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-blue-900">
                    Identidad del Responsable
                  </h2>
                  <p>
                    SITIOS DE INTERÉS MÉXICO S.A. de C.V. es una empresa
                    legalmente constituida conforme a las leyes mexicanas, con
                    domicilio en CIRCUITO SANTA FE 29, CLUB DE GOLF SANTA FE,
                    XOCHITEPEC, MORELOS, C.P. 62790.
                  </p>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-blue-900">
                    Recolección de Datos
                  </h2>
                  <p>
                    Recabamos información necesaria para brindar nuestros
                    servicios turísticos:
                  </p>
                  <ul className="list-disc pl-6 mt-4">
                    <li>Nombre completo y datos de contacto</li>
                    <li>Información de identificación oficial</li>
                    <li>Datos de emergencia y acompañantes</li>
                    <li>Información de pagos (protegida con cifrado SSL)</li>
                  </ul>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-blue-900">
                    Uso de la Información
                  </h2>
                  <p>Sus datos se utilizan para:</p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold mb-2">
                        Servicios Principales
                      </h3>
                      <ul className="list-disc pl-4">
                        <li>Reservaciones y operaciones turísticas</li>
                        <li>Gestión de pagos y facturación</li>
                        <li>Comunicación de emergencia</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Mejora Continua</h3>
                      <ul className="list-disc pl-4">
                        <li>Análisis estadísticos</li>
                        <li>Mejora de experiencias turísticas</li>
                        <li>Personalización de servicios</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-blue-900">
                    Derechos ARCO
                  </h2>
                  <p>
                    Usted puede ejercer sus derechos de Acceso, Rectificación,
                    Cancelación y Oposición mediante:
                  </p>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-4">
                        1
                      </span>
                      <div>
                        <h3 className="font-semibold">Solicitud Escrita</h3>
                        <p className="text-sm">
                          Enviar documento al Departamento de Protección de
                          Datos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-4">
                        2
                      </span>
                      <div>
                        <h3 className="font-semibold">Vía Digital</h3>
                        <p className="text-sm">
                          Solicitud mediante nuestro portal de clientes
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-blue-900">
                    Contacto
                  </h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">
                      Oficina de Protección de Datos:
                    </h3>
                    <ul className="space-y-2">
                      <li>📞 Teléfono: 52-55-6888-8686</li>
                      <li>📧 Email: informacion@sitiosdeinteresmexico.com</li>
                      <li>
                        📍 Dirección: CIRCUITO SANTA FE 29, CLUB DE GOLF SANTA
                        FE, XOCHITEPEC, MORELOS
                      </li>
                      <li>🕒 Horario: L-V 9:00 a 18:00 hrs</li>
                    </ul>
                    <p className="mt-4 text-sm text-gray-600">
                      Actualizado: Mayo 2025 | Versión 1.1
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
};

export default PrivacyPolicy;
