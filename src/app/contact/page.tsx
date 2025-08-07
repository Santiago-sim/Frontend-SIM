import React from 'react';
import Footer from "@/components/Footer";
import { MessageCircle } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Main Contact Section */}
      <div className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-600">
              <h2 className="text-2xl font-semibold mb-6 text-red-800 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Contáctanos
              </h2>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Nombre completo</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Teléfono</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                      placeholder="Tu número"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Tu mensaje</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition h-32"
                    placeholder="Cuéntanos sobre el viaje de tus sueños..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-base hover:bg-red-700 transition-all shadow-md"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
