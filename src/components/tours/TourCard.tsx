"use client";
import Link from "next/link";
import { CldImage } from 'next-cloudinary';
import Image from "next/image";

interface TourCardProps {
  documentId: string;
  name: string;
  image: string;
  duration: string;
  description: string;
}


const TourCard = ({
  documentId,
  name,
  image,
  duration,
  description,
}: TourCardProps) => {
  return (
    <Link 
      href={`/tours/${documentId}`} 
      className="block group"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]">
        <div className="relative overflow-hidden h-[180px] sm:h-[150px] md:h-[180px]  lg:h-[200px]"> {/* Responsive height for the image container */}
          {image ? (
          <CldImage
            src={image}
            alt={name}
            fill
            className="object-cover ..."
          />
        ) : (
          <Image
            src="/placeholder.png"
            alt="Imagen no disponible"
            fill
            className="object-cover"
          />
        )}
        </div>
        <div className="p-4 flex flex-col justify-between h-[170px]">
          <div className="flex-grow">
            <h3 className="text-sm sm:text-base mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {name}
            </h3>
            {description && (
              <p className="text-gray-600 text-xs line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <div className="inline-flex items-center justify-center py-1 px-2 bg-gray-100 text-gray-700 text-xs rounded-full">
            {duration} {duration === '1' ? 'Hr' : 'Hrs'}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
