import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Properties() {
  const [searchParams] = useSearchParams();
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('SORT: FEATURED');
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    let url = 'http://localhost:8080/api/room-types';
    if (checkIn && checkOut) {
      url = `http://localhost:8080/api/room-types/available?checkIn=${checkIn}&checkOut=${checkOut}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        // Map backend data to frontend format, adding fallback images
        const formattedData = data.map((item, index) => {
          // Placeholder images based on index
          const fallbackImages = [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ];
          return {
            id: item.id,
            name: item.typeName,
            description: item.description || 'Trải nghiệm không gian nghỉ dưỡng tuyệt vời với các tiện ích hiện đại.',
            size: item.size || '45 SQM',
            guests: `${item.capacity} GUESTS`,
            bed: 'KING SIZE', // Hardcoded
            price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price || 0),
            rawPrice: item.price || 0, // Dùng để sort
            image: item.imageUrl || fallbackImages[index % fallbackImages.length],
            tag: index === 0 ? 'MOST POPULAR' : null,
            stars: 5,
            isCompact: index > 1
          };
        });
        setRooms(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching room types:', err);
        setLoading(false);
      });
  }, []);

  const handleTypeToggle = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Logic Lọc và Sắp xếp
  let filteredRooms = [...rooms];
  
  if (selectedTypes.length > 0) {
    filteredRooms = filteredRooms.filter(r => selectedTypes.includes(r.name));
  }

  if (sortOption === 'PRICE: LOW TO HIGH') {
    filteredRooms.sort((a, b) => a.rawPrice - b.rawPrice);
  } else if (sortOption === 'PRICE: HIGH TO LOW') {
    filteredRooms.sort((a, b) => b.rawPrice - a.rawPrice);
  }

  const uniqueTypes = [...new Set(rooms.map(r => r.name))];

  return (
    <div className="max-w-7xl mx-auto px-12 py-12">
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end">
        <div>
          <h4 className="text-xs font-bold text-[#8b6e45] tracking-widest uppercase mb-3">Exclusive Stays</h4>
          <h1 className="text-5xl font-serif font-bold text-[#0f1c2e] mb-4">Your Private Sanctuary</h1>
          <p className="text-gray-600">
            Discover available suites and rooms meticulously prepared for your arrival in <strong>Saigon</strong>
            <br /> 
            {checkIn && checkOut ? (
              <span>from <strong>{checkIn}</strong> to <strong>{checkOut}</strong>.</span>
            ) : (
              <span>Vui lòng chọn ngày để kiểm tra phòng trống.</span>
            )}
          </p>
        </div>
        <div className="flex space-x-4 mt-6 md:mt-0">
          <button className="border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50 flex items-center space-x-2">
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>FILTER</span>
          </button>
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50 bg-white outline-none cursor-pointer"
          >
            <option>SORT: FEATURED</option>
            <option>PRICE: LOW TO HIGH</option>
            <option>PRICE: HIGH TO LOW</option>
          </select>
        </div>
      </div>

      <hr className="border-gray-200 mb-12" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-10 pr-4">
          
          {/* Price Range */}
          <div>
            <h3 className="text-sm font-bold border-l-2 border-[#8b6e45] pl-3 mb-6">Price Range</h3>
            <div className="relative h-1 bg-gray-200 rounded-full mb-4">
              <div className="absolute top-0 left-0 w-2/3 h-full bg-[#8b6e45] rounded-full"></div>
              <div className="absolute top-1/2 left-2/3 w-4 h-4 bg-[#8b6e45] rounded-full -translate-y-1/2 -translate-x-1/2 border-2 border-white shadow"></div>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>$200</span>
              <span>$2000+</span>
            </div>
          </div>

          {/* Room Type */}
          <div>
            <h3 className="text-sm font-bold border-l-2 border-[#8b6e45] pl-3 mb-6">Room Type</h3>
            <div className="space-y-4">
              {uniqueTypes.map(type => (
                <label key={type} className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeToggle(type)}
                    className="w-4 h-4 border-gray-300 text-[#0f1c2e] focus:ring-[#0f1c2e] accent-[#0f1c2e]" 
                  />
                  <span className={`text-sm ${selectedTypes.includes(type) ? 'font-medium text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>{type}</span>
                </label>
              ))}
              {uniqueTypes.length === 0 && <span className="text-xs text-gray-400">Đang tải...</span>}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-sm font-bold border-l-2 border-[#8b6e45] pl-3 mb-6">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-xs border border-gray-300 text-gray-600 hover:border-gray-400">PRIVATE POOL</button>
              <button className="px-3 py-1 text-xs bg-[#0f1c2e] text-white border border-[#0f1c2e]">BUTLER SERVICE</button>
              <button className="px-3 py-1 text-xs border border-gray-300 text-gray-600 hover:border-gray-400">OCEAN VIEW</button>
              <button className="px-3 py-1 text-xs border border-gray-300 text-gray-600 hover:border-gray-400">WINE CELLAR</button>
            </div>
          </div>

        </div>

        {/* Room List */}
        <div className="lg:col-span-3 space-y-12">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b6e45]"></div>
            </div>
          ) : (
            <>
              {filteredRooms.length === 0 && (
                <div className="text-center text-gray-500 py-12 border border-gray-100 bg-gray-50 rounded-sm">
                  Không tìm thấy phòng nào phù hợp với bộ lọc.
                </div>
              )}
              {filteredRooms.map(room => (
            room.isCompact ? null : (
              <div key={room.id} className="grid grid-cols-1 md:grid-cols-2 bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-64 md:h-full min-h-[300px]">
                  {room.tag && (
                    <div className="absolute top-4 left-4 bg-[#0f1c2e]/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 uppercase tracking-wider z-10">
                      {room.tag}
                    </div>
                  )}
                  <img src={room.image} alt={room.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="p-8 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-serif font-bold text-[#0f1c2e]">{room.name}</h2>
                    <div className="text-[#8b6e45] text-xs flex">
                      {Array(room.stars).fill('★').join('')}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-8 leading-relaxed flex-grow">{room.description}</p>
                  
                  <div className="flex items-center space-x-6 text-xs text-gray-500 mb-8">
                    {room.size && <div className="flex items-center"><span className="material-symbols-outlined text-base mr-1">square_foot</span>{room.size}</div>}
                    {room.guests && <div className="flex items-center"><span className="material-symbols-outlined text-base mr-1">group</span>{room.guests}</div>}
                    {room.bed && <div className="flex items-center"><span className="material-symbols-outlined text-base mr-1">bed</span>{room.bed}</div>}
                  </div>

                  <div className="flex justify-between items-end border-t border-gray-100 pt-6">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Per Night</div>
                      <div className="text-3xl font-serif text-[#0f1c2e]">{room.price}</div>
                    </div>
                    <Link to={`/room/${room.id}${checkIn && checkOut ? `?checkIn=${checkIn}&checkOut=${checkOut}` : ''}`} className="bg-[#0f1c2e] text-white px-8 py-3 text-sm font-semibold tracking-wider hover:bg-[#8b6e45] transition-colors">
                      BOOK NOW
                    </Link>
                  </div>
                </div>
              </div>
            )
          ))}

          {/* Compact Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {filteredRooms.filter(r => r.isCompact).map(room => (
              <Link to={`/room/${room.id}${checkIn && checkOut ? `?checkIn=${checkIn}&checkOut=${checkOut}` : ''}`} key={room.id} className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer block">
                <div className="h-48 overflow-hidden">
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-[#0f1c2e] mb-2">{room.name}</h3>
                  <p className="text-sm text-gray-600 mb-6 line-clamp-2">{room.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-serif text-[#0f1c2e]">{room.price}</span>
                    <span className="text-xs font-bold text-[#8b6e45] uppercase tracking-wider group-hover:underline">DETAILS</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
