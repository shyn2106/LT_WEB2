import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  // Nhận dữ liệu truyền từ trang RoomDetail
  const bookingData = location.state || { 
    room: { id: 1, typeName: 'Grand Heritage Suite', price: 4500000 }, 
    checkIn: '2024-10-12', 
    checkOut: '2024-10-15',
    nights: 3
  };
  const { room, checkIn, checkOut, nights } = bookingData;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CARD');

  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  React.useEffect(() => {
    fetch('http://localhost:8080/api/services')
      .then(res => res.json())
      .then(data => setAvailableServices(data))
      .catch(err => console.error("Error fetching services:", err));
  }, []);

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const servicesTotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const roomTotal = room.price * nights;
  const subTotal = roomTotal + servicesTotal;
  const tax = subTotal * 0.05;
  const grandTotal = subTotal + tax;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Lấy thông tin user (chứa JWT token) từ localStorage
    const userStr = localStorage.getItem('user');
    let userId = null;
    let token = '';
    if (userStr) {
      const user = JSON.parse(userStr);
      userId = user.id; // Lấy ID của User đang đăng nhập
      token = user.token || user.accessToken || ''; // Tùy thuộc vào cấu trúc trả về từ backend (JwtResponse)
    }

    const bookingPayload = {
      user: { id: userId }, // Gán user ID thật
      customer: { fullName: formData.name, email: formData.email, phone: formData.phone }, // Gửi kèm thông tin người đặt
      room: { id: room.id }, // Dùng ID phòng thật
      checkInDate: checkIn,
      checkOutDate: checkOut,
      status: "PENDING",
      services: selectedServices.map(s => ({ id: s.id }))
    };

    fetch('http://localhost:8080/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(bookingPayload)
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Có lỗi xảy ra khi đặt phòng, vui lòng thử lại.");
      }
    })
    .then(data => {
      if (paymentMethod === 'VNPAY') {
        fetch(`http://localhost:8080/api/payment/create_payment?amount=${grandTotal}&bookingId=${data.id}`)
          .then(res => res.json())
          .then(paymentData => {
            if (paymentData.status === 'ok' && paymentData.url) {
              window.location.href = paymentData.url;
            } else {
              alert("Lỗi khi tạo liên kết thanh toán VNPAY");
              setIsSubmitting(false);
            }
          })
          .catch(err => {
            console.error(err);
            alert("Lỗi khi kết nối đến server thanh toán.");
            setIsSubmitting(false);
          });
      } else {
        setSuccess(true);
        setIsSubmitting(false);
      }
    })
    .catch(err => {
      console.error(err);
      alert(err.message || "Lỗi kết nối tới Server.");
      setIsSubmitting(false);
    });
  };

  if (success) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-center">
        <span className="material-symbols-outlined text-6xl text-green-500 mb-4">check_circle</span>
        <h2 className="text-3xl font-serif font-bold text-[#0f1c2e] mb-2">Đặt phòng thành công!</h2>
        <p className="text-gray-500 mb-8">Cảm ơn {formData.name} đã lựa chọn Lumière Grand.</p>
        <button onClick={() => window.location.href = '/'} className="bg-[#8b6e45] text-white px-8 py-3 text-sm font-semibold">Trở về trang chủ</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-12 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#0f1c2e] mb-2">Hoàn tất đặt phòng</h1>
          <p className="text-gray-500 text-sm">Chỉ còn một bước nữa để bắt đầu kỳ nghỉ tuyệt vời của bạn.</p>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Bạn cần hỗ trợ? </span>
          <span className="font-bold text-[#0f1c2e] border-b border-[#0f1c2e] pb-1">+84 24 1234 5678</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-12">
          
          <form onSubmit={handleSubmit}>
            {/* Section 1 */}
            <section className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#0f1c2e] text-white flex items-center justify-center font-bold">1</div>
                <h2 className="text-xl font-serif font-bold text-[#0f1c2e]">Thông tin khách hàng</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Họ và tên</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nguyễn Văn A" className="w-full border border-gray-300 rounded-sm py-3 px-4 text-sm focus:outline-none focus:border-[#8b6e45]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="example@email.com" className="w-full border border-gray-300 rounded-sm py-3 px-4 text-sm focus:outline-none focus:border-[#8b6e45]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Số điện thoại</label>
                  <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+84 ..." className="w-full border border-gray-300 rounded-sm py-3 px-4 text-sm focus:outline-none focus:border-[#8b6e45]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Yêu cầu đặc biệt (không bắt buộc)</label>
                  <textarea rows="4" value={formData.requests} onChange={e => setFormData({...formData, requests: e.target.value})} placeholder="VD: Giường phụ, nhận phòng sớm..." className="w-full border border-gray-300 rounded-sm py-3 px-4 text-sm focus:outline-none focus:border-[#8b6e45] resize-none"></textarea>
                </div>
              </div>
            </section>

            {/* Section 2: Services */}
            <section className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#0f1c2e] text-white flex items-center justify-center font-bold">2</div>
                <h2 className="text-xl font-serif font-bold text-[#0f1c2e]">Dịch vụ nâng tầm trải nghiệm</h2>
              </div>
              
              <div className="pl-11 grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableServices.length > 0 ? availableServices.map(service => {
                  const isSelected = selectedServices.some(s => s.id === service.id);
                  return (
                    <div 
                      key={service.id} 
                      onClick={() => handleServiceToggle(service)}
                      className={`border rounded-sm p-4 cursor-pointer transition-colors ${isSelected ? 'border-[#8b6e45] bg-[#8b6e45]/5' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" checked={isSelected} readOnly className="w-4 h-4 text-[#8b6e45] focus:ring-[#8b6e45] accent-[#8b6e45]" />
                          <span className="font-bold text-[#0f1c2e] text-sm">{service.serviceName || service.name}</span>
                        </div>
                        <span className="text-[#8b6e45] font-bold text-sm">+{new Intl.NumberFormat('vi-VN').format(service.price)}đ</span>
                      </div>
                      <p className="text-xs text-gray-500 ml-7">{service.description}</p>
                    </div>
                  );
                }) : (
                  <div className="text-sm text-gray-500">Đang tải dịch vụ...</div>
                )}
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#0f1c2e] text-white flex items-center justify-center font-bold">3</div>
                <h2 className="text-xl font-serif font-bold text-[#0f1c2e]">Phương thức thanh toán</h2>
              </div>
              
              <div className="pl-11 space-y-6">
                {/* Credit Card Option */}
                <div 
                  className={`border rounded-sm p-6 bg-white relative cursor-pointer transition-colors ${paymentMethod === 'CARD' ? 'border-[#8b6e45]' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setPaymentMethod('CARD')}
                >
                  <div className="absolute top-6 left-6">
                    <input type="radio" name="payment" checked={paymentMethod === 'CARD'} readOnly className="w-4 h-4 text-[#8b6e45] focus:ring-[#8b6e45] accent-[#8b6e45]" />
                  </div>
                  <div className="pl-8">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="material-symbols-outlined text-[#8b6e45]">credit_card</span>
                      <span className="font-bold text-[#0f1c2e] text-sm">Thẻ Tín dụng / Ghi nợ</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-6 uppercase tracking-wider">VISA, MASTERCARD, AMEX</div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Số thẻ</label>
                        <div className="relative">
                          <input type="text" placeholder="0000 0000 0000 0000" className="w-full border border-gray-300 rounded-sm py-3 px-4 text-sm focus:outline-none focus:border-[#8b6e45]" />
                          <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400">lock</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Hạn dùng (MM/YY)</label>
                          <input type="text" placeholder="MM/YY" className="w-full border border-gray-300 rounded-sm py-3 px-4 text-sm focus:outline-none focus:border-[#8b6e45]" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">CVC/CVV</label>
                          <input type="text" placeholder="123" className="w-full border border-gray-300 rounded-sm py-3 px-4 text-sm focus:outline-none focus:border-[#8b6e45]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VNPAY Option */}
                <div 
                  className={`border rounded-sm p-6 bg-white relative cursor-pointer transition-colors ${paymentMethod === 'VNPAY' ? 'border-[#8b6e45]' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setPaymentMethod('VNPAY')}
                >
                  <div className="absolute top-6 left-6">
                    <input type="radio" name="payment" checked={paymentMethod === 'VNPAY'} readOnly className="w-4 h-4 text-[#8b6e45] focus:ring-[#8b6e45] accent-[#8b6e45]" />
                  </div>
                  <div className="pl-8">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="material-symbols-outlined text-gray-600">account_balance</span>
                      <span className="font-bold text-[#0f1c2e] text-sm">Thanh toán qua VNPAY</span>
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">QUÉT MÃ QR HOẶC NHẬP TAY</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-[#f8f9fa] p-4 rounded-sm border border-gray-200">
                  <span className="material-symbols-outlined text-green-600">verified_user</span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Dữ liệu của bạn được mã hóa hoàn toàn. Chúng tôi cam kết bảo mật thông tin thanh toán theo tiêu chuẩn quốc tế PCI DSS.
                  </p>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={isSubmitting} className="bg-[#8b6e45] text-white px-10 py-4 text-sm font-semibold tracking-wider hover:bg-[#735936] transition-colors rounded-sm w-full md:w-auto disabled:opacity-50">
                    {isSubmitting ? 'Đang xử lý...' : 'Xác nhận & Thanh toán'}
                  </button>
                  <p className="text-xs text-gray-400 mt-4">
                    BẰNG CÁCH NHẤP VÀO NÚT TRÊN, BẠN ĐỒNG Ý VỚI CÁC <a href="#" className="underline">ĐIỀU KHOẢN DỊCH VỤ</a> CỦA CHÚNG TÔI.
                  </p>
                </div>
              </div>
            </section>
          </form>

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 sticky top-8">
            <h3 className="text-xl font-serif font-bold text-[#0f1c2e] mb-6">Tóm tắt đơn hàng</h3>
            
            <div className="flex space-x-4 mb-6 pb-6 border-b border-gray-100">
              <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=150&q=80" alt="Room" className="w-20 h-20 object-cover rounded-sm" />
              <div>
                <div className="text-[10px] text-[#8b6e45] font-bold uppercase tracking-wider mb-1">PHÒNG NGHỈ</div>
                <h4 className="font-serif font-bold text-[#0f1c2e] text-lg mb-1">{room.typeName}</h4>
                <div className="text-[#8b6e45] text-xs">★★★★★</div>
              </div>
            </div>

            <div className="space-y-4 text-sm mb-6 pb-6 border-b border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Thời gian lưu trú</span>
                <span className="font-bold text-[#0f1c2e]">{nights} Đêm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nhận phòng</span>
                <span className="text-gray-900">{checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Trả phòng</span>
                <span className="text-gray-900">{checkOut}</span>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-6 pb-6 border-b border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Giá phòng ({nights} đêm)</span>
                <span>{new Intl.NumberFormat('vi-VN').format(roomTotal)} đ</span>
              </div>
              {selectedServices.length > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Dịch vụ thêm ({selectedServices.length})</span>
                  <span>{new Intl.NumberFormat('vi-VN').format(servicesTotal)} đ</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Phí dịch vụ & Thuế (5%)</span>
                <span>{new Intl.NumberFormat('vi-VN').format(tax)} đ</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">TỔNG CỘNG</span>
                <span className="text-[10px] text-gray-400 italic">Đã bao gồm VAT</span>
              </div>
              <div className="text-2xl font-serif font-bold text-[#0f1c2e]">{new Intl.NumberFormat('vi-VN').format(grandTotal)} đ</div>
            </div>

            <div className="flex items-start space-x-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-sm">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>Chính sách hủy phòng: Miễn phí hủy trước 48 giờ.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
