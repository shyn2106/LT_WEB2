import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

export default function RoomDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || "");
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || "");

  const calculateNights = (start, end) => {
    if (!start || !end) return 3; // Mặc định 3 đêm nếu có lỗi
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 ? diffDays : 1; // Ít nhất 1 đêm
  };

  const nights = calculateNights(checkIn, checkOut);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no ID is provided, fetch ID 1 as default for demo purposes
    const fetchId = id || 1;
    fetch(`http://localhost:8080/api/room-types/${fetchId}`)
      .then(res => res.json())
      .then(data => {
        setRoom(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching room detail:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b6e45]"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Không tìm thấy thông tin phòng.
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };
  return (
    <div className="max-w-7xl mx-auto px-12 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 flex items-center space-x-2">
        <Link to="/" className="hover:text-[#8b6e45]">Trang chủ</Link>
        <span>›</span>
        <Link to="/properties" className="hover:text-[#8b6e45]">Phòng nghỉ</Link>
        <span>›</span>
        <span className="text-gray-900 font-medium">{room.typeName}</span>
      </div>

      {/* Title & Meta */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#0f1c2e] mb-4">{room.typeName}</h1>
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center text-[#8b6e45]">
            <span className="text-lg">★★★★☆</span>
            <span className="ml-2 text-gray-600">(48 Đánh giá)</span>
          </div>
          <div className="flex items-center">
            <span className="material-symbols-outlined mr-2 text-gray-400">square_foot</span>
            {room.size || '45 m²'}
          </div>
          <div className="flex items-center">
            <span className="material-symbols-outlined mr-2 text-gray-400">group</span>
            {room.capacity} Khách
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-16">
        <div className="md:col-span-8 bg-gray-200 overflow-hidden h-[300px] md:h-[500px] rounded-lg">
          <img src={room.imageUrl || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} alt="Room Main" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="md:col-span-4 grid grid-cols-1 grid-rows-3 gap-4 h-[500px] hidden md:grid">
          <div className="bg-gray-200 overflow-hidden rounded-lg min-h-0">
            <img src="https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Detail 1" className="w-full h-full object-cover" />
          </div>
          <div className="bg-gray-200 overflow-hidden rounded-lg min-h-0">
            <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Detail 2" className="w-full h-full object-cover" />
          </div>
          <div className="bg-gray-200 relative cursor-pointer overflow-hidden group rounded-lg min-h-0">
            <img src="https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Detail 3" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#0f1c2e]/80 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-3xl mb-2">grid_view</span>
              <span className="text-sm font-medium">Xem tất cả</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Description */}
          <section>
            <h2 className="text-2xl font-serif text-[#0f1c2e] mb-6">Mô tả phòng</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>{room.description || 'Trải nghiệm không gian nghỉ dưỡng tuyệt vời với các tiện ích hiện đại. Căn phòng được thiết kế theo phong cách tối giản nhưng sang trọng.'}</p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Amenities */}
          <section>
            <h2 className="text-2xl font-serif text-[#0f1c2e] mb-6">Tiện nghi cao cấp</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { icon: 'ac_unit', title: 'Điều hòa', desc: 'Kiểm soát nhiệt độ' },
                { icon: 'kitchen', title: 'Minibar', desc: 'Đồ uống cao cấp' },
                { icon: 'balcony', title: 'Ban công riêng', desc: 'Hướng đại dương' },
                { icon: 'wifi', title: 'WiFi Miễn phí', desc: 'Tốc độ cao' },
                { icon: 'tv', title: 'Smart TV', desc: 'Dịch vụ giải trí' },
                { icon: 'shower', title: 'Phòng tắm', desc: 'Vòi sen & Bồn tắm' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="bg-gray-50 p-3 rounded-full text-gray-500">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Reviews */}
          <section>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-serif text-[#0f1c2e] mb-2">Đánh giá từ khách hàng</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-serif">4.9</span>
                  <div>
                    <div className="text-[#8b6e45] text-sm">★★★★★</div>
                    <div className="text-xs text-gray-500">Dựa trên 48 nhận xét</div>
                  </div>
                </div>
              </div>
              <button className="border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
                VIẾT ĐÁNH GIÁ
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Nguyễn Hoàng', date: 'Tháng 9, 2024', content: '"Tầm nhìn từ ban công thật sự tuyệt vời, đặc biệt là lúc bình minh. Phòng ốc sạch sẽ, dịch vụ minibar đa dạng. Chắc chắn sẽ quay lại!"', initials: 'NH' },
                { name: 'Minh Lan', date: 'Tháng 8, 2024', content: '"Phòng thiết kế rất sang trọng, các tiện ích trong phòng đều rất hiện đại. Đội ngũ nhân viên hỗ trợ nhiệt tình. 10/10 điểm cho sự yên tĩnh."', initials: 'ML', bg: 'bg-[#fed488] text-[#785a1a]' }
              ].map((rev, idx) => (
                <div key={idx} className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${rev.bg || 'bg-blue-100 text-blue-800'}`}>
                        {rev.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{rev.name}</div>
                        <div className="text-xs text-gray-400">{rev.date}</div>
                      </div>
                    </div>
                    <div className="text-[#8b6e45] text-xs">★★★★★</div>
                  </div>
                  <p className="text-sm text-gray-600 italic">{rev.content}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button className="text-sm font-medium border-b border-gray-900 pb-1 hover:text-[#8b6e45] hover:border-[#8b6e45] transition-colors">
                XEM THÊM ĐÁNH GIÁ
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white p-8 rounded-lg shadow-xl border border-gray-100">
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-1">Giá từ</div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-serif font-bold text-[#0f1c2e]">{formatPrice(room.price)}</span>
                <span className="text-gray-500 text-sm">/đêm</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Ngày nhận phòng</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border border-gray-300 rounded-sm py-3 px-4 text-sm focus:outline-none focus:border-[#8b6e45] cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Ngày trả phòng</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border border-gray-300 rounded-sm py-3 px-4 text-sm focus:outline-none focus:border-[#8b6e45] cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Khách</label>
                <select className="w-full border border-gray-300 rounded-sm py-3 px-4 text-sm appearance-none focus:outline-none focus:border-[#8b6e45] bg-white cursor-pointer">
                  <option>{room.capacity} Khách</option>
                  <option>1 Người lớn</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-6 mb-6">
              {checkIn && checkOut ? (
                <>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatPrice(room.price)} x {nights} đêm</span>
                    <span>{formatPrice((room.price || 0) * nights)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Phí dịch vụ (5%)</span>
                    <span>{formatPrice((room.price || 0) * nights * 0.05)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#0f1c2e] pt-2 border-t border-gray-100">
                    <span>Tổng thanh toán</span>
                    <span>{formatPrice((room.price || 0) * nights * 1.05)}</span>
                  </div>
                </>
              ) : (
                <div className="text-sm text-red-500 text-center font-medium py-2">
                  Vui lòng chọn ngày nhận và trả phòng
                </div>
              )}
            </div>

            <Link 
              to="/checkout" 
              state={{ room: room, checkIn: checkIn, checkOut: checkOut, nights: nights }} 
              className={`block w-full text-white text-center py-4 font-semibold tracking-wider transition-colors rounded-sm ${(!checkIn || !checkOut) ? 'bg-gray-400 pointer-events-none' : 'bg-[#8b6e45] hover:bg-[#735936]'}`}
            >
              ĐẶT PHÒNG NGAY
            </Link>
            <p className="text-center text-xs text-gray-400 mt-4">Bạn sẽ chưa bị trừ tiền ở bước này</p>
          </div>
        </div>

      </div>
    </div>
  );
}
