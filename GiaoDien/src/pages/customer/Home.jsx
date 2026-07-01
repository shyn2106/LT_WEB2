import React, { useEffect } from 'react';
import HeroSection from '../../components/home/HeroSection';
import FeaturedRooms from '../../components/home/FeaturedRooms';
import Facilities from '../../components/home/Facilities';
import LuxuryExperience from '../../components/home/LuxuryExperience';
import Gallery from '../../components/home/Gallery';
import Testimonials from '../../components/home/Testimonials';
import Statistics from '../../components/home/Statistics';
import SpecialOffers from '../../components/home/SpecialOffers';
import CallToAction from '../../components/home/CallToAction';

export default function Home() {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#fbf9f8]">
      <HeroSection />
      <FeaturedRooms />
      <Facilities />
      <LuxuryExperience />
      <Statistics />
      <SpecialOffers />
      <Gallery />
      <Testimonials />
      <CallToAction />
    </div>
  );
}
