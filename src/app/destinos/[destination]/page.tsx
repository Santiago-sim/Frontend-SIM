"use client";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { getDestinationTours } from "@/lib/get-destinations";
import TourCard from "@/components/tours/TourCard";
import { MapPin, Search, Calendar } from "lucide-react";
import LoadingSkeleton from "@/components/tours/LoadingSkeleton";

interface PageProps {
  params: Promise<{
    destination: string;
  }>;
}

interface Tour {
  documentId: string;
  name: string;
  description: string;
  duration: string;
  image: string;
}

export default function DestinationPage({ params }: PageProps) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [destinationName, setDestinationName] = useState<string>("");
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const resolvedParams = use(params);
  const decodedDestination = decodeURIComponent(resolvedParams.destination);

  useEffect(() => {
    const loadTours = async () => {
      setIsLoading(true);
      if (decodedDestination) {
        const response = await getDestinationTours(decodedDestination);
        if (response.tours) {
          setTours(response.tours);
        }
        if (response.destinationName) {
          setDestinationName(response.destinationName);
        }
        setIsLoading(false);
      }
    };

    loadTours();
  }, [decodedDestination]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!tours.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 py-32 text-center">
            <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Destino No Encontrado
            </h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Lo sentimos, no hay tours disponibles para este destino en este
              momento.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Search className="w-4 h-4 mr-2" />
              Explorar otros destinos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-800 py-24">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center text-white max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Tours en {destinationName || "Cargando..."}
              </h1>
              <p className="text-lg text-gray-100 mb-8">
                Descubre experiencias únicas y aventuras inolvidables en este
                maravilloso destino
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{tours.length} tours disponibles</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Reserva con anticipación</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((tour) => (
                <div
                  key={tour.documentId}
                  className="transform hover:-translate-y-1 transition-transform duration-300"
                >
                  <TourCard {...tour} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              ¿No encuentras el tour perfecto?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Contáctanos para crear un itinerario personalizado que se adapte a
              tus necesidades
            </p>
            <Link 
            href="/tailor-trip"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Personalizar Mi Viaje
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
