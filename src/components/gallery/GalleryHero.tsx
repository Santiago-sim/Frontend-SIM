"use client"

import { motion } from "framer-motion"

interface GalleryHeroProps {
  title: string
  subtitle: string
  backgroundImage: string
}

export default function GalleryHero({ title, subtitle, backgroundImage }: GalleryHeroProps) {
  return (
    <div className="relative mb-12 overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-green-700/80 via-white/30 to-red-700/80 z-10"></div>
      <img src={backgroundImage || "/placeholder.com"} alt={title} className="w-full h-64 md:h-80 object-cover" />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white text-center p-6">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  )
}
