import React from "react";
import Footer from "@/components/Footer";

const AboutUs = () => {
  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
      title: <span className="text-red-600">Puente Cultural</span>,
      description:
        "Conectamos las ricas culturas de México y China, creando experiencias únicas que celebran ambas tradiciones.",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      ),
      title: <span className="text-red-600">Guías Bilingües</span>,
      description:
        "Equipo especializado que domina español, inglés y mandarín para una comunicación perfecta.",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: <span className="text-red-600">Precios Justos</span>,
      description:
        "Ofrecemos las mejores experiencias con una excelente relación calidad-precio para todos nuestros viajeros.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Hero Section with Chinese-inspired design */}
      <div className="relative bg-red-700 text-white">
        <div className="absolute inset-0 bg-[url('/patterns/chinese-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Descubre México
                <span className="block text-yellow-300">con Ojos Nuevos</span>
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                El puente a una auténtica experiencia cultural
              </p>
            </div>
            <div className="flex-1 relative">
              <div className="absolute -inset-4 bg-red-800 rounded-lg transform rotate-3"></div>
              <img
                src="https://64.media.tumblr.com/554f9cf40d8ea3154a964d6162f619fc/tumblr_ps1urmE26r1xwi2z1o1_1280.png"
                alt="Banderas de México y China"
                className="relative rounded-lg shadow-2xl transform -rotate-3 transition-transform hover:rotate-0 duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Red Banner Section */}
      <div className="bg-red-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">★</span>
              <span className="font-bold">Experiencia Cultural Única</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">★</span>
              <span className="font-bold">Guías Certificados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">★</span>
              <span className="font-bold">Servicio de Excelencia</span>
            </div>
          </div>
        </div>
      </div>

      {/* About Section with propaganda-style design */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-1 bg-red-600"></div>
            </div>
            <h2 className="text-4xl font-bold mb-8 text-red-800">
              Nuestra Misión Revolucionaria
            </h2>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Somos una agencia de viajes especializada en crear puentes
              culturales entre México y China. Ubicados en el corazón de México,
              nos dedicamos a diseñar experiencias únicas que satisfacen tanto a
              viajeros chinos que desean explorar las maravillas de México, como
              a mexicanos que buscan descubrir su propio país desde una
              perspectiva diferente.
            </p>
          </div>

          {/* Features with propaganda-style cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg border-2 border-red-200 hover:border-red-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center justify-center mb-6 bg-red-50 w-16 h-16 rounded-full mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section with Chinese Design Elements */}
      <section className="py-16 bg-red-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/chinese-pattern.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-800">
            Nuestros Valores Fundamentales
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-red-600">
              <h3 className="text-2xl font-bold mb-4 text-red-700">
                Compromiso con la Excelencia
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Cada tour está cuidadosamente diseñado para superar las
                expectativas, combinando lugares icónicos con experiencias
                auténticas fuera de las rutas turísticas tradicionales.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-red-600">
              <h3 className="text-2xl font-bold mb-4 text-red-700">
                Entendimiento Cultural
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Nos especializamos en crear experiencias que respetan y celebran
                tanto la cultura china como la mexicana, facilitando un
                verdadero intercambio cultural.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-red-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">
            ¡Únete a Nuestra Revolución Cultural!
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Descubre la magia de México con una perspectiva única
          </p>
          <button className="bg-yellow-400 text-red-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-colors duration-300 transform hover:scale-105">
            Reserva Tu Experiencia
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
