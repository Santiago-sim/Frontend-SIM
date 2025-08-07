"use client"

import { motion } from "framer-motion"

interface GalleryCardProps {
  id: number
  src: string
  alt: string
  location: string
  category: string
  onClick: () => void
  index: number
}

export default function GalleryCard({ id, src, alt, location, category, onClick, index }: GalleryCardProps) {
  return (
    <motion.div
      className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={src || "/placeholder.com"}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white text-lg font-semibold">{alt}</h3>
        <p className="text-white/80 text-sm">{location}</p>
      </div>
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{category}</div>
    </motion.div>
  )
}
