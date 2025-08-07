import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Ruta al archivo JSON de la animación
const airplaneJson = "/animation.json";

const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90">
      <div className="relative w-1/4 h-1/4 sm:w-1/2 sm:h-1/2 lg:w-1/4 lg:h-1/4">
        <img
          src="/logo.svg"
          alt="Logo"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1/4 sm:h-1/4 lg:h-3/4"
        />

        {/* Animación Lottie con archivo JSON */}
        <div className="absolute inset-0">
          <DotLottieReact
            src={airplaneJson}
            loop
            autoplay
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;