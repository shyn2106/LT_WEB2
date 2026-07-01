import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function SpecialOffers() {
  const navigate = useNavigate();
  
  const offers = [
    {
      title: 'Summer Escape',
      desc: 'Save up to 30% on luxurious rooms and suites this summer. Includes daily breakfast for two.',
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Romantic Honeymoon',
      desc: 'Champagne on arrival, a 60-minute couples massage, and a romantic dinner under the stars.',
      image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  return (
    <section className="py-24 bg-[#fbf9f8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#8b6e45] text-sm font-bold tracking-[0.2em] uppercase mb-4 block"
          >
            EXCLUSIVE
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-serif font-bold text-[#0f1c2e]"
          >
            Special Offers
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 60 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="h-[1px] bg-[#8b6e45] mx-auto mt-6"
          ></motion.div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {offers.map((offer, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="group flex flex-col xl:flex-row bg-white shadow-sm hover:shadow-xl transition-all duration-300 rounded-sm overflow-hidden"
            >
              <div className="xl:w-1/2 h-64 xl:h-auto overflow-hidden">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="xl:w-1/2 p-8 flex flex-col justify-center border-t xl:border-t-0 xl:border-l border-gray-100">
                <h3 className="text-2xl font-serif font-bold text-[#0f1c2e] mb-4">{offer.title}</h3>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">{offer.desc}</p>
                <button 
                  onClick={() => navigate('/properties')}
                  className="w-full py-3 border border-[#0f1c2e] text-[#0f1c2e] font-bold uppercase tracking-widest hover:bg-[#0f1c2e] hover:text-white transition-colors"
                >
                  BOOK NOW
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
