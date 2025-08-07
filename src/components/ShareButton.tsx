'use client';

import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  description: string;
}

export function ShareButton({ title, description }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error al compartir:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
    >
      <Share2 className="w-5 h-5" />
      <span>Compartir tour</span>
    </button>
  );
}