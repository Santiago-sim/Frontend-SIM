import React from "react";
import Image from "next/image"; // Usar Image de Next.js para optimización
// Asegúrate que Link de next/link esté importado si lo usas directamente, aunque aquí solo se usa <a>
// import Link from 'next/link';
import { Link as LinkIcon, Tag, Newspaper } from "lucide-react"; // <--- CORRECCIÓN AQUÍ

interface NewsSourceCardProps {
  id: string;
  name: string;
  url: string;
  icon: string | null;
  description: string;
  category: string[];
}

// Placeholder simple si no hay icono
const PlaceholderIcon = () => (
  <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-400">
    {/* Ahora Newspaper está importado y se puede usar */}
    <Newspaper size={40} />
  </div>
);

export default function NewsSourceCard({
  id,
  name,
  url,
  icon,
  description,
  category,
}: NewsSourceCardProps) {
  // Limitar descripción para que no sea muy larga
  const shortDescription =
    description.length > 100
      ? description.substring(0, 97) + "..."
      : description;

  // Tomar solo las primeras 3 categorías para mostrar
  const displayCategories = category.slice(0, 3);

  // Estado local para manejar error de carga de imagen específica de este card
  const [imgError, setImgError] = React.useState(false);

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full group transition-all duration-300 hover:shadow-xl">
      <div className="relative h-32 w-full overflow-hidden">
        {/* Enlace externo en la imagen */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visitar ${name}`}
        >
          {icon && !imgError ? (
            <Image
              src={icon}
              alt={`Icono de ${name}`}
              fill // Ocupa todo el contenedor padre
              style={{ objectFit: "contain" }} // 'cover' o 'contain' según prefieras
              className="transition-transform duration-300 group-hover:scale-110" // Animación de zoom al pasar el ratón
              // Añadir manejo de errores básico para la imagen
              onError={handleImageError} // Llama a la función de error
              // Opcional: tamaños para optimización de Next/Image
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            // Muestra el placeholder si no hay icono O si la imagen falló en cargar
            <PlaceholderIcon />
          )}
        </a>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-emerald-700 transition-colors">
          {/* Enlace externo en el título */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
          >
            {name}
          </a>
        </h3>

        <p className="text-sm text-gray-600 mb-4 flex-grow">
          {shortDescription || "No hay descripción disponible."}
        </p>

        {/* Mostrar categorías */}
        {displayCategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {displayCategories.map((cat) => (
              <span
                key={cat}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full capitalize flex items-center"
              >
                <Tag size={12} className="mr-1" /> {cat}
              </span>
            ))}
          </div>
        )}

        {/* Enlace explícito (opcional, ya que título e imagen son enlaces) */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto text-sm inline-flex items-center text-emerald-600 hover:text-emerald-800 hover:underline font-medium group-hover:translate-x-1 transition-transform duration-200"
        >
          Visitar sitio <LinkIcon size={14} className="ml-1" />
        </a>
      </div>
    </div>
  );
}
