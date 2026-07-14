import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);
    setFormData({
      fullName: userData.fullName || '',
      email: userData.email || '',
      phone: userData.phone || ''
    });
    const token = userData.token || userData.accessToken || '';

    fetch(`https://ltweb2-production.up.railway.app/api/bookings/user/${userData.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bookings:', err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#8b6e45]"></div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    const token = user.token || user.accessToken || '';
    fetch(`https://ltweb2-production.up.railway.app/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone
      })
    })
    .then(res => {
      if (res.ok) return res.json();
      throw new Error('Update failed');
    })
    .then(updatedUser => {
      // Cập nhật lại localStorage để phiên đăng nhập hiện tại ghi nhớ
      const newUser = { ...user, fullName: updatedUser.fullName, email: updatedUser.email, phone: updatedUser.phone };
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setIsEditing(false);
      alert('Cập nhật hồ sơ thành công!');
    })
    .catch(err => {
      console.error(err);
      alert('Đã xảy ra lỗi khi cập nhật hồ sơ.');
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    return nights === 0 ? 1 : nights;
  };

  const calculateTotal = (booking) => {
    const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
    const roomPrice = booking.room?.roomType?.price || 0;
    
    let servicesTotal = 0;
    if (booking.services && booking.services.length > 0) {
      servicesTotal = booking.services.reduce((sum, s) => sum + (s.price || 0), 0);
    }
    
    const subTotal = roomPrice * nights + servicesTotal;
    const tax = subTotal * 0.05;
    return subTotal + tax;
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING': return <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 font-bold rounded-full">CHỜ XÁC NHẬN</span>;
      case 'CONFIRMED': return <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 font-bold rounded-full">ĐÃ XÁC NHẬN</span>;
      case 'COMPLETED': return <span className="bg-green-100 text-green-700 text-xs px-3 py-1 font-bold rounded-full">HOÀN THÀNH</span>;
      case 'CANCELLED': return <span className="bg-red-100 text-red-700 text-xs px-3 py-1 font-bold rounded-full">ĐÃ HỦY</span>;
      default: return <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-12 py-12 min-h-[70vh]">
      <h1 className="text-3xl font-serif font-bold text-[#0f1c2e] mb-8">Hồ sơ cá nhân</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Column: User Info */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-[#0f1c2e] text-white rounded-full flex items-center justify-center text-4xl font-bold font-serif mb-4">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-[#0f1c2e]">{user?.username}</h2>
              <p className="text-xs text-[#8b6e45] uppercase tracking-wider mt-1">{user?.roles || 'CUSTOMER'}</p>
            </div>
            
            <hr className="border-gray-100 mb-6" />
            
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 w-1/3">Họ và tên:</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    className="w-2/3 border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#8b6e45]" 
                    value={formData.fullName} 
                    onChange={e => setFormData({...formData, fullName: e.target.value})} 
                  />
                ) : (
                  <span className={user?.fullName ? "font-medium" : "text-gray-400 italic"}>
                    {user?.fullName || "Chưa cập nhật"}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 w-1/3">Email:</span>
                {isEditing ? (
                  <input 
                    type="email" 
                    className="w-2/3 border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#8b6e45]" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                ) : (
                  <span className={user?.email ? "" : "text-gray-400 italic"}>
                    {user?.email || "Chưa cập nhật"}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 w-1/3">Điện thoại:</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    className="w-2/3 border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#8b6e45]" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                ) : (
                  <span className={user?.phone ? "" : "text-gray-400 italic"}>
                    {user?.phone || "Chưa cập nhật"}
                  </span>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <div className="mt-8 flex space-x-2">
                <button 
                  onClick={handleSaveProfile}
                  className="flex-1 bg-[#0f1c2e] text-white py-2.5 text-sm font-semibold rounded hover:bg-[#8b6e45] transition-colors"
                >
                  LƯU
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 text-sm font-semibold rounded hover:bg-gray-50 transition-colors"
                >
                  HỦY
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full mt-8 border border-gray-300 text-gray-700 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                CHỈNH SỬA HỒ SƠ
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Bookings */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-serif font-bold text-[#0f1c2e]">Lịch sử đặt phòng</h2>
            <span className="text-sm text-gray-500">{bookings.length} chuyến đi</span>
          </div>
          
          {bookings.length === 0 ? (
            <div className="bg-gray-50 p-12 text-center text-gray-500 border border-gray-100 rounded-sm">
              <span className="material-symbols-outlined text-4xl mb-4 text-gray-300">luggage</span>
              <p>Bạn chưa có chuyến đi nào cùng LUMIÈRE GRAND.</p>
              <button onClick={() => navigate('/properties')} className="mt-4 text-[#8b6e45] font-bold hover:underline">
                Khám phá và Đặt phòng ngay
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
                  {/* Thumbnail Image */}
                  <div className="w-full sm:w-48 h-32 sm:h-auto bg-gray-200 flex-shrink-0 relative">
                    <img 
                      src={booking.room?.roomType?.imageUrl || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80"} 
                      alt="Room" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-2 left-2">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-xs text-gray-400 font-bold tracking-wider uppercase">
                          Mã Booking: #{booking.id}
                        </div>
                      </div>
                      <h3 className="font-serif font-bold text-lg text-[#0f1c2e] mb-2">
                        {booking.room?.roomType?.typeName || 'Phòng nghỉ Tiêu chuẩn'}
                        {booking.room?.roomNumber && <span className="text-gray-500 text-sm ml-2">(Phòng {booking.room.roomNumber})</span>}
                      </h3>
                      <div className="text-sm text-gray-600 flex items-center mb-1">
                        <span className="material-symbols-outlined text-sm mr-2 text-[#8b6e45]">calendar_month</span>
                        <span>
                          {new Date(booking.checkInDate).toLocaleDateString('vi-VN')} 
                          <span className="mx-2 text-gray-300">→</span> 
                          {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="ml-3 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          {calculateNights(booking.checkInDate, booking.checkOutDate)} đêm
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50">
                      <div>
                        <span className="text-xs text-gray-500 block mb-0.5">Tổng thanh toán</span>
                        <span className="font-bold text-[#8b6e45] text-lg">{formatPrice(calculateTotal(booking))}</span>
                      </div>
                      <Link 
                        to={`/booking/${booking.id}`}
                        className="text-sm font-semibold text-[#0f1c2e] hover:text-[#8b6e45] flex items-center group"
                      >
                        CHI TIẾT <span className="material-symbols-outlined text-base ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
