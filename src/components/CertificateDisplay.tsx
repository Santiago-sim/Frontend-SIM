"use client"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { ZoomIn } from "lucide-react"
import cloudinaryLoader from "@/lib/cloudinary"

interface CertificateDisplayProps {
  imageId: string
  altText: string
  title: string
  subtitle: string
  description: string
  imageWidth?: number
}

export default function CertificateDisplay({
  imageId,
  altText,
  title,
  subtitle,
  description,
  imageWidth = 80,
}: CertificateDisplayProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  
  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-6">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl text-center mb-4 text-gray-800">{title}</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">{subtitle}</p>
      <div className={`mx-auto`} style={{ width: `${imageWidth}%` }}>
        <motion.div
          className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsFullScreen(true)}
        >
          <div className="relative">
            <Image
              src={imageId}
              alt={altText}
              width={1000}
              height={700}
              priority={true}
              className="w-full h-auto object-contain rounded-lg"
              loader={cloudinaryLoader}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{altText}</h2>
              <p className="text-sm sm:text-base">{description}</p>
            </div>
          </motion.div>
          
          <motion.div
            className="absolute top-2 right-2 bg-white/20 p-2 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ZoomIn className="w-6 h-6 text-white" />
          </motion.div>
          
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
        </motion.div>
      </div>
      
      {isFullScreen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setIsFullScreen(false)}
        >
          <div className="relative max-w-5xl w-full h-auto">
            <Image
              src={imageId}
              alt={altText}
              width={1500}
              height={1050}
              className="w-full h-auto max-h-[90vh] object-contain"
              loader={cloudinaryLoader}
            />
            <button
              className="absolute top-4 right-4 bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/40 transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation()
                setIsFullScreen(false)
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}