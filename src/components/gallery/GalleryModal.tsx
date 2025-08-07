"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Download, Share, Heart } from "lucide-react"

interface GalleryImage {
  id: number
  src: string
  alt: string
  location: string
  category: string
}

interface GalleryModalProps {
  image: GalleryImage
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export default function GalleryModal({ image, onClose, onNext, onPrevious }: GalleryModalProps) {
  const [isLiked, setIsLiked] = useState(false)

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onNext()
      if (e.key === "ArrowLeft") onPrevious()
    }

    window.addEventListener("keydown", handleKeyDown)
    // Prevenir scroll del body
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "auto"
    }
  }, [onClose, onNext, onPrevious])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navegación */}
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Contenido */}
        <div className="w-full h-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row">
          {/* Imagen */}
          <motion.div
            className="relative flex-grow flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={image.src || "/placeholder.com"}
              alt={image.alt}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          </motion.div>

          {/* Información */}
          <motion.div
            className="w-full md:w-80 bg-white p-6 rounded-t-lg md:rounded-tr-none md:rounded-r-lg flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-2">{image.alt}</h2>
            <p className="text-gray-600 mb-4">{image.location}</p>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{image.category}</span>
            </div>

            <p className="text-gray-700 mb-6">
              Descubre la belleza de {image.alt}, uno de los destinos más impresionantes de {image.location}.
            </p>

            <div className="mt-auto flex justify-between">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full ${isLiked ? "text-red-500" : "text-gray-500"} hover:bg-gray-100`}
                aria-label={isLiked ? "Quitar de favoritos" : "Añadir a favoritos"}
              >
                <Heart className={`w-6 h-6 ${isLiked ? "fill-red-500" : ""}`} />
              </button>

              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100" aria-label="Compartir">
                <Share className="w-6 h-6" />
              </button>

              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100" aria-label="Descargar">
                <Download className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
