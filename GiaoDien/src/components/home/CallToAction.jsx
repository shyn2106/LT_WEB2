import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 bg-[#0f1c2e] overflow-hidden flex items-center justify-center">
      {/* Background Image with Parallax effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?q=80&w=2070&auto=format&fit=crop" 
          alt="CTA Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1c2e]/80 to-[#0f1c2e]"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight"
        >
          Ready For Your Next <br/> Luxury Stay?
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-300 font-light mb-12"
        >
          Book directly with us to enjoy the best rates, exclusive perks, and a truly unforgettable experience.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button 
            onClick={() => navigate('/properties')}
            className="px-12 py-5 bg-[#8b6e45] text-white font-bold tracking-[0.2em] uppercase hover:bg-[#725a37] transition-all hover:scale-105 shadow-2xl rounded-sm"
          >
            BOOK YOUR STAY
          </button>
        </motion.div>
      </div>
    </section>
  );
}
