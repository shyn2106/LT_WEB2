import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Eleanor Roosevelt',
      country: 'United Kingdom',
      text: 'Trải nghiệm tuyệt vời nhất mà tôi từng có. Mọi chi tiết từ phòng ốc đến dịch vụ spa đều hoàn hảo. Nhân viên cực kỳ chuyên nghiệp và thân thiện.',
      rating: 5,
    },
    {
      id: 2,
      name: 'James Chen',
      country: 'Singapore',
      text: 'View thành phố từ Sky Bar thực sự ngoạn mục. Nhà hàng Fine Dining phục vụ những món ăn đẳng cấp Michelin. Chắc chắn sẽ quay lại vào kỳ nghỉ tới.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Sophie Martin',
      country: 'France',
      text: 'Khách sạn mang đậm nét kiến trúc Pháp cổ điển pha lẫn hiện đại. Không gian yên tĩnh, sang trọng, rất phù hợp cho những chuyến nghỉ dưỡng riêng tư.',
      rating: 5,
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-[#0f1c2e] text-white overflow-hidden relative">
      {/* Decorative large quote mark */}
      <div className="absolute top-10 left-10 md:top-20 md:left-20 text-[200px] md:text-[300px] text-white/5 font-serif leading-none select-none pointer-events-none">
        "
      </div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#8b6e45] text-sm font-bold tracking-[0.2em] uppercase mb-16 block"
        >
          GUEST REVIEWS
        </motion.span>

        <div className="relative min-h-[250px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center"
            >
              <div className="flex space-x-1 mb-8">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <span key={i} className="text-[#8b6e45]">★</span>
                ))}
              </div>
              <p className="text-xl md:text-3xl font-serif font-light leading-relaxed mb-10 italic">
                "{testimonials[currentIndex].text}"
              </p>
              <div>
                <h4 className="font-bold tracking-wider uppercase text-sm mb-1">
                  {testimonials[currentIndex].name}
                </h4>
                <span className="text-[#8b6e45] text-xs font-bold uppercase tracking-widest">
                  {testimonials[currentIndex].country}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mt-12">
          <button 
            onClick={prevTestimonial}
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-[#8b6e45] hover:border-[#8b6e45] transition-all"
          >
            ←
          </button>
          <button 
            onClick={nextTestimonial}
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-[#8b6e45] hover:border-[#8b6e45] transition-all"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
