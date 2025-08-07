export const TourCardSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
    {/* Skeleton de la imagen con aspecto similar a la de TourCard */}
    <div className="relative aspect-video bg-gray-200"></div>
    <div className="p-6 flex flex-col justify-between h-[200px]">
      <div>
        {/* Skeleton del título */}
        <div className="h-7 bg-gray-200 rounded w-2/4 mb-2"></div>
        {/* Skeleton de la descripción */}
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
      </div>
      {/* Skeleton de la duración */}
      <div className="h-6 bg-gray-200 rounded-full w-24 mx-auto"></div>
    </div>
  </div>
);
