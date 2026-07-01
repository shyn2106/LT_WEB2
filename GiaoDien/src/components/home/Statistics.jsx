import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Counter = ({ from, to, duration, suffix = '' }) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTime = null;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, from, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export default function Statistics() {
  const stats = [
    { value: 25, suffix: '+', label: 'Years Experience' },
    { value: 350, suffix: '+', label: 'Luxury Rooms' },
    { value: 98, suffix: '%', label: 'Guest Satisfaction' },
    { value: 15, suffix: '', label: 'International Awards' },
  ];

  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center divide-x divide-gray-100">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="text-4xl md:text-6xl font-serif font-bold text-[#8b6e45] mb-2">
                <Counter from={0} to={stat.value} duration={2} suffix={stat.suffix} />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#0f1c2e]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
