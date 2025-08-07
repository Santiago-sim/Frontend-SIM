// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: '127.0.0.1',
//         port: '1337',
//         pathname: '/uploads/**',
//       },
//       // Cuando despliegues a producción, añade también el dominio de producción
//       // {
//       //   protocol: 'https',
//       //   hostname: 'tu-dominio-produccion.com',
//       //   pathname: '/uploads/**',
//       // }
//     ]
//   }
// };

// export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'standalone',
//   images: {
//     domains: ['res.cloudinary.com'],
//     loader: 'custom',
//     loaderFile: './src/lib/cloudinary.ts', // Ruta a tu archivo personalizado
//     formats: ['image/avif', 'image/webp'],
//     deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
//     imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
//     minimumCacheTTL: 86400, // Cache de 1 día
//     unoptimized: false
//   },
//   experimental: {
//     turbo: {
//       rules:{
//         '*.svg': {
//           loaders: ['@svgr/webpack'],
//           as: '*.js',
//         },
//       }
//     }
//   },
//   webpack: (config: import('webpack').Configuration) => {
//     config.resolve = {
//       ...config.resolve,
//       fallback: {
//         ...config.resolve?.fallback,
//         fs: false,
//         path: false
//       }
//     };
//     return config;
//   }
// };

// module.exports = nextConfig;

// next.config.js
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    // loader: "custom",
    // loaderFile: "./src/lib/cloudinary.ts",
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    unoptimized: false,
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  /**
   * Configuración personalizada de Webpack.
   * @param {import('webpack').Configuration} config - La configuración actual de Webpack.
   * @param {object} context - Contexto de Webpack proporcionado por Next.js (opcional, pero bueno incluirlo).
   * @param {string} context.buildId - ID de la build.
   * @param {boolean} context.dev - Verdadero si está en modo desarrollo.
   * @param {boolean} context.isServer - Verdadero si es para el lado del servidor.
   * @param {object} context.defaultLoaders - Loaders por defecto de Next.js.
   * @param {import('webpack')} context.webpack - La instancia de Webpack.
   * @returns {import('webpack').Configuration} - La configuración modificada de Webpack.
   */
  webpack: (
    config: import("webpack").Configuration,
    {
      buildId,
      dev,
      isServer,
      defaultLoaders,
      webpack,
    }: {
      buildId: string;
      dev: boolean;
      isServer: boolean;
      defaultLoaders: object;
      webpack: typeof import("webpack");
    }
  ): import("webpack").Configuration => {
    // <-- Añadimos el tipo con JSDoc y el parámetro context
    // Tu lógica de modificación de Webpack:
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false, // Ejemplo: Deshabilitar polyfills si no los necesitas en el cliente
        path: false,
        // Añade otros fallbacks si son necesarios, o déjalos por defecto.
      },
    };

    // IMPORTANTE: Siempre debes retornar el objeto de configuración modificado.
    return config;
  },
};

module.exports = nextConfig;
