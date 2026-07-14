import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    const userStr = localStorage.getItem('user');
    const token = userStr ? (JSON.parse(userStr).token || JSON.parse(userStr).accessToken || '') : '';

    fetch('http://localhost:8080/api/bookings', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then(res => {
        if (!res.ok) {
          console.error('Lỗi API bookings:', res.status, res.statusText);
          if (res.status === 403 || res.status === 401) {
            console.warn('Token hết hạn hoặc không có quyền. Hãy đăng nhập lại với tài khoản ADMIN.');
          }
          return [];
        }
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) return;
        // Sắp xếp ID giảm dần (mới nhất lên đầu)
        const sortedData = data.sort((a, b) => b.id - a.id);
        setBookings(sortedData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = (id, newStatus) => {
    // Để gọi API PUT update status, cần gửi cả object Booking hoặc Backend cung cấp API riêng
    // Tạm thời ở đây chúng ta sửa cứng status (nếu Backend có hỗ trợ)
    // Lấy booking hiện tại
    const bookingToUpdate = bookings.find(b => b.id === id);
    if (!bookingToUpdate) return;
    
    const updatedBooking = { ...bookingToUpdate, status: newStatus };

    const userStr = localStorage.getItem('user');
    const token = userStr ? (JSON.parse(userStr).token || JSON.parse(userStr).accessToken || '') : '';

    fetch(`http://localhost:8080/api/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(updatedBooking)
    })
    .then(res => {
      if(res.ok) {
        alert("Cập nhật trạng thái thành công!");
        fetchBookings(); // Tải lại danh sách
      } else {
        alert("Lỗi cập nhật!");
      }
    })
    .catch(err => console.error(err));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-yellow-300">Chờ duyệt</span>;
      case 'CONFIRMED':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-300">Đã xác nhận</span>;
      case 'COMPLETED':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-300">Hoàn thành</span>;
      case 'CANCELLED':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-red-300">Đã hủy</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-gray-300">{status}</span>;
    }
  };

  // Calculate details for modal
  let days = 1;
  let roomPrice = 0;
  let roomTotal = 0;
  let servicesTotal = 0;
  let subTotal = 0;
  let tax = 0;
  let grandTotal = 0;

  if (selectedBooking) {
    const checkIn = new Date(selectedBooking.checkInDate);
    const checkOut = new Date(selectedBooking.checkOutDate);
    days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    if (days <= 0 || isNaN(days)) days = 1;

    roomPrice = selectedBooking.room?.roomType?.price || 0;
    roomTotal = roomPrice * days;
    servicesTotal = selectedBooking.services?.reduce((sum, s) => sum + (s.price || 0), 0) || 0;
    subTotal = roomTotal + servicesTotal;
    tax = subTotal * 0.05;
    grandTotal = subTotal + tax;
  }

  // Pagination logic
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Quản lý Đơn đặt phòng</h2>
        <button onClick={fetchBookings} className="text-gray-500 hover:text-[#8b6e45] p-2 bg-gray-50 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-sm">refresh</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Mã Đơn</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Loại phòng</th>
              <th className="px-6 py-4">Ngày nhận/trả</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-8">Đang tải dữ liệu...</td></tr>
            ) : currentBookings.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-8">Chưa có đơn đặt phòng nào.</td></tr>
            ) : (
              currentBookings.map((b) => (
                <tr key={b.id} className="bg-white border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #BK-{b.id.toString().padStart(4, '0')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{b.user?.username || 'Khách Vãng Lai'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#0f1c2e]">{b.room?.roomType?.typeName || 'N/A'}</div>
                    <div className="text-xs text-gray-400">Phòng: {b.room?.roomNumber || 'Chưa xếp'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{b.checkInDate}</div>
                    <div className="text-xs text-gray-400">đến {b.checkOutDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(b.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={() => { setSelectedBooking(b); setIsModalOpen(true); }}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 hover:text-[#8b6e45] focus:outline-none transition-colors"
                      >
                        Chi tiết
                      </button>
                      {b.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none transition-colors"
                          >
                            Duyệt
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-sm hover:bg-red-600 focus:outline-none transition-colors"
                          >
                            Hủy
                          </button>
                        </>
                      )}
                      {b.status === 'CONFIRMED' && (
                        <button 
                          onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-sm hover:bg-green-700 focus:outline-none transition-colors"
                        >
                          Hoàn thành
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && bookings.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white rounded-b-lg">
          <div className="text-sm text-gray-500">
            Hiển thị <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> đến <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, bookings.length)}</span> trong tổng số <span className="font-medium text-gray-900">{bookings.length}</span> đơn
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 text-sm font-medium rounded-sm border ${currentPage === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-[#8b6e45]'}`}
            >
              Trước
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Simple logic to show limited page numbers (e.g., current, first, last, neighbors)
              if (
                pageNumber === 1 || 
                pageNumber === totalPages || 
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-sm border ${currentPage === pageNumber ? 'bg-[#0f1c2e] text-white border-[#0f1c2e]' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 || 
                pageNumber === currentPage + 2
              ) {
                return <span key={pageNumber} className="px-2 py-1.5 text-gray-400">...</span>;
              }
              return null;
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 text-sm font-medium rounded-sm border ${currentPage === totalPages ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-[#8b6e45]'}`}
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Modal Chi Tiết Đặt Phòng */}
      <AnimatePresence>
        {isModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-md shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#0f1c2e] text-[#8b6e45] flex items-center justify-center">
                    <span className="material-symbols-outlined">receipt_long</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#0f1c2e]">Chi Tiết Đơn Đặt Phòng</h3>
                    <p className="text-xs font-bold text-gray-500 tracking-wider">MÃ SỐ: #{selectedBooking.id.toString().padStart(4, '0')}</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Thông tin Khách hàng */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Thông tin Khách Hàng</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <span className="material-symbols-outlined text-gray-400 mr-2 text-[18px]">person</span>
                        <div>
                          <p className="text-xs text-gray-500">Họ và tên</p>
                          <p className="font-bold text-[#0f1c2e]">{selectedBooking.customer?.fullName || selectedBooking.user?.fullName || 'Khách Vãng Lai'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="material-symbols-outlined text-gray-400 mr-2 text-[18px]">mail</span>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-medium text-[#0f1c2e]">{selectedBooking.customer?.email || selectedBooking.user?.email || 'Chưa cung cấp'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="material-symbols-outlined text-gray-400 mr-2 text-[18px]">call</span>
                        <div>
                          <p className="text-xs text-gray-500">Số điện thoại</p>
                          <p className="font-medium text-[#0f1c2e]">{selectedBooking.customer?.phone || selectedBooking.user?.phone || 'Chưa cung cấp'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin Phòng */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Thông tin Lưu Trú</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <span className="material-symbols-outlined text-gray-400 mr-2 text-[18px]">bed</span>
                        <div className="w-full flex justify-between">
                          <div>
                            <p className="text-xs text-gray-500">Loại phòng</p>
                            <p className="font-bold text-[#8b6e45]">{selectedBooking.room?.roomType?.typeName || 'Chưa rõ'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Giá phòng / đêm</p>
                            <p className="font-medium text-gray-900">{new Intl.NumberFormat('vi-VN').format(roomPrice)} đ</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="material-symbols-outlined text-gray-400 mr-2 text-[18px]">calendar_today</span>
                        <div className="w-full flex justify-between">
                          <div>
                            <p className="text-xs text-gray-500">Nhận phòng - Trả phòng</p>
                            <p className="font-medium text-[#0f1c2e]">{selectedBooking.checkInDate} <span className="text-gray-400 mx-1">đến</span> {selectedBooking.checkOutDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Lưu trú</p>
                            <p className="font-medium text-[#0f1c2e]">{days} đêm</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="material-symbols-outlined text-gray-400 mr-2 text-[18px]">info</span>
                        <div>
                          <p className="text-xs text-gray-500">Trạng thái đơn</p>
                          <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dịch vụ & Thanh toán */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">Dịch vụ đi kèm</h4>
                    {selectedBooking.services && selectedBooking.services.length > 0 ? (
                      <div className="bg-gray-50 rounded-sm p-4 border border-gray-100">
                        <ul className="space-y-3 text-sm">
                          {selectedBooking.services.map((s, index) => (
                            <li key={index} className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                              <div className="flex items-center space-x-2">
                                <span className="material-symbols-outlined text-[#8b6e45] text-[16px]">room_service</span>
                                <span className="font-medium text-gray-700">{s.serviceName || `Dịch vụ #${s.id}`}</span>
                              </div>
                              <span className="font-bold text-[#0f1c2e]">{s.price ? new Intl.NumberFormat('vi-VN').format(s.price) + ' đ' : '0 đ'}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-sm p-4 border border-gray-100 text-center text-sm text-gray-500 italic flex items-center justify-center space-x-2">
                        <span className="material-symbols-outlined text-gray-400">do_not_disturb_alt</span>
                        <span>Khách không đặt thêm dịch vụ.</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">Tổng kết thanh toán</h4>
                    <div className="bg-[#fbf9f8] rounded-sm p-5 border border-[#e0e0e0] shadow-sm space-y-3 text-sm">
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Tiền phòng ({days} đêm)</span>
                        <span className="font-medium text-gray-900">{new Intl.NumberFormat('vi-VN').format(roomTotal)} đ</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600 pb-3 border-b border-gray-200">
                        <span>Tiền dịch vụ</span>
                        <span className="font-medium text-gray-900">{new Intl.NumberFormat('vi-VN').format(servicesTotal)} đ</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600 pt-1">
                        <span>Tạm tính</span>
                        <span className="font-medium text-gray-900">{new Intl.NumberFormat('vi-VN').format(subTotal)} đ</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Thuế & Phí (5%)</span>
                        <span className="font-medium text-gray-900">{new Intl.NumberFormat('vi-VN').format(tax)} đ</span>
                      </div>
                      <div className="flex justify-between items-end pt-3 border-t border-gray-200 mt-3">
                        <span className="font-bold text-[#0f1c2e] text-base uppercase">Tổng thanh toán</span>
                        <span className="font-bold text-[#e53e3e] text-xl">{new Intl.NumberFormat('vi-VN').format(grandTotal)} đ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 bg-white flex justify-end">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-8 py-3 bg-[#0f1c2e] text-white rounded-sm hover:bg-[#1a2b3c] transition-colors font-semibold text-sm tracking-wide"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
