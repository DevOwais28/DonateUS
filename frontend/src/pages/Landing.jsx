import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import ImpactStats from '../components/ImpactStats.jsx';
import Features from '../components/Features.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import FeaturedCampaigns from '../components/FeaturedCampaigns.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Footer from '../components/Footer.jsx';
import ThemeLayout from '../layout/ThemeLayout.jsx';

export default function Landing() {
  return (
    <ThemeLayout>
      <Navbar />
      <main>
        <Hero />
        <ImpactStats />
        <Features />
        <HowItWorks />
        <FeaturedCampaigns />
        <Testimonials />
      </main>
      <Footer />
    </ThemeLayout>
  );
}
