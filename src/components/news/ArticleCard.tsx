// components/news/ArticleCard.tsx
"use client"
import React from 'react';
import Image from 'next/image';
import { Calendar, ExternalLink, Newspaper } from 'lucide-react';

// Importa la interfaz Article (puedes moverla a un archivo de tipos si prefieres)
interface Article {
  article_id: string;
  title: string;
  link: string;
  description: string | null;
  pubDate: string;
  image_url: string | null;
  source_id: string;
  source_name: string;
  source_icon: string | null;
}

interface ArticleCardProps {
  article: Article;
}

// Función simple para formatear fecha (puedes usar librerías como date-fns para más opciones)
const formatDate = (dateString: string) => {
  try {
    // Asume que la fecha viene en formato 'YYYY-MM-DD HH:MM:SS' y es UTC
    // Puedes ajustar esto si el formato o la zona horaria es diferente
    const date = new Date(dateString + 'Z'); // Añade 'Z' para indicar UTC
    if (isNaN(date.getTime())) {
        // Si la fecha no es válida, devuelve el string original o un placeholder
        return dateString;
    }
    return date.toLocaleDateString('es-MX', { // Formato para México
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      // hour: '2-digit', // Descomenta si quieres incluir la hora
      // minute: '2-digit',
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString; // Devuelve original si hay error
  }
};


// Placeholder si no hay imagen de artículo
const ArticlePlaceholder = () => (
  <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400">
    <Newspaper size={50} />
  </div>
);

export default function ArticleCard({ article }: ArticleCardProps) {
  // Acortar descripción si es muy larga
  const shortDescription = article.description
    ? (article.description.length > 120 ? article.description.substring(0, 117) + "..." : article.description)
    : "Descripción no disponible.";

  const [imgError, setImgError] = React.useState(false);
  const handleImageError = () => setImgError(true);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full group transition-shadow duration-300 hover:shadow-xl">
      <div className="relative h-48 w-full overflow-hidden">
        {/* Enlace al artículo en la imagen */}
        <a href={article.link} target="_blank" rel="noopener noreferrer" aria-label={`Leer artículo: ${article.title}`}>
          {(article.image_url && !imgError) ? (
            <Image
              src={article.image_url}
              alt={`Imagen para ${article.title}`}
              fill
              style={{ objectFit: 'cover' }} // 'cover' suele ser mejor para imágenes de noticias
              className="transition-transform duration-300 group-hover:scale-105"
              onError={handleImageError}
              // Recuerda configurar los dominios en next.config.js o usar un loader/unoptimized
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <ArticlePlaceholder />
          )}
        </a>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Fuente y Fecha */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
           <span className="flex items-center">
              {/* Muestra icono de la fuente si existe */}
              {article.source_icon && (
                 <Image src={article.source_icon} alt="" width={16} height={16} className="mr-1.5 rounded-sm" unoptimized={true} /* Podría ser necesario unoptimized aquí si hay muchos iconos pequeños o problemas de dominio */ />
              )}
              {article.source_name || article.source_id}
           </span>
           <span className="flex items-center">
              <Calendar size={12} className="mr-1"/> {formatDate(article.pubDate)}
           </span>
        </div>

        {/* Título */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-3 group-hover:text-cyan-700 transition-colors">
          {/* Enlace al artículo en el título */}
          <a href={article.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {article.title}
          </a>
        </h3>

        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
          {shortDescription}
        </p>

        {/* Enlace explícito para leer más */}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto text-sm inline-flex items-center text-cyan-600 hover:text-cyan-800 hover:underline font-medium group-hover:translate-x-1 transition-transform duration-200"
        >
          Leer más <ExternalLink size={14} className="ml-1" />
        </a>
      </div>
    </div>
  );
}