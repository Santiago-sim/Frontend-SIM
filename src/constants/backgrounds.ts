const NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const backgrounds = [
  {
    image: "GUERRERO-ACAPULCO_2_vosujo",
    title: "Acapulco, Guerrero",
    subtitle: "Vive la magia de las playas Mexicanas",
  },
  {
    image: "CDMX_7_efkyag",
    title: "Ciudad de México",
    subtitle: "Historia y modernidad en cada rincón",
  },
  {
    image: "VERACRUZ_3_umh5wj",
    title: "Veracruz",
    subtitle: "Donde el desierto se encuentra con el mar",
  },
  {
    image: "PUEBLA_6_qc8acz",
    title: "Puebla",
    subtitle: "Tradiciones vivas y sabores únicos",
  },
  {
    image: "GUADALAJARA_5_prwt2y",
    title: "Guadalajara",
    subtitle: "Tierra del tequila y el mariachi",
  },
];

export const cloudinaryLoader = ({
  src,
  width,
  quality = 80,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  const params = [
    'f_auto',
    'q_auto:best',
    'c_fill',
    'g_auto',
    `w_${width}`,
    `q_${quality}`,
    'fl_progressive',
    'dpr_auto'
  ].join(',');
  
  return `https://res.cloudinary.com/${NAME}/image/upload/${params}/${src}`;
};