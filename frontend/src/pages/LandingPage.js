import React from 'react';

// --- Core Landing Page Components ---
// Note the paths might need adjusting if you placed them differently
import ParticleBackground from '../components/ParticleBackground';
import Navbar from '../components/LandingNavbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorks from '../components/HowItWorks';
import LogoCloud from '../components/LogoCloud';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

// This component assembles the entire public-facing landing page
function LandingPage() {
  return (
    <>
      <ParticleBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <HowItWorks />
          <LogoCloud />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;