'use client';


interface NavigationProps {
  sections: Array<{
    label: string;
    id: string;
  }>;
}

export function ClientNavigation({ sections }: NavigationProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white sticky top-0 z-30 border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex gap-8 overflow-x-auto">
          {sections.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="py-4 px-2 text-gray-600 hover:text-green-600 border-b-2 border-transparent hover:border-green-600 transition-colors whitespace-nowrap focus:outline-none focus:text-green-600 focus:border-green-600"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}