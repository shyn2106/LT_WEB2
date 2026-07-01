import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full flex items-center justify-center">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Hotel Hero" 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/80 uppercase tracking-[0.3em] text-sm md:text-base font-bold mb-4 font-sans"
        >
          Welcome to the Pinnacle of Elegance
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 tracking-wide drop-shadow-lg"
        >
          LUMIÈRE GRAND
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-24 h-[1px] bg-[#8b6e45] mx-auto mb-8"
        ></motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-lg md:text-xl text-gray-200 font-light mb-12 max-w-2xl mx-auto font-sans"
        >
          Experience luxury beyond expectations in the heart of the city, where every moment is crafted to perfection.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <button 
            onClick={() => navigate('/properties')}
            className="px-10 py-4 bg-[#8b6e45] text-white text-sm font-bold tracking-widest uppercase hover:bg-[#725a37] transition-all hover:scale-105 w-full sm:w-auto"
          >
            Discover Rooms
          </button>
          <button 
            onClick={() => {
              document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-10 py-4 border border-white text-white text-sm font-bold tracking-widest uppercase hover:bg-white hover:text-[#0f1c2e] transition-all hover:scale-105 w-full sm:w-auto"
          >
            Explore More
          </button>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10"
      >
        <span className="text-white/60 text-xs tracking-[0.2em] uppercase mb-2">Scroll</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent"
        ></motion.div>
      </motion.div>

      {/* Floating Booking Search Bar - positioned at the bottom, overlapping the next section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute -bottom-16 left-0 right-0 z-20 px-4 hidden lg:block"
      >
        <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-sm overflow-hidden flex flex-wrap divide-x divide-gray-100">
          <div className="flex-1 p-6 flex flex-col justify-center hover:bg-gray-50 transition-colors cursor-pointer">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Check In</span>
            <span className="text-[#0f1c2e] font-medium text-lg">Nov 12, 2024</span>
          </div>
          <div className="flex-1 p-6 flex flex-col justify-center hover:bg-gray-50 transition-colors cursor-pointer">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Check Out</span>
            <span className="text-[#0f1c2e] font-medium text-lg">Nov 15, 2024</span>
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
            onClick={() => navigate('/properties')}
            className="px-10 bg-[#0f1c2e] text-white font-bold tracking-widest uppercase hover:bg-[#1a2b3c] transition-colors flex items-center justify-center"
          >
            Check Availability
          </button>
        </div>
      </motion.div>
    </div>
  );
}
