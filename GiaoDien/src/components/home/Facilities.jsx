import React from 'react';
import { motion } from 'framer-motion';
import { FiWifi, FiCoffee, FiMonitor, FiMap, FiBriefcase, FiWind } from 'react-icons/fi';
import { FaSwimmer, FaDumbbell, FaSpa, FaGlassMartiniAlt, FaParking, FaCarAlt } from 'react-icons/fa';

export default function Facilities() {
  const facilities = [
    { icon: <FaSwimmer />, title: 'Infinity Pool', desc: 'Hồ bơi vô cực ngắm nhìn toàn cảnh thành phố' },
    { icon: <FaSpa />, title: 'Luxury Spa', desc: 'Trị liệu cao cấp và thư giãn tuyệt đối' },
    { icon: <FaGlassMartiniAlt />, title: 'Fine Dining', desc: 'Ẩm thực quốc tế từ các đầu bếp Michelin' },
    { icon: <FaDumbbell />, title: 'Fitness Center', desc: 'Phòng gym hiện đại mở cửa 24/7' },
    { icon: <FiWifi />, title: 'High-Speed Wifi', desc: 'Kết nối không giới hạn tốc độ cao' },
    { icon: <FaCarAlt />, title: 'Airport Shuttle', desc: 'Dịch vụ đưa đón sân bay bằng xe sang' },
    { icon: <FaParking />, title: 'Valet Parking', desc: 'Bãi đỗ xe an toàn có người phục vụ' },
    { icon: <FiBriefcase />, title: 'Business Center', desc: 'Phòng hội nghị tiêu chuẩn quốc tế' },
  ];

  return (
    <section className="py-24 bg-[#0f1c2e] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[#8b6e45] text-sm font-bold tracking-[0.2em] uppercase mb-4 block"
          >
            AMENITIES
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-6"
          >
            Hotel Facilities
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-[1px] bg-[#8b6e45] mx-auto"
          ></motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {facilities.map((fac, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group flex flex-col items-center text-center p-6 border border-white/10 hover:border-[#8b6e45]/50 hover:bg-white/5 transition-all duration-300 rounded-sm cursor-default"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl text-[#8b6e45] group-hover:scale-110 group-hover:bg-[#8b6e45] group-hover:text-white transition-all duration-500 mb-6">
                {fac.icon}
              </div>
              <h3 className="text-lg font-bold font-serif mb-3 tracking-wide">{fac.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {fac.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
