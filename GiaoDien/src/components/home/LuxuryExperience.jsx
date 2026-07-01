import React from 'react';
import { motion } from 'framer-motion';

export default function LuxuryExperience() {
  const experiences = [
    {
      id: 'restaurant',
      title: 'Fine Dining Restaurant',
      subtitle: 'CULINARY EXCELLENCE',
      desc: 'Experience a gastronomic journey with our Michelin-starred chefs. Using only the finest locally sourced ingredients, we create dishes that delight both the palate and the eyes in an elegant setting.',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop',
      reverse: false
    },
    {
      id: 'spa',
      title: 'Wellness & Spa',
      subtitle: 'REJUVENATE YOUR SENSES',
      desc: 'Step into a sanctuary of tranquility. Our award-winning spa offers bespoke treatments combining ancient traditions with modern wellness practices to restore your mind, body, and spirit.',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
      reverse: true
    },
    {
      id: 'lounge',
      title: 'Sky Bar & Lounge',
      subtitle: 'CITY LIGHTS',
      desc: 'Enjoy signature cocktails crafted by expert mixologists while taking in breathtaking panoramic views of the city skyline from our exclusive rooftop lounge.',
      image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?q=80&w=2029&auto=format&fit=crop',
      reverse: false
    }
  ];

  return (
    <section className="py-24 bg-[#fbf9f8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {experiences.map((exp, idx) => (
          <div 
            key={exp.id} 
            id={exp.id}
            className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-32 last:mb-0 ${exp.reverse ? 'lg:flex-row-reverse' : ''}`}
          >
            {/* Image Side */}
            <motion.div 
              initial={{ opacity: 0, x: exp.reverse ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="aspect-[4/5] relative overflow-hidden group">
                <img 
                  src={exp.image} 
                  alt={exp.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                {/* Decorative border */}
                <div className="absolute inset-4 border border-white/30 z-10 pointer-events-none hidden md:block"></div>
              </div>
              {/* Decorative background box */}
              <div className={`absolute top-8 ${exp.reverse ? '-left-8' : '-right-8'} w-full h-full bg-[#0f1c2e]/5 -z-10 hidden lg:block`}></div>
            </motion.div>

            {/* Text Side */}
            <motion.div 
              initial={{ opacity: 0, x: exp.reverse ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-1/2"
            >
              <span className="text-[#8b6e45] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                {exp.subtitle}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0f1c2e] mb-6 leading-tight">
                {exp.title}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8 font-light text-lg">
                {exp.desc}
              </p>
              <button className="flex items-center text-[#0f1c2e] font-bold uppercase tracking-widest hover:text-[#8b6e45] transition-colors group">
                <span className="border-b-2 border-[#0f1c2e] pb-1 group-hover:border-[#8b6e45] transition-colors">
                  Explore More
                </span>
                <span className="ml-3 transform group-hover:translate-x-2 transition-transform">→</span>
              </button>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
