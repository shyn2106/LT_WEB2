import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiWifi, FiCoffee, FiMonitor, FiMaximize, FiUsers } from 'react-icons/fi';

export default function FeaturedRooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://ltweb2-production.up.railway.app/api/room-types')
      .then(res => res.json())
      .then(data => {
        // Lấy tối đa 3 phòng đầu tiên làm phòng nổi bật
        setRooms(data.slice(0, 3));
      })
      .catch(err => console.error("Error fetching room types:", err));
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <section className="py-24 bg-white relative z-10 pt-40 lg:pt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[#8b6e45] text-sm font-bold tracking-[0.2em] uppercase mb-4 block"
          >
            DISCOVER
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-serif font-bold text-[#0f1c2e]"
          >
            Rooms & Suites
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-[1px] bg-[#8b6e45] mx-auto mt-6"
          ></motion.div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rooms.map((room, index) => (
            <motion.div 
              key={room.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group cursor-pointer bg-[#fbf9f8] rounded-sm overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              {/* Image Container with Zoom effect */}
              <div className="relative h-72 overflow-hidden bg-gray-200">
                <img 
                  src={room.imageUrl || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'} 
                  alt={room.typeName} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded flex items-center space-x-1">
                  <span className="text-[#8b6e45] text-xs">★</span>
                  <span className="text-[#8b6e45] text-xs">★</span>
                  <span className="text-[#8b6e45] text-xs">★</span>
                  <span className="text-[#8b6e45] text-xs">★</span>
                  <span className="text-[#8b6e45] text-xs">★</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-serif font-bold text-[#0f1c2e] mb-4 group-hover:text-[#8b6e45] transition-colors">
                  {room.typeName}
                </h3>
                
                {/* Amenities */}
                <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center" title="Kích thước">
                    <FiMaximize className="mr-2" /> {room.size || '35'}m²
                  </div>
                  <div className="flex items-center" title="Sức chứa">
                    <FiUsers className="mr-2" /> {room.capacity || 2} Người
                  </div>
                  <div className="flex items-center" title="Free Wifi">
                    <FiWifi className="mr-2" /> Wifi
                  </div>
                  <div className="flex items-center" title="Breakfast">
                    <FiCoffee className="mr-2" />
                  </div>
                  <div className="flex items-center" title="TV">
                    <FiMonitor className="mr-2" />
                  </div>
                </div>

                {/* Footer of Card */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Starting from</span>
                    <span className="text-xl font-bold text-[#0f1c2e]">{formatPrice(room.price)}₫</span>
                    <span className="text-sm text-gray-500"> /night</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/properties');
                    }}
                    className="w-12 h-12 rounded-full bg-[#0f1c2e] text-white flex items-center justify-center group-hover:bg-[#8b6e45] group-hover:-translate-y-1 transition-all"
                  >
                    →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <button 
            onClick={() => navigate('/properties')}
            className="border-b-2 border-[#0f1c2e] pb-1 text-[#0f1c2e] font-bold uppercase tracking-widest hover:text-[#8b6e45] hover:border-[#8b6e45] transition-colors"
          >
            VIEW ALL ROOMS
          </button>
        </div>
      </div>
    </section>
  );
}
