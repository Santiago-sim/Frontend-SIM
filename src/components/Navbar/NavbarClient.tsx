"use client";
import { useEffect } from "react";
import React, { useState } from 'react';
import { ChevronDown, Phone, Mail, Search, User, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { languages } from "@/constants";
import { combinedNavigation } from "@/constants";
import {
  type ExtendedNavbarProps,
  hasNavigationSections,
  hasNavigationItems,
  NavigationItem,
} from "@/types/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/custom/logout-button";

interface AuthUserProps {
  username: string;
  email: string;
}

function LoggedInUser({ userData }: { readonly userData: AuthUserProps }) {
  return (
    <div className="flex items-center gap-3 ">
      <Link
        href="/dashboard/account"
        className="hover:text-blue-700 cursor-pointer"
      >
        {userData.username}
      </Link>
      <LogoutButton />
    </div>
  );
}

// Función auxiliar para verificar si un elemento tiene secciones de servicios
const hasServicesSection = (item: NavigationItem): boolean => {
  return hasNavigationItems(item) && item.title === "Servicios";
};

const Navbar: React.FC<ExtendedNavbarProps> = ({ destinations, data, initialUser }) => {
  const [openMenu, setOpenMenu] = useState("");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  const { logoText, ctaButton } = data;

  const destinationsMenu = destinations.map((dest) => ({
    title: dest.name,
    href: `/destinos/${dest.id}`,
  }));

  const fullNavigation = combinedNavigation.map((item) => {
    if (hasNavigationSections(item) && item.title === "Destinos en México") {
      return {
        ...item,
        sections: [
          {
            title: "Destinos Principales",
            items: destinationsMenu,
          },
          ...item.sections,
        ],
      };
    }
    return item;
  });

  const renderUserSection = () => {
    if (initialUser.ok && initialUser.data) {
      return <LoggedInUser userData={initialUser.data} />;
    }
    return (
      <Link href={ctaButton.url}>
        <User className="w-5 h-5 text-gray-600 hover:text-green-700 cursor-pointer" />
      </Link>
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileSubmenu = (title: string) => {
    setMobileSubmenu(mobileSubmenu === title ? "" : title);
  };

  return (
    <>
      <div className="w-full fixed top-0 left-0 right-0 z-50">
        {/* Top Bar */}
        <div className="bg-white py-1 px-4 lg:px-8 border-b border-gray-700/20">
          <div className="container mx-auto flex justify-between items-center">
            {/* Mobile Logo */}
            <Link href="/" className="lg:hidden">
              <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
            </Link>

            {/* Language Selector - Adjusted for mobile */}
            <div className="relative py-1 hidden sm:block ml-[120px]">
              {/*<button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center space-x-2 bg-white text-gray-800 border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
              >
                {languages.find((lang) => lang.code === "ES")?.flag}
                <span>ES</span>
                {languageOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>*/}
              {languageOpen && (
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 z-50">
                  {languages.map((lang) => (
                    <a
                      key={lang.code}
                      href={lang.url}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      {lang.flag}
                      {lang.code}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right Section */}
            <div className="hidden lg:flex items-center space-x-12 lg:text-sm sm:text-xs min-h-[30px]">
              <a
                href="mailto:info@sitiosdeinteresmexico.com"
                className="flex items-center hover:text-blue-700"
              >
                <Mail className="w-5 h-5 mr-2" />
                <span className="hidden xl:inline">
                  info@sitiosdeinteresmexico.com
                </span>
              </a>
              <a
                href="tel:+52-55-6888-8686"
                className="flex items-center hover:text-blue-700"
              >
                <Phone className="w-5 h-5 mr-2" />
                <span className="hidden xl:inline">+52-55-6888-8686</span>
              </a>
              <div className="flex items-center">{renderUserSection()}</div>
            </div>

            {/* Mobile Menu Button - Improved styling */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Logo Container - Desktop only */}
          <div
            className={`absolute left-2 ${
              scrolled ? "-top-10" : "-top-8"
            } z-50 hidden lg:block transition-all duration-300`}
          >
            <Link href="/" passHref>
              <div className="bg-white p-3 rounded-lg shadow-lg">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className={`${scrolled ? "h-20" : "h-24"} w-auto transition-all duration-300`}
                />
              </div>
            </Link>
          </div>

          {/* Main Navigation - Desktop */}
          <nav className="hidden lg:block bg-black bg-opacity-75 lg:h-16 ">
            <div className="container mx-auto">
              <ul className="flex justify-center space-x-6 px-26">
                {fullNavigation.map((item) => (
                  <li
                    key={item.title}
                    className="relative group"
                    onMouseEnter={() => setOpenMenu(item.title)}
                    onMouseLeave={() => setOpenMenu("")}
                  >
                    <a
                      href={item.href}
                      className="block px-6 py-3 text-white relative group"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-700/30 via-white/30 to-red-700/30 rounded-lg" />
                      </div>
                      <span className="relative z-10 group-hover:text-white transition-colors duration-300 lg:text-sm sm:text-xs">
                        {item.title}
                        {(hasNavigationSections(item) ||
                          hasServicesSection(item)) && (
                          <span className="inline-block ml-1 text-xs">▼</span>
                        )}
                      </span>
                    </a>

                    {/* Menú desplegable para Destinos */}
                    {hasNavigationSections(item) && openMenu === item.title && (
                      <div className="absolute min-w-max bg-black bg-opacity-75 text-white shadow-lg z-50">
                        <div className="grid grid-cols-1 divide-white/10 w-full">
                          {item.sections.map((section) => (
                            <div key={section.title} className="p-6">
                              {/*<h3 className="text-lg font-medium mb-4">
                                {section.title}
                              </h3>*/}
                              <ul className="space-y-2">
                                {section.items.map((subitem) => (
                                  <li key={subitem.title}>
                                    <a
                                      href={subitem.href}
                                      className="block hover:bg-gradient-to-r from-green-700/30 via-white/30 to-red-700/30 rounded px-2 py-1"
                                    >
                                      {subitem.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Menú desplegable para Servicios */}
                    {hasServicesSection(item) && openMenu === item.title && (
                      <div className="absolute min-w-max bg-black bg-opacity-75 text-white shadow-lg z-50">
                        <div className="p-6 w-64">
                          <ul className="space-y-3">
                            {hasNavigationItems(item) &&
                              item.items.map((subitem) => (
                                <li key={subitem.title}>
                                  <a
                                    href={subitem.href}
                                    className="block hover:bg-gradient-to-r from-green-700/30 via-white/30 to-red-700/30 rounded px-2 py-1"
                                  >
                                    <div className="font-medium">
                                      {subitem.title}
                                    </div>
                                    {subitem.description && (
                                      <div className="text-xs text-gray-300 mt-1">
                                        {subitem.description}
                                      </div>
                                    )}
                                  </a>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Mobile Menu - Improved styling and transitions */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-black bg-opacity-95 text-white overflow-y-auto max-h-[calc(100vh-64px)] transition-all duration-300 ease-in-out">
              <div className="p-4 space-y-4">
                {/* Mobile Search - Improved styling */}
                <div className="flex items-center bg-white/10 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-white/30">
                  <input
                    type="text"
                    placeholder="Buscar"
                    className="bg-transparent outline-none w-full text-white placeholder-white/70"
                  />
                  <Search className="w-5 h-5 text-white/70" />
                </div>

                {/* Mobile User Section */}
                <div className="border-b border-white/10 py-4">
                  {initialUser.ok && initialUser.data ? (
                    <LoggedInUser userData={initialUser.data} />
                  ) : (
                    <Link href={ctaButton.url}>
                      <Button className="w-full flex items-center justify-center gap-2 py-3">
                        <User className="w-5 h-5" />
                        {ctaButton.text}
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Navigation Items - Improved styling */}
                {fullNavigation.map((item) => (
                  <div
                    key={item.title}
                    className="border-b border-white/10 last:border-none"
                  >
                    <div
                      className="flex items-center justify-between py-4 px-2"
                      onClick={() =>
                        (hasNavigationSections(item) ||
                          hasServicesSection(item)) &&
                        toggleMobileSubmenu(item.title)
                      }
                    >
                      <a href={item.href} className="text-lg font-medium">
                        {item.title}
                      </a>
                      {(hasNavigationSections(item) ||
                        hasServicesSection(item)) && (
                        <ChevronDown
                          size={20}
                          className={`transform transition-transform duration-300 ${
                            mobileSubmenu === item.title ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>

                    {/* Mobile Submenu para Destinos */}
                    {hasNavigationSections(item) &&
                      mobileSubmenu === item.title && (
                        <div className="bg-white/5 rounded-lg mx-2 mb-4 overflow-hidden">
                          {item.sections.map((section) => (
                            <div key={section.title} className="p-4">
                              {/*<h3 className="text-white/90 text-sm font-medium mb-3">
                              {section.title}
                            </h3>*/}
                              <ul className="space-y-2">
                                {section.items.map((subitem) => (
                                  <li key={subitem.title}>
                                    <a
                                      href={subitem.href}
                                      className="block py-2 px-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
                                    >
                                      {subitem.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Mobile Submenu para Servicios */}
                    {hasServicesSection(item) &&
                      mobileSubmenu === item.title && (
                        <div className="bg-white/5 rounded-lg mx-2 mb-4 overflow-hidden">
                          <div className="p-4">
                            <ul className="space-y-3">
                              {/* Utilizamos hasNavigationItems para confirmar el tipo antes de mapear */}
                              {hasNavigationItems(item) &&
                                item.items.map((subitem) => (
                                  <li key={subitem.title}>
                                    <a
                                      href={subitem.href}
                                      className="block py-2 px-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
                                    >
                                      <div className="font-medium">
                                        {subitem.title}
                                      </div>
                                      {subitem.description && (
                                        <div className="text-xs text-gray-400 mt-1">
                                          {subitem.description}
                                        </div>
                                      )}
                                    </a>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      )}
                  </div>
                ))}

                {/* Mobile Contact Links - Improved styling */}
                <div className="pt-4 space-y-4">
                  <a
                    href="tel:+52-55-6888-8686"
                    className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                  >
                    <Phone className="w-5 h-5" />
                    <span>+52-55-6888-8686</span>
                  </a>
                  <a
                    href="mailto:info@mexicotravel.net"
                    className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                  >
                    <Mail className="w-5 h-5" />
                    <span>info@mexicotravel.net</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Spacer div - Adjusted for better mobile spacing */}
      <div className="lg:h-[50px]" />
    </>
  );
};

export default Navbar;
