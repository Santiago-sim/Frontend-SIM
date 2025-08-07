import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    // Validar URL de Cloudinary
    const cloudinaryRegex = /res\.cloudinary\.com\/([^\/]+)\/(image|video|raw)\/upload\/(.*)/;
    const match = url.match(cloudinaryRegex);
    
    if (!match) {
      return NextResponse.json({ error: "URL de Cloudinary inválida" }, { status: 400 });
    }

    const [_, cloudName, resourceType, path] = match;
    
    // Extraer versión y publicId completo
    const versionMatch = path.match(/v(\d+)\//);
    const version = versionMatch ? versionMatch[1] : null;
    const publicIdWithExtension = version ? path.replace(`v${version}/`, "") : path;

    // Generar URL firmada
    const signedUrl = cloudinary.url(publicIdWithExtension, {
      resource_type: resourceType as any,
      type: "upload",
      sign_url: true,
      version: version ? parseInt(version) : undefined,
      secure: true
    });


    // Validación adicional
    if (!signedUrl.includes(publicIdWithExtension)) {
      throw new Error("Error en la construcción de la URL");
    }

    return NextResponse.json({
      originalUrl: url,
      signedUrl,
      publicId: publicIdWithExtension,
      resourceType,
      version
    });

  } catch (error) {
    console.error("Error detallado:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error en el servidor" },
      { status: 500 }
    );
  }
}