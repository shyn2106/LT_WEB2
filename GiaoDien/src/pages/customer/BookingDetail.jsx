import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const token = JSON.parse(userStr).token || JSON.parse(userStr).accessToken || '';

    fetch(`http://localhost:8080/api/bookings/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Không tìm thấy Booking');
        return res.json();
      })
      .then(data => {
        setBooking(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#8b6e45]"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Không tìm thấy đơn đặt phòng</h2>
        <p className="text-gray-500 mb-6">Đơn đặt phòng này không tồn tại hoặc bạn không có quyền xem.</p>
        <Link to="/profile" className="text-[#8b6e45] hover:underline">Quay lại Hồ sơ</Link>
      </div>
    );
  }

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
      case 'PENDING': return <span className="bg-yellow-100 text-yellow-700 text-sm px-4 py-1.5 font-bold rounded-full">CHỜ XÁC NHẬN</span>;
      case 'CONFIRMED': return <span className="bg-blue-100 text-blue-700 text-sm px-4 py-1.5 font-bold rounded-full">ĐÃ XÁC NHẬN</span>;
      case 'COMPLETED': return <span className="bg-green-100 text-green-700 text-sm px-4 py-1.5 font-bold rounded-full">HOÀN THÀNH</span>;
      case 'CANCELLED': return <span className="bg-red-100 text-red-700 text-sm px-4 py-1.5 font-bold rounded-full">ĐÃ HỦY</span>;
      default: return <span className="bg-gray-100 text-gray-700 text-sm px-4 py-1.5 font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 min-h-[70vh]">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-8 flex items-center space-x-2">
        <Link to="/profile" className="hover:text-[#8b6e45] flex items-center">
          <span className="material-symbols-outlined text-sm mr-1">arrow_back</span>
          Quay lại Hồ sơ
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50">
          <div>
            <div className="text-sm text-gray-400 font-bold tracking-wider uppercase mb-2">Hóa đơn Dịch vụ</div>
            <h1 className="text-3xl font-serif font-bold text-[#0f1c2e]">Chi tiết Đơn đặt phòng #{booking.id}</h1>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            {getStatusBadge(booking.status)}
            <div className="text-sm text-gray-500 mt-3">Ngày tạo: {new Date().toLocaleDateString('vi-VN')}</div>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Hotel Info */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-l-2 border-[#8b6e45] pl-3">Khách sạn cung cấp</h4>
              <div className="text-gray-600 space-y-1">
                <p className="font-bold text-gray-900 text-lg">LUMIÈRE GRAND HOTEL</p>
                <p>123 Đại lộ Nguyễn Huệ, Quận 1</p>
                <p>Thành phố Hồ Chí Minh, Việt Nam</p>
                <p>Hotline: 1900 1000</p>
                <p>Email: contact@lumieregrand.com</p>
              </div>
            </div>

            {/* Customer Info */}
            {booking.customer && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-l-2 border-[#8b6e45] pl-3">Thông tin Khách lưu trú</h4>
                <div className="bg-gray-50 p-5 rounded border border-gray-100 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-gray-400 text-xs uppercase mb-1">Họ và Tên</span>
                      <span className="font-medium text-gray-900 text-base">{booking.customer.fullName}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-xs uppercase mb-1">Căn cước / Passport</span>
                      <span className="font-medium text-gray-900">{booking.customer.identityNumber}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-xs uppercase mb-1">Số điện thoại</span>
                      <span className="font-medium text-gray-900">{booking.customer.phoneNumber}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 text-xs uppercase mb-1">Email</span>
                      <span className="font-medium text-gray-900">{booking.customer.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Service Details */}
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-l-2 border-[#8b6e45] pl-3">Bảng Kê Chi Tiết</h4>
          <div className="border border-gray-200 rounded-sm overflow-hidden mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr className="text-left">
                  <th className="py-4 px-6 font-semibold">Hạng mục</th>
                  <th className="py-4 px-6 font-semibold text-right">Đơn giá</th>
                  <th className="py-4 px-6 font-semibold text-right">Số lượng</th>
                  <th className="py-4 px-6 font-semibold text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="text-gray-900">
                <tr className="border-b border-gray-100">
                  <td className="py-6 px-6">
                    <span className="font-bold text-base text-[#0f1c2e]">{booking.room?.roomType?.typeName || 'Phòng Standard'}</span>
                    {booking.room?.roomNumber && <span className="text-xs bg-gray-100 px-2 py-0.5 ml-2 rounded text-gray-600 border border-gray-200">Phòng {booking.room.roomNumber}</span>}
                    <div className="text-sm text-gray-500 mt-2 flex items-center">
                      <span className="material-symbols-outlined text-sm mr-1">event</span>
                      Nhận phòng: <strong className="mx-1 text-gray-700">{booking.checkInDate}</strong>
                      <span className="mx-2">|</span> 
                      Trả phòng: <strong className="ml-1 text-gray-700">{booking.checkOutDate}</strong>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-right font-medium text-gray-600">{formatPrice(booking.room?.roomType?.price)}</td>
                  <td className="py-6 px-6 text-right text-gray-600">{calculateNights(booking.checkInDate, booking.checkOutDate)} đêm</td>
                  <td className="py-6 px-6 text-right font-bold text-gray-900">
                    {formatPrice((booking.room?.roomType?.price || 0) * calculateNights(booking.checkInDate, booking.checkOutDate))}
                  </td>
                </tr>
                {/* Additional Services */}
                {booking.services && booking.services.length > 0 && (
                  <tr>
                    <td colSpan="4" className="py-3 px-6 bg-gray-50 text-xs font-bold text-gray-500 uppercase">Dịch vụ phát sinh</td>
                  </tr>
                )}
                {booking.services && booking.services.map((svc, idx) => (
                  <tr key={idx} className="border-b border-gray-50">
                    <td className="py-4 px-6">
                      <span className="text-gray-700 font-medium">+ {svc.serviceName}</span>
                    </td>
                    <td className="py-4 px-6 text-right text-gray-600">{formatPrice(svc.price)}</td>
                    <td className="py-4 px-6 text-right text-gray-600">1</td>
                    <td className="py-4 px-6 text-right font-medium text-gray-800">{formatPrice(svc.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Summary */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/2 lg:w-1/3 text-sm">
              <div className="flex justify-between py-3 text-gray-600">
                <span>Tạm tính (Subtotal):</span>
                <span className="font-medium">
                  {formatPrice(
                    (booking.room?.roomType?.price || 0) * calculateNights(booking.checkInDate, booking.checkOutDate) + 
                    (booking.services?.reduce((sum, s) => sum + (s.price || 0), 0) || 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between py-3 text-gray-600 border-b border-gray-200">
                <span>Thuế & Phí (Tax 5%):</span>
                <span className="font-medium">
                  {formatPrice(
                    ((booking.room?.roomType?.price || 0) * calculateNights(booking.checkInDate, booking.checkOutDate) + 
                    (booking.services?.reduce((sum, s) => sum + (s.price || 0), 0) || 0)) * 0.05
                  )}
                </span>
              </div>
              <div className="flex justify-between py-5 text-xl font-bold text-white bg-[#0f1c2e] px-6 mt-4 rounded-sm shadow-md">
                <span>TỔNG THANH TOÁN:</span>
                <span>{formatPrice(calculateTotal(booking))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-center space-x-4 print:hidden">
          <button 
            onClick={() => {
              // Thêm CSS in ấn vào trang (ẩn header, footer, chỉ giữ nội dung hóa đơn)
              const style = document.createElement('style');
              style.id = 'print-style';
              style.innerHTML = `
                @media print {
                  body > * { display: none !important; }
                  #root > * { display: none !important; }
                  .print-area { display: block !important; }
                  nav, header, footer { display: none !important; }
                }
              `;
              document.head.appendChild(style);
              window.print();
              // Xóa CSS sau khi in xong
              setTimeout(() => {
                const el = document.getElementById('print-style');
                if (el) el.remove();
              }, 1000);
            }}
            className="px-8 py-3 bg-white border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center shadow-sm"
          >
            <span className="material-symbols-outlined mr-2">print</span>
            In Hóa Đơn
          </button>
          <button className="px-8 py-3 bg-[#0f1c2e] text-white rounded font-medium hover:bg-[#8b6e45] transition-colors shadow-sm">
            Yêu Cầu Hỗ Trợ
          </button>
        </div>
      </div>
    </div>
  );
}
