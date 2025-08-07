// components/news/LoadingSkeleton.tsx (Ejemplo adaptado)
import React from "react";

const SkeletonArticleCard = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-300"></div> {/* Placeholder for image */}
    <div className="p-5">
      <div className="flex justify-between items-center mb-2">
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>{" "}
        {/* Placeholder for source */}
        <div className="h-3 bg-gray-300 rounded w-1/3"></div>{" "}
        {/* Placeholder for date */}
      </div>
      <div className="h-5 bg-gray-300 rounded w-full mb-2"></div>{" "}
      {/* Placeholder for title line 1 */}
      <div className="h-5 bg-gray-300 rounded w-5/6 mb-4"></div>{" "}
      {/* Placeholder for title line 2 */}
      <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>{" "}
      {/* Placeholder for desc line 1 */}
      <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>{" "}
      {/* Placeholder for desc line 2 */}
      <div className="h-3 bg-gray-300 rounded w-4/5 mb-4"></div>{" "}
      {/* Placeholder for desc line 3 */}
      <div className="h-4 bg-gray-300 rounded w-1/4 mt-auto"></div>{" "}
      {/* Placeholder for link */}
    </div>
  </div>
);

export default function LoadingSkeleton() {
  // Puedes mantener el Hero Skeleton si quieres o simplificarlo
  return (
    <div className="flex flex-col min-h-screen">
      {/* Skeleton Hero (simplificado o como antes) */}
      <div className="bg-gray-300 py-20 animate-pulse">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="h-16 w-16 bg-gray-400 rounded-full mx-auto mb-4"></div>
          <div className="h-10 bg-gray-400 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-400 rounded w-full max-w-md mx-auto mb-8"></div>
          <div className="h-10 bg-gray-400 rounded w-48 mx-auto"></div>
        </div>
      </div>

      {/* Skeleton Grid */}
      <section className="py-16 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map(
              (
                _,
                index // Muestra 6 esqueletos
              ) => (
                <SkeletonArticleCard key={index} />
              )
            )}
          </div>
        </div>
      </section>
      {/* Skeleton Footer (opcional) */}
      <div className="bg-gray-200 py-12 animate-pulse mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
