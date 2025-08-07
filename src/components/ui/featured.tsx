const features = [
  {
    icon: (
      <svg
        className="w-8 h-8 text-emerald-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: "Guías certificados",
    description:
      "Expertos locales que conocen cada rincón y su historia, brindándote una experiencia auténtica y segura.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-emerald-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Flexibilidad Total",
    description:
      "Desde tours de un día hasta circuitos completos por el país. Adaptamos los itinerarios a tus necesidades.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-emerald-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Grupos reducidos",
    description:
      "Experiencias más personalizadas y mejor atención. Garantizamos grupos pequeños para una mejor experiencia.",
  },
];

const Featured = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16 text-emerald-700">
          ¿Por qué viajar con nosotros?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 hover:bg-emerald-50"
            >
              <div className="bg-emerald-100 p-4 rounded-xl mb-6 group-hover:bg-emerald-200 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-emerald-700">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured;
