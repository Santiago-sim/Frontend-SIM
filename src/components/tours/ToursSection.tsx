// components/tours/ToursSection.tsx
"use client";
import { useState, useEffect } from "react";
import { getTours, PaginatedToursResponse } from "@/lib/get-tours";
import TourCard from "./TourCard";
import { TourCardSkeleton } from "./TourCardSkeleton";
import { Pagination } from "./Pagination";
import Virgula from "@/components/ui/maya";

export function ToursSection() {
  const [toursData, setToursData] = useState<PaginatedToursResponse | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [, setOffsetY] = useState(0);

  useEffect(() => {
    const handleResize = () => setOffsetY(window.innerHeight * 0.3);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading(true);
      const data = await getTours(currentPage, 3);
      setToursData(data);
      setIsLoading(false);
    };
    fetchTours();
  }, [currentPage]);

  if (isLoading) {
    return (
      <section className="justify-center py-8 mt-20 bg-white" id="tours">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="relative">
                <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded max-w-2xl mx-auto mb-8"></div>
              </div>
              {/* Grid de Skeletons, una fila y 3 columnas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                {[...Array(3)].map((_, i) => (
                  <TourCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!toursData?.tours.length) {
    return (
      <section className="py-8 mt-20 bg-white" id="tours">
        <div className="mt-10">
          <div className="container mx-auto text-center">
            No hay tours disponibles en este momento.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 mt-0 bg-white" id="tours">
      <div className="container mx-auto px-4">
        {/* Title Section with Decorative Elements */}
        <div className="text-center mb-12 relative mt-0">
          {/* Main Title */}
          <div className="relative inline-block">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-center mb-4 text-gray-800">
              Tours más solicitados
            </h1>
          </div>
          <Virgula />

          {/* Subtitle */}
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto mt-6">
            Exploran los destinos alucinantes de México con nuestros tours
            recomendados
          </p>
        </div>

        {/* Tours Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-1">
          {toursData.tours.map((tour) => (
            <TourCard key={tour.documentId} {...tour} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mb-12">
          <Pagination
            currentPage={currentPage}
            totalPages={toursData.pagination.pageCount}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </section>
  );
}

export default ToursSection;
