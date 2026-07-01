import React from 'react';
import { motion } from 'framer-motion';

export default function Gallery() {
  const images = [
    { src: 'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?q=80&w=2070&auto=format&fit=crop', colSpan: 'col-span-2', rowSpan: 'row-span-2' },
    { src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
    { src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop', colSpan: 'col-span-1', rowSpan: 'row-span-2' },
    { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
    { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop', colSpan: 'col-span-2', rowSpan: 'row-span-1' },
  ];

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#8b6e45] text-sm font-bold tracking-[0.2em] uppercase mb-4 block"
            >
              MEMORIES
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-serif font-bold text-[#0f1c2e]"
            >
              Photo Gallery
            </motion.h2>
          </div>
          <motion.button 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="hidden md:block mt-6 md:mt-0 border-b-2 border-[#0f1c2e] pb-1 text-[#0f1c2e] font-bold uppercase tracking-widest hover:text-[#8b6e45] hover:border-[#8b6e45] transition-colors"
          >
            VIEW FULL GALLERY
          </motion.button>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 md:grid-rows-2 gap-4 md:gap-6 h-[800px] md:h-[600px]">
          {images.map((img, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`${img.colSpan} ${img.rowSpan} overflow-hidden group cursor-pointer relative rounded-sm`}
            >
              <img 
                src={img.src} 
                alt="Gallery Item" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
