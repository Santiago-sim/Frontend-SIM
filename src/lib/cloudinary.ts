const cuenta = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export default function cloudinaryLoader({
  src,
  width,
  quality = 85,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const params = [
    'f_auto',       // Formato automático
    'q_auto:best',  // Calidad inteligente
    'c_fill',       // Recorte inteligente
    'g_auto',       // Optimización gravitacional
    `w_${width}`,   
    `q_${quality}`,
    'fl_progressive',
    'dpr_auto'
  ].join(',');

  return `https://res.cloudinary.com/${cuenta}/image/upload/${params}/${src}`;
}

export async function signCloudinaryUrl(url: string): Promise<string | null> {
    try {
      const response = await fetch('/api/cloudinary-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Error al firmar la URL');
      }

      const data = await response.json();
      return data.signedUrl;
    } catch (error) {
      console.error('Error signing URL:', error);
      return null;
    }
}