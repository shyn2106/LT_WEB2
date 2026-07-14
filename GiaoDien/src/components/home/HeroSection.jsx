import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch('https://ltweb2-production.up.railway.app/api/banners/active')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setBanners(data);
        } else {
          setBanners([getDefaultBanner()]);
        }
      })
      .catch(err => {
        console.error(err);
        setBanners([getDefaultBanner()]);
      });
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % banners.length);
      }, 5000); // Đổi banner sau 5 giây
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const getDefaultBanner = () => ({
    id: 0,
    title: 'LUMIÈRE GRAND',
    subtitle: 'Welcome to the Pinnacle of Elegance',
    description: 'Experience luxury beyond expectations in the heart of the city, where every moment is crafted to perfection.',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?q=80&w=2070&auto=format&fit=crop',
    buttonText: 'Discover Rooms',
    link: '/properties'
  });

  const handleSearch = () => {
    if (checkIn && checkOut) {
      navigate(`/properties?checkIn=${checkIn}&checkOut=${checkOut}`);
    } else {
      navigate('/properties');
    }
  };

  const activeBanner = banners[currentSlide] || getDefaultBanner();

  return (
    <div className="relative h-screen w-full flex items-center justify-center">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img 
            key={activeBanner.id}
            src={activeBanner.imageUrl}
            alt={activeBanner.title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16 h-full flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBanner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {activeBanner.subtitle && (
              <p className="text-white/80 uppercase tracking-[0.3em] text-sm md:text-base font-bold mb-4 font-sans text-center">
                {activeBanner.subtitle}
              </p>
            )}
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 tracking-wide drop-shadow-lg text-center">
              {activeBanner.title}
            </h1>
            
            <div className="w-24 h-[1px] bg-[#8b6e45] mx-auto mb-8"></div>
            
            {activeBanner.description && (
              <p className="text-lg md:text-xl text-gray-200 font-light mb-12 max-w-2xl mx-auto font-sans text-center">
                {activeBanner.description}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {activeBanner.buttonText && (
                <button 
                  onClick={() => navigate(activeBanner.link || '/properties')}
                  className="px-10 py-4 bg-[#8b6e45] text-white text-sm font-bold tracking-widest uppercase hover:bg-[#725a37] transition-all hover:scale-105 w-full sm:w-auto"
                >
                  {activeBanner.buttonText}
                </button>
              )}
              <button 
                onClick={() => {
                  document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-10 py-4 border border-white text-white text-sm font-bold tracking-widest uppercase hover:bg-white hover:text-[#0f1c2e] transition-all hover:scale-105 w-full sm:w-auto"
              >
                Explore More
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-32 flex space-x-3 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
                }`}
              ></button>
            ))}
          </div>
        )}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10 hidden md:flex">
        <span className="text-white/60 text-xs tracking-[0.2em] uppercase mb-2">Scroll</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent"
        ></motion.div>
      </div>

      {/* Floating Booking Search Bar - positioned at the bottom, overlapping the next section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute -bottom-16 left-0 right-0 z-20 px-4 hidden lg:block"
      >
        <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-sm overflow-hidden flex flex-wrap divide-x divide-gray-100">
          <div className="flex-1 p-6 flex flex-col justify-center hover:bg-gray-50 transition-colors">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 cursor-pointer">Check In</label>
            <input 
              type="date" 
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="outline-none bg-transparent font-medium text-lg text-[#0f1c2e] cursor-pointer"
            />
          </div>
          <div className="flex-1 p-6 flex flex-col justify-center hover:bg-gray-50 transition-colors">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 cursor-pointer">Check Out</label>
            <input 
              type="date" 
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="outline-none bg-transparent font-medium text-lg text-[#0f1c2e] cursor-pointer"
            />
          </div>
          <div className="flex-1 p-6 flex flex-col justify-center hover:bg-gray-50 transition-colors cursor-pointer">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Guests</span>
            <span className="text-[#0f1c2e] font-medium text-lg">2 Adults, 1 Room</span>
          </div>
          <div className="flex-1 p-6 flex flex-col justify-center hover:bg-gray-50 transition-colors cursor-pointer">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Promo Code</span>
            <input type="text" placeholder="Add code" className="outline-none bg-transparent font-medium text-lg text-[#0f1c2e] placeholder-gray-300" />
          </div>
          <button 
            onClick={handleSearch}
            className="px-10 bg-[#0f1c2e] text-white font-bold tracking-widest uppercase hover:bg-[#1a2b3c] transition-colors flex items-center justify-center"
          >
            Check Availability
          </button>
        </div>
      </motion.div>
    </div>
  );
}
