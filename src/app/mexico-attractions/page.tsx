import { getCategorias } from "@/lib/get-categorias"
import { getAllTours } from "@/lib/get-tours"
import TourGallery from "./tour-gallery"
import { Suspense } from "react"
import LoadingSkeleton from "@/components/tours/LoadingSkeleton"
export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  // Obtener tours y categorías dinámicamente desde la API
  const [tours, categorias] = await Promise.all([getAllTours(), getCategorias()])

  // Si no hay categorías disponibles, extraer categorías únicas de los tours
  const uniqueCategories =
    categorias.length > 0
      ? categorias
      : [...new Set(tours.flatMap((tour) => tour.categorias.map((cat) => cat.Nombre)))].map((name) => ({
          id: name,
          name: name,
        }))

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <TourGallery tours={tours} categories={uniqueCategories} title="Tours de México" />
    </Suspense>
  )
}
