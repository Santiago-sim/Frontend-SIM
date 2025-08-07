import React from "react";
import dynamic from 'next/dynamic';
import { Star } from "lucide-react";
import Link from "next/link";
import { StrapiContentRenderer } from "./StrapiContentRenderer";
import { StrapiBlock } from "@/types/strapi";

const Map = dynamic(() => import('./TourMap'), {
  ssr: false, // Esto es importante - deshabilita el Server Side Rendering para el mapa
  loading: () => (
    <div className="w-full h-[220px] bg-gray-100 rounded-lg flex items-center justify-center">
      <p>Loading map...</p>
    </div>
  ),
});

interface TourHeroSectionProps {
  image: string;
  name: string;
  description: string;
  ubicacion: string;
}

const TourHeroSection: React.FC<TourHeroSectionProps> = ({
  image,
  name,
  description,
  ubicacion,
}) => {
  return (
    <section className="felx-1 min-h-screen">
      <div className="max-w-auto mx-auto w-4/5 px-4">
        <div className="bg-white p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side - Image */}
            <div className="">
              <div className="w-full h-[250px]">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Middle content */}
            <div className="lg:w-3/6 flex flex-col ml-2">
              <h1 className="text-2xl font-medium mb-3 font-sans">{name}</h1>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="text-gray-400 ml-2">good!</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="items-center flex text-gray-600 text-sm">
                  {ubicacion}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <p className="items-center flex text-gray-600 text-sm">
                  {description}
                </p>
              </div>

              <div className="flex gap-10 mt-12">
                <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors">
                  Request a quote
                </button>
                <button className="flex items-center gap-1 border border-gray-300 px-6 py-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="text-blue-500">+</span>
                  My Favorite
                </button>
              </div>
            </div>

            {/* Right side - Leaflet Map */}
            <div className="lg:w-60">
              <div className="w-full h-full">
                <Map name={name} ubicacion={ubicacion} />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600">
                Itinerary
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Questions & Answers
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Search
              </button>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourHeroSection;