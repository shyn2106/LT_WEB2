import React from 'react';
import { Link } from 'react-router-dom';

export default function Experiences() {
  const articles = [
    {
      id: 1,
      category: 'CULINARY',
      title: 'Unveiling the Art of French Gastronomy at L\'Aura',
      date: 'Oct 15, 2024',
      excerpt: 'Join our Michelin-starred Executive Chef as we introduce the new autumn tasting menu, featuring rare ingredients sourced directly from the highlands.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      category: 'WELLNESS',
      title: 'The Signature Bamboo Therapy at Oasis Spa',
      date: 'Oct 12, 2024',
      excerpt: 'Discover a sanctuary of peace where ancient Eastern healing traditions meet modern wellness techniques in our award-winning spa.',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      category: 'DESTINATION',
      title: 'A Curated Guide to Saigon\'s Hidden Art Galleries',
      date: 'Oct 05, 2024',
      excerpt: 'Step off the beaten path and explore the vibrant contemporary art scene of the city with our exclusive concierge recommendations.',
      image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      category: 'EVENTS',
      title: 'Jazz Under the Stars: Weekend Rooftop Soirée',
      date: 'Sep 28, 2024',
      excerpt: 'Elevate your weekend with live jazz performances, signature cocktails, and breathtaking panoramic views of the city skyline.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-12 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h4 className="text-[10px] font-bold text-[#8b6e45] uppercase tracking-widest mb-3">THE JOURNAL</h4>
        <h1 className="text-5xl font-serif font-bold text-[#0f1c2e] mb-6">Curated Experiences</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Stories, insights, and exclusive glimpses into the luxurious lifestyle and authentic local encounters awaiting you at Lumière Grand.</p>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <button className="px-6 py-2 text-xs font-bold uppercase tracking-wider bg-[#0f1c2e] text-white rounded-sm">All</button>
        <button className="px-6 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 text-gray-500 hover:border-[#8b6e45] hover:text-[#8b6e45] rounded-sm transition-colors">Culinary</button>
        <button className="px-6 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 text-gray-500 hover:border-[#8b6e45] hover:text-[#8b6e45] rounded-sm transition-colors">Wellness</button>
        <button className="px-6 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 text-gray-500 hover:border-[#8b6e45] hover:text-[#8b6e45] rounded-sm transition-colors">Destination</button>
      </div>

      {/* Featured Article (First one) */}
      <div className="mb-16 group cursor-pointer">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="h-80 lg:h-auto overflow-hidden">
            <img src={articles[0].image} alt={articles[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="p-12 lg:p-16 flex flex-col justify-center bg-[#fbf9f8]">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-[10px] font-bold text-[#8b6e45] uppercase tracking-wider">{articles[0].category}</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-500">{articles[0].date}</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#0f1c2e] mb-4 group-hover:text-[#8b6e45] transition-colors">{articles[0].title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-8">{articles[0].excerpt}</p>
            <div>
              <span className="text-xs font-bold text-[#0f1c2e] uppercase tracking-wider border-b border-[#0f1c2e] pb-1 group-hover:border-[#8b6e45] group-hover:text-[#8b6e45] transition-colors">READ MORE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.slice(1).map(article => (
          <div key={article.id} className="group cursor-pointer bg-white rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="h-60 overflow-hidden rounded-t-sm">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-[10px] font-bold text-[#8b6e45] uppercase tracking-wider">{article.category}</span>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-400">{article.date}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#0f1c2e] mb-3 group-hover:text-[#8b6e45] transition-colors line-clamp-2">{article.title}</h3>
              <p className="text-sm text-gray-600 mb-6 line-clamp-3">{article.excerpt}</p>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-[#0f1c2e] transition-colors">READ MORE</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-16">
        <button className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#8b6e45] hover:text-[#8b6e45] rounded-sm transition-colors">
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        <button className="w-10 h-10 border border-[#8b6e45] bg-[#8b6e45] flex items-center justify-center text-white font-medium rounded-sm">1</button>
        <button className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#8b6e45] hover:text-[#8b6e45] rounded-sm transition-colors">2</button>
        <button className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#8b6e45] hover:text-[#8b6e45] rounded-sm transition-colors">3</button>
        <button className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#8b6e45] hover:text-[#8b6e45] rounded-sm transition-colors">
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>

    </div>
  );
}
