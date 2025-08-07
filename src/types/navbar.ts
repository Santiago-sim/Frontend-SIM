export interface NavigationLink {
  title: string;
  href: string;
  description?: string;
}

export interface NavigationSection {
  title: string;
  items: NavigationLink[];
}

export interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

// Agregamos la interfaz para items que necesita tu sección de Servicios
export interface NavigationItemWithItems extends NavigationLink {
  items: NavigationLink[];
}

export interface NavigationItemWithSections extends NavigationLink {
  sections: NavigationSection[];
}

// Actualizamos el tipo para incluir NavigationItemWithItems
export type NavigationItem = NavigationLink | NavigationItemWithSections | NavigationItemWithItems;

//* Function to type check if an item has sections*
export function hasNavigationSections(item: NavigationItem): item is NavigationItemWithSections {
  return 'sections' in item;
}

// Nueva función de tipo para verificar si un item tiene items
export function hasNavigationItems(item: NavigationItem): item is NavigationItemWithItems {
  return 'items' in item;
}

export interface AuthUserProps {
  username: string;
  email: string;
}

export interface UserResponse {
  ok: boolean;
  data: AuthUserProps | null;
  error?: any;
}

export interface NavbarProps {
  destinations: Array<{
    id: string;
    name: string;
  }>;
}

export interface ExtendedNavbarProps extends NavbarProps {
  data: {
    logoText: {
      id: number;
      text: string;
      url: string;
    };
    ctaButton: {
      id: number;
      text: string;
      url: string;
    };
  };
  initialUser: UserResponse;
}