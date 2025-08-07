import {
  NavigationItemWithSections,
  NavigationItem,
  NavigationLink,
  Review,
} from "@/types/navbar";

interface ServicesItemsSection {
  title: string;
  href: string;
  items: {
    title: string;
    href: string;
    description?: string;
  }[];
}


export const FOOTER_LINKS = [
  {
    title: "Enlaces Rápidos",
    links: [
      "Sobre Nosotros",
      "Contactanos",
      "Politica de Privacidad",
      "Terminos de Uso",
    ],
  },
  {
    title: "Destinos",
    links: ["CDMX", "Guadalajara", "Guanajuato", "Puebla", "Veracruz"],
  },
];

export const FOOTER_CONTACT_INFO = {
  title: "Contacto",
  links: [
    {
      label: "Email",
      value: "info@sitiosdeinteresmexico.com",
    },
    {
      label: "Teléfono",
      value: "+52-55-6888-8686",
    },
  ],
};

export const SOCIALS = {
  title: "Redes Sociales",
  links: ["/facebook.svg", "/instagram.svg", "/twitter.svg"],
};

export const languages = [
  {
    code: "ES",
    url: "https://www.mexicotravel.net/",
    flag: (
      <svg className="w-4 h-4 mr-2" viewBox="0 0 32 24">
        <rect width="32" height="24" fill="#006847" />
        <rect x="11" y="0" width="10" height="24" fill="#fff" />
        <rect x="21" y="0" width="11" height="24" fill="#ce1126" />
        <circle cx="16" cy="12" r="4" fill="#824A33" />
        <path d="M16,9 c1,1.5 1,3 0,4.5 c-1,-1.5 -1,-3 0,-4.5" fill="#006847" />
      </svg>
    ),
  },
  {
    code: "EN",
    url: "https://en.mexicotravel.net/",
    flag: (
      <svg className="w-4 h-4 mr-2" viewBox="0 0 32 24">
        <rect width="32" height="24" fill="#012169" />
        <path d="M0,0 L32,24 M32,0 L0,24" stroke="#fff" strokeWidth="4" />
        <path d="M16,0 V24 M0,12 H32" stroke="#fff" strokeWidth="8" />
        <path d="M16,0 V24 M0,12 H32" stroke="#C8102E" strokeWidth="4" />
      </svg>
    ),
  },
  {
    code: "中文",
    url: "https://zh.mexicotravel.net/",
    flag: (
      <svg className="w-4 h-4 mr-2" viewBox="0 0 32 24">
        <rect width="32" height="24" fill="#EE1C25" />
        <path
          d="M8,4 l2,6 l6,-2 l-2,6 l6,2 l-6,2 l2,6 l-6,-2 l-2,6 l-2,-6 l-6,2 l2,-6 l-6,-2 l6,-2 l-2,-6 l6,2 z"
          fill="#FFFF00"
        />
      </svg>
    ),
  },
];

export const destinosItems: NavigationItemWithSections[] = [
  {
    title: "Destinos en México",
    href: "/",
    sections: [
      /*{
        title: "Categorias",
        items: [
          {
            title: "Antropología",
            href: "/mexico-tour/activities/anthropology",
          },
          { title: "Culinario", href: "/mexico-tour/activities/gastronomy" },
          { title: "Popular", href: "/mexico-tour/activities/popular-culture" },
          { title: "Museos", href: "/mexico-tour/activities/museums" },
          { title: "Ferroviario", href: "/mexico-tour/activities/railway" },
          { title: "Hotelero", href: "/mexico-tour/activities/hospitality" },
          {
            title: "Arquitectura",
            href: "/mexico-tour/activities/architecture",
          },
          {
            title: "Experiencias",
            href: "/mexico-tour/activities/experiences",
          },
          { title: "Nocturno", href: "/mexico-tour/activities/nightlife" },
        ],
      },*/
      /*{
        title: "Destinos 1",
        items: [
          { title: "Riviera Maya", href: "/mexico-tour/riviera-maya" },
          { title: "Ruta Maya", href: "/mexico-tour/ruta-maya" },
          { title: "México Colonial", href: "/mexico-tour/colonial" },
          { title: "Baja California", href: "/mexico-tour/baja" },
          { title: "Copper Canyon", href: "/mexico-tour/copper-canyon" },
          { title: "Monarch Butterfly", href: "/mexico-tour/butterfly" },
        ],
      },*/
    ],
  },
];

export const serviciosItems: ServicesItemsSection[]=[
  {
    title: "Servicios",
    href: "/",
    items: [
      { title: "Tour", href: "/tour", description: "Consiste en llevarte a las atracciones" },
      { title: "Guía", href: "/guide", description: "Acompañarte en las atracciones, dar recomendaciones y datos" },
      { title: "Paquetes", href: "/packages", description: "Conjunto de atracciones por tema" },
    ],
  },
];

export const mainLinks: NavigationLink[] = [
  { title: "Turismo a la medida", href: "/tailor-trip" },
  { title: "Atracciones en Mexico", href: "/mexico-attractions" },
  { title: "Noticias", href: "/mexico-travel-news" },
];

export const combinedNavigation: NavigationItem[] = [
  mainLinks[0],
  ...destinosItems,
  mainLinks[1],
  //activar para actualizaciones posteriores
  ...serviciosItems,
  mainLinks[2],
];

export const reviews: Review[] = [
  {
    name: "Slavoj Žižek",
    rating: 5,
    comment:
      "Amazing money-worth experience! The tour was well organized and the guide was very knowledgeable, I understood everthing despite the guide being Chinese. I'd always choose Sitios de interés for my Mexico trips.",
    date: "2024-03-15",
  },
  {
    name: "Carlos Rodríguez",
    rating: 4,
    comment: "Los guías a veces no sabían cuales actividades estaban incluidas y se confundian con mi. itinerario, pero en general fue una experiencia grata",
    date: "2024-01-10",
  },
];

export const navigationSections = [
  { label: "Descripción", id: "descripcion" },
  { label: "Itinerario", id: "itinerario" },
  { label: "Incluye", id: "incluye" },
  { label: "Recomendaciones", id: "recomendaciones" },
  { label: "Reseñas", id: "resenas" },
];
