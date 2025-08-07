import Virgula from "./maya"
import Featured from "./featured"
import Image from "next/image"
import cloudinaryLoader from "@/lib/cloudinary"

const Features = () => {
  return (
    <>
      <section className="relative min-h-[350px] sm:min-h-[400px] lg:min-h-[350px] xl:min-h-[400px] 2xl:min-h-[450px] overflow-hidden">
        {/* Background Image using Cloudinary */}
        <div className="absolute inset-0">
          <Image
            src="Features/u7ypyfps3keqhk9yaiz4"
            loader={cloudinaryLoader}
            alt="Viajero feliz"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Content Container with Blur Effect */}
        <div className="absolute inset-0 lg:left-auto lg:right-0 h-full w-full lg:w-[50%] xl:w-[40%] 2xl:w-[35%] flex items-center justify-center px-4 sm:px-6 lg:px-0">
          <div className="h-full w-full max-w-2xl lg:max-w-none bg-black p-3 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center opacity-50 lg:opacity-75 backdrop-blur-sm lg:backdrop-blur">
            <div className="max-w-lg lg:max-w-none text-center lg:text-left space-y-2 sm:space-y-3 lg:space-y-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-1 sm:mb-2 lg:mb-3 tracking-wide text-white font-medium">
                Personaliza tu Viaje
              </h2>
              <div className="mx-auto lg:mx-0">
                <Virgula color="white" />
              </div>
              <p className="text-xs sm:text-sm md:text-base text-white/90 mb-3 sm:mb-4 lg:mb-5 leading-relaxed lg:pr-4">
                Cada persona es diferente. Estamos aquí para ayudarte a planificar los tours más destacados. Personaliza
                tu viaje hasta el más mínimo detalle.
              </p>

              <a
                href="#"
                className="inline-block px-4 py-2 sm:px-6 sm:py-2 md:px-8 md:py-3 border border-white text-white hover:bg-white hover:text-gray-800 transition-all duration-300 tracking-wide text-xs sm:text-sm md:text-base"
              >
                A tu medida
              </a>
            </div>
          </div>
        </div>
      </section>
      <Featured />
    </>
  )
}

export default Features

