"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import TourSection from "@/components/tours/ToursSection";
import Features from "@/components/ui/Features";
import LoadingPlane from "@/components/animation/LoadingPlane";
import News from "@/components/News";
import { getUserMeLoader } from "./data/services/get-user-me-loader";
import { HeroSection } from "@/components/HeroSection";
import { backgrounds } from "@/constants/backgrounds";
import CertificateDisplay from "@/components/CertificateDisplay";

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ ok: false });

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserMeLoader();
      setUser(user);
    };

    fetchUser();
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingPlane />
      ) : (
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            <HeroSection
              backgrounds={backgrounds}
              isAuthenticated={user.ok}
              priorityImages={3} // Precarga las primeras 3 imágenes
            />
            <TourSection />
            <Features />
            <CertificateDisplay
              imageId="Certificado/l01svsneyw0zbbvvck13"
              altText="Certificado de Registro Nacional de Turismo"
              title="Nuestro Certificado de Excelencia"
              subtitle="Testimonio de nuestra calidad y compromiso con el turismo nacional y extranjero 🇲🇽."
              description="Certificado oficial de inscripción al Registro Nacional de Turismo ✅ 🎉"
              imageWidth={90}
            />
            {/*<News: TODO/>*/} 
          </main>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Home;
