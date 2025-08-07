"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import cloudinaryLoader from "@/lib/cloudinary";

interface Background {
  image: string;
  title: string;
  subtitle: string;
}

interface Props {
  backgrounds: Background[];
  isAuthenticated: boolean;
  priorityImages?: number;
}

export function HeroSection({
  backgrounds,
  isAuthenticated,
  priorityImages = 2,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Precarga estratégica de imágenes
  useEffect(() => {
    const preloadImages = async () => {
      // Use a regular for loop instead of Promise.all for better error handling
      for (let index = 0; index < priorityImages; index++) {
        if (index >= backgrounds.length) break; // Prevent out-of-bounds access
        try {
          const img = new window.Image();
          img.src = cloudinaryLoader({
            src: backgrounds[index].image,
            width: 1920,
            quality: 80,
          });
          await img.decode(); // This is where the error might occur
          setLoadedIndices((prev) => new Set([...prev, index]));
        } catch (error) {
          console.error(`Error preloading image at index ${index}:`, error);
          //  Handle the error (e.g., show a placeholder, retry, skip the image)
          // Don't stop the entire process, just handle this specific image load failure.
        }
      }
    };

    preloadImages();
  }, [backgrounds, priorityImages]);

  // Transición optimizada
  useEffect(() => {
    if (loadedIndices.size < priorityImages) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
        setIsTransitioning(false);
      }, 700);
    }, 8000);

    return () => clearInterval(interval);
  }, [loadedIndices, backgrounds.length, priorityImages]);

  const optimizedImage = (index: number) =>
    cloudinaryLoader({
      src: backgrounds[index].image,
      width: 1920,
      quality: 85,
    });

  // Función para aplicar la animación de fade-in
  const fadeInAnimation = (index: number) => ({
    opacity: currentIndex === index ? 1 : 0,
    transition: "opacity 1s ease-in-out",
    // Agregamos un pequeño retraso para que la animación sea más suave
    transitionDelay: currentIndex === index ? "0.3s" : "0s",
  });

  return (
    <div className="relative h-[calc(75vh)] min-h-[400px] lg:min-h-[640px] overflow-hidden">
      {backgrounds.map((bg, index) => (
        <div
          key={bg.image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentIndex === index ? "opacity-100" : "opacity-0"
          } ${isTransitioning ? "ease-in-out" : "ease-linear"}`}
        >
          <Image
            src={bg.image}
            loader={cloudinaryLoader}
            alt={bg.title}
            fill
            priority={index < priorityImages}
            loading={index < priorityImages ? "eager" : "lazy"}
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            className="object-cover object-center"
            onLoadingComplete={() =>
              setLoadedIndices((prev) => new Set([...prev, index]))
            }
            onError={(e) => {
              console.error("Error loading image:", e);
            }}
            style={{
              transform: `scale(${currentIndex === index ? 1 : 1.02})`,
              transition: "transform 10s linear",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
        <div
          style={fadeInAnimation(currentIndex)}
          className="mb-8 flex gap-2 justify-center"
        >
          {!isAuthenticated ? (
            <>
              <AuthButton href="/signup" label="Registro" />
              <AuthButton href="/signin" label="Iniciar Sesión" />
            </>
          ) : (
            <AuthButton href="/dashboard/account" label="Ir al Dashboard" />
          )}
        </div>

        <h1
          style={fadeInAnimation(currentIndex)}
          className="text-3xl md:text-5xl lg:text-6xl font-light mb-3 leading-tight text-white"
        >
          <span className="block mb-2">Descubre</span>
          <span className="block mb-2">
            <span className="text-green-500">Mé</span>
            <span className="text-white">xi</span>
            <span className="text-red-500">co</span>
          </span>
        </h1>

        <p
          style={fadeInAnimation(currentIndex)}
          className="text-base md:text-lg lg:text-xl mb-6 text-white max-w-3xl font-extralight"
        >
          {backgrounds[currentIndex].subtitle}
        </p>

        {/*<ScrollButton
          style={fadeInAnimation(currentIndex)}
          targetId="tours"
          label="Explorar Tours"
        />*/}

        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-white w-6 opacity-100"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares
const AuthButton = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className={`
      group relative inline-flex items-center justify-center
      w-[110px]        sm:w-[120px]    md:w-[150px]    lg:w-[175px]
      py-3             sm:py-3         md:py-4         lg:py-4
      text-xs          sm:text-sm      md:text-sm    lg:text-base
      text-white border-2 border-green-500
      hover:bg-green-100 hover:text-white
      transition-all duration-300
      font-light tracking-wider
      overflow-hidden shadow-lg backdrop-blur-sm rounded-full
      text-center
    `}
  >
    <span className="relative z-10">{label}</span>
    <div
      className="
      absolute inset-0 bg-green-500
      transform scale-x-0 group-hover:scale-x-100
      transition-transform duration-300 origin-left
    "
    />
  </Link>
);

const ScrollButton = ({
  targetId,
  label,
  style,
}: {
  targetId: string;
  label: string;
  style?: React.CSSProperties;
}) => (
  <button
    onClick={() =>
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" })
    }
    className="group relative inline-block px-8 py-3 text-white border-2 border-white hover:bg-white hover:text-black transition-all duration-300 text-lg font-light tracking-wider overflow-hidden"
    style={style}
  >
    <span className="relative z-10">{label}</span>
    <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
  </button>
);
