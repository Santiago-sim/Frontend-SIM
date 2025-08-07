"use client";

import { FOOTER_CONTACT_INFO, FOOTER_LINKS } from "@/constants";
import Link from "next/link";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand and About */}
          <div>
            <Link href="/" className="inline-block mb-3">
              <h2 className="text-lg font-medium">Sitios de Interés México</h2>
            </Link>
            <p className="text-sm text-gray-300 mb-4 max-w-xs">
              Descubre los destinos más impresionantes de México con nuestros
              tours personalizados.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-medium mb-3 uppercase tracking-wider">
              Enlaces rápidos
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <ul className="space-y-2">
                {FOOTER_LINKS[0].links.slice(0, 4).map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {FOOTER_LINKS[1].links.slice(0, 4).map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-medium mb-3 uppercase tracking-wider">
              Contacto
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`mailto:${FOOTER_CONTACT_INFO.links.find((link) => link.label === "Email")?.value}`}
                  className="text-sm text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2 text-gray-300" />
                  <span>
                    {
                      FOOTER_CONTACT_INFO.links.find(
                        (link) => link.label === "Email"
                      )?.value
                    }
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href={`tel:${FOOTER_CONTACT_INFO.links.find((link) => link.label === "Teléfono")?.value}`}
                  className="text-sm text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <Phone className="w-4 h-4 mr-2 text-gray-300" />
                  <span>
                    {
                      FOOTER_CONTACT_INFO.links.find(
                        (link) => link.label === "Teléfono"
                      )?.value
                    }
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 mt-6 border-t border-gray-800 text-xs text-gray-300">
          <p>© 2025 SitiosDeInteresMéxico - Todos los derechos reservados.</p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <Link
              href="/terminos"
              className="hover:text-white transition-colors"
            >
              Términos
            </Link>
            <Link
              href="/privacidad"
              className="hover:text-white transition-colors"
            >
              Privacidad
            </Link>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 fixed bottom-4 right-4 transition-all duration-300 z-50 shadow-lg"
          aria-label="Volver arriba"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
